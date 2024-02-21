import React from 'react';
import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <>
      <header className='my-3'>
        <nav>
          <ul className='nav nav-tabs justify-content-center'>
            <li className='nav-item'>
              <NavLink
                className={`nav-link ${({ isActive }) => isActive ? 'active' : ''}`}
                to="/">Home</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                className={`nav-link ${({ isActive }) => isActive ? 'active' : ''}`}
                to="cart">Cart</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                className={`nav-link ${({ isActive }) => isActive ? 'active' : ''}`}
                to="user/profile">Profile</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}