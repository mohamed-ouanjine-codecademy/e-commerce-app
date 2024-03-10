import React, { useEffect } from "react";
import ShippingAddresses from "../shippingAddresses/ShippingAddresses";
import { useDispatch, useSelector } from "react-redux";
import DeliveryMethods from "../deliveryMethods/DeliveryMethods";
import { setTotalCost, setCurrentStep, setContinueButtonDisabled } from "./checkoutSlice";
import OrderSummary from "../../components/OrderSummary";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const totalCost = useSelector(state => state.checkout.totalCost);
  const currentStep = useSelector(state => state.checkout.currentStep);
  const nextButtonDisabled = useSelector(state => state.checkout.nextButtonDisabled);
  // Items (cart)
  const items = useSelector(state => state.cart.items);
  const subTotal = useSelector(state => state.cart.totalAmount);
  // Shipping Address
  const selectedAddressId = useSelector(state => state.shippingAddresses.sideEffect.selectedAddressId);
  const shippingAddress = useSelector(state =>
    state.shippingAddresses.shippingAddresses.find(address =>
      address.id === selectedAddressId
    )
  );
  // Delivery Method
  const selectedMethodId = useSelector(state => state.deliveryMethods.sideEffects.selectedMethodId);
  const deliveryMethod = useSelector(state => state.deliveryMethods.deliveryMethods.find(method =>
    method.id === selectedMethodId
  ));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Set total cost by adding items's total cost and delivery method cost
  useEffect(() => {
    dispatch(setTotalCost(subTotal + deliveryMethod?.price));
  }, [dispatch, subTotal, deliveryMethod])

  // TODO: complete the 5 steps (shipping addresses,...,Payment, thank you page)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingAddresses />;
      case 2:
        return <DeliveryMethods />;
      case 3:
        return (
          <OrderSummary
            items={items}
            subTotal={subTotal}
            onItemsEdit={() => navigate('/cart')}
            shippingAddress={shippingAddress}
            onShippingAddressEdit={() => dispatch(setCurrentStep(1))}
            deliveryMethod={deliveryMethod}
            onDeliveryMethodEdit={() => dispatch(setCurrentStep(2))}
            totalCost={totalCost}
          />
        );
      default:
        return null;
    }
  };

  // This is basically to set the "Continue" button disabled state
  useEffect(() => {
    let continueButtonDisabledStatus;
    switch (currentStep) {
      case 1:
        if (selectedAddressId === null) continueButtonDisabledStatus = true;
        else continueButtonDisabledStatus = false
        break;
      case 2:
        if (selectedMethodId === null) continueButtonDisabledStatus = true;
        else continueButtonDisabledStatus = false
        break;
      case 3:
        continueButtonDisabledStatus = false;
        break;
      default:
        continueButtonDisabledStatus = true;
    }
    dispatch(setContinueButtonDisabled(continueButtonDisabledStatus));
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
                  onClick={() => dispatch(setCurrentStep(currentStep - 1))}
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
              onClick={() => dispatch(setCurrentStep(currentStep + 1))}
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