import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  if (totalPages <= 1) return null;

  return (
    <div className="pagination__wrapper">
      <button 
        className="pagination__btn" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <FaChevronLeft />
      </button>
      
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button 
            key={pageNumber} 
            className={`pagination__btn ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button 
        className="pagination__btn" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;