// src/pages/user/BookingPage.jsx
// TODO: Implement booking process page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SeatMap from '../../components/user/SeatMap';
import BookingSummary from '../../components/user/BookingSummary';
import showtimeService from '../../services/showtimeService';
import bookingService from '../../services/bookingService';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        setLoading(true);
        const data = await showtimeService.getShowtimeById(showtimeId);
        setShowtime(data);
        setBookedSeats(data.bookedSeats || []);
      } catch (err) {
        setError('Failed to load showtime data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeData();
  }, [showtimeId]);

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      return [...prev, seatId];
    });
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
      const bookingData = {
        showtimeId,
        userId: user.id,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * showtime.pricePerSeat
      };

      const booking = await bookingService.createBooking(bookingData);
      navigate(`/bookings/${booking.id}`);
    } catch (err) {
      setError('Failed to create booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !showtime) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error || 'Showtime not found'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Seat Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Select Seats</h2>
            <SeatMap
              rows={showtime.studio.rows}
              seatsPerRow={showtime.studio.seatsPerRow}
              bookedSeats={bookedSeats}
              onSeatSelect={handleSeatSelect}
              selectedSeats={selectedSeats}
            />
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <BookingSummary
              movie={showtime.movie}
              showtime={showtime}
              selectedSeats={selectedSeats}
              pricePerSeat={showtime.pricePerSeat}
              onConfirm={handleBooking}
              onCancel={() => navigate(`/movies/${showtime.movie.id}`)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
