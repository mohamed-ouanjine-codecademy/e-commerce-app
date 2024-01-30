import React from 'react';
import { useDispatch } from 'react-redux';

export function SignForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  submitValue
}) {
  const dispatch = useDispatch();

  return (
    <form className={`${className} container`} onSubmit={onSubmit}>
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
          value={submitValue}
          disabled={email && password ? false : true}
        />
      </div>
    </form>
  )
}