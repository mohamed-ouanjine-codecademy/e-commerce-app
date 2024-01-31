import React from "react";
import { SignForm } from "../../components/SignForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, clearEmail, setPassword, clearPassword, signIn } from './signInSlice';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const email = useSelector(store => store.signIn.user.email);
  const password = useSelector(store => store.signIn.user.password);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(signIn({ email, password }));
    dispatch(clearEmail());
    dispatch(clearPassword());
    navigate('/profile');
  }
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
            submitValue="Sign In"
          />
        </div>
      </div>
    </>
  )
}