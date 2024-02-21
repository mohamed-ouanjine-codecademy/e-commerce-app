import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  setEmail,
  setPassword,
  checkEmailAvailability,
  registerUser,
  resetUser,
  resetCheckEmailAvailability,
  resetRegisterUser
} from "./signUpSlice";
import { signInUser } from "../signIn/signInSlice";
import { setUserInfo } from "../profile/profileSlice";
import { SignForm } from "../../components/SignForm";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const newUser = useSelector(state => state.signUp.user);
  const { email, password } = useSelector(state => state.signUp.user);
  const isEmailAvailable = useSelector(state => state.signUp.isEmailAvailable);
  const {
    isPending: checkEmailAvailabilityPending,
    isFulfilled: checkEmailAvailabilityFulfilled,
  } = useSelector(state => state.signUp.checkEmailAvailability);
  const {
    isPending: registerUserPending,
    isFulfilled: registerUserFulfilled,
  } = useSelector(state => state.signUp.registerUser);
  const {
    isPending: signInUserPending,
    isFulfilled: signInUserFulfilled,
  } = useSelector(state => state.signIn.signInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check email availability after a submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(checkEmailAvailability({ email }));
  };

  // Register User (after checking email availability)
  useEffect(() => {
    const func = async () => {
      dispatch(resetCheckEmailAvailability());
      // Register User
      await dispatch(registerUser({ email, password }));
    }
    if (isEmailAvailable && checkEmailAvailabilityFulfilled) func();
  }, [email, password, isEmailAvailable, checkEmailAvailabilityFulfilled, dispatch]);

  // Sign In user (after a successful registration)
  useEffect(() => {
    const func = async () => {
      try {
        dispatch(resetRegisterUser());
        // set user info in profile
        dispatch(setUserInfo({
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          address: newUser.address
        }));
        // Sign In user
        await dispatch(signInUser({ email, password }));
      } catch (error) {
        throw error;
      }
    }
    if (registerUserFulfilled) func();
  }, [
    email,
    password,
    registerUserFulfilled,
    dispatch,
    newUser.id,
    newUser.firstName,
    newUser.lastName,
    newUser.address
  ]
  );

  // Redirect user (after a successful sign in)
  useEffect(() => {
    if (signInUserFulfilled) {
      // reset user info in signUp Slice
      dispatch(resetUser());
      // Redirect user to /user/info (page to get user info)
      navigate('/user/profile/edit');
    }
  }, [navigate, signInUserFulfilled, dispatch]);

  // Submit message handler
  const handleSubmitMessage = () => {
    if (checkEmailAvailabilityPending || registerUserPending || signInUserPending)
      return 'Pending ...';
    
    return 'Sign Up';
  };

  return (
    <div className="container">
      <div className="row flex-column">
        <h3 className="col">Sign Up</h3>
        <SignForm
          className="col"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          submitValue={handleSubmitMessage()}
          isEmailAvailable={isEmailAvailable}
        />
      </div>
    </div>
  );
}
