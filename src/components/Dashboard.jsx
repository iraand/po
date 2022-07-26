import React, { useContext, useState } from 'react';
import config from '../config';
import { Context } from '../context';
import ActionsContentNew from './ActionContentNew';
import ListsContentNew from './ListsContentNew';

import { CNav, CNavItem, CNavLink, CContainer, CRow, CCol, CTabContent, CTabPane } from '@coreui/react';

export default function Dashboard() {
  const [activeKey, setActiveKey] = useState(0);

  const context = useContext(Context);
  const context_publishers = context.getPublishers();
  const _years = [config.get('first_year')];

  for (let year = _years[0] + 1; year <= new Date().getFullYear(); year++) {
    _years.push(year);
  }

  const publishers = context_publishers.map(({ identifier, name }) => ({ value: identifier, label: name }));
  const years = _years.map((year, i) => ({ value: year, label: year }));


  return (
    <CContainer className="px-md-0" >
      <CRow className="px-md-0">
        <CCol sm={0} lg={1} md={0} className="px-md-0">
          <CNav variant="tabs" role="tablist" className="navigation py-4 justify-content-end">
            {Object.keys(context.menu_items).map((key, index) => {
              const Icon = context.menu_items[key].icon_type;
              return <CNavItem key={index}>
                <CNavLink
                  key={index}
                  active={activeKey === index}
                  onClick={() => setActiveKey(index)}
                >
                  <Icon className={'menu-item-icon'}/>
                </CNavLink>
              </CNavItem>;
            })}
          </CNav>
        </CCol>

        <CCol sm={12} lg={10} md={12} className="px-0">
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="ActionsContent" visible={activeKey === 0}>
              <ActionsContentNew publishers={publishers} years={years} />
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="LinksContent" visible={activeKey === 1}>
              <ListsContentNew publishers={publishers} years={years} />
            </CTabPane>
          </CTabContent>
        </CCol>
      </CRow>
    </CContainer>

  );
}
