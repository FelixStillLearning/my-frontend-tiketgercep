// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-left">
                        <Link to="/" className="navbar-brand glow-text">
                            Ticket<span className="navbar-brand-highlight">Gercep</span>
                        </Link>
                        <div className="navbar-links">
                            <Link to="/" className="navbar-link">Home</Link>
                            <Link to="/movies" className="navbar-link">Movies</Link>
                            <Link to="/cinemas" className="navbar-link">Cinemas</Link>
                            <Link to="/promotions" className="navbar-link">Promotions</Link>
                        </div>
                    </div>
                    <div className="navbar-right">
                        <Link to="/login" className="btn btn-primary">Sign In</Link>
                    </div>
                    <div className="navbar-mobile-toggle">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="btn btn-secondary navbar-toggle-btn"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="btn btn-secondary mobile-menu-close"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="mobile-menu-links">
                        <Link to="/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/movies" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Movies</Link>
                        <Link to="/cinemas" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Cinemas</Link>
                        <Link to="/promotions" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Promotions</Link>
                        <Link to="/login" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
