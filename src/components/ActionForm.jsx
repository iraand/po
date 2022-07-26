import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, startOfMonth, addMonths } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { MultiSelect } from './MultiSelect';
import { fetchData } from './HOC/fetchData';
import { LogContainer } from './LogContainer';
import BuildMailingCampaignReportModal from './BuildMailingCampaignReportModal';

import { CButton, CForm, CFormCheck, CFormInput } from '@coreui/react';

export const ActionForm = (props) => {
  const publishers = props.options.publishers;
  const startDate = addMonths(startOfMonth(new Date()), -1);

  const [date, setDate] = useState(startDate);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [publishersId, setPublishersId] = useState([]);
  const [shellDisabledButton, setShellDisabledButton] = useState(false);
  const [checkedAutostartNextStage, setCheckedAutostartNextStage] = useState(true);
  const [recipients, setRecipients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [triggeredJobs, setTriggeredJobs] = useState([]);
  const [isLogsOn, setIsLogsOn] = useState(false);

  const [savedJobs, setSavedJobs] = useState([]);
  const onSelectChange = (e) => {
    setSelectedPublishers(e);
    const publishers_id = e.map((item) => [item.value]);

    setPublishersId(publishers_id.flat());
  };

  useEffect(() => {

    if (selectedPublishers.length > 0 || recipients.length > 0) {
      setShellDisabledButton(false);
    } else {
      setShellDisabledButton(true);
    }

    const saved_jobs = (JSON.parse(localStorage.getItem('jobs')) || []).filter(({ type }) => type === props.jobType);

    if (saved_jobs.length) {
      const merged_jobs = triggeredJobs || [];

      saved_jobs.forEach((saved_job) => {
        if (!merged_jobs.map(({ id }) => id).includes(saved_job.id)) {
          merged_jobs.push(saved_job);
        }
      });

      if (merged_jobs !== triggeredJobs) {
        setTriggeredJobs(() => merged_jobs);
      }

    }

  }, [props, triggeredJobs, selectedPublishers, recipients]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLogsOn(true);

    const fetch_options = [publishersId, format(startOfMonth(date), 'yyyy-MM-dd'), checkedAutostartNextStage, recipients];

    const job = await fetchData(props.formTitle, fetch_options);

    if (job) {

      setTriggeredJobs((prevState) => [
        ...prevState,
        job
      ]);

      const saved_jobs = JSON.parse(localStorage.getItem('jobs')) || [];

      saved_jobs.push(job);
      setSavedJobs(saved_jobs);
      localStorage.setItem('jobs', JSON.stringify(saved_jobs));
    }
  };

  const removeJobFunc = (job_id) => {
    const jobs = triggeredJobs.filter((job) => job.id !== job_id);
    const saved_jobs = (JSON.parse(localStorage.getItem('jobs')) || []).filter(({ id }) => id !== job_id);
    localStorage.setItem('jobs', JSON.stringify(saved_jobs));

    if (!jobs.length) {
      setIsLogsOn(false);
    }

    setTriggeredJobs(() => jobs);
  };

  const forms = <>
    <CForm className="row col-sm-1 col-md-1 col-lg-2 gx-0 gy-3 mb-5" onSubmit={handleSubmit}>
      {props.multi
          && <MultiSelect
            options={publishers}
            value={selectedPublishers}
            placeholder={'Select Publishers'}
            onChange={onSelectChange}
            name={'publisher'}
          />
      }
      {props.recipients
          && <CFormInput
            type="email"
            placeholder='Input recipient(s)'
            aria-describedby="exampleFormControlInputHelpInline"
            onChange={(e) => { setRecipients(() => [e.target.value]); }}
            className="react-select-container me-3 me-sx-0"
          />
      }
      <DatePicker
        selected={date}
        onChange={(e) => setDate(e)}
        dateFormat="yyyy-MM"
        showMonthYearPicker
        closeOnScroll={(e) => e.target === document}
        className="react-select-container me-3 me-sx-0"
      />
      {props.check
          && <CFormCheck defaultChecked id="flexCheckDefault"
            onChange={() => setCheckedAutostartNextStage(!checkedAutostartNextStage)}
            label={props.label}
          />
      }
      <CButton
        type="submit"
        className="form-button me-3"
        disabled={shellDisabledButton}
      >{props.button}
      </CButton>
      {props.buttonSecond
          && <CButton
            type="submit"
            className="form-button --second"
            disabled={shellDisabledButton}
            onClick={() => {
              setModalVisible(true);
            }}
          >{props.buttonSecond}
          </CButton>
      }
    </CForm>
  </>;

  const triggerModalVisible = (val) => setModalVisible(val);

  return (
    <>
      {forms}
      {savedJobs && <LogContainer jobs={triggeredJobs} onRemoveJob={removeJobFunc} />}
      {modalVisible && <BuildMailingCampaignReportModal outer_state={{ modal_visible: true }} outer_setState={triggerModalVisible} context={publishers}/>}
    </>
  );
};
