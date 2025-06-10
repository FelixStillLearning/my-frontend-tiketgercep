import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`);
      fetchMovies(); // Refresh list setelah delete
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  if (loading) {
    return (
      <div className="container mt-6">
        <div className="has-text-centered">
          <p className="is-size-4">Loading movies...</p>
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
      <h1 className="title is-2">Movie Management</h1>
      
      {/* Tombol Add New Movie - Link ke MovieForm (create mode) */}
      <Link to="/admin/movies/create" className="button is-success mb-4">
        Add New Movie
      </Link>
      
      {/* Tabel Movies - dari AdminMovies tapi dengan link ke MovieForm */}
      <div className="table-container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={movie.movie_id}>
                <td>{index + 1}</td>
                <td>{movie.title}</td>
                <td>{movie.genre}</td>
                <td>{movie.duration} min</td>
                <td>{movie.rating}</td>
                <td>
                  <span className={`tag ${
                    movie.status === 'now_playing' ? 'is-success' : 
                    movie.status === 'coming_soon' ? 'is-warning' : 'is-danger'
                  }`}>
                    {movie.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="buttons">
                    {/* Edit Button - Link ke MovieForm (edit mode) */}
                    <Link 
                      to={`/admin/movies/edit/${movie.movie_id}`} 
                      className="button is-small is-info"
                    >
                      Edit
                    </Link>
                    {/* Delete Button - langsung delete tanpa pindah halaman */}
                    <button 
                      className="button is-small is-danger"
                      onClick={() => handleDelete(movie.movie_id)}
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
    </div>
  );
};

export default MovieManager;