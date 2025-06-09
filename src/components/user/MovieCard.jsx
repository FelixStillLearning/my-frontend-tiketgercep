// src/components/user/MovieCard.jsx
// TODO: Implement movie display card component

import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({
    id,
    title,
    posterUrl,
    rating,
    genre,
    duration,
    releaseDate,
    isComingSoon = false,
    className = '',
}) => {
    return (
        <div className={`movie-card ${className}`}>
            <div className="movie-card-image">
                <img src={posterUrl} alt={title} />
                <div className="movie-card-overlay">
                    {isComingSoon ? (
                        <button className="btn btn-primary" style={{ marginBottom: '0.5rem' }}>
                            Get Notified
                        </button>
                    ) : (
                        <Link to={`/movies/${id}`} className="btn btn-primary" style={{ marginBottom: '0.5rem' }}>
                            Book Tickets
                        </Link>
                    )}
                </div>
            </div>
            <div className="movie-card-content">
                <h3 className="movie-card-title">{title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', gap: '1rem' }}>
                    {rating && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
                            <i className="fas fa-star" style={{ marginRight: '0.25rem' }}></i>
                            <span>{rating}/5</span>
                        </div>
                    )}
                    {duration && <span style={{ color: '#9ca3af' }}>{duration}</span>}
                    {releaseDate && <span style={{ color: '#9ca3af' }}>{new Date(releaseDate).toLocaleDateString()}</span>}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
