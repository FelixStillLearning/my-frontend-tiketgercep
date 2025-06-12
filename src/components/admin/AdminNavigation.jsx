import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';

const AdminNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const menuItems = [
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
        }
    ];

    const handleLogout = () => {
        // Clear user data and redirect
        localStorage.removeItem('user');
        navigate('/');
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
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-2 right-2">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <i className="fas fa-sign-out-alt w-5 text-center"></i>
                        <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
                    </button>                </div>
            </div>

            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirm Logout"
                size="sm"
            >
                <div className="p-4">
                    <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
                    <div className="flex justify-end space-x-3">
                        <button 
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            onClick={() => setShowLogoutModal(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AdminNavigation;
