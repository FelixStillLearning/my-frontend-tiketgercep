// src/pages/user/BookingHistory.jsx
// Implementation of user's booking history page using real API data

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import bookingService from '../../services/bookingService';
import { movieService } from '../../services/MovieService';
import showtimeService from '../../services/showtimeService';
import studioService from '../../services/studioService';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Get user's bookings
        const bookingsData = await bookingService.getUserBookings(user.user_id);
        
        // Fetch related data for each booking
        const enrichedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              // Get showtime details
              const showtime = await showtimeService.getShowtimeById(booking.showtime_id);
              
              // Get movie details
              const movie = await movieService.getById(showtime.movie_id);
              
              // Get studio details
              const studio = await studioService.getStudioById(showtime.studio_id);
              
              return {
                ...booking,
                movie: {
                  title: movie.title,
                  poster_url: movie.poster_url
                },
                showtime: {
                  date: showtime.show_date,
                  time: showtime.show_time,
                  studio: {
                    name: studio.name || `Studio ${showtime.studio_id}`
                  }
                }
              };
            } catch (err) {
              console.warn('Error fetching booking details:', err);
              return {
                ...booking,
                movie: { title: 'Unknown Movie' },
                showtime: {
                  date: 'Unknown',
                  time: 'Unknown',
                  studio: { name: 'Unknown Studio' }
                }
              };
            }
          })
        );
        
        setBookings(enrichedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };    fetchBookings();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center text-gray-400">Loading booking history...</div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-white mb-8">Booking History</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-400">No bookings found</p>
            <button
              onClick={() => navigate('/movies')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.booking_id} className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{booking.movie.title}</h2>
                    <p className="text-gray-400">
                      {new Date(`${booking.showtime.date}T${booking.showtime.time}`).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400">Studio</p>
                    <p className="font-medium text-white">{booking.showtime.studio.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Seats</p>
                    <p className="font-medium text-white">{booking.total_seats}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Amount</p>
                    <p className="font-medium text-white">Rp {parseInt(booking.total_price).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Booking Code</p>
                    <p className="font-medium text-white">{booking.booking_code}</p>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Print Ticket
                    </button>
                    <button
                      onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;
