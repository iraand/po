import React, { useState, useEffect } from 'react';
import { CPagination, CPaginationItem } from '@coreui/react';

export const Pagination = (props) => {

  const pages = Math.ceil(props.data.length / props.limit);

  const [currentPage, setCurrentPage] = useState(1);

  const last = currentPage * props.limit;
  const first = last - props.limit;

  const collection = props.data.slice(first, last);


  const [shellDisableNext, setShellDisableNext] = useState(false);
  const [shellDisablePrev, setShellDisablePrev] = useState(true);

  const nextPage = () => {
    if (currentPage !== pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginationItem = () => {
    const pagination_item = [];
    for (let i = 1; i <= pages; i++) {
      pagination_item.push(<CPaginationItem key={i}
        active={currentPage === i}
        onClick={
          () => {
            if (currentPage !== i) {
              setCurrentPage(i);
            }
          }}
      >{i}</CPaginationItem>);
    }

    return [...pagination_item];
  };

  useEffect(() => {

    if (currentPage === 1 && pages !== 1) {
      setShellDisablePrev(true);
      setShellDisableNext(false);
    } else if (currentPage === pages && pages !== 1) {
      setShellDisableNext(true);
      setShellDisablePrev(false);
    } else if (pages === 1) {
      setShellDisablePrev(true);
      setShellDisableNext(true);
    } else {
      setShellDisablePrev(false);
      setShellDisableNext(false);
    }

  }, [currentPage, pages]);


  return (
    <>{collection}
      <CPagination aria-label="Page navigation example">
        <CPaginationItem onClick={prevPage} aria-label="Previous" disabled={shellDisablePrev}>
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {paginationItem()}
        <CPaginationItem onClick={nextPage} aria-label="Next" disabled={shellDisableNext}>
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>
    </>
  );
};
