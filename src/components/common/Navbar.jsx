// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-gray-900/80 backdrop-blur-md fixed w-full z-50 top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link to="/" className="text-2xl font-bold text-indigo-400 glow-text">
                                    Ticket<span className="text-amber-400">Gercep</span>
                                </Link>
                            </div>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    <Link to="/" className="text-indigo-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                    <Link to="/movies" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Movies</Link>
                                    <Link to="/cinemas" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Cinemas</Link>
                                    <Link to="/promotions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Promotions</Link>
                                </div>
                            </div>
                        </div>                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6 space-x-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            My Account
                                        </Link>
                                        <span className="text-indigo-300 text-sm">
                                            Hello, {user?.name || user?.email || 'User'}
                                        </span>
                                        <button 
                                            onClick={handleLogout}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/register" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Join Now
                                        </Link>
                                        <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
                            >
                                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
                            <Link 
                                to="/" 
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/movies" 
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Movies
                            </Link>
                            <Link 
                                to="/cinemas" 
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Cinemas
                            </Link>                            <Link 
                                to="/promotions" 
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Promotions
                            </Link>
                            
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        to="/dashboard" 
                                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <div className="px-3 py-2 text-indigo-300 text-sm">
                                        Hello, {user?.name || user?.email || 'User'}
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/register" 
                                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Join Now
                                    </Link>
                                    <Link 
                                        to="/login" 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}</div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
