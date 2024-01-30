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
      <div className="row mb-3">
        <label htmlFor='email' className="form-label">Email:</label>
        <input
          id='email'
          className="form-control"
          type="email"
          name="email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          placeholder='example@gmail.com'
        />
      </div>
      <div className="row mb-3">
        <label htmlFor='password' className="form-label">Password:</label>
        <input
          id='password'
          className="form-control"
          type="password"
          name="password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          placeholder='*******'
        />
      </div>
      <div className="row">
        <input
          className="btn btn-primary"
          type="submit"
          value={submitValue}
          disabled={email && password ? false : true}
        />
      </div>
    </form>
  )
}