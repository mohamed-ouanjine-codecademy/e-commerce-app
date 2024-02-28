import React from "react";

export function Button({ value, onClick, isPending }) {

  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-100"
        aria-label={value}
        onClick={onClick}
      >
        {
          isPending ? 'Pending...' : value
        }
      </button>
    </>
  );
};
