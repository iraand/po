import config from '../config';
import { openNotificationWithIcon } from '../utils';

const PORTAL_API_URL = config.get('portal_api_url');
const JOB_STATUS_FAILED = config.get('job_statuses').failed;
const JOB_STATUS_NOT_FOUND = config.get('job_statuses').not_found;
const LOCAL_STORAGE_KEY = config.get('local_storage_key');

class ApiClient {

  static _applyAuth(data) {
    const token = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!token) {
      console.log('NO TOKEN');
      return data;
    }

    data.headers = Object.assign(data.headers || {}, { Authorization: `Bearer ${token}` });
    return data;
  }

  static async getUser() {
    const response = await fetch(`${PORTAL_API_URL}/users/0?$include=account`, ApiClient._applyAuth({ headers: { 'content-type': 'application/json' } }));

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  }

  static async loadPublishers() {
    try {
      const jwt = window.localStorage.getItem(LOCAL_STORAGE_KEY);

      const response = await fetch(`${PORTAL_API_URL}/accounts?type=publisher`, ApiClient._applyAuth({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        }
      }));

      if (!response.ok) {
        openNotificationWithIcon('error', 'Failed to load publishers!');
        return null;
      }

      const { data } = await response.json();

      return data;
    } catch (e) {
      openNotificationWithIcon('error', 'Failed to load publishers!');
    }
  }

  static async triggerJob(request_body) {
    try {
      const response = await fetch(`${PORTAL_API_URL}/po/jobs`, ApiClient._applyAuth({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request_body)
      }));

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          openNotificationWithIcon('warning');
          return null;
        }
        openNotificationWithIcon('error');
        return null;
      }

      const { data } = await response.json();

      return data;
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }

  static async getJobById(job_id) {
    const jobFailed = (failed_job_id, error_log, status = JOB_STATUS_FAILED) => {
      const saved_job = (JSON.parse(localStorage.getItem('jobs')) || []).filter(({ id }) => id === failed_job_id)[0];

      const adjusted_logs = saved_job.logs || [];

      if (error_log && (adjusted_logs[adjusted_logs.length - 2] === error_log)) {
        adjusted_logs.push(error_log);
      }

      return Object.assign(saved_job || {}, {
        id: failed_job_id,
        status,
        logs: adjusted_logs
      });
    };

    try {
      const response = await fetch(`${PORTAL_API_URL}/po/jobs/${job_id}`, ApiClient._applyAuth({ method: 'GET' }));

      switch (response.status) {
        case 200:
          return await response.json();
        case 401:
        case 403:
          openNotificationWithIcon('warning');
          return jobFailed(job_id, response.statusText, JOB_STATUS_NOT_FOUND);
        case 404:
          return jobFailed(job_id, response.statusText, JOB_STATUS_NOT_FOUND);
        default:
          return null;
      }
    } catch (e) {
      openNotificationWithIcon('error');

      return jobFailed(job_id, 'The request to API failed!');
    }
  }

  static async getJobs() {
    try {
      const response = await fetch(`${PORTAL_API_URL}/po/jobs`, ApiClient._applyAuth({ method: 'GET' }));

      switch (response.status) {
        case 200:
          return await response.json();
        case 204:
          return [];
        case 401:
        case 403:
          openNotificationWithIcon('warning');
          return null;
        default:
          return null;
      }
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }

  static async fetchPOList(publisher_id, year) {
    try {
      // const response = await fetch(`${PORTAL_API_URL}/po/publishers/${publisher_id}/reports?year=${year}`, ApiClient._applyAuth({ method: 'GET' }));
      const response = await fetch(`${PORTAL_API_URL}/po/reports?publisher_id=${publisher_id}&year=${year}`, ApiClient._applyAuth({ method: 'GET' }));

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          openNotificationWithIcon('warning');
          return null;
        }

        openNotificationWithIcon('error');
        return null;
      }

      const { data: { reports } } = await response.json();

      return reports || [];
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }

  static async fetchDataImportReportsList(month) {
    try {
      const response = await fetch(`${PORTAL_API_URL}/po/reports/publisher_data_importing?report_period=${month}`, ApiClient._applyAuth({ method: 'GET' }));

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          openNotificationWithIcon('warning');
          return null;
        }

        openNotificationWithIcon('error');
        return null;
      }

      const { data: { reports } } = await response.json();

      return reports || [];
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }

  static async fetchEmailingReportList(month) {
    try {
      const response = await fetch(`${PORTAL_API_URL}/po/reports/emailing?report_period=${month}`, ApiClient._applyAuth({ method: 'GET' }));

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          openNotificationWithIcon('warning');
          return null;
        }

        openNotificationWithIcon('error');
        return null;
      }

      const { data: { reports } } = await response.json();

      return reports || [];
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }

  static async fetchContactListSnapshotsList(month) {
    try {
      const response = await fetch(`${PORTAL_API_URL}/po/snapshots/contact_list?report_period=${month}`, ApiClient._applyAuth({ method: 'GET' }));

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          openNotificationWithIcon('warning');
          return null;
        }

        openNotificationWithIcon('error');
        return null;
      }

      const { data: { snapshots } } = await response.json();

      return snapshots || [];
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }

  static async fetchMailingCampaignsList() {
    try {
      const response = await fetch(`${PORTAL_API_URL}/po/mailing-campaigns`, ApiClient._applyAuth({ method: 'GET' }));

      switch (response.status) {
        case 200:
          return await response.json();
        case 401:
        case 403:
          openNotificationWithIcon('warning');
          return null;
        default:
          openNotificationWithIcon('error');
          return null;
      }
    } catch (e) {
      openNotificationWithIcon('error');
    }
  }
}

export default ApiClient;
