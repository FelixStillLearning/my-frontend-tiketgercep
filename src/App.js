import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import HomePage from './pages/user/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MovieDetail from './pages/user/MovieDetail';
import AdminMovies from './pages/admin/AdminMovies';
import MovieManager from './pages/admin/MovieManager';
import MovieForm from './components/admin/MovieForm'; 
import AdminStudios from './pages/admin/AdminStudios';
import StudioManager from './pages/admin/StudioManager';
import StudioForm from './components/admin/StudioForm';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import ShowtimeManager from './pages/admin/ShowtimeManager';
import ShowtimeForm from './components/admin/ShowtimeForm';
import NotFound from './pages/common/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            
            {/* Homepage - Landing page with movie list */}
            <Route path="/" element={<HomePage />} />
            
            {/* Movie Detail - Individual movie information */}
            <Route path="/movie/:id" element={<MovieDetail />} />
            
            {/* ========== ADMIN ROUTES ========== */}
            
            {/* Admin Dashboard - Main admin page */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Admin Movie Management */}
            <Route path="/admin/movies" element={<AdminMovies />} />

            {/* TAMBAH ROUTE BARU DI SINI: */}
            {/* Movie Manager - Alternative movie management */}
            <Route path="/admin/movie-manager" element={<MovieManager />} />
            
            {/* Movie Form - Create/Edit movie */}
            <Route path="/admin/movies/create" element={<MovieForm />} />
            <Route path="/admin/movies/edit/:id" element={<MovieForm />} />
            
            {/* Admin Studio Management */}
            <Route path="/admin/studios" element={<AdminStudios />} />

            <Route path="/admin/studio-manager" element={<StudioManager />} />
            <Route path="/admin/studios/create" element={<StudioForm />} />
            <Route path="/admin/studios/edit/:id" element={<StudioForm />} />
            
            {/* Admin Showtime Management */}
            <Route path="/admin/showtimes" element={<AdminShowtimes />} />

            {/* Movie Manager - Alternative movie management */}
            <Route path="/admin/showtime-manager" element={<ShowtimeManager />} />
            <Route path="/admin/showtimes/create" element={<ShowtimeForm />} />
            <Route path="/admin/showtimes/edit/:id" element={<ShowtimeForm />} />
            
            {/* ========== REDIRECTS & ERROR HANDLING ========== */}
            
            {/* Redirect old admin paths */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="footer">
          <div className="content has-text-centered">
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;