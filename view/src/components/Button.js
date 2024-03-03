import React from "react";
import { Spinner } from "./sideEffect/Spinner";

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
          isPending ? (
            <Spinner />
          ) : (
            value
          )
        }
      </button>
    </>
  );
};
