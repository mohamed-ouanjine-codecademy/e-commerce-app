import React from "react";
import { SignForm } from "../../components/SignForm";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, clearEmail, setPassword, clearPassword, signIn } from './signInSlice';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const email = useSelector(store => store.signIn.user.email)
  const password = useSelector(store => store.signIn.user.password)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(signIn({ email, password }));
    dispatch(clearEmail())
    dispatch(clearPassword())
    navigate('/profile')
  }
  return (
    <>
      <div className="container py-5">
        <h3>Sign In</h3>
        <SignForm
          className="row"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          submitValue="Sign In"
        />
      </div>
    </>
  )
}