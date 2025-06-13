// src/pages/user/MovieDetail.jsx
// Implementation of movie details & showtimes page using real API data

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import { movieService } from '../../services/MovieService';
import showtimeService from '../../services/showtimeService';
import { useAuth } from '../../contexts/AuthContext';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
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
                
                // Fetch movie details - handle apiCall wrapper response
                const movieResponse = await movieService.getById(id);
                console.log('MovieService response:', movieResponse);
                
                // Check if API call was successful
                if (!movieResponse.success) {
                    throw new Error(movieResponse.error || 'Failed to fetch movie data');
                }
                
                const movieData = movieResponse.data;
                console.log('Extracted movie data:', movieData);
                
                // Format movie data sesuai dengan response database
                const formattedMovie = {
                    id: movieData.movie_id,
                    title: movieData.title || 'Unknown Title',
                    poster_path: movieData.poster_url || 'https://via.placeholder.com/300x450/444444/ffffff?text=No+Image+Available',
                    poster_url_original: movieData.poster_url, // Keep original URL for debugging
                    rating: movieData.rating || 'Not Rated',
                    genre: movieData.genre || 'Unknown Genre',
                    duration: movieData.duration ? `${movieData.duration} minutes` : 'Unknown Duration',
                    release_date: movieData.release_date || 'Unknown Release Date',
                    synopsis: movieData.synopsis || 'No synopsis available',
                    // Fields yang tidak ada di database, bisa ditambahkan nanti
                    director: 'To be updated',
                    cast: 'To be updated', 
                    language: 'English'
                };
                
                console.log('Formatted movie data:', formattedMovie);
                setMovie(formattedMovie);
                
                // Fetch showtimes for this movie
                const showtimesData = await showtimeService.getByMovieId(id);
                console.log('Fetched showtimes data:', showtimesData);
                
                // Group showtimes by date
                const groupedShowtimes = groupShowtimesByDate(showtimesData);
                console.log('Grouped showtimes:', groupedShowtimes);
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
            if (!showtimesData || !Array.isArray(showtimesData)) {
                console.log('Invalid showtimes data:', showtimesData);
                return [];
            }
            
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
                    studio: showtime.Studio ? showtime.Studio.studio_name : `Studio ${showtime.studio_id}`,
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
        if (!isAuthenticated) {
            // Jika belum login, arahkan ke halaman login dengan redirect
            navigate('/login', { 
                state: { 
                    from: `/movies/${id}`,
                    message: 'Please login to select showtime and book tickets'
                } 
            });
            return;
        }
        setSelectedShowtime(showtime);
    };

    const handleBooking = () => {
        if (!isAuthenticated) {
            // Jika belum login, arahkan ke halaman login dengan redirect
            navigate('/login', { 
                state: { 
                    from: `/movies/${id}`,
                    message: 'Please login to book tickets'
                } 
            });
            return;
        }
        
        if (selectedShowtime) {
            navigate(`/booking/${selectedShowtime.id}`);
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
                                onError={(e) => {
                                    console.log('Poster failed to load:', movie.poster_path);
                                    console.log('Original URL:', movie.poster_url_original);
                                    
                                    // Try different fallback options
                                    if (e.target.src !== 'https://via.placeholder.com/300x450/444444/ffffff?text=No+Image+Available') {
                                        // First fallback: generic placeholder
                                        e.target.src = 'https://via.placeholder.com/300x450/444444/ffffff?text=No+Image+Available';
                                    } else if (e.target.src !== 'https://picsum.photos/300/450?grayscale') {
                                        // Second fallback: random image from Picsum
                                        e.target.src = 'https://picsum.photos/300/450?grayscale';
                                    } else {
                                        // Final fallback: base64 encoded minimal image
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjNDQ0NDQ0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                                    }
                                }}
                                onLoad={() => {
                                    console.log('Poster loaded successfully:', movie.poster_path);
                                }}
                            />
                        </div>
                        <div className="w-full md:w-2/3">
                            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center text-amber-400">
                                    <i className="fas fa-star mr-2"></i>
                                    <span className="text-lg font-semibold">{movie.rating}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <i className="fas fa-clock mr-2"></i>
                                    <span>{movie.duration}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <i className="fas fa-calendar mr-2"></i>
                                    <span>{new Date(movie.release_date).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long', 
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                                <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="text-gray-400 mb-1">Genre</p>
                                    <p className="text-white font-medium">{movie.genre}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Rating</p>
                                    <p className="text-white font-medium">{movie.rating}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Director</p>
                                    <p className="text-white font-medium">{movie.director}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Language</p>
                                    <p className="text-white font-medium">{movie.language}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Showtimes */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Select Showtime</h2>
                
                {/* Date Selection */}
                {showtimes.length > 0 ? (
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
                                {new Date(showtime.date).toLocaleDateString('id-ID', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-lg">No showtimes available for this movie</p>
                    </div>
                )}

                {/* Time Selection */}
                {selectedDate && showtimes.find(s => s.date === selectedDate)?.times.length > 0 && (
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
                                    <p className="text-lg font-medium">{time.time.substring(0, 5)}</p>
                                    <p className="text-sm">{time.studio}</p>
                                    <p className="text-sm mt-1">Rp {time.price.toLocaleString('id-ID')}</p>
                                </button>
                            ))}
                    </div>
                )}

                {/* Booking Button */}
                {showtimes.length > 0 && (
                    <div className="flex justify-center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleBooking}
                            disabled={!selectedShowtime && isAuthenticated}
                        >
                            {!isAuthenticated 
                                ? 'Login to Book Tickets' 
                                : selectedShowtime 
                                    ? 'Book Tickets' 
                                    : 'Select a Showtime'
                            }
                        </Button>
                        
                        {!isAuthenticated && (
                            <div className="ml-4 flex items-center">
                                <p className="text-sm text-gray-400">
                                    Please{' '}
                                    <button 
                                        onClick={() => navigate('/login', { 
                                            state: { 
                                                from: `/movies/${id}`,
                                                message: 'Please login to book tickets'
                                            } 
                                        })}
                                        className="text-indigo-400 hover:text-indigo-300 underline"
                                    >
                                        login
                                    </button>
                                    {' '}to select showtime and book tickets
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MovieDetail;
