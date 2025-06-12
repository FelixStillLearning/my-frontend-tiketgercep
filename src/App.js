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

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import MovieFormPage from './pages/admin/MovieFormPage';
import AdminStudios from './pages/admin/AdminStudios';
import StudioFormPage from './pages/admin/StudioFormPage';
import AdminShowtimes from './pages/admin/AdminShowtimesNew';
import ShowtimeFormPage from './pages/admin/ShowtimeFormPage';
import BookingManager from './pages/admin/BookingManagerNew';
import MovieManager from './pages/admin/MovieManager';
import StudioManager from './pages/admin/StudioManager';
import ShowtimeManager from './pages/admin/ShowtimeManager';
import UserManager from './pages/admin/UserManager';
import SeatManager from './pages/admin/SeatManager';
import BookingSeatManager from './pages/admin/BookingSeatManager';

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
                        <Route path="/dashboard" element={<UserDashboard />} />                        {/* Admin Routes - using simple components first */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/movies" element={<AdminMovies />} />                        <Route path="/admin/movies/add" element={<MovieFormPage />} />
                        <Route path="/admin/movies/edit/:id" element={<MovieFormPage />} />
                        <Route path="/admin/studios" element={<AdminStudios />} />                        <Route path="/admin/studios/add" element={<StudioFormPage />} />
                        <Route path="/admin/studios/edit/:id" element={<StudioFormPage />} />
                        <Route path="/admin/showtimes" element={<AdminShowtimes />} />
                        <Route path="/admin/showtimes/add" element={<ShowtimeFormPage />} />
                        <Route path="/admin/showtimes/edit/:id" element={<ShowtimeFormPage />} />
                        <Route path="/admin/bookings" element={<BookingManager />} />
                        
                        {/* New Admin Manager Routes with CRUD */}
                        <Route path="/admin/manage/movies" element={<MovieManager />} />
                        <Route path="/admin/manage/studios" element={<StudioManager />} />
                        <Route path="/admin/manage/showtimes" element={<ShowtimeManager />} />
                        <Route path="/admin/manage/users" element={<UserManager />} />
                        <Route path="/admin/manage/seats" element={<SeatManager />} />
                        <Route path="/admin/manage/booking-seats" element={<BookingSeatManager />} />

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