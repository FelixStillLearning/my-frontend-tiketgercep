// src/pages/user/BookingDetail.jsx
// Enhanced booking detail page with improved UI/UX

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
          
          const enrichedBooking = {
            ...bookingData,
            movie: {
              title: movieData.title || 'Unknown Movie',
              poster_url: movieData.poster_url,
              genre: movieData.genre,
              duration: movieData.duration ? `${movieData.duration} minutes` : 'Unknown Duration'
            },
            showtime: {
              show_date: showtime.show_date,
              show_time: showtime.show_time,
              studio_id: showtime.studio_id
            },
            studio: {
              name: studio.name || `Studio ${showtime.studio_id}`
            }
          };
          
          setBooking(enrichedBooking);
        } catch (enrichErr) {
          console.warn('Error enriching booking data:', enrichErr);
          setBooking({
            ...bookingData,
            movie: { title: 'Unknown Movie', duration: 'Unknown Duration' },
            showtime: { show_date: 'Unknown', show_time: 'Unknown' },
            studio: { name: 'Unknown Studio' }
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
  }, [id, user, navigate]);  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center" style={{ paddingTop: '80px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-gray-400 text-lg">Loading booking details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center" style={{ paddingTop: '80px' }}>
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">{error || 'Booking not found'}</div>
            <button
              onClick={() => navigate('/bookings')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Booking History
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-4 max-w-7xl" style={{ paddingTop: '80px' }}>        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Booking Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>        {/* Main Content Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[calc(100vh-140px)]">
            
            {/* Movie Poster Section */}
            <div className="lg:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col items-center justify-center">
              <div className="relative">
                <img
                  src={booking.movie?.poster_url || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={booking.movie?.title}
                  className="w-56 h-auto rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-lg">
                  <span className="text-xs font-semibold">Ticket</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white mb-2">{booking.movie?.title}</h2>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {booking.movie?.genre}
                  </span>
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {booking.movie?.duration}
                  </span>
                </div>
              </div>
            </div>            {/* Booking Information Section */}
            <div className="lg:col-span-2 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Booking Information</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === 'confirmed' ? 'bg-green-500 text-white' : 
                  booking.status === 'cancelled' ? 'bg-red-500 text-white' : 
                  'bg-yellow-500 text-black'
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-400 text-xs">Booking Code</span>
                    </div>
                    <span className="text-white font-mono text-sm">{booking.booking_code}</span>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400 text-xs">Show Date & Time</span>
                    </div>                    <span className="text-white font-semibold text-sm">
                      {new Date(booking.showtime?.show_date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {booking.showtime?.show_time}
                    </span>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-400 text-xs">Studio</span>
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {booking.studio?.name || `Studio ${booking.showtime?.studio_id}`}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5l-1.5 1.5 3.5 3.5-3.5 3.5L16 19l5-5-5-5zM8 19l1.5-1.5L6 14l3.5-3.5L8 5l-5 5 5 5z" />
                      </svg>
                      <span className="text-gray-400 text-xs">Total Seats</span>
                    </div>                    <span className="text-white font-semibold text-lg">{booking.total_seats}</span>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-gray-400 text-xs">Total Amount</span>
                    </div>
                    <span className="text-white font-bold text-lg">
                      Rp {booking.total_price?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-400 text-xs">Booking Date</span>
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {new Date(booking.booking_date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Action Buttons */}
          <div className="bg-gray-750 px-6 py-4 border-t border-gray-700">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Ticket
              </button>
              
              <button
                onClick={() => navigate('/bookings')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View All Bookings
              </button>
              
              <button
                onClick={() => navigate('/movies')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h3z" />
                </svg>
                Browse Movies
              </button>
            </div>
          </div>        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetail;
