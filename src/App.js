import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// User Pages
import HomePage from './pages/user/HomePage';
import MovieList from './pages/user/MovieList';
import MovieDetail from './pages/user/MovieDetail';
import BookingPage from './pages/user/BookingPage';
import BookingHistory from './pages/user/BookingHistory';
import UserDashboard from './pages/user/UserDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminStudios from './pages/admin/AdminStudios';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import BookingManager from './pages/admin/BookingManager';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* User Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/movies" element={<MovieList />} />
                            <Route path="/movies/:id" element={<MovieDetail />} />
                            <Route path="/booking/:showtimeId" element={<BookingPage />} />
                            <Route path="/bookings" element={<BookingHistory />} />
                            <Route path="/dashboard" element={<UserDashboard />} />

                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/movies" element={<AdminMovies />} />
                            <Route path="/admin/studios" element={<AdminStudios />} />
                            <Route path="/admin/showtimes" element={<AdminShowtimes />} />
                            <Route path="/admin/bookings" element={<BookingManager />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;