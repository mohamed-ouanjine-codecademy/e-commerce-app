import React, { useEffect } from "react";
import ShippingAddresses from "../shippingAddresses/ShippingAddresses";
import { useDispatch, useSelector } from "react-redux";
import ShippingMethods from "../shippingMethods/ShippingMethods";
import { setCurrentStep, resetNextButtonDisabled } from "./checkoutSlice";

function Checkout() {
  const currentStep = useSelector(state => state.checkout.currentStep);
  const nextButtonDisabled = useSelector(state => state.checkout.nextButtonDisabled);
  const selectedAddressId = useSelector(state => state.shippingAddresses.sideEffect.selectedAddressId);
  const selectedMethodId = useSelector(state => state.shippingMethods.sideEffects.selectedMethodId);

  const dispatch = useDispatch();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingAddresses />;
      case 2:
        return <ShippingMethods />;
      default:
        return null;
    }
  };


  useEffect(() => {
    let nextButtonDisabledStatus;
    switch (currentStep) {
      case 1:
        if (selectedAddressId === null) nextButtonDisabledStatus = true;
        else nextButtonDisabledStatus = false
        break;
      case 2:
        if (selectedMethodId === null) nextButtonDisabledStatus = true;
        else nextButtonDisabledStatus = false
        break;
      default:
        nextButtonDisabledStatus = true;
    }
    dispatch(resetNextButtonDisabled(nextButtonDisabledStatus));
  }, [dispatch, selectedAddressId, selectedMethodId, currentStep]);

  return (
    <>
      <div className="container-fluid">
        <div className="row text-center">
          <h1 className="col">Checkout</h1>
        </div>
        <div className="row my-3">
          <div className="col">
            {renderStepContent()}
          </div>
        </div>
        <div className="row">
          {
            (currentStep > 1) && (
              <div className="col">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => dispatch(setCurrentStep(-1))}
                >
                  Previous Step
                </button>
              </div>
            )
          }
          <div className="col">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => dispatch(setCurrentStep(1))}
              disabled={nextButtonDisabled}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;