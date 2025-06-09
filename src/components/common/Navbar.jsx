// src/components/common/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Navbar = () => (
  <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <Link className="navbar-item" to="/">
        <strong>TiketGercep</strong>
      </Link>
      <button className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>
    <div id="navbarMenu" className="navbar-menu">
      <div className="navbar-start">
        <Link className="navbar-item" to="/">Home</Link>
        <Link className="navbar-item" to="/admin">Admin</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
