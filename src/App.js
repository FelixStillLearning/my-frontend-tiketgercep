import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import HomePage from './pages/user/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MovieDetail from './pages/user/MovieDetail';
import AdminMovies from './pages/admin/AdminMovies';
import AdminStudios from './pages/admin/AdminStudios';
import AdminShowtimes from './pages/admin/AdminShowtimes';
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
            
            {/* Admin Studio Management */}
            <Route path="/admin/studios" element={<AdminStudios />} />
            
            {/* Admin Showtime Management */}
            <Route path="/admin/showtimes" element={<AdminShowtimes />} />
            
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