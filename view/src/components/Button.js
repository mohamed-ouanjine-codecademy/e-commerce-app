import React from "react";

export function Button({ value, onClick, isPending }) {

  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-100"
        aria-label="Add to Cart"
        onClick={onClick}
      >
        {
          isPending ? 'Pending...' : 'Add to Cart'
        }
      </button>
    </>
  );
};
