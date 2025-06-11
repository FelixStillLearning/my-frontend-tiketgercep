import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
  // ✅ STATE SESUAI DATABASE
  const [userId, setUserId] = useState("");
  const [showtimeId, setShowtimeId] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [status, setStatus] = useState("pending");
  const [bookingDate, setBookingDate] = useState("");
  
  // ✅ DATA UNTUK DROPDOWN DAN AUTO-CALCULATE
  const [users, setUsers] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const darkInputStyle = {
    backgroundColor: '#3a3a3a',
    borderColor: '#4a4a4a',
    color: '#dbdbdb'
  };

  useEffect(() => {
    fetchUsers();
    fetchShowtimes();
    generateBookingCode();
    setBookingDate(new Date().toISOString().slice(0, 16));
    
    if (isEditMode) {
      fetchBookingData();
    }
  }, [id, isEditMode]);

  // ✅ AUTO-CALCULATE TOTAL PRICE
  useEffect(() => {
    if (totalSeats && pricePerSeat) {
      const calculatedPrice = parseInt(totalSeats) * parseFloat(pricePerSeat);
      setTotalPrice(calculatedPrice.toString());
    }
  }, [totalSeats, pricePerSeat]);

  // ✅ UPDATE PRICE KETIKA SHOWTIME BERUBAH
  useEffect(() => {
    if (showtimeId) {
      const showtime = showtimes.find(s => s.showtime_id === parseInt(showtimeId));
      if (showtime) {
        setSelectedShowtime(showtime);
        // ✅ SET HARGA PER SEAT (BISA AMBIL DARI SHOWTIME ATAU SET DEFAULT)
        const defaultPrice = 50000; // Default Rp 50,000 per seat
        setPricePerSeat(showtime.price || defaultPrice);
      }
    } else {
      setSelectedShowtime(null);
      setPricePerSeat(0);
      setTotalPrice("");
    }
  }, [showtimeId, showtimes]);

  const generateBookingCode = () => {
    const code = 'BK' + Date.now().toString().slice(-6);
    setBookingCode(code);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/showtimes');
      setShowtimes(response.data);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${id}`);
      const booking = response.data;
      setUserId(booking.user_id || "");
      setShowtimeId(booking.showtime_id || "");
      setBookingCode(booking.booking_code || "");
      setTotalSeats(booking.total_seats || "");
      setTotalPrice(booking.total_price || "");
      setStatus(booking.status || "pending");
      setBookingDate(booking.booking_date ? new Date(booking.booking_date).toISOString().slice(0, 16) : "");
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Failed to load booking data');
    }
  };

  // ✅ HANDLE TOTAL SEATS CHANGE
  const handleSeatsChange = (e) => {
    setTotalSeats(e.target.value);
  };

  // ✅ HANDLE PRICE PER SEAT CHANGE (MANUAL OVERRIDE)
  const handlePricePerSeatChange = (e) => {
    setPricePerSeat(e.target.value);
  };

  const saveBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        user_id: parseInt(userId),
        showtime_id: parseInt(showtimeId),
        booking_code: bookingCode,
        total_seats: parseInt(totalSeats),
        total_price: parseFloat(totalPrice),
        status: status,
        booking_date: new Date(bookingDate).toISOString()
      };

      console.log('Sending booking data:', bookingData);

      if (isEditMode) {
        await axios.patch(`http://localhost:5000/api/bookings/${id}`, bookingData);
      } else {
        await axios.post('http://localhost:5000/api/bookings', bookingData);
      }
      
      navigate('/admin/bookings');
    } catch (error) {
      console.error('Error saving booking:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} booking: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <div className="box has-background-dark">
              <h2 className="title is-4 has-text-white mb-5">
                {isEditMode ? "Edit Booking" : "Add New Booking"}
              </h2>
              
              <form onSubmit={saveBooking}>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Customer</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select 
                            style={darkInputStyle}
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)}
                            required
                          >
                            <option value="">Select a customer</option>
                            {users.map((user) => (
                              <option key={user.user_id} value={user.user_id}>
                                {user.full_name} ({user.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Booking Code</label>
                      <div className="control">
                        <input 
                          type="text" 
                          className="input" 
                          style={darkInputStyle}
                          value={bookingCode}
                          onChange={(e) => setBookingCode(e.target.value)}
                          placeholder="BK123456"
                          required 
                        />
                      </div>
                      <p className="help has-text-grey">
                        <button 
                          type="button" 
                          className="button is-small is-info is-outlined"
                          onClick={generateBookingCode}
                        >
                          Generate New Code
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Showtime</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select 
                            style={darkInputStyle}
                            value={showtimeId} 
                            onChange={(e) => setShowtimeId(e.target.value)}
                            required
                          >
                            <option value="">Select a showtime</option>
                            {showtimes.map((showtime) => (
                              <option key={showtime.showtime_id} value={showtime.showtime_id}>
                                {showtime.movie_title} - {showtime.studio_name} - {showtime.show_date} {showtime.show_time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* ✅ SHOWTIME INFO */}
                      {selectedShowtime && (
                        <p className="help has-text-info">
                          📽️ {selectedShowtime.movie_title} | 🏢 {selectedShowtime.studio_name} | 📅 {selectedShowtime.show_date} ⏰ {selectedShowtime.show_time}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Status</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select 
                            style={darkInputStyle}
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            required
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Total Seats</label>
                      <div className="control">
                        <input 
                          type="number" 
                          className="input" 
                          style={darkInputStyle}
                          value={totalSeats}
                          onChange={handleSeatsChange}
                          placeholder="2"
                          min="1"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    {/* ✅ PRICE PER SEAT (MANUAL OVERRIDE) */}
                    <div className="field">
                      <label className="label has-text-grey-light">Price per Seat (IDR)</label>
                      <div className="control">
                        <input 
                          type="number" 
                          className="input" 
                          style={darkInputStyle}
                          value={pricePerSeat}
                          onChange={handlePricePerSeatChange}
                          placeholder="50000"
                          min="0"
                          step="any"
                        />
                      </div>
                      <p className="help has-text-grey">
                        Set price per seat (auto-filled from showtime)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    {/* ✅ TOTAL PRICE (AUTO-CALCULATED) */}
                    <div className="field">
                      <label className="label has-text-grey-light">Total Price (IDR)</label>
                      <div className="control">
                        <input 
                          type="number" 
                          className="input" 
                          style={{
                            ...darkInputStyle,
                            backgroundColor: '#2a2a2a', // Darker to show it's calculated
                            fontWeight: 'bold'
                          }}
                          value={totalPrice}
                          onChange={(e) => setTotalPrice(e.target.value)}
                          placeholder="Auto-calculated"
                          min="0"
                          step="any"
                          required 
                        />
                      </div>
                      <p className="help has-text-success">
                        💰 Auto-calculated: {totalSeats} seats × Rp {Number(pricePerSeat).toLocaleString('id-ID')} = Rp {Number(totalPrice).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Booking Date</label>
                      <div className="control">
                        <input 
                          type="datetime-local" 
                          className="input" 
                          style={darkInputStyle}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field is-grouped is-grouped-right mt-5">
                  <div className="control">
                    <button 
                      type="button" 
                      className="button is-light is-outlined"
                      onClick={() => navigate("/admin/bookings")}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="control">
                    <button 
                      type="submit" 
                      className={`button is-danger ${loading ? 'is-loading' : ''}`}
                      disabled={loading}
                    >
                      {isEditMode ? "Update Booking" : "Save Booking"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;