import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShowtimeManager = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShowtimes();
  }, []);

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/showtimes');
      setShowtimes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch showtimes');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/showtimes/${id}`);
      fetchShowtimes(); // Refresh list setelah delete
    } catch (err) {
      setError('Failed to delete showtime');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
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
      <h1 className="title is-2">Showtime Management</h1>
      
      {/* Tombol Add New Showtime */}
      <Link to="/admin/showtimes/create" className="button is-success mb-4">
        Add New Showtime
      </Link>
      
      {/* Tabel Showtimes */}
      <div className="table-container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>No</th>
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
            {showtimes.map((showtime, index) => (
              <tr key={showtime.showtime_id}>
                <td>{index + 1}</td>
                <td>{showtime.movie_title || showtime.movie?.title || 'N/A'}</td>
                <td>{showtime.studio_name || showtime.studio?.name || 'N/A'}</td>
                <td>{formatDate(showtime.show_date)}</td>
                <td>{showtime.show_time}</td>
                <td>{formatPrice(showtime.price)}</td>
                <td>
                  <span className={`tag ${
                    showtime.available_seats > 10 ? 'is-success' : 
                    showtime.available_seats > 5 ? 'is-warning' : 'is-danger'
                  }`}>
                    {showtime.available_seats || 0} seats
                  </span>
                </td>
                <td>
                  <div className="buttons">
                    <Link 
                      to={`/admin/showtimes/edit/${showtime.showtime_id}`} 
                      className="button is-small is-info mr-2"
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

export default ShowtimeManager;