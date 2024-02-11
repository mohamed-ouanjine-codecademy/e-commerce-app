import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, checkEmail, setCheckEmailDefault, register } from "./signUpSlice";
import { signInUser } from "../signIn/signInSlice";
import { createCart } from "../cart/cartSlice";
import { SignForm } from "../../components/SignForm";
import { Navigate, useNavigate } from "react-router-dom";

export function SignUp() {
  const {id: userId, email, password } = useSelector(state => state.signUp.user);
  const isEmailAvailable = useSelector(state => state.signUp.isEmailAvailable);
  const checkEmailPending = useSelector(state => state.signUp.checkEmailPending);
  const checkEmailFulfilled = useSelector(state => state.signUp.checkEmailFulfilled);
  const registerUserPending = useSelector(state => state.signUp.registerUserPending);
  const registerUserFulfilled = useSelector(state => state.signUp.registerUserFulfilled);
  const signInPending = useSelector(state => state.signIn.signInPending);
  const signInFulfilled = useSelector(state => state.signIn.signInFulfilled);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check email availability
    await dispatch(checkEmail({ email }));
  };

  // Register User
  useEffect(() => {
    const registerUser = async () => {
      // Register User
      await dispatch(register({ email, password }));
      // dispatch(setCheckEmailDefault());
    }
    if (isEmailAvailable && checkEmailFulfilled) registerUser();
  }, [isEmailAvailable, checkEmailFulfilled, dispatch]);

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
  }, [registerUserFulfilled, dispatch]);

  // Redirect user
  useEffect(() => {
    if (signInFulfilled) {
      // Redirect user to /user/info (page to get user info)
      navigate('/user/info');
    }
  }, [signInFulfilled]);

  // Submit message handler
  const handleSubmitMessage = () => {
    if (checkEmailPending || registerUserPending || signInPending) {
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
