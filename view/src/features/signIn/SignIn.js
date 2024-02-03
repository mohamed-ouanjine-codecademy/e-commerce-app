import React, { useEffect } from "react";
import { SignForm } from "../../components/SignForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, clearEmail, setPassword, clearPassword, signIn } from './signInSlice';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const email = useSelector(store => store.signIn.user.email);
  const password = useSelector(store => store.signIn.user.password);
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
      // Clear email & password
      dispatch(clearEmail());
      dispatch(clearPassword());
      // Redirect user to profile
      navigate('/profile');
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