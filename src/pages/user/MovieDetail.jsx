// src/pages/user/MovieDetail.jsx
// Implementation of movie details & showtimes page using real API data

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import { movieService } from '../../services/MovieService';
import showtimeService from '../../services/showtimeService';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real data from API
    useEffect(() => {
        const fetchMovieAndShowtimes = async () => {
            try {
                setLoading(true);
                
                // Fetch movie details
                const movieData = await movieService.getById(id);
                
                // Format movie data
                const formattedMovie = {
                    id: movieData.movie_id,
                    title: movieData.title,
                    poster_path: movieData.poster_url || 'https://via.placeholder.com/300x450?text=No+Image',
                    rating: movieData.rating,
                    genre: movieData.genre,
                    duration: `${movieData.duration}m`,
                    release_date: movieData.release_date,
                    description: movieData.synopsis,
                    director: 'Not available', // This may need to be added to the API
                    cast: 'Not available',     // This may need to be added to the API
                    language: 'English',       // This may need to be added to the API
                    ageRating: movieData.rating
                };
                setMovie(formattedMovie);
                
                // Fetch showtimes for this movie
                const showtimesData = await showtimeService.getByMovieId(id);
                
                // Group showtimes by date
                const groupedShowtimes = groupShowtimesByDate(showtimesData);
                setShowtimes(groupedShowtimes);
                
                // Set default selected date to the first available date
                if (groupedShowtimes.length > 0) {
                    setSelectedDate(groupedShowtimes[0].date);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError('Failed to load movie details. Please try again later.');
                setLoading(false);
            }
        };

        // Group showtimes by date
        const groupShowtimesByDate = (showtimesData) => {
            const groupedByDate = {};
            
            showtimesData.forEach(showtime => {
                const date = showtime.show_date;
                
                if (!groupedByDate[date]) {
                    groupedByDate[date] = {
                        id: date,
                        date: date,
                        times: []
                    };
                }
                
                groupedByDate[date].times.push({
                    id: showtime.showtime_id,
                    time: showtime.show_time,
                    studio: `Studio ${showtime.studio_id}`, // This might need to be changed based on actual studio data
                    price: parseFloat(showtime.ticket_price)
                });
            });
              return Object.values(groupedByDate);
        };

        if (id) {
            fetchMovieAndShowtimes();
        }
    }, [id]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedShowtime(null);
    };    const handleShowtimeSelect = (showtime) => {
        setSelectedShowtime(showtime);
    };

    const handleBooking = () => {
        if (selectedShowtime) {
            navigate(`/booking/${id}/${selectedShowtime.id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            variant="primary"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <p className="text-gray-400">Movie not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            {/* Movie Header */}
            <div className="pt-16 pb-8 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3">
                            <img
                                src={movie.poster_path}
                                alt={movie.title}
                                className="w-full rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="w-full md:w-2/3">
                            <h1 className="text-3xl font-bold text-white mb-4">{movie.title}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center text-amber-400">
                                    <i className="fas fa-star mr-1"></i>
                                    <span>{movie.rating}/5</span>
                                </div>
                                <span className="text-gray-300">{movie.duration}</span>
                                <span className="text-gray-300">{new Date(movie.release_date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 mb-6">{movie.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Director</p>
                                    <p className="text-white">{movie.director}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Cast</p>
                                    <p className="text-white">{movie.cast}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Genre</p>
                                    <p className="text-white">{movie.genre}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Language</p>
                                    <p className="text-white">{movie.language}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Showtimes */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-white mb-6">Select Showtime</h2>
                
                {/* Date Selection */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {showtimes.map(showtime => (
                        <button
                            key={showtime.id}
                            className={`px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap ${
                                selectedDate === showtime.date
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                            onClick={() => handleDateSelect(showtime.date)}
                        >
                            {new Date(showtime.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </button>
                    ))}
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {showtimes
                        .find(s => s.date === selectedDate)
                        ?.times.map(time => (
                            <button
                                key={time.id}
                                className={`p-4 rounded-lg text-center ${
                                    selectedShowtime?.id === time.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => handleShowtimeSelect(time)}
                            >
                                <p className="text-lg font-medium">{time.time}</p>
                                <p className="text-sm">{time.studio}</p>
                                <p className="text-sm mt-1">Rp {time.price.toLocaleString()}</p>
                            </button>
                        ))}
                </div>

                {/* Booking Button */}
                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleBooking}
                        disabled={!selectedShowtime}
                    >
                        {selectedShowtime ? 'Book Tickets' : 'Select a Showtime'}
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MovieDetail;
