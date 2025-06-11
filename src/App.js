import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import HomePage from './pages/user/HomePage';
import AdminLayout from './layouts/AdminLayout';
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
import AdminBooking from './pages/admin/AdminBooking';
import BookingForm from './components/admin/BookingForm';
import AdminUser from './pages/admin/AdminUser';
import UserForm from './components/admin/UserForm';
import NotFound from './pages/common/NotFound';
import './App.css';

// Component untuk conditional navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  
  // Jangan tampilkan navbar di admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Navbar />;
};

// Component untuk conditional footer
const ConditionalFooter = () => {
  const location = useLocation();
  
  // Jangan tampilkan footer di admin routes jika perlu
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <footer className="footer">
      <div className="content has-text-centered">
      </div>
    </footer>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar - conditional */}
        <ConditionalNavbar />
        
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
            {/* Semua route di dalam grup ini akan menggunakan AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} /> 
              
              <Route path="movies" element={<AdminMovies />} />
              <Route path="movie-manager" element={<MovieManager />} />
              <Route path="movies/create" element={<MovieForm />} />
              <Route path="movies/edit/:id" element={<MovieForm />} />
              
              <Route path="studios" element={<AdminStudios />} />
              <Route path="studio-manager" element={<StudioManager />} />
              <Route path="studios/create" element={<StudioForm />} />
              <Route path="studios/edit/:id" element={<StudioForm />} />

              <Route path="showtimes" element={<AdminShowtimes />} />
              <Route path="showtime-manager" element={<ShowtimeManager />} />
              <Route path="showtimes/create" element={<ShowtimeForm />} />
              <Route path="showtimes/edit/:id" element={<ShowtimeForm />} />

              <Route path="bookings" element={<AdminBooking />} />
              <Route path="bookings/create" element={<BookingForm />} />
              <Route path="bookings/edit/:id" element={<BookingForm />} />

              <Route path="users" element={<AdminUser />} />
              <Route path="users/create" element={<UserForm />} />
              <Route path="users/edit/:id" element={<UserForm />} />
            </Route>
            
            {/* ========== REDIRECTS & ERROR HANDLING ========== */}
            
            {/* Redirect old admin paths */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer - conditional */}
        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;