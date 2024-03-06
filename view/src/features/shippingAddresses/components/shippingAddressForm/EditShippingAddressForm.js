import React, { useEffect } from "react";
import ShippingAddressForm from "./ShippingAddressForm";
import { useDispatch, useSelector } from "react-redux";
import {
  editShippingAddress,
  resetEditShippingAddress,
  setShippingAddressField,
} from "../../shippingAddressesSlice";
import { useNavigate, useParams } from "react-router-dom";

function EditShippingAddressForm() {
  const { shippingAddressId } = useParams();
  const parsedShippingAddressId = parseInt(shippingAddressId);
  const shippingAddresses = useSelector(state => state.shippingAddresses.shippingAddresses);
  const shippingAddress = shippingAddresses.find(address => address.id === parsedShippingAddressId);

  const {
    isPending: editShippingAddressPending,
    isFulfilled: editShippingAddressFulfilled
  } = useSelector(state => state.shippingAddresses.editShippingAddress);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedShippingAddress = {
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      };
      await dispatch(editShippingAddress({ shippingAddressId: parsedShippingAddressId, shippingAddress: updatedShippingAddress }));
    } catch (error) {
      // Handle error here
    }
  }

  useEffect(() => {
    if (editShippingAddressFulfilled) {
      dispatch(resetEditShippingAddress());
      navigate(-1);
    }
  }, [dispatch, navigate, editShippingAddressFulfilled]);

  return (
    <div className="container-fluid">
      <div className="row text-center">
        <h1 className="col">Update Shipping Address</h1>
      </div>
      <div className="row">
        <div className="col">
          <ShippingAddressForm
            onSubmit={handleSubmit}
            shippingAddress={shippingAddress}
            setShippingAddressField={(field) => dispatch(setShippingAddressField({ ...field, shippingAddressId: parsedShippingAddressId }))}
            submitMessage={'Update'}
            actionPending={editShippingAddressPending}
          />
        </div>
      </div>
    </div>
  );
};

export default EditShippingAddressForm;