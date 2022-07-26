import React, { useState, useContext } from 'react';

import config from '../config';
import { Context } from '../context';

import { CHeader, CContainer, CRow, CCol, CButton, CAvatar, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CModal, CModalBody, CModalFooter } from '@coreui/react';
import { AiOutlineLogin, AiOutlineUser, AiOutlineQuestionCircle } from 'react-icons/ai';

const PORTAL_API_URL = config.get('portal_api_url');
const REPORTS_URL = config.get('reports_url');
const LOCAL_STORAGE_KEY = config.get('local_storage_key');

export default function Header () {
  const context = useContext(Context);
  const state = context.state;
  const [visible, setVisible] = useState(false);

  const logOut = () => {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.href = `${REPORTS_URL}/logout?redirect=${window.location.href}`;
    setVisible(!visible);
  };

  const logIn = () => {
    window.location.href = `${PORTAL_API_URL}/auth/sso?redirect=${window.location.href}`;

  };

  return (
    <CHeader className="p-0">
      <CContainer fluid className="px-0">
        <CRow xs={{ cols: 2, gutter: 0 }} md={{ cols: 2, gutter: 0 }} lg={{ cols: 2, gutter: 0 }}>
          <CCol lg={{ span: 8, offset: 2 }} className="d-md-flex align-items-center p-0">
            <img src="./logo_azerion.svg" alt="Azerion" className="d-block logo me-3 mt-4 mb-4 ms-3" />
            <img src="./new_logo.png" alt="Inskin" className="d-block logo-inskin ms-3" />
          </CCol>
          <CCol className="d-flex justify-content-end p-0" lg={{ span: 2, offset: 0 }}>
            {state.user_set
              && <div className="d-flex align-self-center justify-content-end me-2">
                {state.user
                && <div className="d-flex gap-md-3 gap-xs-1 justify-content-end align-items-center">
                  <div>
                    <span>{state.user.firstName}</span>
                    <span className="p-1">{state.user.lastName}</span>
                    <div className="user-account">{state.user.account.name}</div>
                  </div>
                  {state.user
                  && <CDropdown className='d-flex align-items-center' >
                    <CDropdownToggle href="#" size='sm' className='user-account-menu d-flex align-self-center'>
                      <CAvatar className="az-avatar">
                        <AiOutlineUser />
                      </CAvatar>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem key='logout' onClick={() => setVisible(!visible)}>
                        {'Log out'}
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                  }
                </div>
                }
                {!state.user
                && <CButton size="sm" variant="outline" onClick={logIn}>
                  <AiOutlineLogin className="icon m-50" />
                  {'Log in'}
                </CButton>
                }
              </div>
            }
          </CCol>
        </CRow>
      </CContainer>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody><AiOutlineQuestionCircle className="icon-guestion" color="primary"/>{ 'Are you sure you want to log out?' }</CModalBody>
        <CModalFooter>
          <CButton onClick={() => setVisible(false)} color="secondary"> {'Cancel'} </CButton>
          <CButton onClick={logOut}>{'OK'}</CButton>
        </CModalFooter>
      </CModal>
    </CHeader>
  );
}


/*
--select * from roles;
--select * from role_permissions;
--select * from user_roles;
--select * from users;


--insert into roles (id,`createdAt`,`updatedAt`) values ('agency-publisher-user', current_timestamp(), current_timestamp());
--insert into role_permissions (`roleId`, `permissionId`, `createdAt`,`updatedAt`) values ('agency-publisher-user', 'reports:agency', current_timestamp(), current_timestamp());
--insert into role_permissions (`roleId`, `permissionId`, `createdAt`,`updatedAt`) values ('agency-publisher-user', 'reports:agency-campaigns', current_timestamp(), current_timestamp());
--insert into role_permissions (`roleId`, `permissionId`, `createdAt`,`updatedAt`) values ('agency-publisher-user', 'schedules:write', current_timestamp(), current_timestamp());
--insert into role_permissions (`roleId`, `permissionId`, `createdAt`,`updatedAt`) values ('agency-publisher-user', 'reports:live-campaigns', current_timestamp(), current_timestamp());
--insert into role_permissions (`roleId`, `permissionId`, `createdAt`,`updatedAt`) values ('agency-publisher-user', 'reports:publisher-campaigns', current_timestamp(), current_timestamp());
--insert into role_permissions (`roleId`, `permissionId`, `createdAt`,`updatedAt`) values ('agency-publisher-user', 'reports:revenue', current_timestamp(), current_timestamp());
--update user_roles set `roleId`='agency-publisher-user' where `userId`=7

--update user_roles set `roleId`='agency-user' where `userId`=7
--delete from role_permissions where `roleId`='agency-publisher-user';
--delete from roles where id='agency-publisher-user';
*/
