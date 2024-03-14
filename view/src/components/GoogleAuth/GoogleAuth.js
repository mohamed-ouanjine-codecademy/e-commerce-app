import React from 'react';
import styles from './GoogleAuth.module.css';
import { ReactComponent as GoogleIcon } from '../../google-icon.svg'; // Import Google's icon SVG

function GoogleAuth() {
  return (
    <button
      className={`btn w-100 border border-gray ${styles.button}`}
      onClick={() => window.open("http://localhost:8000/api/auth/google", "_self")}
    >
      <div className='row justify-content-start'>
      <span className='col-2'><GoogleIcon className="google-icon" /></span>
      <span className='col-6'>Continue with Google</span>
      </div>
    </button>
  );
};

export default GoogleAuth;
