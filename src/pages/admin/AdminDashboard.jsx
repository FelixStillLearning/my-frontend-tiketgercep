// src/pages/admin/AdminDashboard.jsx

import React from 'react';
// Hapus import yang tidak perlu, ganti dengan komponen baru
// import axios from 'axios';
// import { Link } from 'react-router-dom';
import AdminCard from '../../components/admin/AdminCard';
import RecentBookings from '../../components/admin/RecentBookings'; // <-- Import
import MovieSchedule from '../../components/admin/MovieSchedule';   // <-- Import
import { faFilm, faArchway, faClock } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  // Anda bisa tetap menyimpan state untuk AdminCard di sini jika mau
  // atau memindahkannya ke dalam masing-masing komponen.
  // Untuk contoh ini, kita asumsikan data kartu tetap ada.
  const stats = { totalMovies: 42, activeStudios: 5, todaysShows: 18 };

  return (
    <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
      <div className="container">
        <h1 className="title is-2 has-text-white">Dashboard</h1>
        
        {/* Baris untuk AdminCard */}
        <div className="columns is-multiline mb-5">
            <div className="column is-one-third">
                <AdminCard icon={faFilm} title="Total Movies" value={stats.totalMovies} />
            </div>
            <div className="column is-one-third">
                <AdminCard icon={faArchway} title="Total Studios" value={stats.activeStudios} />
            </div>
            <div className="column is-one-third">
                <AdminCard icon={faClock} title="Today's Showtimes" value={stats.todaysShows} />
            </div>
        </div>

        {/* Baris untuk Komponen Baru */}
        <div className="columns">
            <div className="column is-half">
                <RecentBookings />
            </div>
            <div className="column is-half">
                <MovieSchedule />
            </div>
        </div>

      </div>
    </section>
  );
};

export default AdminDashboard;