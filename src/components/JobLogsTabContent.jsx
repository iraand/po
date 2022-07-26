import React from 'react';
import ApiClient from '../services/ApiClient';
import config from '../config';

import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { CSpinner } from '@coreui/react';

const JOB_STATUS_FINISHED = config.get('job_statuses').finished;
const JOB_STATUS_FAILED = config.get('job_statuses').failed;
const JOB_STATUS_NOT_FOUND = config.get('job_statuses').not_found;
const JOB_FINISHED_LOG = 'Job has been finished!';
const JOB_FAILED_LOG = 'Job FAILED!';
const JOB_NOT_FOUND_LOG = 'Job not found! Last fetched log below.';
const TIMEOUT_SECONDS = 1;

class JobLogsTabContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      job: props.job,
      logs: props.job.logs || []
    };

    this.refresh_interval = null;
  }

  componentDidMount() {
    if (!this.refresh_interval) {
      this.refresh_interval = setInterval(this.refreshLogs.bind(this), TIMEOUT_SECONDS * 1000);
    }
  }

  componentWillUnmount() {
    if (this.refresh_interval) {
      clearInterval(this.refresh_interval);
      this.refresh_interval = null;
    }
  }

  async refreshLogs() {
    const job = await ApiClient.getJobById(this.state.job.id);

    if (job) {
      if (!job.logs) {
        job.logs = [];
      }

      const logs = job.logs;
      const saved_jobs = (JSON.parse(localStorage.getItem('jobs')) || []).filter(({ id }) => id !== job.id);

      if ([JOB_STATUS_FINISHED, JOB_STATUS_FAILED, JOB_STATUS_NOT_FOUND].includes(job.status)) {
        let log_to_check;

        switch (job.status) {
          case JOB_STATUS_FINISHED:
            log_to_check = JOB_FINISHED_LOG;
            break;
          case JOB_STATUS_FAILED:
            log_to_check = { text: JOB_FAILED_LOG, error: true };
            break;
          case JOB_STATUS_NOT_FOUND:
            log_to_check = { text: JOB_NOT_FOUND_LOG, error: true };
            break;
          default:
            break;
        }

        if (log_to_check) {
          if ((logs[logs.length - 1].text || logs[logs.length - 1]) !== (log_to_check.text || log_to_check)) {
            logs.push(log_to_check);
          }

          clearInterval(this.refresh_interval);
          this.refresh_interval = null;
        }
      }
      saved_jobs.push(job);
      localStorage.setItem('jobs', JSON.stringify(saved_jobs));
      this.setState(() => ({ logs, job }));
    }
  }

  render() {
    const { job } = this.state;
    const pending = [JOB_STATUS_FINISHED, JOB_STATUS_FAILED, JOB_STATUS_NOT_FOUND].includes(job.status)
      ? false
      : <CSpinner color="secondary" className='job-loading-spinner'/>;

    return <div className='timeline-container'>
      {pending}

      {this.state.logs.reverse().map((log, i) => {
        if (log.error) {
          return <div key={i} className='timeline close'>
            <AiOutlineCloseCircle className='timeline-icon'/>
            <p>{log.text || log}</p>
          </div>;
        }

        return <div key={i + 1} className='timeline'>
          <AiOutlineCheckCircle className='timeline-icon'/>
          <p>{log.text || log}</p>
        </div>;
      })}
    </div>;
  }
}

export default JobLogsTabContent;
