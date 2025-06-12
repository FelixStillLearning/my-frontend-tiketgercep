// src/pages/user/UserDashboard.jsx
// Implementation of user dashboard page using real API data

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import bookingService from '../../services/bookingService';
import { movieService } from '../../services/MovieService';
import showtimeService from '../../services/showtimeService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user's recent bookings
        const bookingsData = await bookingService.getUserBookings(user.user_id);
        
        // Enrich booking data with movie information
        const enrichedBookings = await Promise.all(
          bookingsData.slice(0, 3).map(async (booking) => {
            try {
              const showtime = await showtimeService.getShowtimeById(booking.showtime_id);
              const movie = await movieService.getById(showtime.movie_id);
              
              return {
                ...booking,
                movie: {
                  title: movie.title
                },
                showtime: {
                  date: showtime.show_date,
                  time: showtime.show_time
                }
              };
            } catch (err) {
              console.warn('Error fetching booking details:', err);
              return {
                ...booking,
                movie: { title: 'Unknown Movie' },
                showtime: { date: 'Unknown', time: 'Unknown' }
              };
            }
          })
        );
          setRecentBookings(enrichedBookings);
        setFormData(prev => ({
          ...prev,
          name: user.full_name || user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      await updateProfile(updateData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center text-gray-400">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="pt-20"> {/* Add padding-top to avoid navbar overlap */}
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.full_name || user?.name || 'User'}!</h1>
            <p className="text-gray-400">Manage your profile and view your booking history</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-8">            {/* Profile Update Form */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
              </div>
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Update Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Password Change Form */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-lock text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-white">Change Password</h2>
              </div>
              <form onSubmit={handlePasswordChange}>                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
                  >
                    <i className="fas fa-key mr-2"></i>
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>          {/* Recent Bookings */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-ticket-alt text-white"></i>
              </div>
              <h2 className="text-2xl font-semibold text-white">Recent Bookings</h2>
            </div>
            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-ticket-alt text-gray-500 text-xl"></i>
                </div>
                <p className="text-gray-400 text-lg mb-4">No recent bookings</p>
                <button
                  onClick={() => navigate('/movies')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <i className="fas fa-film mr-2"></i>
                  Book Your First Movie
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500 hover:bg-gray-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1">{booking.movie.title}</h3>
                        <div className="flex items-center text-gray-300 text-sm space-x-4">
                          <span className="flex items-center">
                            <i className="fas fa-calendar mr-1"></i>
                            {new Date(booking.showtime.date).toLocaleDateString('id-ID')}
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-clock mr-1"></i>
                            {booking.showtime.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </div>
                      </div>                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => navigate('/bookings')}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <i className="fas fa-history mr-2"></i>
                    View All Bookings
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
