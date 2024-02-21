import React from "react";
import { useDispatch } from "react-redux";

export function IncreaseDecreaseButtons({
  quantity,

  setQuantity,
}) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="input-group flex-nowrap">
        <button
          type="button"
          className="col btn btn-outline-secondary"
          onClick={() => dispatch(setQuantity(quantity - 1))}
        >-</button>
        <input
          type="text"
          className="col form-control text-center"
          value={quantity}
          onChange={(e) => dispatch(setQuantity(parseInt(e.target.value)))}
        />
        <button
          type="button"
          className="col btn btn-outline-secondary"
          onClick={() => dispatch(setQuantity(quantity + 1))}
        >+</button>
      </div>
    </>
  );
};