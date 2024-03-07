import React from "react";
import ShippingAddresses from "../shippingAddresses/ShippingAddresses";
import { useSelector } from "react-redux";

function Checkout() {
  const selectedAddressId = useSelector(state => state.shippingAddresses.sideEffect.selectedAddressId);
  return (
    <>
      <div className="container-fluid">
        <div className="row text-center">
          <h1 className="col">Checkout</h1>
        </div>
        <div className="row">
          <div className="col">
            <ShippingAddresses />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              type="button"
              className="btn btn-primary w-100"
              disabled={selectedAddressId === null}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;