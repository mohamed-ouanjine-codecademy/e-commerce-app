import React, { useEffect } from "react";
import { SignForm } from "../../components/SignForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, signIn } from './signInSlice';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from "../userInfo/userInfoSlice";

export function SignIn() {
  const email = useSelector(store => store.signIn.user.email);
  const password = useSelector(store => store.signIn.user.password);
  const user = useSelector(store => store.signIn.user);
  const signInPending = useSelector(store => store.signIn.signInPending);
  const signInFulfilled = useSelector(store => store.signIn.signInFulfilled);
  const signInRejected = useSelector(store => store.signIn.signInRejected);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signIn({ email, password }));
  }

  useEffect(() => {
    if (signInFulfilled) {
      // Set user info
      dispatch(setUserInfo(user));
      // Redirect user to profile
      navigate('/user/profile');
    }
  }, [signInFulfilled]);

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