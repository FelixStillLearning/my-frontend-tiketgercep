import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// User Pages
import HomePage from './pages/user/HomePage';
import MovieList from './pages/user/MovieList';
import MovieDetail from './pages/user/MovieDetail';
import BookingPage from './pages/user/BookingPage';
import BookingHistory from './pages/user/BookingHistory';
import UserDashboard from './pages/user/UserDashboard';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import MovieFormPage from './pages/admin/MovieFormPage';
import AdminStudios from './pages/admin/AdminStudios';
import StudioFormPage from './pages/admin/StudioFormPage';
import AdminShowtimes from './pages/admin/AdminShowtimesNew';
import ShowtimeFormPage from './pages/admin/ShowtimeFormPage';
import AdminBookings from './pages/admin/AdminBookings';
import BookingFormPage from './pages/admin/BookingFormPage';
import AdminUsersSimple from './pages/admin/AdminUsersSimple';
import UserFormPageSimple from './pages/admin/UserFormPageSimple';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-900 text-white">
                    <Routes>
                        {/* User Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movies" element={<MovieList />} />
                        <Route path="/movies/:id" element={<MovieDetail />} />
                        <Route path="/booking/:showtimeId" element={<BookingPage />} />
                        <Route path="/bookings" element={<BookingHistory />} />
                        <Route path="/dashboard" element={<UserDashboard />} />                          {/* Admin Routes */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/movies" element={<AdminMovies />} />                        
                        <Route path="/admin/movies/add" element={<MovieFormPage />} />
                        <Route path="/admin/movies/edit/:id" element={<MovieFormPage />} />
                        <Route path="/admin/studios" element={<AdminStudios />} />                        
                        <Route path="/admin/studios/add" element={<StudioFormPage />} />
                        <Route path="/admin/studios/edit/:id" element={<StudioFormPage />} />                        
                        <Route path="/admin/showtimes" element={<AdminShowtimes />} />
                        <Route path="/admin/showtimes/add" element={<ShowtimeFormPage />} />
                        <Route path="/admin/showtimes/edit/:id" element={<ShowtimeFormPage />} />                          <Route path="/admin/bookings" element={<AdminBookings />} />
                        <Route path="/admin/bookings/add" element={<BookingFormPage />} />
                        <Route path="/admin/bookings/edit/:id" element={<BookingFormPage />} />                        <Route path="/admin/users" element={<AdminUsersSimple />} />                        <Route path="/admin/users/add" element={<UserFormPageSimple />} />
                        <Route path="/admin/users/edit/:id" element={<UserFormPageSimple />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;