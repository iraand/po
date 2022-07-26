import { openNotificationWithIcon } from '../../utils';
import ApiClient from '../../services/ApiClient';
import { forms_titles, forms_titles_actions } from '../../constants/formTitles';

export const fetchData = async (formTitle, options) => {
  let data = null;

  if (formTitle === forms_titles[0]) {
    const { publisher, year } = options;

    if (!publisher || !year) {
      return openNotificationWithIcon('warning', 'Wrong input!', 'Publisher and year should be selected.');
    }

    data = await ApiClient.fetchPOList(publisher, year);
  }

  if (formTitle === forms_titles[1]) {
    data = await ApiClient.fetchDataImportReportsList(options);
  }

  if (formTitle === forms_titles[2]) {
    data = await ApiClient.fetchContactListSnapshotsList(options);
  }

  if (formTitle === forms_titles[3]) {
    data = await ApiClient.fetchEmailingReportList(options);
  }


  if (formTitle === forms_titles_actions[0]) {
    const [publishers_id, date, checked_auto_next_stage] = options;

    const request_body = {
      data: {
        type: 'import_publishers_data',
        report_period: date,
        publishers_ids: publishers_id,
        autostart_second_stage: checked_auto_next_stage
      }
    };

    data = await ApiClient.triggerJob(request_body);
  }


  if (formTitle === forms_titles_actions[1]) {
    const date = options.data;
    const recipients = options.recipients;
    // const [publishers_id, date, checked_auto_next_stage, recipients] = options;

    const request_body = {
      data: {
        type: 'build_and_send_publisher_data_importing_report',
        report_period: date,
        email_recipients: recipients
      }
    };

    data = await ApiClient.triggerJob(request_body);
  }

  if (formTitle === forms_titles_actions[2]) {
    const [publishers_id, date, checked_auto_next_stage] = options;

    const request_body = {
      data: {
        type: 'send_publishers_emails',
        publishers_ids: publishers_id,
        report_period: date,
        autostart_second_stage: checked_auto_next_stage
      }
    };

    data = await ApiClient.triggerJob(request_body);
  }

  if (formTitle === forms_titles_actions[3]) {
    const [publishers_id, date] = options;

    const request_body = {
      data: {
        type: 'synchronize_data_files_and_tables',
        report_periods: [date],
        publishers_ids: publishers_id
      }
    };

    data = await ApiClient.triggerJob(request_body);
  }

  return data;
};
