import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, checkEmail, setCheckEmailDefault, register } from "./signUpSlice";
import { signIn } from "../signIn/signInSlice";
import { createCart } from "../cart/cartSlice";
import { SignForm } from "../../components/SignForm";
import { Navigate, useNavigate } from "react-router-dom";

export function SignUp() {
  const email = useSelector(state => state.signUp.user.email);
  const password = useSelector(state => state.signUp.user.password);
  const isEmailAvailable = useSelector(state => state.signUp.isEmailAvailable);
  const checkEmailPending = useSelector(state => state.signUp.checkEmailPending);
  const checkEmailFulfilled = useSelector(state => state.signUp.checkEmailFulfilled);
  const registerUserPending = useSelector(state => state.signUp.registerUserPending);
  const registerUserFulfilled = useSelector(state => state.signUp.registerUserFulfilled);
  const signInPending = useSelector(state => state.signIn.signInPending);
  const signInFulfilled = useSelector(state => state.signIn.signInFulfilled);
  const createCartPending = useSelector(state => state.cart.createCartPending);
  const createCartFulfilled = useSelector(state => state.cart.createCartFulfilled);
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
      dispatch(setCheckEmailDefault());
    }
    if (isEmailAvailable && checkEmailFulfilled) registerUser();
  }, [isEmailAvailable, checkEmailFulfilled]);

  // Sign In user & create cart
  useEffect(() => {
    const signInUserAndCartCart = async () => {
      // Sign In user auto
      await dispatch(signIn({ email, password }));
      // Create Cart
      await dispatch(createCart());
    }
    if (registerUserFulfilled) signInUserAndCartCart();
  }, [registerUserFulfilled]);

  // Redirect user
  useEffect(() => {
    if (createCartFulfilled) {
      // Redirect user to /user/info (page to get user info)
      navigate('/user/info');
    }
  }, [createCartFulfilled]);

  // Submit message handler
  const handleSubmitMessage = () => {
    if (checkEmailPending || registerUserPending || signInPending || createCartPending) {
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
