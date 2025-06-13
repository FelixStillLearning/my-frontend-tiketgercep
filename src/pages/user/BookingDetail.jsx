// src/pages/user/BookingDetail.jsx
// Implementation of booking detail page showing specific booking information

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import bookingService from '../../services/bookingService';
import { movieService } from '../../services/MovieService';
import showtimeService from '../../services/showtimeService';
import studioService from '../../services/studioService';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [enrichedBooking, setEnrichedBooking] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Get booking details
        const bookingData = await bookingService.getBookingById(id);
        setBooking(bookingData);
        
        // Check if this booking belongs to the current user
        if (bookingData.user_id !== user.user_id) {
          setError('You are not authorized to view this booking.');
          setLoading(false);
          return;
        }
        
        // Enrich booking with additional data
        try {
          const showtime = await showtimeService.getShowtimeById(bookingData.showtime_id);
          const movieResponse = await movieService.getById(showtime.movie_id);
          const movieData = movieResponse.success ? movieResponse.data : movieResponse;
          const studio = await studioService.getStudioById(showtime.studio_id);
          
          const enriched = {
            ...bookingData,
            movie: {
              title: movieData.title || 'Unknown Movie',
              poster_url: movieData.poster_url,
              genre: movieData.genre,
              duration: movieData.duration
            },
            showtime: {
              date: showtime.show_date,
              time: showtime.show_time,
              studio: {
                name: studio.name || `Studio ${showtime.studio_id}`
              }
            }
          };
          
          setEnrichedBooking(enriched);
        } catch (enrichErr) {
          console.warn('Error enriching booking data:', enrichErr);
          setEnrichedBooking({
            ...bookingData,
            movie: { title: 'Unknown Movie' },
            showtime: {
              date: 'Unknown',
              time: 'Unknown',
              studio: { name: 'Unknown Studio' }
            }
          });
        }
        
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetail();
    }
  }, [id, user, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date, time) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return `${date} at ${time}`;
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center text-gray-400">Loading booking details...</div>
        </div>
        <Footer />
      </div>
    );
  }
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center text-red-400">{error || 'Booking not found'}</div>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/bookings')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Back to Booking History
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayBooking = enrichedBooking || booking;
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Booking Details</h1>
            <button
              onClick={() => navigate('/bookings')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to History
            </button>
          </div>

          {/* Booking Information Card */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Movie Info */}
              <div>
                {displayBooking.movie?.poster_url && (
                  <img
                    src={displayBooking.movie.poster_url}
                    alt={displayBooking.movie.title}
                    className="w-full max-w-sm h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {displayBooking.movie?.title || 'Unknown Movie'}
                </h2>
                {displayBooking.movie?.genre && (
                  <p className="text-gray-400">{displayBooking.movie.genre}</p>
                )}
                {displayBooking.movie?.duration && (
                  <p className="text-gray-400">{displayBooking.movie.duration} minutes</p>
                )}
              </div>

              {/* Right Column - Booking Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking Code:</span>
                      <span className="text-white font-mono">{booking.booking_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date & Time:</span>
                      <span className="text-white">
                        {formatDateTime(displayBooking.showtime?.date, displayBooking.showtime?.time)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Studio:</span>
                      <span className="text-white">{displayBooking.showtime?.studio?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Seats:</span>
                      <span className="text-white">{booking.total_seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-white font-semibold">
                        Rp {parseInt(booking.total_price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking Date:</span>
                      <span className="text-white">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Information */}
          {booking.BookingSeats && booking.BookingSeats.length > 0 && (
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Seat Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {booking.BookingSeats.map((bookingSeat, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-white font-semibold">
                      {bookingSeat.Seat?.seat_label || `Seat ${index + 1}`}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Row {bookingSeat.Seat?.seat_row}, Seat {bookingSeat.Seat?.seat_number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            {booking.status === 'confirmed' && (
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Print Ticket
              </button>
            )}
            <button
              onClick={() => navigate('/bookings')}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              View All Bookings
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Browse Movies
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetail;
