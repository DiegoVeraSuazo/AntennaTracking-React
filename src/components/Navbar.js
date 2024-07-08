import React from 'react';
import './css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/iss.svg" alt="Logo" className="navbar-logo" />
      </div>
      <h1>Sistema de control</h1>
    </nav>
  );
}

export default Navbar;
