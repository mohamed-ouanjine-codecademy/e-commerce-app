import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, checkEmailAvailability, registerUser } from "./signUpSlice";
import { signInUser } from "../signIn/signInSlice";
import { SignForm } from "../../components/SignForm";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const { email, password } = useSelector(state => state.signUp.user);
  const isEmailAvailable = useSelector(state => state.signUp.isEmailAvailable);
  const { 
    isPending : checkEmailAvailabilityPending,
    isFulfilled: checkEmailAvailabilityFulfilled,
  } = useSelector(state => state.signUp.checkEmailAvailability);
  const { 
    isPending : registerUserPending,
    isFulfilled: registerUserFulfilled,
  } = useSelector(state => state.signUp.registerUser);
  const { 
    isPending : signInUserPending,
    isFulfilled: signInUserFulfilled,
  } = useSelector(state => state.signIn.signInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check email availability
    await dispatch(checkEmailAvailability({ email }));
  };

  // Register User
  useEffect(() => {
    const registerUserFunc = async () => {
      // Register User
      await dispatch(registerUser({ email, password }));
      // dispatch(setCheckEmailDefault());
    }
    if (isEmailAvailable && checkEmailAvailabilityFulfilled) registerUserFunc();
  }, [email ,password, isEmailAvailable, checkEmailAvailabilityFulfilled, dispatch]);

  // Sign In user & create cart
  useEffect(() => {
    const signInFunc = async () => {
      try {
        // Sign In user auto
        await dispatch(signInUser({ email, password }));
      } catch (error) {
        throw error;
      }
    }
    if (registerUserFulfilled) signInFunc();
  }, [email, password, registerUserFulfilled, dispatch]);

  // Redirect user
  useEffect(() => {
    if (signInUserFulfilled) {
      // Redirect user to /user/info (page to get user info)
      navigate('/user/info');
    }
  }, [navigate, signInUserFulfilled]);

  // Submit message handler
  const handleSubmitMessage = () => {
    if (checkEmailAvailabilityPending || registerUserPending || signInUserPending) {
      return 'Pending ...';
    }
    return 'Sign Up';
  };
  
  return (
    <div className="container py-5">
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
