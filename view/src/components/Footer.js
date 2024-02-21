import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from '../features/logOut/LogOut';
import { useSelector } from 'react-redux';

export function Footer() {
  const isAuthenticated= useSelector(state => state.signIn.isAuthenticated);

  return (
    <>
      <footer className="container-fluid text-center py-3 my-3 bg-light">
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
                {!isAuthenticated && <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="/user/sign-up">Sign Up</Link>}
              </li>
              <li className='nav-item'>
                {!isAuthenticated && <Link className={`nav-link ${({ isActive }) => isActive && 'active'}`} to="/user/sign-in">Sign In</Link>}
              </li>
              <li className='nav-item'>
                {isAuthenticated && <LogOut className={`nav-link ${({ isActive }) => isActive && 'active'}`} >Log Out</LogOut>}
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