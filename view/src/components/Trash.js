import React from "react";

export function Trash({ onRemove }) {
  return (
    <>
      <span className="btn bi bi-trash" style={{ fontSize: '1.2rem' }} onClick={onRemove}></span>
    </>
  );
};