// src/pages/user/BookingPage.jsx
// Implementation of booking process page using real API data

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SeatMap from '../../components/user/SeatMap';
import BookingSummary from '../../components/user/BookingSummary';
import showtimeService from '../../services/showtimeService';
import { movieService } from '../../services/MovieService';
import studioService from '../../services/studioService';
import seatService from '../../services/seatService';
import bookingService from '../../services/bookingService';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [studio, setStudio] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [studioSeats, setStudioSeats] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        
        // Fetch showtime details
        const showtimeData = await showtimeService.getShowtimeById(showtimeId);
        setShowtime(showtimeData);
          // Fetch movie details
        const movieResponse = await movieService.getById(showtimeData.movie_id);
        console.log('MovieService response in BookingPage:', movieResponse);
        
        // Check if API call was successful
        if (!movieResponse.success) {
            throw new Error(movieResponse.error || 'Failed to fetch movie data');
        }
        
        const movieData = movieResponse.data;
        console.log('Extracted movie data in BookingPage:', movieData);
        
        // Format movie data sesuai dengan response database
        const formattedMovie = {
            movie_id: movieData.movie_id,
            title: movieData.title || 'Unknown Title',
            poster_url: movieData.poster_url || 'https://via.placeholder.com/300x450/444444/ffffff?text=No+Image+Available',
            rating: movieData.rating || 'Not Rated',
            genre: movieData.genre || 'Unknown Genre',
            duration: movieData.duration ? `${movieData.duration} minutes` : 'Unknown Duration',
            release_date: movieData.release_date || 'Unknown Release Date',
            overview: movieData.overview || 'No overview available'
        };
        
        setMovie(formattedMovie);
        
        // Fetch studio details
        const studioData = await studioService.getStudioById(showtimeData.studio_id);
        setStudio(studioData);
        
        // Fetch studio seats
        const seats = await seatService.getByStudioId(showtimeData.studio_id);
        setStudioSeats(seats);
        
        // Fetch booked seats for this showtime
        const bookedSeatsData = await seatService.getBookedSeatsByShowtimeId(showtimeId);
        const bookedSeatIds = bookedSeatsData.map(bs => `${bs.Seat.seat_row}-${bs.Seat.seat_number}`);
        setBookedSeats(bookedSeatIds);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking data. Please try again later.');
        setLoading(false);
      }
    };

    if (showtimeId) {
      fetchBookingData();
    }
  }, [showtimeId]);
  const handleSeatSelect = (selectedSeatIds) => {
    setSelectedSeats(selectedSeatIds);
  };
  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${showtimeId}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    try {
      setLoading(true);
        // Convert seat IDs to actual seat records for booking
      const selectedSeatRecords = selectedSeats.map(seatId => {
        const [row, seatNum] = seatId.split('-');
        return studioSeats.find(seat => 
          seat.seat_row === row && seat.seat_number === parseInt(seatNum)
        );
      }).filter(Boolean);

      const bookingData = {
        user_id: user.user_id,
        showtime_id: parseInt(showtimeId),
        booking_code: `BK${Date.now()}`,
        total_seats: selectedSeats.length,
        total_price: selectedSeats.length * parseFloat(showtime.ticket_price),
        status: 'confirmed',
        booking_date: new Date().toISOString().split('T')[0],
        seats: selectedSeatRecords.map(seat => seat.seat_id)
      };

      const booking = await bookingService.createBooking(bookingData);
      navigate(`/bookings/${booking.booking_id}`);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 pt-20 pb-4">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-gray-400">Loading booking data...</div>
          </div>
        </div>
        <Footer />
      </div>
    );  }

  if (error || !showtime || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 pt-20 pb-4">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-red-400">{error || 'Booking data not found'}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Seat Selection */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4 lg:p-6 flex flex-col">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Select Seats</h2>
              <div className="flex-1 flex items-center justify-center">
                <SeatMap
                  studioSeats={studioSeats}
                  bookedSeats={bookedSeats}
                  onSeatSelect={handleSeatSelect}
                  selectedSeats={selectedSeats}
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-800 rounded-lg shadow-md p-4 lg:p-6">
              <BookingSummary
                movie={{
                  title: movie.title,
                  genre: movie.genre,
                  duration: movie.duration,
                  posterUrl: movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image'
                }}
                showtime={{
                  date: showtime.show_date,
                  startTime: showtime.show_time,
                  studioName: studio ? studio.name : `Studio ${showtime.studio_id}`
                }}
                selectedSeats={selectedSeats}
                pricePerSeat={parseFloat(showtime.ticket_price)}
                onConfirm={handleBooking}
                onCancel={() => navigate(`/movies/${movie.movie_id}`)}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
