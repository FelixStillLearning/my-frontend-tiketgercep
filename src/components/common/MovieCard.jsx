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
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={poster_path} 
                    alt={title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {isComingSoon ? (
                        <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Get Notified
                        </button>
                    ) : (
                        <Link 
                            to={`/movies/${id}`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
                        >
                            Book Tickets
                        </Link>
                    )}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h3>
                <div className="flex flex-col gap-2 text-sm text-gray-400">
                    {rating && (
                        <div className="flex items-center gap-1">
                            <i className="fas fa-star text-amber-400"></i>
                            <span className="text-white">{rating}/5</span>
                        </div>
                    )}
                    {duration && (
                        <div className="flex items-center gap-1">
                            <i className="fas fa-clock text-gray-400"></i>
                            <span>{duration}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <i className="fas fa-calendar text-gray-400"></i>
                        <span>{release_date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard; 