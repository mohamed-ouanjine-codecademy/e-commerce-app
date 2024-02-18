import React from "react";

export function Trash({ onRemove, removeItemPending }) {
  return (
    <>
      {
        !removeItemPending ? (
          <span className="btn bi bi-trash" style={{ fontSize: '1.2rem' }} onClick={onRemove}></span>
        ) : (
          <div className="spinner-grow spinner-grow-sm text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )
      }
    </>
  );
};