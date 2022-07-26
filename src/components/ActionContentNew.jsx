import React, { useState, useEffect } from 'react';
import ApiClient from '../services/ApiClient';
import config from '../config';
import { forms_titles_actions } from '../constants/formTitles';

import { ActionForm } from './ActionForm';

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react';

const JOB_STATUS_FINISHED = config.get('job_statuses').finished;
let interval;

export default function ActionContentNew(props) {
  const publishers = props.publishers;
  const [jobsLoaded, setJobsLoaded] = useState(true);

  useEffect(() => {
    const reload_jobs = async () => {
      const response = await ApiClient.getJobs();

      if (!response) {
        if (interval) {
          clearInterval(interval);
        }
        return;
      }

      const running_jobs = response.filter(({ status }) => status !== JOB_STATUS_FINISHED);

      if (running_jobs.length) {
        const saved_jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const merged_jobs = saved_jobs;
        let has_new_job = false;

        running_jobs.forEach((job) => {
          if (!saved_jobs.map(({ id }) => id).includes(job.id)) {
            merged_jobs.push(job);
            has_new_job = true;
          }
        });

        if (has_new_job) {
          if (jobsLoaded) {
            setJobsLoaded(false);
          }

          localStorage.setItem('jobs', JSON.stringify(merged_jobs));

          if (!jobsLoaded) {
            setJobsLoaded(true);
          }
        }
      }
    };

    reload_jobs();

    interval = setInterval(reload_jobs, 5000);

    return () => {
      clearInterval(interval);
    };
  });

  const forms = [
    <ActionForm
      options={{ publishers }}
      key={1}
      formTitle={forms_titles_actions[0]}
      multi
      button={'Import'}
      label={'Automatically start second stage'}
      jobType={'import_publishers_data'}
    />,
    <ActionForm
      options={{ publishers }}
      key={2} formTitle={forms_titles_actions[1]}
      input button={'Send'}
      jobType={'build_and_send_publisher_data_importing_report'}
      recipients
    />,
    <ActionForm
      options={{ publishers }}
      key={3}
      formTitle={forms_titles_actions[2]}
      multi
      button={'Send'}
      buttonSecond={'Build Report'}
      label={'Automatically build and send report'}
      jobType={'send_publishers_emails'}
    />,
    <ActionForm
      options={{ publishers }}
      key={4}
      formTitle={forms_titles_actions[3]}
      multi
      button={'Sync'}
      jobType={'synchronize_data_files_and_tables'}
    />
  ];

  return <>
    <CRow lg={{ cols: 2, gutter: 4 }} md={{ cols: 2, gutter: 4}} xs={{ cols: 1, gutter: 4 }}>
      {forms.map((item, index) =>
        <CCol key={index} sm={12}>
          <CCard>
            <CCardHeader>{forms_titles_actions[index]}
              <div className='card-header__num'>{index < 3 ? index + 1 : '*'}</div>
            </CCardHeader>
            <CCardBody>
              {item}
            </CCardBody>
          </CCard>
        </CCol>
      )}
    </CRow>
  </>;
}
