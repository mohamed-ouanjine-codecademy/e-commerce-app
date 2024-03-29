import React from "react";

function DeliveryMethod({
  deliveryMethod,
  isSelected,
  onSelectMethod
}) {
  const { name, price, description } = deliveryMethod;

  return (
    <>
      <div className={`card ${isSelected && 'border border-primary'}`}>
        <div className="card-body">
          <label className="row align-items-center">
            <div className="col-2">
              <input
                type="radio"
                name="deliveryMethod"
                checked={isSelected}
                onChange={onSelectMethod}
              />
            </div>
            <div className="col-10">
              <h5 className="card-title">{name}</h5>
              <p className="card-text">{`${description}`}</p>
              <h6 className="card-subtitle text-body-secondary">{`$${price}`}</h6>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default DeliveryMethod;