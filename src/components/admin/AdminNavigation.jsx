import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);const menuItems = [
        {
            title: 'Dashboard',
            icon: 'fas fa-tachometer-alt',
            path: '/admin'
        },
        {
            title: 'Movies',
            icon: 'fas fa-film',
            path: '/admin/movies'
        },
        {
            title: 'Studios',
            icon: 'fas fa-building',
            path: '/admin/studios'
        },
        {
            title: 'Showtimes',
            icon: 'fas fa-clock',
            path: '/admin/showtimes'
        },
        {
            title: 'Bookings',
            icon: 'fas fa-ticket-alt',
            path: '/admin/bookings'
        },
        {
            title: 'Users',
            icon: 'fas fa-users',
            path: '/admin/users'
        }
    ];    const handleLogout = () => {
        try {
            // Clear all authentication data from localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('tiketgercep_user');
            
            // Redirect to homepage (not login page)
            navigate('/');
            
            // Show success message
            console.log('Admin logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear localStorage and redirect even if logout function fails
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('tiketgercep_user');
            navigate('/');
        }
    };

    return (
        <>
            <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
                        <h1 className="text-xl font-bold">
                            <span className="text-indigo-400 glow-text">Ticket</span>
                            <span className="text-amber-400">Gercep</span>
                        </h1>
                        <p className="text-sm text-gray-400">Admin Panel</p>
                    </div>
                    <button 
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
                    </button>
                </div>

                {/* Profile */}
                <div className={`p-4 border-b border-gray-700 ${isCollapsed ? 'hidden' : 'block'}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                            <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Admin User</h3>
                            <p className="text-gray-400 text-sm">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                            title={isCollapsed ? item.title : ''}
                        >
                            <i className={`${item.icon} w-5 text-center`}></i>
                            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.title}</span>
                        </Link>
                    ))}
                </nav>                {/* Logout */}
                <div className="absolute bottom-4 left-2 right-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <i className="fas fa-sign-out-alt w-5 text-center"></i>
                        <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminNavigation;
