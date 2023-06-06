import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './Pagination.module.scss';
import { DestinationsType } from '../../types/DestinationListTypes';

type PaginationProps = {
  filteredDestinations: DestinationsType[];
  setSlicedDestinations: React.Dispatch<
    React.SetStateAction<DestinationsType[]>
  >;
};

const PAGES = {
  START_INDEX_OF_PAGE: 1,
  PAGES_TO_SKIP: 1,
  ITEMS_PER_PAGE: 20,
  QUERY_OF_URL: 'page',
  PAGES_TO_SHOW_IN_NAVBAR: 5
};

function Pagination({
  filteredDestinations,
  setSlicedDestinations
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(
    PAGES.START_INDEX_OF_PAGE
  );

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const pageNumber = parseInt(
    queryParams.get(PAGES.QUERY_OF_URL) || PAGES.START_INDEX_OF_PAGE.toString()
  );

  const totalPages = useMemo(() => {
    return Math.ceil(filteredDestinations.length / PAGES.ITEMS_PER_PAGE);
  }, [filteredDestinations]);

  const firstDestinationIdx = useMemo(() => {
    return (currentPage - PAGES.PAGES_TO_SKIP) * PAGES.ITEMS_PER_PAGE;
  }, [currentPage]);

  const lastDestinationIdx = useMemo(() => {
    return firstDestinationIdx + PAGES.ITEMS_PER_PAGE;
  }, [firstDestinationIdx]);

  useEffect(() => {
    setSlicedDestinations(() => {
      return filteredDestinations.slice(
        firstDestinationIdx,
        lastDestinationIdx
      );
    });
  }, [filteredDestinations, firstDestinationIdx, lastDestinationIdx]);

  useEffect(() => {
    setCurrentPage(() => pageNumber);
  }, [pageNumber]);

  const handlePageQueryChange = (targetPageNumber: number) => {
    setCurrentPage(() => targetPageNumber);
    queryParams.set(PAGES.QUERY_OF_URL, targetPageNumber.toString());
    navigate(`?${queryParams.toString()}`);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + PAGES.START_INDEX_OF_PAGE
  );

  const slicePageIdx = useMemo(() => {
    return (
      Math.floor(
        (currentPage - PAGES.START_INDEX_OF_PAGE) /
          PAGES.PAGES_TO_SHOW_IN_NAVBAR
      ) *
        PAGES.PAGES_TO_SHOW_IN_NAVBAR +
      PAGES.START_INDEX_OF_PAGE
    );
  }, [currentPage]);

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      handlePageQueryChange(currentPage - PAGES.PAGES_TO_SKIP);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    handlePageQueryChange(pageNumber);
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      handlePageQueryChange(currentPage + PAGES.PAGES_TO_SKIP);
    }
  };

  const handleFirstPageClick = () => {
    handlePageQueryChange(PAGES.START_INDEX_OF_PAGE);
  };

  const handleLastPageClick = () => {
    handlePageQueryChange(totalPages);
  };

  return (
    <div className={styles.paginationBar}>
      <button onClick={handleFirstPageClick}>{`<<`}</button>
      <button onClick={handlePreviousPageClick}>{`<`}</button>

      {pageNumbers
        .slice(
          slicePageIdx - PAGES.START_INDEX_OF_PAGE,
          slicePageIdx +
            PAGES.PAGES_TO_SHOW_IN_NAVBAR -
            PAGES.START_INDEX_OF_PAGE
        )
        .map((pageNumber) =>
          currentPage === pageNumber ? (
            <span
              key={pageNumber}
              className={styles.pageNumber}
              id={styles.selected}
            >
              {pageNumber}
            </span>
          ) : (
            <NavLink
              to={`?page=${pageNumber}`}
              className={styles.pageNumber}
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </NavLink>
          )
        )}
      {pageNumbers
        .slice(
          slicePageIdx - PAGES.START_INDEX_OF_PAGE,
          slicePageIdx +
            PAGES.PAGES_TO_SHOW_IN_NAVBAR -
            PAGES.START_INDEX_OF_PAGE
        )
        .includes(totalPages) ? (
        <span></span>
      ) : (
        <span className={styles.reducedNumber}>...</span>
      )}

      <button onClick={handleNextPageClick}>{`>`}</button>
      <button onClick={handleLastPageClick}>{`>>`}</button>
    </div>
  );
}

export default Pagination;
