import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <>
      <footer className="container-fluid">
        <ul className="row">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/sign-up">Sign UP</Link></li>
          <li><Link to="/sign-in">Sign In</Link></li>
          <li><Link to="#">Terms</Link></li>
          <li><Link to="#">Privacy</Link></li>
        </ul>
        <p className="row">CopyRight 2024</p>
      </footer>
    </>
  )
}