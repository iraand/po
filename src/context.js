import React, { createContext } from 'react'
import config from './config';

import ApiClient from './services/ApiClient';
import { AiOutlineInteraction, AiOutlineProfile } from 'react-icons/ai';
import {openNotificationWithIcon } from './utils';

const LOCAL_STORAGE_KEY = config.get('local_storage_key');

const NOT_LOGGED_IN = -1;
const NOT_ENOUGH_PERMISSIONS = 0;
const LOGGED_IN = 1;
const permissions = {
  view: 'po-management-console:view',
  build: 'po-management-console:build'
};

export const Context = createContext();

class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      is_beta: true,
      user: null,
      user_set: false,
      current_menu_item: 'actions',
      active_list_item: 0,
      publishers: [],
      publishers_fetched: false
    };

  }

  fetchPublishers = async () => {
    if (this.state.publishers_fetched) return this.state.publishers;

    return (await ApiClient.loadPublishers()) || [];
  };

  getPublishers = () => this.state.publishers || [];

  onMenuSelected = (args) => {
    let allowed = false;

    if (this.state.user && this.state.user.permissions) {
      if (this.state.user.permissions.includes(permissions.build)) {
        allowed = true;
      }
      if (this.state.user.permissions.includes(permissions.view) && args.key === 'lists') {
        allowed = true;
      }
    }

    if (allowed) {
      this.setState(() => ({
        current_menu_item: args.key
      }));
    } else {
      openNotificationWithIcon('warning')
    }
  };

  _handleHash() {
    const pieces = window.location.hash.replace(/^#/, '').split('&');
    const hash_data = {};

    for (let i = 0; i < pieces.length; i++) {
      const parts = pieces[i].split('=');
      if (parts.length < 2) {
        parts.push('');
      }
      hash_data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }

    if (hash_data.access_token) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, hash_data.access_token);
      delete hash_data.access_token;

      const hash = Object.entries(hash_data).reduce((res_str,[key, value]) => {
        if (res_str) {
          res_str = `${res_str}&`;
        }
        res_str = `${res_str}${key}=${value}`;

        return res_str;
      }, '');

      window.history.pushState({}, null, `${window.location.origin}${window.location.pathname}${hash ? '#' + hash: ''}`);
    }
  }

  async componentDidMount() {
    if (window.location.hash) {
      this._handleHash();
    }

    if (!this.state.user) {
      const user = await ApiClient.getUser();

      if (user) {
        const publishers = await this.fetchPublishers();
        const current_menu_item = user.permissions.includes(permissions.view) && ! user.permissions.includes(permissions.build)
          ? 'lists'
          : null;
        const state_to_set = { user, publishers, publishers_fetched: true };

        if (current_menu_item) {
          Object.assign(state_to_set, { current_menu_item });
        }

        this.setState(() => (state_to_set));
      }

      this.setState(() => ({ user_set: true }));
    }
  }

  checkPermissions() {
    const user = this.state.user;

    if (!user) {
      return NOT_LOGGED_IN;
    }

    if (user.permissions) {
      if (user.permissions.includes(permissions.build)) {
        return LOGGED_IN;
      }
      if (user.permissions.includes(permissions.view) && this.state.current_menu_item === 'lists') {
        return LOGGED_IN;
      }
    }

    return NOT_ENOUGH_PERMISSIONS;
  }

  render() {
    return (<Context.Provider value={{
      state: this.state,
      menu_items: {
        actions: { name: 'Actions', icon_type: AiOutlineInteraction},
        lists: { name: 'Lists', icon_type: AiOutlineProfile}
      },
      header_height: 64,
      jobs: {},
      onMenuSelected: this.onMenuSelected,
      logoClick: this.logoClick,
      getPublishers: this.getPublishers,
      checkPermissions: this.checkPermissions
    }}>
      {this.props.children}
    </Context.Provider>);
  }
}

export default Provider;