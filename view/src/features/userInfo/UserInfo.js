import React, { useEffect } from "react";
import { setFirstName, setLastName, setAddress, updateUserInfo } from "./userInfoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserInfoForm } from "../../components/UserInfoForm";

export function UserInfo() {
  const userId = useSelector(store => store.signIn.user.id);
  const {
    firstName,
    lastName,
    address
  } = useSelector(store => store.userInfo.user);
  const updateUserInfoPending = useSelector(store => store.userInfo.updateUserInfoPending);
  const updateUserInfoFulfilled = useSelector(store => store.userInfo.updateUserInfoFulfilled);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(updateUserInfo({ userId, firstName, lastName, address }));
  }

  // Redirect User
  useEffect(() => {
    if (updateUserInfoFulfilled) {
      navigate('/user/profile');
    }
  }, [updateUserInfoFulfilled]);

  // Submit message handler
  const handleSubmitMessage = () => {
    if (updateUserInfoPending) {
      return 'Pending ...';
    }
    return 'Save';
  };

  return (
    <>
      <div className="container py-5">
      <div className="row flex-column">
        <h3 className="col">Your Info</h3>
        <UserInfoForm 
        className="col"
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        address={address}
        setAddress={setAddress}
        onSubmit={handleSubmit}
        submitMessage={handleSubmitMessage}
      />
      </div>
    </div>
      
    </>
  );
};