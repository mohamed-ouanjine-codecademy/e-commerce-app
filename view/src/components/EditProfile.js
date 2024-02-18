import React, { useEffect } from "react";
import { setFirstName, setLastName, setAddress, updateUserInfo, loadProfileInfo, resetUpdateUserInfo } from "../features/profile/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { UserInfoForm } from "./UserInfoForm";

export function EditProfile() {
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const {
    id: userId,
    firstName,
    lastName,
    address
  } = useSelector(state => state.profile.user);
  const {
    isPending: updateUserInfoPending,
    isFulfilled: updateUserInfoFulfilled
  } = useSelector(state => state.profile.updateUserInfo);
  const {
    isPending: loadProfileInfoPending,
  } = useSelector(state => state.profile.loadProfileInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(updateUserInfo({
      userId,
      firstName,
      lastName,
      address
    }))
  }

  const handleSubmitMessage = () => {
    if (updateUserInfoPending || loadProfileInfoPending) return 'Pending...';
    return 'Save Changes';
  }

  // load profile info
  useEffect(() => {
    const func = async () => {
      await dispatch(loadProfileInfo());
    }
    if (!userId) func();
  }, [dispatch, userId]);

  // Redirect user after a successful modefication
  useEffect(() => {
    if (updateUserInfoFulfilled) {
      // reset updateUserInfo to default
      dispatch(resetUpdateUserInfo());
      // redirect user
      navigate('/user/profile')
    };
  }, [dispatch, navigate, updateUserInfoFulfilled]);

  // Redirect user to sign in page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/user/sign-in' />
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <h2>Your Info</h2>
        </div>
        <div className='row'>
          <UserInfoForm
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