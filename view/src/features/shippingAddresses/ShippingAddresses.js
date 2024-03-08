import React, { useEffect } from "react";
import ShippingAddress from "./components/shippingAddress/ShippingAddress";
import ShippingAddressPrototype from "./components/shippingAddress/ShippingAddressPrototype";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteShippingAddress,
  getShippingAddresses,
  setSelectedAddressId,
  sortShippingAddresses
} from "./shippingAddressesSlice";
import HouseAdd from "../../components/icons/HouseAdd";
import { useNavigate } from "react-router-dom";

function ShippingAddresses() {
  const shippingAddresses = useSelector(state => state.shippingAddresses.shippingAddresses);
  const {
    selectedAddressId,
    addressOnRemoval
  } = useSelector(state => state.shippingAddresses.sideEffect);
  const {
    isPending: getShippingAddressPending,
    isFulfilled: getShippingAddressFulfilled
  } = useSelector(state => state.shippingAddresses.getShippingAddresses);
  const {
    isPending: deleteShippingAddressPending
  } = useSelector(state => state.shippingAddresses.deleteShippingAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getShippingAddressesFunc = async () => {
      await dispatch(getShippingAddresses());
    }
    if (!getShippingAddressFulfilled) getShippingAddressesFunc();
  }, [dispatch, getShippingAddressFulfilled]);

  // Sort the shipping addresses whenever the array changes (from least to greatest)
  useEffect(() => {
    dispatch(sortShippingAddresses());
  }, [dispatch, shippingAddresses]);

  return (
    <div className="container-fluid">
      <div className="row">
        <h2 className="col">Shipping Address</h2>
      </div>
      <div className="row g-2">
        {
          getShippingAddressPending ? (
            Array.from({ length: 3 }, (_, index) =>
              <div className="col-12 col-md-6" key={index}>
                <ShippingAddressPrototype />
              </div>
            )
          ) : (
            shippingAddresses.map(shippingAddress => {
              const shippingAddressId = shippingAddress.id;
              return (
                <div className="col-12 col-md-6" key={shippingAddress.id} >
                  <ShippingAddress
                    shippingAddress={shippingAddress}
                    selected={selectedAddressId === shippingAddressId}
                    onSelectAddress={() => dispatch(setSelectedAddressId(shippingAddressId))}
                    onAddressRemoval={() => dispatch(deleteShippingAddress({ shippingAddressId }))}
                    removeAddressPending={deleteShippingAddressPending && shippingAddressId === addressOnRemoval}
                  />
                </div>
              )
            })
          )
        }
        <div className="col text-center">
          <HouseAdd
            onClick={() => navigate('/add-shipping-address')}
            size={'1.5rem'}
          />
        </div>
      </div>
    </div >
  );
};

export default ShippingAddresses;
