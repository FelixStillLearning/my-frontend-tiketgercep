import React from 'react';
import { Link } from 'react-router-dom';

const CinemaCard = ({
    id,
    name,
    location,
    image,
    rating,
    totalStudios,
    className = '',
}) => {
    return (
        <div className={`cinema-card ${className}`}>
            <div className="cinema-image">
                <img src={image} alt={name} />
                {rating && (
                    <div className="cinema-rating">
                        <i className="fas fa-star"></i>
                        <span>{rating}/5</span>
                    </div>
                )}
            </div>
            <div className="cinema-content">
                <h3 className="cinema-name">{name}</h3>
                <p className="cinema-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {location}
                </p>
                <p className="cinema-studios">
                    <i className="fas fa-film"></i>
                    {totalStudios} Studios
                </p>
                <Link to={`/cinemas/${id}`} className="btn btn-primary cinema-link">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CinemaCard; 