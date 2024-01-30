import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <>
      <footer className="container-fluid text-center py-3 bg-light">
        <div className='row gap-5'>
          <div className='col'>
            <h3>Links</h3>
            <ul className="nav nav-underline flex-column">
              <li className='nav-item'>
                <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="/">Home</Link>
              </li>
              <li className='nav-item'>
                <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="#">Terms</Link>
              </li>
              <li className='nav-item'>
                <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="#">Privacy</Link>
              </li>
            </ul>
          </div>
          <div className='col'>
            <h3>Auth</h3>
            <ul className="nav nav-underline flex-column">
              <li className='nav-item'>
                <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="/sign-up">Sign Up</Link>
              </li>
              <li className='nav-item'>
                <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="/sign-in">Sign In</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='row'>
          <p>CopyRight 2024</p>
        </div>
      </footer>
    </>
  )
}