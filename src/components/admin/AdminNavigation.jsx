// src/components/admin/AdminNavigation.jsx (Bulma)
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faFilm, faArchway, faClock, faTicketAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

// Agar NavLink berfungsi dengan baik, tambahkan CSS ini di file index.css Anda:
// a.is-active { background-color: #e50914 !important; color: white !important; }
const AdminNavigation = () => {
  return (
    <aside className="menu p-4 has-background-dark" style={{ height: '100vh' }}>
      <p className="menu-label has-text-grey-light">General</p>
      <ul className="menu-list">
        <li>
          <NavLink to="/admin" className="has-text-white">
            <span className="icon-text">
              <span className="icon"><FontAwesomeIcon icon={faTachometerAlt} /></span>
              <span>Dashboard</span>
            </span>
          </NavLink>
        </li>
      </ul>
      <p className="menu-label has-text-grey-light">Management</p>
      <ul className="menu-list">
        <li>
          <NavLink to="/admin/movies" className="has-text-white">
             <span className="icon-text">
              <span className="icon"><FontAwesomeIcon icon={faFilm} /></span>
              <span>Movies</span>
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/studios" className="has-text-white">
             <span className="icon-text">
              <span className="icon"><FontAwesomeIcon icon={faArchway} /></span>
              <span>Studios</span>
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/showtimes" className="has-text-white">
             <span className="icon-text">
              <span className="icon"><FontAwesomeIcon icon={faClock} /></span>
              <span>Showtimes</span>
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/bookings" className="has-text-white">
             <span className="icon-text">
              <span className="icon"><FontAwesomeIcon icon={faTicketAlt} /></span>
              <span>Bookings</span>
            </span>
          </NavLink>
        </li>
         <li>
          <NavLink to="/admin/users" className="has-text-white">
             <span className="icon-text">
              <span className="icon"><FontAwesomeIcon icon={faUsers} /></span>
              <span>Users</span>
            </span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminNavigation;