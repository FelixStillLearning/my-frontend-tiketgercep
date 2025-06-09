import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const {
        id,
        title,
        poster_path,
        release_date,
        rating,
        duration,
        isComingSoon = false
    } = movie;

    return (
        <div className="movie-card">
            <div className="movie-card-image-container">
                <img 
                    src={poster_path} 
                    alt={title} 
                    className="movie-card-image"
                />
                <div className="movie-card-overlay">
                    {isComingSoon ? (
                        <button className="btn btn-primary btn-sm">
                            Get Notified
                        </button>
                    ) : (
                        <Link 
                            to={`/movies/${id}`}
                            className="btn btn-primary btn-sm"
                        >
                            Book Tickets
                        </Link>
                    )}
                </div>
            </div>
            <div className="movie-card-content">
                <h3 className="movie-card-title">{title}</h3>
                <div className="movie-card-info">
                    {rating && (
                        <div className="movie-card-rating">
                            <i className="fas fa-star"></i>
                            <span>{rating}/5</span>
                        </div>
                    )}
                    {duration && (
                        <span className="movie-card-duration">{duration} minutes</span>
                    )}
                    <span className="movie-card-date">{release_date}</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard; 