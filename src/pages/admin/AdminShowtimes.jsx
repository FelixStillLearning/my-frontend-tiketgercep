import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchShowtimes();
    }, []);

    const fetchShowtimes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/showtimes');
            console.log('Showtimes data:', response.data); // Debug
            setShowtimes(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch showtimes');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this showtime?')) {
            try {
                await axios.delete(`http://localhost:5000/api/showtimes/${id}`);
                fetchShowtimes(); // Refresh list
            } catch (err) {
                setError('Failed to delete showtime');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mt-6">
                <div className="has-text-centered">
                    <p className="is-size-4">Loading showtimes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-6">
                <div className="notification is-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-6">
            <h1 className="title is-2">Manage Showtimes</h1>
            
            <Link to="/admin/showtimes/create" className="button is-success mb-4">
                Add New Showtime
            </Link>
            
            <div className="table-container">
                <table className="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Studio</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Price</th>
                            <th>Available Seats</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showtimes.map((showtime) => (
                            <tr key={showtime.showtime_id}>
                                <td>
                                    <strong>{showtime.movie_title || showtime.title || 'N/A'}</strong>
                                </td>
                                <td>
                                    <span className="tag is-info">
                                        {showtime.studio_name || 'N/A'}
                                    </span>
                                    {showtime.total_seats && (
                                        <>
                                            <br />
                                            <small className="has-text-grey">
                                                Capacity: {showtime.total_seats} seats
                                            </small>
                                        </>
                                    )}
                                </td>
                                <td>
                                    {showtime.show_date ? formatDate(showtime.show_date) : 'N/A'}
                                </td>
                                <td>
                                    <span className="tag is-light">
                                        {showtime.show_time || 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    {showtime.price ? formatPrice(showtime.price) : 'N/A'}
                                </td>
                                <td>
                                    <span className="tag is-success">
                                        {showtime.total_seats || 0} seats
                                    </span>
                                </td>
                                <td>
                                    <div className="buttons">
                                        <Link 
                                            to={`/admin/showtimes/edit/${showtime.showtime_id}`}
                                            className="button is-small is-info"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            className="button is-small is-danger"
                                            onClick={() => handleDelete(showtime.showtime_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showtimes.length === 0 && (
                <div className="notification is-info">
                    No showtimes found. <Link to="/admin/showtimes/create">Create your first showtime</Link>
                </div>
            )}
        </div>
    );
};

export default AdminShowtimes;