import React from "react";
import { Pencil } from "../../../../components/icons/Pencil";
import { Trash } from "../../../../components/icons/Trash";
import { useNavigate } from "react-router-dom";

function ShippingAddress({
  shippingAddress,
  selected,
  onSelectAddress,
  onAddressRemoval,
  removeAddressPending
}) {
  const {
    id: shippingAddressId,
    name,
    street,
    city,
    state
  } = shippingAddress;
  const navigate = useNavigate();

  return (
    <>
      <label className="w-100">
        <div className={`card ${selected && 'border border-primary'}`}>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-2">
                <input
                  type="radio"
                  name="shippingAddress"
                  checked={selected}
                  onChange={onSelectAddress}
                />
              </div>
              <div className="col-8">
                <h5 className="card-title">{name}</h5>
                <p className="card-text text-body-secondary">{`${street}, ${city}, ${state}`}</p>
              </div>
              <div className="col-2">
                <div className="row row-cols-1">
                  <div className="col text-center">
                    <Pencil 
                      onClick={() => navigate(`/edit-shipping-address/${shippingAddressId}`)}
                    />
                  </div>
                  <div className="col text-center">
                    <Trash
                      onRemove={onAddressRemoval}
                      removeItemPending={removeAddressPending}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </label>
    </>
  );
};

export default ShippingAddress;