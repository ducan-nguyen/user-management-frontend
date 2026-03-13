import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div className="text-center mt-5">
      <Spinner
        animation="border"
        variant="primary"
        style={{ width: "3rem", height: "3rem" }}
      />
      <p className="mt-2 text-muted">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
