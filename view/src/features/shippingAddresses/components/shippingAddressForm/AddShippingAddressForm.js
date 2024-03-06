import React, { useEffect } from "react";
import ShippingAddressForm from "./ShippingAddressForm";
import { useDispatch, useSelector } from "react-redux";
import {
  createShippingAddress,
  resetNewShippingAddress,
  setNewShippingAddressField,
  resetCreateShippingAddress,
} from "../../shippingAddressesSlice";
import { useNavigate } from "react-router-dom";

function AddShippingAddressForm() {
  const newShippingAddress = useSelector(state => state.shippingAddresses.newShippingAddress);
  const {
    isPending: createShippingAddressPending,
    isFulfilled: createShippingAddressFulfilled
  } = useSelector(state => state.shippingAddresses.createShippingAddress)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createShippingAddress({ newShippingAddress }));
  }

  useEffect(() => {
    if (createShippingAddressFulfilled) {
      // wipeout newShippingAddress
      dispatch(resetNewShippingAddress());
      // reset createShippingAddress sede effect
      dispatch(resetCreateShippingAddress());
      // navigate user back
      navigate(-1);
    }
  }, [dispatch, navigate, createShippingAddressFulfilled]);

  return (
    <>
      <div className="container-fluid">
        <div className="row text-center">
          <h1 className="col">Add New Shipping Address</h1>
        </div>
        <div className="row">
          <div className="col">
            <ShippingAddressForm
              onSubmit={handleSubmit}
              shippingAddress={newShippingAddress}
              setShippingAddressField={(field) => dispatch(setNewShippingAddressField(field))}
              submitMessage={'Create'}
              actionPending={createShippingAddressPending}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddShippingAddressForm;