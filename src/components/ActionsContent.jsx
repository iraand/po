import React from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Select, Card, Popover, Checkbox } from 'antd';
import { CRow, CCol } from '@coreui/react';

import ListsContent from './ListsContent';
import ExtendedSelect from './ExtendedSelect';
import statifyContent from './HOC/statifyContent';
import ApiClient from '../services/ApiClient';
import config from '../config';
import BuildMailingCampaignReportModal from './BuildMailingCampaignReportModal';

const JOB_STATUS_FINISHED = config.get('job_statuses').finished;
let interval;

class ActionsContent extends ListsContent {
  constructor(props) {
    super(props);

    this.state = { jobs_loaded: true };
  }

  async componentDidMount() {
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
          if (this.state.jobs_loaded) {
            this.setState(() => ({ jobs_loaded: false }));
          }

          localStorage.setItem('jobs', JSON.stringify(merged_jobs));

          if (!this.state.jobs_loaded) {
            this.setState(() => ({ jobs_loaded: true }));
          }
        }

      }
    };

    await reload_jobs();
    interval = setInterval(reload_jobs, 5000);
  }
  componentWillUnmount() {
    clearInterval(interval);
  }

  render() {
    if (this.state.jobs_loaded) {
      const cards = [
        {
          title: 'Import publishers\' data',
          extra: '1',
          subscriptContent: (state, setState, outer_context, onClickFunc) =>
            <Form layout={'inline'}>
              <Form.Item>
                <ExtendedSelect
                  mode={'tags'}
                  style={{ width: 200 }}
                  placeholder={'Select Publishers'}
                  tokenSeparators={[',']}
                  allowClear
                  onChange={(value) => {
                    setState(() => ({ publishers: value }));
                  }}
                  filterOption={(input, option) =>
                    (option.key !== '0')
                    && (
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      || option.props.value.indexOf(input.toLowerCase()) >= 0
                    )
                  }
                  extension={{ all_values: outer_context.getPublishers().map((p) => p.identifier) }}
                >
                  <Select.Option key={0} value={'all'}
                    className={'selectAll'}
                  ><Button>{'Select All'}</Button></Select.Option>
                  {outer_context.getPublishers().map((publisher, i) =>
                    <Select.Option key={i + 1} value={publisher.identifier}>{publisher.name}</Select.Option>)}
                </ExtendedSelect>
              </Form.Item>
              <Form.Item>
                <DatePicker.MonthPicker
                  size={'default'}
                  defaultValue={state.month}
                  placeholder='Select Month'
                  style={{ width: 100 }}
                  onChange={(value) => {
                    setState(() => ({ month: value }));
                  }}
                />
              </Form.Item>
              <Form.Item className={'card-button'}>
                <Button type='primary' onClick={onClickFunc}>
                  {'Import'}
                </Button>
              </Form.Item>
              <Form.Item style={{width: 130, lineHeight: '12px', margin: '0 0 0 auto'}} >
                <Checkbox
                  checked={state.autostart_second_stage}
                  onChange={(e) => {
                    setState(() => ({ autostart_second_stage: e.target.checked }));
                  }}
                ><span style={{fontSize:12}}>{'Automatically start second stage'}</span></Checkbox>
              </Form.Item>
            </Form>,
          onCardSubmitHandler: async function (data) {
            // TODO: validate
            const request_body = {
              data: {
                type: 'import_publishers_data',
                report_period: data.month.startOf('month').format('YYYY-MM-DD'),
                publishers_ids: data.publishers,
                autostart_second_stage: data.autostart_second_stage
              }
            };

            return await ApiClient.triggerJob(request_body);
          },
          default_state: {
            month: moment().add(-1, 'month'),
            autostart_second_stage : true
          },
          job_type: 'import_publishers_data'
        },
        {
          title: 'Build report about the PO reports creation process',
          extra: '2',
          subscriptContent: (state, setState, outer_context, onClickFunc) =>
            <Form>
              <Form.Item style={{ display: 'inline-block', marginRight: 16 }}>
                <DatePicker.MonthPicker
                  size={'default'}
                  defaultValue={state.month}
                  placeholder='Select Month'
                  style={{ width: 100 }}
                  onChange={(value) => {
                    setState(() => ({ month: value }));
                  }}
                />
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', marginRight: 16 }}>
                <Select
                  mode={'tags'}
                  style={{ width: 200 }}
                  tokenSeparators={[',']}
                  placeholder='Input recipient(s)'
                  onChange={(value) => {
                    setState(() => ({ recipients: value }));
                  }}
                />
              </Form.Item>
              <div style={{ display: 'inline-block', marginRight: 16 }}>
                <Form.Item className={'card-button margin-card-button'}>
                  <Button type='primary' onClick={onClickFunc}>{'Send'}</Button>
                </Form.Item>
                <Form.Item className={'card-button margin-card-button'}>
                  <Button type='primary' disabled>{'Build'}</Button>
                </Form.Item>
                {/* <Form.Item className={'card-button margin-card-button'} style={{ marginBottom: 0 }}>*/}
                {/*  <Button type='primary' disabled>{'Download'}</Button>*/}
                {/* </Form.Item>*/}
              </div>

            </Form>,
          onCardSubmitHandler: async function (data) {
            // TODO: validate

            const request_body = {
              data: {
                type: 'build_and_send_publisher_data_importing_report',
                report_period: data.month.startOf('month').format('YYYY-MM-DD'),
                email_recipients: data.recipients
              }
            };

            return await ApiClient.triggerJob(request_body);
          },
          default_state: {
            month: moment().add(-1, 'month')
          },
          job_type: 'build_and_send_publisher_data_importing_report'
        },
        {
          title: 'Send email notifications to publishers',
          extra: '3',
          subscriptContent: (state, setState, outer_context, onClickFunc) =>
            <React.Fragment>
              <Form>
                <Form.Item style={{ display: 'inline-block', marginRight: 16 }}>
                  <ExtendedSelect
                    showSearch
                    mode='tags'
                    style={{ width: 200 }}
                    placeholder={'Select Publishers'}
                    tokenSeparators={[',']}
                    allowClear
                    onChange={(value) => {
                      setState(() => ({ publishers: value }));
                    }}
                    filterOption={(input, option) =>
                      (option.key !== '0')
                      && (
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        || option.props.value.indexOf(input.toLowerCase()) >= 0
                      )
                    }
                    extension={{ all_values: outer_context.getPublishers().map((p) => p.identifier) }}
                  >
                    <Select.Option key={0} value={'all'}
                      className={'selectAll'}
                    ><Button>{'Select All'}</Button></Select.Option>
                    {outer_context.getPublishers().map((publisher, i) =>
                      <Select.Option key={i + 1} value={publisher.identifier}>{publisher.name}</Select.Option>)}
                  </ExtendedSelect>
                </Form.Item>
                <Form.Item style={{ display: 'inline-block', marginRight: 16 }}>
                  <DatePicker.MonthPicker
                    size={'default'}
                    defaultValue={state.month}
                    placeholder='Select Month'
                    style={{ width: 100 }}
                    onChange={(value) => {
                      setState(() => ({ month: value }));
                    }}
                  />
                </Form.Item>
                <div style={{ display: 'inline-block', marginRight: 16, width: 140 }}>
                  <Form.Item className={'card-button margin-card-button'}>
                    <Button type='primary' style={{ width: 94 }} onClick={onClickFunc}>{'Send'}</Button>
                  </Form.Item>
                  <Form.Item className={'card-button margin-card-button'}>
                    <Button type='primary' style={{ width: 140 }} onClick={() => {
                      setState(() => ({ modal_visible: true }));
                    }}
                    >{'Build Report'}</Button>
                  </Form.Item>
                </div>
                <Form.Item style={{width: 130, lineHeight: '12px', display: 'inline-block', float: 'right'}} >
                  <Checkbox
                    checked={state.auto_build_send_report}
                    onChange={(e) => {
                      setState(() => ({ auto_build_send_report: e.target.checked }));
                    }}
                  ><span style={{fontSize:12}}>{'Automatically build and send report'}</span></Checkbox>
                </Form.Item>
              </Form>
              {!!state.modal_visible && <BuildMailingCampaignReportModal outer_state={state} outer_setState={setState} context={outer_context}/>}
            </React.Fragment>,
          onCardSubmitHandler: async function (data) {
            // TODO: validate

            const request_body = {
              data: {
                type: 'send_publishers_emails',
                publishers_ids: data.publishers,
                report_period: data.month.startOf('month').format('YYYY-MM-DD'),
                auto_build_send_report: data.auto_build_send_report
              }
            };

            return await ApiClient.triggerJob(request_body);
          },
          default_state: {
            month: moment().add(-1, 'month'),
            modal_visible: false,
            auto_build_send_report: true
          },
          job_type: 'send_publishers_emails'
        },
        {
          title: <Popover placement='topLeft' content={'This should be triggered if there were some changes to PO Data files.'} >{'Synchronize data files with tables and report files'}</Popover>,
          extra: '*',
          subscriptContent: (state, setState, outer_context, onClickFunc) =>
            <Form layout={'inline'}>
              <Form.Item>
                <ExtendedSelect
                  showSearch
                  mode='tags'
                  style={{ width: 200 }}
                  placeholder={'Select Publishers'}
                  tokenSeparators={[',']}
                  allowClear
                  onChange={(value) => {
                    setState(() => ({ publishers: value }));
                  }}
                  filterOption={(input, option) =>
                    (option.key !== '0')
                    && (
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      || option.props.value.indexOf(input.toLowerCase()) >= 0
                    )
                  }
                  extension={{ all_values: outer_context.getPublishers().map((p) => p.identifier) }}
                >
                  <Select.Option key={0} value={'all'}
                    className={'selectAll'}
                  ><Button>{'Select All'}</Button></Select.Option>
                  {outer_context.getPublishers().map((publisher) =>
                    <Select.Option key={publisher.name} value={publisher.identifier}>{publisher.name}</Select.Option>)}
                </ExtendedSelect>
              </Form.Item>
              <Form.Item>
                {/* TODO: Replace with multiple months picker */}
                <DatePicker.MonthPicker
                  size={'default'}
                  defaultValue={state.months[0]}
                  placeholder='Select Month'
                  style={{ width: 100 }}
                  onChange={(value) => {
                    setState(() => ({ months: [value] }));
                  }}
                />
              </Form.Item>
              <Form.Item className={'card-button'}>
                <Button type='primary' onClick={onClickFunc}>
                  {'Sync'}
                </Button>
              </Form.Item>
            </Form>,
          async onCardSubmitHandler (data) {
            // TODO: validate

            const request_body = {
              data: {
                type: 'synchronize_data_files_and_tables',
                report_periods: data.months.map((month) => month.startOf('month').format('YYYY-MM-DD')),
                publishers_ids: data.publishers
              }
            };

            return await ApiClient.triggerJob(request_body);
          },
          default_state: {
            months: [moment().add(-1, 'month')]
          },
          job_type: 'synchronize_data_files_and_tables'
        }
      ];

      return (
        <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 4 }}>{
          cards.map((item, i) => {
            const Content = statifyContent(item.subscriptContent, item.onCardSubmitHandler, Object.assign(item.default_state, { is_logs_on: true }));

            return <CCol key={i}>
              <Card title={item.title} extra={item.extra}>
                <Content key={Content} job_type={item.job_type}/>
              </Card>
            </CCol>;
          })
        }</CRow>
      );
    }
    return null;
  }
}

export default ActionsContent;
