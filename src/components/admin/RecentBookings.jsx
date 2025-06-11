import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentBookings();
    }, []);

    const fetchRecentBookings = async () => {
        try {
            setLoading(true);
            // Ambil data bookings, lalu sortir berdasarkan tanggal terbaru dan ambil 5 teratas
            const response = await axios.get('http://localhost:5000/api/bookings'); 
            const sortedBookings = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(sortedBookings.slice(0, 5)); // Ambil 5 pesanan terbaru
        } catch (error) {
            console.error("Error fetching recent bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="box has-background-dark">
            <h3 className="title is-5 has-text-white">Recent Bookings</h3>
            {loading ? (
                <p className="has-text-centered has-text-grey-light">Loading...</p>
            ) : (
                <table className="table is-fullwidth is-dark is-hoverable">
                    <thead>
                        <tr>
                            <th className='has-text-grey'>User</th>
                            <th className='has-text-grey'>Movie</th>
                            <th className='has-text-grey has-text-right'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="is-vcentered">{booking.user?.name || 'Guest'}</td>
                                    <td className="is-vcentered">{booking.showtime?.movie?.title || 'N/A'}</td>
                                    <td className="has-text-right is-vcentered">
                                        <span className={`tag ${
                                            booking.status === 'confirmed' ? 'is-success' :
                                            booking.status === 'pending' ? 'is-warning' : 'is-danger'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="has-text-centered has-text-grey">No recent bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RecentBookings;