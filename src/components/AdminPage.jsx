import React, { useContext } from 'react';

import { CSpinner } from '@coreui/react';

import Header from './Header';
import LoginPage from './LoginPage.jsx';
import ActionsContent from './ActionsContent';
import Dashboard from './Dashboard';

import { Context } from '../context';

// import config from '../config';
// const PORTAL_API_URL = config.get('portal_api_url');

const NOT_LOGGED_IN = -1;
const NOT_ENOUGH_PERMISSIONS = 0;
const LOGGED_IN = 1;

export default function AdminPage() {
  const context = useContext(Context);
  let content = <CSpinner color="secondary" className='spinner'/>;

  if (context.state.user_set) {
    switch (context.checkPermissions()) {
      case NOT_LOGGED_IN:
        content = <LoginPage />;
        // return window.location.href = `${PORTAL_API_URL}/auth/sso?redirect=${window.location.href}`;
        break;

      case NOT_ENOUGH_PERMISSIONS:
        content = <ActionsContent />;
        break;

      case LOGGED_IN:
        content = <Dashboard />;
        break;

      default:
        content = <CSpinner color="secondary" className='spinner'/>;
        break;
    }
  }

  return (
    <>
      <Header/>
      {content}
    </>
  );
}

