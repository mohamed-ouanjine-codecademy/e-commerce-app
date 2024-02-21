import React from "react";
import { Spinner } from "./sideEffect/Spinner";

export function IncreaseDecreaseButtons({
  quantity,
  onIncrease,
  increasePending,
  onDecrease,
  decreasePending,
}) {
  return (
    <>
        <div className="input-group">
          <button
            type="button"
            className="col btn btn-outline-secondary"
            onClick={onIncrease}
          >
            {
              increasePending ? (
                <Spinner />
              ) : (
                '+'
              )
            }
          </button>
          <input
            type="text" value={quantity}
            className="col form-control text-center"
          />
          <button
            type="button"
            className="col btn btn-outline-secondary"
            onClick={onDecrease}
          >
            {
              decreasePending ? (
                <Spinner />
              ) : (
                '-'
              )
            }
          </button>
        </div>
    </>
  );
};