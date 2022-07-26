import React from 'react';
import Select from 'react-select';

import { notification } from 'antd';
import ApiClient from '../services/ApiClient';
import config from '../config';

import { CModal, CModalHeader, CModalBody,  CModalTitle, CModalFooter, CButton, CForm, CFormCheck, CFormInput } from '@coreui/react';

const JOB_STATUS_FINISHED = config.get('job_statuses').finished;
const JOB_STATUS_FAILED = config.get('job_statuses').failed;
const JOB_STATUS_NOT_FOUND = config.get('job_statuses').not_found;

const TIMEOUT_SECONDS = 5;

class BuildMailingCampaignReportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mailing_campaigns: [],
      mailing_campaign: '',
      job_running: false,
      disabled_button: true
    };
  }

  async componentDidMount() {
    await this.refreshMailingCampaigns()
  }

  async refreshMailingCampaigns() {
    let mailing_campaigns = await ApiClient.fetchMailingCampaignsList();

    mailing_campaigns = mailing_campaigns.map(( campaign ) => ({ value: campaign, label: campaign }));

    if (mailing_campaigns) {
      this.setState(() => ({mailing_campaigns}));
    }
  }

  onOk = async () => {
    this.props.outer_setState(() => ({ modal_visible: false }));

    this.setState(() => ({disabled_button: true}));

    if (this.state.mailing_campaign) {
      const request_body = {
        data: {
          type: 'build_emailing_report',
          campaign_name: this.state.mailing_campaign
        }
      };

      const job = await ApiClient.triggerJob(request_body);

      if (job) {
        const job_refresh_interval = setInterval(async () => {
          const fresh_job = await ApiClient.getJobById(job.id);

          if (fresh_job && fresh_job.status === JOB_STATUS_FINISHED) {
            notification.success({
              message: 'Emailing Report has been built!',
              description: 'It can be downloaded within the "Lists" page'
            });

            clearInterval(job_refresh_interval);
            this.setState(() => ({job_running: false}));
          }

          if ([JOB_STATUS_FAILED, JOB_STATUS_NOT_FOUND].includes(fresh_job.status)) {
            notification.warn({
              message: 'Something went wrong!',
              description: 'Please, check the "Lists" page for the emailing report, if it\'s not there try to trigger building again.'
            });

            clearInterval(job_refresh_interval);
            this.setState(() => ({job_running: false}));
          }
        }, TIMEOUT_SECONDS * 1000);
        this.setState(() => ({job_running: true}));
      }
    }


  };

  render() {
    return <CModal visible={!!this.props.outer_state.modal_visible}>
      <CModalHeader>
        Report settings
      </CModalHeader>
      <CModalBody>
        <Select
            options={this.state.mailing_campaigns}
            isClearable
            isSearchable
            placeholder='Select Mailing Campaign'
            onChange={(e) => {
              this.setState(() => ({
                mailing_campaign: e.value,
                disabled_button: false
              }));
            }}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => this.props.outer_setState(() => false)}>
          Cancel
        </CButton>
        <CButton color="primary" disabled={this.state.disabled_button}  onClick={this.onOk}>Ok</CButton>
      </CModalFooter>
    </CModal>;
  }
}

export default BuildMailingCampaignReportModal;
