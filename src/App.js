import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import ProtectedUserRoute from './components/common/ProtectedUserRoute';
import './App.css';

// User Pages
import HomePage from './pages/user/HomePage.jsx';
import MovieList from './pages/user/MovieList.jsx';
import MovieDetail from './pages/user/MovieDetail.jsx';
import BookingPage from './pages/user/BookingPage.jsx';
import BookingHistory from './pages/user/BookingHistory.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';

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
import BookingDetail from './pages/user/BookingDetailNew';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-900 text-white">
                    <Routes>
                        {/* User Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movies" element={<MovieList />} />
                        <Route path="/movies/:id" element={<MovieDetail />} />                        <Route path="/booking/:showtimeId" element={<BookingPage />} />                        <Route path="/bookings" element={<ProtectedUserRoute><BookingHistory /></ProtectedUserRoute>} />
                        <Route path="/bookings/:id" element={<ProtectedUserRoute><BookingDetail /></ProtectedUserRoute>} />
                        <Route path="/dashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                        <Route path="/admin/movies" element={<ProtectedAdminRoute><AdminMovies /></ProtectedAdminRoute>} />                        
                        <Route path="/admin/movies/add" element={<ProtectedAdminRoute><MovieFormPage /></ProtectedAdminRoute>} />
                        <Route path="/admin/movies/edit/:id" element={<ProtectedAdminRoute><MovieFormPage /></ProtectedAdminRoute>} />
                        <Route path="/admin/studios" element={<ProtectedAdminRoute><AdminStudios /></ProtectedAdminRoute>} />                        
                        <Route path="/admin/studios/add" element={<ProtectedAdminRoute><StudioFormPage /></ProtectedAdminRoute>} />
                        <Route path="/admin/studios/edit/:id" element={<ProtectedAdminRoute><StudioFormPage /></ProtectedAdminRoute>} />                        
                        <Route path="/admin/showtimes" element={<ProtectedAdminRoute><AdminShowtimes /></ProtectedAdminRoute>} />
                        <Route path="/admin/showtimes/add" element={<ProtectedAdminRoute><ShowtimeFormPage /></ProtectedAdminRoute>} />
                        <Route path="/admin/showtimes/edit/:id" element={<ProtectedAdminRoute><ShowtimeFormPage /></ProtectedAdminRoute>} />                          
                        <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminBookings /></ProtectedAdminRoute>} />
                        <Route path="/admin/bookings/add" element={<ProtectedAdminRoute><BookingFormPage /></ProtectedAdminRoute>} />
                        <Route path="/admin/bookings/edit/:id" element={<ProtectedAdminRoute><BookingFormPage /></ProtectedAdminRoute>} />                        
                        <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsersSimple /></ProtectedAdminRoute>} />                        
                        <Route path="/admin/users/add" element={<ProtectedAdminRoute><UserFormPageSimple /></ProtectedAdminRoute>} />
                        <Route path="/admin/users/edit/:id" element={<ProtectedAdminRoute><UserFormPageSimple /></ProtectedAdminRoute>} />

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