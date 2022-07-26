import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { buildList } from './HOC/buildList';
import { fetchData } from './HOC/fetchData';
import { Pagination } from './HOC/Pagination';
import { CButton, CForm, CSpinner } from '@coreui/react';

export const FormWithTwoSelects = (props) => {
  const publishers = props.options.publishers;
  const years = props.options.years;
  const formTitle = props.formTitle;

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(null);
  const [stateForm, setStateForm] = useState({ 'publisher': '', 'year': '' });
  const [disabledButton, setDisabledButton] = useState(true);

  const onChange = (e, { name }) => {
    let value = null;

    if (e)({ value } = e);

    setStateForm((prevState) => ({
      ...prevState,
      [name]: value
    }));

  };

  useEffect(() => {
    const { publisher, year } = stateForm;

    if (!publisher || !year) {
      if (!disabledButton) setDisabledButton(true);
    }

    if (publisher && year) {
      if (disabledButton) setDisabledButton(false);
    }

  }, [stateForm, disabledButton]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSpinner(<CSpinner color="secondary" className='spinner' />);

    const fetchedData = await fetchData(formTitle, stateForm);

    const content = buildList(fetchedData);

    setSpinner(null);

    setData(content);

    setStateForm({ 'publisher': '', 'year': '' });

  };

  return (
    <>
      <CForm className="row col-md-1 col-lg-3 gx-0 gy-3 mb-5" onSubmit={handleSubmit}>
        <Select
          options={publishers}
          isClearable
          isSearchable
          placeholder={'Select Publisher'}
          classNamePrefix = 'react-select'
          onChange={onChange}
          className="react-select-container me-3 me-sx-0"
          name={'publisher'}
        />
        <Select
          options={years}
          isClearable
          isSearchable
          placeholder={'Select year'}
          classNamePrefix = 'react-select'
          onChange={onChange}
          className="react-select-container me-3 me-sx-0"
          name={'year'}
        />
        <CButton
          type="submit"
          className="form-button"
          disabled={disabledButton}
        >{'Fetch'}
        </CButton>
      </CForm>
      {spinner}
      {(data && data.length > 0) && <Pagination data={data} limit={10}/>}
    </>
  );
};
