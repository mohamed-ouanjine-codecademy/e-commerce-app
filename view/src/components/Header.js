import React from 'react';
import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="cart">Cart</NavLink></li>
            <li><NavLink to="profile">Profile</NavLink></li>
          </ul>
        </nav>
      </header>
    </>
  )
}