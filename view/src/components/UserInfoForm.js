import React from "react";
import { useDispatch } from "react-redux";

export function UserInfoForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address,
  setAddress,
  onSubmit,
  submitMessage,
}) {
  const dispatch = useDispatch();

  return (
    <>
      <form className={`container-fluid p-4`} onSubmit={onSubmit}>
        <div className="row mb-3">
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input
            id="firstName"
            className="form-control"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => dispatch(setFirstName(e.target.value))}
            required
          />
        </div>
        <div className="row mb-3">
          <label htmlFor="lastNamee" className="form-label">Last Name:</label>
          <input
            id="lastNamee"
            className="form-control"
            type="text"
            name="lastNamee"
            value={lastName}
            onChange={(e) => dispatch(setLastName(e.target.value))}
            required
          />
        </div>
        <div className="row mb-3">
          <label htmlFor="address" className="form-label">Address:</label>
          <input
            id="address"
            className="form-control"
            type="address"
            name="address"
            value={address}
            onChange={(e) => dispatch(setAddress(e.target.value))}
          />
        </div>
        <div className="row mb-3">
          <input
            className="btn btn-primary"
            type="submit"
            value={submitMessage()}
            disabled={firstName && lastName ? false : true}
          />
        </div>
      </form>
    </>
  );
};