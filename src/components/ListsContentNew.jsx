import React, { useState } from 'react';
import { forms_titles } from '../constants/formTitles';
import { FormWithTwoSelects } from './FormWithTwoSelects';
import { DatePickerForm } from './DatePickerForm';

import {
  CRow,
  CCol,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody
} from '@coreui/react';

export default function ListsContentNew(props) {
  const [publishers] = useState(props.publishers);
  const [years] = useState(props.years);

  const forms = [
    <FormWithTwoSelects options={{ publishers, years }}
      key={1} formTitle={forms_titles[0]}
    />,
    <DatePickerForm key={2} formTitle={forms_titles[1]} />,
    <DatePickerForm key={3} formTitle={forms_titles[2]} />,
    <DatePickerForm key={4} formTitle={forms_titles[3]} />,
    'TBD'
  ];

  return (
    <CRow md={{ cols: 1, gutter: 3 }} lg={{ cols: 1, gutter: 4 }}>
      <CCol sm={12}>
        <CAccordion alwaysOpen className="accordion">
          {forms.map((item, index) =>
            <CAccordionItem key={index + 1} className="mb-3">
              <CAccordionHeader>
                {forms_titles[index]}
              </CAccordionHeader>
              <CAccordionBody >
                {forms[index]}
              </CAccordionBody>
            </CAccordionItem>
          )}
        </CAccordion>
      </CCol>
      <CCol />
    </CRow>
  );
}
