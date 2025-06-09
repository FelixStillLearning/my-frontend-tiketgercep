// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../App.css';

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    return (
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to="/">
                    <strong>TiketGercep</strong>
                </Link>

                <button
                    className={`navbar-burger ${isActive ? 'is-active' : ''}`}
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={toggleMenu}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className="navbar-start">
                    <Link 
                        className={`navbar-item ${location.pathname === '/' ? 'is-active' : ''}`}
                        to="/"
                    >
                        Home
                    </Link>
                    <Link 
                        className={`navbar-item ${location.pathname === '/admin' ? 'is-active' : ''}`}
                        to="/admin"
                    >
                        Admin
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <Link className="button is-light" to="/admin">
                                <strong>Admin Panel</strong>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
