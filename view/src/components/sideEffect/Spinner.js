import React from "react";

export function Spinner() {
  return (
    <>
      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <span className="visually-hidden" role="status">Loading...</span>
    </>
  );
};