import React from 'react';
import ReactJsPagination from 'react-js-pagination';

export const Pagination = ({
  activePage,
  itemsCountPerPage,
  totalItemsCount,
  pageRangeDisplayed,
  onChange,
  prevPageText = <i className="fal fa-chevron-left"></i>,
  nextPageText = <i className="fal fa-chevron-right"></i>,
  firstPageText = <i className="fal fa-chevron-double-left"></i>,
  lastPageText = <i className="fal fa-chevron-double-right"></i>,
  itemClass = "page-item",
  linkClass = "page-link",
  innerClass = "pagination justify-content-center"
}) => {

  return (
    <ReactJsPagination
      activePage={activePage}
      itemsCountPerPage={itemsCountPerPage}
      totalItemsCount={totalItemsCount}
      pageRangeDisplayed={pageRangeDisplayed}
      onChange={onChange}
      innerClass={innerClass}
      prevPageText={prevPageText}
      nextPageText={nextPageText}
      firstPageText={firstPageText}
      lastPageText={lastPageText}
      itemClass={itemClass}
      linkClass={linkClass}
    />
  );
};

export default Pagination;
