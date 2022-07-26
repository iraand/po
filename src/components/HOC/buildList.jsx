import React from 'react';
import { CAvatar, CCallout } from '@coreui/react';
import { AiOutlineFrown } from 'react-icons/ai';

export const buildList = (data) => {
  let content = null;
  if (data && data.length) {
    content = data.map((val, i) =>
      <CCallout color="primary" key={i} >
        <a href={val.link} target={'blank'} className='d-flex align-items-center'>
          <CAvatar shape="square" src={'/gs_icon.png'} />
          <div className="mx-3">{val.file_name}</div>
        </a>
      </CCallout>
    );
  }

  if (!data || !data.length) {
    content = [
      <CCallout color="warning" key={1} className='d-flex align-items-center'>
        <AiOutlineFrown className='me-3 no-data-icon' size="30"/>
        {'No Data'}
      </CCallout>
    ];
  }

  return [...content];
};
