import React from 'react';
import { Collapse, Button, Form, Layout, Select, List, Avatar, DatePicker, Typography } from 'antd';
import moment from 'moment';

import { Context } from '../context';
import config from '../config';
import ApiClient from '../services/ApiClient';
import statifyContent from './HOC/statifyContent';
import { openNotificationWithIcon } from '../utils';

const years = [config.get('first_year')];

for (let year = years[0] + 1; year <= new Date().getFullYear(); year++) {
  years.push(year);
}

class ListsContent extends React.Component {
  render() {
    const forms = [
      {
        title: 'Publisher\'s PO reports',
        subscriptContent: (state, setState, outer_context, onClickFunc) =>
          <React.Fragment>
            <Form layout={'inline'} style={{ paddingBottom: 10 }}>
              <Form.Item>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder='Select Publisher'
                  allowClear
                  onChange={(value) => {
                    const new_state = { publisher: value };

                    if (!value) {
                      new_state.po_list = [];
                      if (!state.year) {
                        new_state.show_empty_list = false;
                      }
                    }

                    setState(() => new_state);
                  }}
                >
                  {outer_context.getPublishers().map((publisher, i) =>
                    <Select.Option key={i} value={publisher.identifier}>{publisher.name}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder='Select year'
                  allowClear
                  onChange={(value) => {
                    const new_state = { year: value };

                    if (!value) {
                      new_state.po_list = [];
                      if (!state.publisher) {
                        new_state.show_empty_list = false;
                      }
                    }

                    setState(() => new_state);
                  }}
                >
                  {years.map((year) => <Select.Option key={year}>{year}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={onClickFunc}>
                  {'Fetch'}
                </Button>
              </Form.Item>
            </Form>
            <List className={state.show_empty_list ? '' : 'hide-empty-list'}
              style={{ width: '100%' }}
              pagination={{
                showSizeChanger: true,
                hideOnSinglePage: true,
                defaultPageSize: 5,
                pageSizeOptions: ['5', '10', '25', '50']
              }}
              dataSource={state.po_list}
              renderItem={(item) => <List.Item>
                <List.Item.Meta
                  avatar={<Avatar shape="square" src={'/gs_icon.png'}/>}
                  title={`${item.file_name}`}
                  description={<a href={item.link} target={'_blank'} rel={'noopener noreferrer'}>{item.link}</a>}
                />
              </List.Item>}
            />
          </React.Fragment>,
        async onCardSubmitHandler (data) {
          if (!data.publisher || !data.year) {
            return openNotificationWithIcon('warning', 'Wrong input!', 'Publisher and year should be selected.');
          }

          const list = await ApiClient.fetchPOList(data.publisher, data.year);


          if (list) {
            this.setState(() => ({ po_list: list, show_empty_list: true }));
          }
        }
      },
      {
        title: 'PO reports creation processes reports',
        subscriptContent: (state, setState, outer_context, onClickFunc) =>
          <React.Fragment>
            <Form layout={'inline'} style={{ paddingBottom: 10 }}>
              <Form.Item>
                <DatePicker.MonthPicker
                  size={'default'}
                  defaultValue={state.month}
                  placeholder='Select Month'
                  style={{ width: 100 }}
                  onChange={(value) => {
                    const new_state = { month: value };

                    if (!value) {
                      new_state.show_empty_list = false;
                      new_state.data_import_report_list = [];
                    }

                    setState(() => new_state);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={onClickFunc}>
                  {'Fetch'}
                </Button>
              </Form.Item>
            </Form>
            <List className={state.show_empty_list ? '' : 'hide-empty-list'}
              style={{ width: '100%' }}
              pagination={{
                showSizeChanger: true,
                hideOnSinglePage: true,
                defaultPageSize: 5,
                pageSizeOptions: ['5', '10', '25', '50']
              }}
              dataSource={state.data_import_report_list}
              renderItem={(item) => <List.Item>
                <List.Item.Meta
                  avatar={<Avatar shape="square" src={'/gs_icon.png'}/>}
                  title={`${item.file_name}`}
                  description={<a href={item.link} target={'_blank'} rel={'noopener noreferrer'}>{item.link}</a>}
                />
              </List.Item>}
            />
          </React.Fragment>,
        async onCardSubmitHandler (data) {
          const list = await ApiClient.fetchDataImportReportsList(data.month.startOf('month').format('YYYY-MM-DD'));

          if (list) {
            this.setState(() => ({ data_import_report_list: list, show_empty_list: true }));
          }
        },
        default_state: {
          month: moment().add(-1, 'month')
        }
      },
      {
        title: 'Contact list snapshots',
        subscriptContent: (state, setState, outer_context, onClickFunc) =>
          <React.Fragment>
            <Form layout={'inline'} style={{ paddingBottom: 10 }}>
              <Form.Item>
                <DatePicker.MonthPicker
                  size={'default'}
                  defaultValue={state.month}
                  placeholder='Select Month'
                  style={{ width: 100 }}
                  onChange={(value) => {
                    const new_state = { month: value };

                    if (!value) {
                      new_state.show_empty_list = false;
                      new_state.contact_list_snapshots_list = [];
                    }

                    setState(() => new_state);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={onClickFunc}>
                  {'Fetch'}
                </Button>
              </Form.Item>
            </Form>
            <List className={state.show_empty_list ? '' : 'hide-empty-list'}
              style={{ width: '100%' }}
              pagination={{
                showSizeChanger: true,
                hideOnSinglePage: true,
                defaultPageSize: 5,
                pageSizeOptions: ['5', '10', '25', '50']
              }}
              dataSource={state.contact_list_snapshots_list}
              renderItem={(item) => <List.Item>
                <List.Item.Meta
                  avatar={<Avatar shape="square" src={'/gs_icon.png'}/>}
                  title={`${item.file_name}`}
                  description={<a href={item.link} target={'_blank'} rel={'noopener noreferrer'}>{item.link}</a>}
                />
              </List.Item>}
            />
          </React.Fragment>,
        async onCardSubmitHandler (data) {
          const contact_list_snapshots_list = await ApiClient.fetchContactListSnapshotsList(data.month.startOf('month').format('YYYY-MM-DD'));

          if (contact_list_snapshots_list) {
            this.setState(() => ({ contact_list_snapshots_list, show_empty_list: true }));
          }
        },
        default_state: {
          month: moment().add(-1, 'month')
        }
      },
      {
        title: 'Emailing reports',
        subscriptContent: (state, setState, outer_context, onClickFunc) =>
          <React.Fragment>
            <Form layout={'inline'} style={{ paddingBottom: 10 }}>
              <Form.Item>
                <DatePicker.MonthPicker
                  size={'default'}
                  defaultValue={state.month}
                  placeholder='Select Month'
                  style={{ width: 100 }}
                  onChange={(value) => {
                    const new_state = { month: value };

                    if (!value) {
                      new_state.show_empty_list = false;
                      new_state.contact_list_snapshots_list = [];
                    }

                    setState(() => new_state);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={onClickFunc}>
                  {'Fetch'}
                </Button>
              </Form.Item>
            </Form>
            <List className={state.show_empty_list ? '' : 'hide-empty-list'}
              style={{ width: '100%' }}
              pagination={{
                showSizeChanger: true,
                hideOnSinglePage: true,
                defaultPageSize: 5,
                pageSizeOptions: ['5', '10', '25', '50']
              }}
              dataSource={state.emailing_report_list}
              renderItem={(item) => <List.Item>
                <List.Item.Meta
                  avatar={<Avatar shape="square" src={'/gs_icon.png'}/>}
                  title={`${item.file_name}`}
                  description={<a href={item.link} target={'_blank'} rel={'noopener noreferrer'}>{item.link}</a>}
                />
              </List.Item>}
            />
          </React.Fragment>,
        async onCardSubmitHandler (data) {
          const emailing_report_list = await ApiClient.fetchEmailingReportList(data.month.startOf('month').format('YYYY-MM-DD'));

          if (emailing_report_list) {
            this.setState(() => ({ emailing_report_list, show_empty_list: true }));
          }
        },
        default_state: {
          month: moment().add(-1, 'month')
        }
      },
      {
        title: 'Data snapshot tables',
        subscriptContent: (state, setState, outer_context, onClickFunc) =>
          <React.Fragment>
            {'TBD'}
          </React.Fragment>,
        async onCardSubmitHandler (data) {
          // TBD
        }
      }
    ];
    return (
      <Context.Consumer>{(context) =>
        <Layout.Content style={{ padding: 24, overflow: 'auto' }}>
          <Collapse accordion defaultActiveKey={context.state.active_list_item || 1} style={{ maxWidth: 'calc(80% - 10px)' }}>
            {forms.map((form, index) => {
              const SubscribedForm = statifyContent(form.subscriptContent, form.onCardSubmitHandler, form.default_state);
              return <Collapse.Panel header={<Typography.Title style={{ margin: 0, fontSize: 16 }}>{form.title}</Typography.Title>} key={index + 1}>
                <SubscribedForm key={SubscribedForm} />
              </Collapse.Panel>;
            })}
          </Collapse>
        </Layout.Content>
      }</Context.Consumer>
    );
  }
}

export default ListsContent;
