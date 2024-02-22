import React, { useEffect, useState } from "react";
import { Spinner } from "./sideEffect/Spinner";

export function IncreaseDecreaseButtons({
  quantity,
  setQuantity,
  setQuantityPending
}) {
  const [increasePending, setIncreasePending] = useState(false);
  const [decreasePending, setDecreasePending] = useState(false);

  const handleDecrease = () => {
    setQuantity(quantity - 1);
    setDecreasePending(true);
  }
  const handleIncrease = () => {
    setQuantity(quantity + 1);
    setIncreasePending(true);
  }

  useEffect(() => {
    if (!setQuantityPending) {
      if (increasePending) setIncreasePending(false);
      if (decreasePending) setDecreasePending(false);
    }
  }, [setQuantityPending]);

  return (
    <>
      <div className="input-group flex-nowrap">
        <button
          type="button"
          className="col btn btn-outline-secondary"
          onClick={handleDecrease}
        >
          {
            (decreasePending && setQuantityPending) ? (
              <Spinner />
            ) : (
              '-'
            )
          }
        </button>
        <input
          type="text"
          className="col form-control text-center"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button
          type="button"
          className="col btn btn-outline-secondary"
          onClick={handleIncrease}
        >
          {
            (increasePending && setQuantityPending) ? (
              <Spinner />
            ) : (
              '+'
            )
          }
        </button>
      </div>
    </>
  );
};