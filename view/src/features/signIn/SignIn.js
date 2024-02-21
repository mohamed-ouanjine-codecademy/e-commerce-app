import React, { useEffect } from "react";
import { SignForm } from "../../components/SignForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, clearEmail, setPassword, clearPassword, signInUser, setDefaultSignInUser } from './signInSlice';
import { Navigate, useNavigate } from 'react-router-dom';
// import { setUserInfo } from "../userInfo/userInfoSlice";

export function SignIn() {
  const email = useSelector(state => state.signIn.email);
  const password = useSelector(state => state.signIn.password);
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
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
      // Clear email & password
      dispatch(clearEmail());
      dispatch(clearPassword());
      dispatch(setDefaultSignInUser())
      navigate('/user/profile');
    }
  }, [signInFulfilled, dispatch, navigate]);

  if (isAuthenticated) {
    return <Navigate to='/user/profile' />
  }
  return (
    <>
      <div className="container">
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