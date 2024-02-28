import React from "react";

export default function Bag({ onClick, itemsCount }) {
  return (
    <>
      <i className="bi bi-bag position-relative" onClick={onClick}>
        {
          (itemsCount > 0) && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {itemsCount}
              <span className="visually-hidden">Items count</span>
            </span>
          )
        }
      </i>
    </>
  );
};