// src/components/user/UserNavigation.jsx
// TODO: Implement user menu component

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserNavigation = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/profile', label: 'Profile', icon: 'user' },
        { path: '/bookings', label: 'My Bookings', icon: 'ticket' },
        { path: '/favorites', label: 'Favorites', icon: 'heart' },
        { path: '/notifications', label: 'Notifications', icon: 'bell' },
    ];

    return (
        <nav className="bg-gray-800 rounded-lg shadow-lg p-4">
            <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`
                                flex items-center space-x-3 px-4 py-2 rounded-md transition-colors
                                ${isActive(item.path)
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }
                            `}
                        >
                            <span className="material-icons text-xl">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default UserNavigation;
