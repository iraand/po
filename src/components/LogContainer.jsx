import React, { useState, useRef } from 'react';
import JobLogsTabContent from './JobLogsTabContent';

import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CCloseButton, CTooltip } from '@coreui/react';

export const LogContainer = (props) => {
  const [activeKey, setActiveKey] = useState(0);
  const { jobs } = props;
  const tabRef = useRef(null);

  const clickHandler = (e) => {
    const jobId = e.target.getAttribute('name');

    if (tabRef.current && tabRef.current.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      tabRef.current.remove();
    }

    props.onRemoveJob(jobId);
  };

  if (jobs) {
    return (
      <>
        <CNav variant="tabs" role="tablist" className="jobs-tabs mt-5">
          {jobs.map((job, i) => <CNavItem key={i}>
            <CNavLink
              onClick={() => setActiveKey(i)}
              active={activeKey === i}
              ref={tabRef}
            ><CTooltip content="Remove Job" >
                <CCloseButton name={job.id} className="close-button" onClick={clickHandler} />
              </CTooltip>
              {job.title || `#${i + 1}`}
            </CNavLink>
          </CNavItem>
          )}
        </CNav>
        <CTabContent className="jobs-tabs mt-3">
          {jobs.map((job, i) => <CTabPane key={i}
            role="tabpanel"
            aria-labelledby={job.tab_title}
            visible={activeKey === i}
          >
            <JobLogsTabContent job={job}/>
          </CTabPane>
          )}
        </CTabContent>

      </>
    );
  }
  return null;
};
