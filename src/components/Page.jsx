import React, { useContext } from 'react';
import { Layout, Menu, Empty, Spin } from 'antd';
import ActionsContent from './ActionsContent';
import ListsContent from './ListsContent';
import { Context } from '../context';
import './styles/Page.less';

import { CContainer, CRow, CCol, CButton, CAvatar, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CModal, CModalBody, CModalFooter } from '@coreui/react';
import { AiOutlineLogin, AiOutlineUser, AiOutlineQuestionCircle } from 'react-icons/ai';

// eslint-disable-next-line no-warning-comments
// TODO : lazy, Suspense - React 18

const NOT_LOGGED_IN = -1;
const NOT_ENOUGH_PERMISSIONS = 0;
const LOGGED_IN = 1;

const renderContentComponent = (value, context) => {
  if (context.state.user_set) {
    switch (context.checkPermissions()) {
      case NOT_LOGGED_IN:
        return <Empty
          style={{ margin: 'auto' }}
          image={'/no_data.svg'}
          imageStyle={{ height: 250 }}
          description={'You\'re not logged in!'}
          
          
        />;
      case NOT_ENOUGH_PERMISSIONS:
        return <Empty
          style={{ margin: 'auto' }}
          image={'/no_data.svg'}
          imageStyle={{ height: 250 }}
          description={<React.Fragment>{'Not enough permissions!'}<br/>{'Please, contact administrator'}.</React.Fragment>}
        />;
      case LOGGED_IN:
        switch (value) {
          case 'actions':
            return <ActionsContent context={context} />;
          case 'lists':
            return <ListsContent context={context} />;
          default:
            return <ActionsContent context={context} />;
        }
      default:
    }
  }
  return <div style={{
    fontSize: 25,
    height: '100%',
    width: '100vw',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  }}
         >
    <Spin size='large' />
    <p style={{
      margin: 0,
      padding: '0 0 0 20px'
    }}
    >{'Loading ...'}</p>
  </div>;
};

export default function Page () {
  const context = useContext(Context);

  return (
    <Layout className={'page-layout'}>
      <Layout.Sider width={100}>
        <Menu
          mode='inline'
          defaultSelectedKeys={[context.state.current_menu_item]}
          selectedKeys={[context.state.current_menu_item]}
          onSelect={context.onMenuSelected}
        >
          {Object.keys(context.menu_items).map((key) => {
            const Icon = context.menu_items[key].icon_type;

            return <Menu.Item key={key}>
              <Icon className={'menu-item-icon'}/>
            </Menu.Item>;
          })}
        </Menu>
      </Layout.Sider>
      {renderContentComponent(context.state.current_menu_item, context)}
    </Layout>

  );
}


