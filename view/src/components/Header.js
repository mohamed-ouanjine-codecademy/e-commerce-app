import React from 'react';
import { NavLink } from 'react-router-dom';
import Bag from './icons/Bag';
import { useSelector } from 'react-redux';

export function Header() {
  const itemsCount = useSelector(state => state.cart.items.length);
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
                to="user/profile">Profile</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                className={`nav-link ${({ isActive }) => isActive ? 'active' : ''}`}
                to="cart">
                  <Bag itemsCount={itemsCount}/>
                </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}