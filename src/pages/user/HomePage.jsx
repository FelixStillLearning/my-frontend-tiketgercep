import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../../services/MovieService';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                setError('Failed to fetch movies. Please try again later.');
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

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
            <h1 className="title is-2 has-text-centered mb-6">Now Showing</h1>
            
            <div className="columns is-multiline">
                {movies.map((movie) => (
                    <div key={movie.id} className="column is-one-quarter">
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-4by3">
                                    <img 
                                        src={movie.poster_url || 'https://via.placeholder.com/300x450'} 
                                        alt={movie.title}
                                    />
                                </figure>
                            </div>
                            <div className="card-content" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <p className="title is-5" style={{ marginBottom: 6, marginTop: 0 }}>{movie.title}</p>
                                <p className="subtitle is-6" style={{ marginBottom: 8, marginTop: 0 }}>{movie.duration} minutes</p>
                                <div className="content" style={{ marginTop: 0 }}>
                                    <p>{movie.synopsis?.substring(0, 100)}...</p>
                                </div>
                            </div>
                            <footer className="card-footer">
                                <Link to={`/movie/${movie.id}`} className="card-footer-item">
                                    View Details
                                </Link>
                            </footer>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
