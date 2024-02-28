import React from "react";

export function PrototypeCartItem({ className }) {
  return (
    <>
      <div className={`${className} card bg-light placeholder-glow w-100 h-100 overflow-hidden`} aria-hidden='true'>
        <div className="row g-0 w-100 h-100">
          <div className="col-4 placeholder bg-primary">
          </div>
          <div className="col-6 pt-3">
            <h5>
              <span className="placeholder placeholder-lg col-12 mx-1"></span>
            </h5>
            <p>
              <span className="placeholder placeholder-sm col-7 mx-1"></span>
              <span className="placeholder placeholder-sm col-4 mx-1"></span>
              <span className="placeholder placeholder-sm col-4 mx-1"></span>
              <span className="placeholder placeholder-sm col-6 mx-1"></span>
              <span className="placeholder placeholder-sm col-8 mx-1"></span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};