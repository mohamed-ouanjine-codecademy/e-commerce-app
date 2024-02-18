import React from "react";

export function Pencil({ onClick }) {
  return (
    <>
      <i className="btn bi bi-pencil p-0" style={{ fontSize: '1.2rem' }} onClick={onClick}></i>
    </>
  );
};