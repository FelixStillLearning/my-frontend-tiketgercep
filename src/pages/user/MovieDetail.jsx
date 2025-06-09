// src/pages/user/MovieDetail.jsx
// TODO: Implement movie details & showtimes page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState(null);

    // Mock data for demonstration
    useEffect(() => {
        // In a real app, this would be an API call
        const mockMovie = {
            id: 1,
            title: 'Spider-Man: Across the Spider-Verse',
            posterUrl: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
            rating: 4.8,
            genre: 'Animation, Action',
            duration: '2h 20m',
            releaseDate: '2023-06-02',
            description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
            director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
            cast: 'Shameik Moore, Hailee Steinfeld, Oscar Isaac',
            language: 'English',
            ageRating: 'PG-13'
        };

        const mockShowtimes = [
            {
                id: 1,
                date: '2024-03-15',
                times: [
                    { id: 1, time: '10:00', studio: 'Studio 1', price: 50000 },
                    { id: 2, time: '13:00', studio: 'Studio 2', price: 55000 },
                    { id: 3, time: '16:00', studio: 'Studio 1', price: 50000 },
                    { id: 4, time: '19:00', studio: 'Studio 2', price: 55000 }
                ]
            },
            {
                id: 2,
                date: '2024-03-16',
                times: [
                    { id: 5, time: '10:00', studio: 'Studio 1', price: 50000 },
                    { id: 6, time: '13:00', studio: 'Studio 2', price: 55000 },
                    { id: 7, time: '16:00', studio: 'Studio 1', price: 50000 },
                    { id: 8, time: '19:00', studio: 'Studio 2', price: 55000 }
                ]
            }
        ];

        setMovie(mockMovie);
        setShowtimes(mockShowtimes);
        setSelectedDate(mockShowtimes[0].date);
    }, [id]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedShowtime(null);
    };

    const handleShowtimeSelect = (showtime) => {
        setSelectedShowtime(showtime);
    };

    const handleBooking = () => {
        if (selectedShowtime) {
            navigate(`/booking/${id}/${selectedShowtime.id}`);
        }
    };

    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <p className="text-gray-400">Loading...</p>
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
                                src={movie.posterUrl}
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
                                <span className="text-gray-300">{movie.ageRating}</span>
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
