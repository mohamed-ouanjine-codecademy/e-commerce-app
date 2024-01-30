import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, clearEmail, setPassword, clearPassword, register } from "./signUpSlice";
import { SignForm } from "../../components/SignForm";

export function SignUp() {
  const email = useSelector(store => store.signUp.email);
  const password = useSelector(store => store.signUp.password);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(register({ email, password }));
    dispatch(clearEmail())
    dispatch(clearPassword())
  }

  return (
    <>
      <div className="container">
        <h3 className="row">Sign Up</h3>
        <SignForm
          className="row"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          submitValue="Sign Up"
        />
      </div>
    </>
  )
}