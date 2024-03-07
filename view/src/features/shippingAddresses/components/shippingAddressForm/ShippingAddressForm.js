import React from "react";
import { Spinner } from "../../../../components/sideEffect/Spinner";
import { useNavigate } from "react-router-dom";

function ShippingAddressForm({
  onSubmit,
  shippingAddress,
  setShippingAddressField,
  submitMessage,
  actionPending
}) {
  const { name, street, city, state, postalCode, country } = shippingAddress;
  const navigate = useNavigate();

  const handleCanceling = () => {
    navigate(-1);
  }

  return (
    <>
      <form className={`container-fluid`} onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="shippingAddressName" className="form-label">Shipping Address Name:</label>
            <input
              id="shippingAddressName"
              className="form-control"
              type="text"
              name="shippingAddressName"
              value={name}
              onChange={(e) => setShippingAddressField({ key: 'name', value: e.target.value })}
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="street" className="form-label">Street:</label>
            <input
              id="street"
              className="form-control"
              type="text"
              name="street"
              value={street}
              onChange={(e) => setShippingAddressField({ key: 'street', value: e.target.value })}
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="city" className="form-label">City:</label>
            <input
              id="city"
              className="form-control"
              type="text"
              name="city"
              value={city}
              onChange={(e) => setShippingAddressField({ key: 'city', value: e.target.value })}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="state" className="form-label">State:</label>
            <input
              id="state"
              className="form-control"
              type="text"
              name="state"
              value={state}
              onChange={(e) => setShippingAddressField({ key: 'state', value: e.target.value })}
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="country" className="form-label">Country:</label>
            <input
              id="country"
              className="form-control"
              type="text"
              name="country"
              value={country}
              onChange={(e) => setShippingAddressField({ key: 'country', value: e.target.value })}
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="postalCode" className="form-label">Postal Code:</label>
            <input
              id="postalCode"
              className="form-control"
              type="number"
              name="postalCode"
              value={postalCode}
              onChange={(e) => setShippingAddressField({ key: 'postalCode', value: e.target.value })}
              required
            />
          </div>
          <div className="col-6">
            <button
              className="btn btn-secondary w-100"
              type="button"
              onClick={handleCanceling}
              disabled={actionPending}
            >
              Cancel
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={actionPending}
            >
              {actionPending ? <Spinner /> : submitMessage}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ShippingAddressForm;