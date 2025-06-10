import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Tambahkan import Link
import { movieService } from '../../services/MovieService';

const AdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const result = await movieService.getAll();
            if (result.success) {
                setMovies(result.data);
            } else {
                setError(result.error);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch movies');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await movieService.delete(id);
            if (result.success) {
                fetchMovies();
            } else {
                setError(result.error);
            }
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
            <h1 className="title is-2">Manage Movies</h1>
            
            {/* TAMBAHKAN: Tombol Add New Movie */}
            <Link to="/admin/movies/create" className="button is-success mb-4">
                Add New Movie
            </Link>
            
            <div className="table-container">
                <table className="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.duration} minutes</td>
                                <td>{movie.status}</td>
                                <td>
                                    <div className="buttons">
                                        {/* UBAH: Edit button jadi Link ke MovieForm */}
                                        <Link 
                                            to={`/admin/movies/edit/${movie.movie_id}`}
                                            className="button is-small is-info"
                                        >
                                            Edit
                                        </Link>
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

export default AdminMovies;