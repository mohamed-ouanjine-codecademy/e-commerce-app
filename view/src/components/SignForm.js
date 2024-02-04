import React from 'react';
import { useDispatch } from 'react-redux';

export function SignForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  submitValue,
  isEmailAvailable,
  credentials
}) {
  const dispatch = useDispatch();

  const renderEmailFeedback = () => {
    if (isEmailAvailable === false) {
      return (
        <div className="invalid-feedback">
          Email is not available. Please choose another one.
        </div>
      );
    }
    return null;
  };

  const renderEmailAndPasswordFeedback = () => {
    if (credentials === false) {
      return (
        <div className="invalid-feedback">
          Wrong email or password
        </div>
      );
    }
    return null;
  };

  return (
    <form className={`${className} container`} onSubmit={onSubmit}>
      <div className={`row mb-3 ${isEmailAvailable === false && 'has-error'}`}>
        <label htmlFor='email' className="form-label">Email:</label>
        <input
          id='email'
          className={`form-control ${isEmailAvailable === false ? 'is-invalid' : ''}`}
          type="email"
          name="email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          placeholder='example@gmail.com'
        />
        {renderEmailFeedback()}
      </div>
      <div className={`row mb-3 ${credentials === false && 'has-error'}`}>
        <label htmlFor='password' className="form-label">Password:</label>
        <input
          id='password'
          className={`form-control ${credentials === false && 'is-invalid'}`}
          type="password"
          name="password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          placeholder='*******'
        />
        {renderEmailAndPasswordFeedback()}
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
  );
}
