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
            path: '/admin/dashboard'
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
    ];

    const handleLogout = () => {
        // Add logout logic here
        navigate('/');
    };

    return (
        <>
            <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    <button 
                        className="admin-sidebar-toggle"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
                    </button>
                    <h1 className="admin-sidebar-title">
                        <span className="glow-text">Ticket</span>
                        <span style={{ color: 'var(--color-warning)' }}>Gercep</span>
                    </h1>
                    <p className="admin-sidebar-subtitle">Admin Panel</p>
                </div>

                <div className="admin-profile">
                    <div className="admin-profile-image">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="admin-profile-info">
                        <h3 className="admin-profile-name">Admin User</h3>
                        <p className="admin-profile-role">Administrator</p>
                    </div>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            title={isCollapsed ? item.title : ''}
                        >
                            <i className={`admin-nav-icon ${item.icon}`}></i>
                            <span className="admin-nav-link-text">{item.title}</span>
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="admin-nav-item"
                    >
                        <i className="admin-nav-icon fas fa-sign-out-alt"></i>
                        <span className="admin-nav-link-text">Logout</span>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Confirm Logout"
                size="sm"
            >
                <div className="admin-logout-modal">
                    <p>Are you sure you want to logout?</p>
                    <div className="admin-logout-actions">
                        <button 
                            className="btn btn-secondary"
                            onClick={() => setShowLogoutModal(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-danger"
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
