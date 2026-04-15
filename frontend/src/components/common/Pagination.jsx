import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange, size = "md" }) => {
  const getPaginationItems = () => {
    let items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // First page
    if (start > 1) {
      items.push(
        <BSPagination.First key="first" onClick={() => onPageChange(1)} />
      );
      items.push(<BSPagination.Ellipsis key="ellipsis-start" disabled />);
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      items.push(
        <BSPagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </BSPagination.Item>
      );
    }

    // Last page
    if (end < totalPages) {
      items.push(<BSPagination.Ellipsis key="ellipsis-end" disabled />);
      items.push(
        <BSPagination.Last
          key="last"
          onClick={() => onPageChange(totalPages)}
        />
      );
    }

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center mt-4">
      <BSPagination size={size}>
        <BSPagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {getPaginationItems()}
        <BSPagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </BSPagination>
    </div>
  );
};

export default Pagination;
