import React from "react";
import ShippingAddresses from "../shippingAddresses/ShippingAddresses";

function Checkout() {
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
      </div>
    </>
  );
};

export default Checkout;