import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, startOfMonth, addMonths } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchData } from './HOC/fetchData';
import { buildList } from './HOC/buildList';

import { CButton, CForm, CSpinner } from '@coreui/react';
import { Pagination } from './HOC/Pagination';


export const DatePickerForm = (props) => {
  const startDate = addMonths(startOfMonth(new Date()), -1);
  const formTitle = props.formTitle;

  const [date, setDate] = useState(startDate);
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(null);

  const onChange = (e) => {
    setDate(e);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSpinner(<CSpinner color="secondary" className='spinner' />);

    const fetchedData = await fetchData(formTitle, format(startOfMonth(date), 'yyyy-MM-dd'));

    const content = buildList(fetchedData);

    setSpinner(null);

    setData(content);
  };

  return (
    <>
      <CForm className="row col-md-1 col-lg-3 gx-0 gy-3" onSubmit={handleSubmit}>
        <DatePicker
          selected={date}
          onChange={onChange}
          dateFormat="yyyy-MM"
          showMonthYearPicker
          closeOnScroll={(e) => e.target === document}
          className="me-3 me-sx-0"
        />
        <CButton
          type="submit"
          className="form-button"
          disabled={false}
        >{'Fetch'}
        </CButton>
      </CForm>
      {spinner}
      {(data && data.length > 0) && <Pagination data={data} limit={6}/>}
    </>
  );
};
