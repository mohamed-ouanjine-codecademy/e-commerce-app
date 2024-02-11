import React, { useEffect } from "react";
import { SignForm } from "../../components/SignForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, signInUser, setDefault } from './signInSlice';
import { useNavigate } from 'react-router-dom';
// import { setUserInfo } from "../userInfo/userInfoSlice";

export function SignIn() {
  const email = useSelector(state => state.signIn.user.email);
  const password = useSelector(state => state.signIn.user.password);
  const {
    isPending: signInPending,
    isFulfilled: signInFulfilled,
    isRejected: signInRejected
  } = useSelector(state => state.signIn.signInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signInUser({ email, password }));
  }

  useEffect(() => {
    if (signInFulfilled) {
      dispatch(setDefault());
      // Set user info
      // dispatch(setUserInfo(user));
      // Redirect user to profile
      navigate('/user/profile');
    }
  }, [signInFulfilled, dispatch]);

  return (
    <>
      <div className="container py-5">
        <div className="row flex-column">
          <h3 className="col">Sign In</h3>
          <SignForm
            className="col"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            submitValue={signInPending ? 'Pending ...' : 'Sign In'}
            credentials={!signInRejected}
          />
        </div>
      </div>
    </>
  )
}