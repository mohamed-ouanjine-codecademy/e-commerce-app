import React from "react";
import { Spinner } from "../sideEffect/Spinner";

export function Trash({ onRemove, removeItemPending }) {
  return (
    <>
      {
        !removeItemPending ? (
          <span className="btn bi bi-trash" style={{ fontSize: '1.2rem' }} onClick={onRemove}></span>
        ) : (
          <Spinner />
        )
      }
    </>
  );
};