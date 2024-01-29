import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, clearEmail, setPassword, clearPassword, register } from "./signUpSlice";

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
      <form className="container" method="POST" onSubmit={handleSubmit}>
        <div className="row">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
        </div>
        <div className="row">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
        </div>
        <div className="row">
          <input
            className="col-4"
            type="submit"
            value="Sign Up"
            disabled={email && password ? false : true}
          />
        </div>
      </form>
    </>
  )
}