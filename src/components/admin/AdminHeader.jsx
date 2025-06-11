import React from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

// Komponen ini akan menampilkan header di dalam AdminLayout Anda
const AdminHeader = () => {
    const location = useLocation();

    // Fungsi untuk mendapatkan judul halaman berdasarkan URL
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (path === 'admin' || path === '') return 'Dashboard';
        // Mengubah 'movie-manager' menjadi 'Movie Manager'
        return path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        // Gunakan navbar Bulma dengan modifier warna gelap
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation" style={{ borderBottom: '1px solid #e50914' }}>
            <div className="navbar-brand">
                <a className="navbar-item" href="/admin">
                    <h1 className="title is-4 has-text-white">{getPageTitle()}</h1>
                </a>
            </div>

            <div className="navbar-menu is-active">
                <div className="navbar-end">
                    {/* Search Bar */}
                    <div className="navbar-item">
                        <div className="field">
                            <p className="control has-icons-right">
                                <input 
                                    className="input is-rounded" 
                                    type="text" 
                                    placeholder="Search..."
                                    style={{ backgroundColor: '#2d2d2d', borderColor: '#4a4a4a', color: '#fff' }}
                                />
                                <span className="icon is-small is-right">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Notification Bell */}
                    <div className="navbar-item">
                        <div className="icon-text has-text-grey-light" style={{ position: 'relative' }}>
                            <span className="icon is-medium">
                                <FontAwesomeIcon icon={faBell} className="is-size-4" />
                            </span>
                            {/* Notifikasi Badge */}
                            <span 
                                className="tag is-danger is-rounded"
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    height: '20px',
                                    width: '20px',
                                    fontSize: '0.7rem',
                                    border: '2px solid #2d2d2d'
                                }}
                            >
                                3
                            </span>
                        </div>
                    </div>
                    
                    {/* Admin Profile */}
                    <div className="navbar-item">
                        <div className="is-flex is-align-items-center">
                            <figure className="image is-24x24 mr-2">
                                <img 
                                    className="is-rounded" 
                                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                                    alt="Admin avatar"
                                    style={{ border: '1px solid #e50914' }}
                                />
                            </figure>
                            <span className="has-text-weight-semibold has-text-white">Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminHeader;