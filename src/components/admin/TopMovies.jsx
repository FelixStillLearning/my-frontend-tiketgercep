import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

const TopMovies = () => {
    const [topMovies, setTopMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopMoviesByBooking = async () => {
            try {
                setLoading(true);
                // 1. Ambil data movies dan bookings secara paralel
                const [moviesResponse, bookingsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/movies'),
                    axios.get('http://localhost:5000/api/bookings')
                ]);

                const movies = moviesResponse.data;
                const bookings = bookingsResponse.data;

                // 2. Hitung jumlah booking untuk setiap film
                const bookingCounts = bookings.reduce((acc, booking) => {
                    const movieId = booking.showtime?.movieId;
                    if (movieId) {
                        acc[movieId] = (acc[movieId] || 0) + 1;
                    }
                    return acc;
                }, {});

                // 3. Tambahkan properti 'bookingCount' ke setiap objek film
                const moviesWithBookingCounts = movies.map(movie => ({
                    ...movie,
                    bookingCount: bookingCounts[movie.id] || 0
                }));

                // 4. Urutkan film berdasarkan jumlah booking terbanyak
                const sortedMovies = moviesWithBookingCounts.sort((a, b) => b.bookingCount - a.bookingCount);

                // 5. Ambil 3 film teratas
                setTopMovies(sortedMovies.slice(0, 3));

            } catch (error) {
                console.error("Error fetching top movies by booking:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopMoviesByBooking();
    }, []);

    if (loading) {
        return (
            <div className="box has-background-dark" style={{ minHeight: '320px'}}>
                <h4 className="title is-5 has-text-white mb-4">
                    <FontAwesomeIcon icon={faCrown} className="has-text-warning mr-2" />
                    Top Movies
                </h4>
                <p className="has-text-centered has-text-grey-light">Loading...</p>
            </div>
        );
    }

    return (
        <div className="box has-background-dark">
            <h4 className="title is-5 has-text-white mb-4">
                <span className="icon-text">
                    <span className="icon has-text-warning">
                        <FontAwesomeIcon icon={faCrown} />
                    </span>
                    <span>Top Movies by Bookings</span>
                </span>
            </h4>

            {/* Div ini TIDAK lagi menggunakan kelas .content */}
            <div>
                {topMovies.length > 0 ? (
                    topMovies.map((movie, index) => {
                        const rankColor = index === 0 ? 'is-warning' : index === 1 ? 'is-light' : 'is-success';
                        return (
                            <div
                                key={movie.id}
                                className="box has-background-grey-darker mb-3 p-3"
                                style={{ border: '1px solid #4a4a4a' }}
                            >
                                <div className="columns is-mobile is-vcentered">
                                    {/* Ranking Number */}
                                    <div className="column is-narrow">
                                        <span className={`tag ${rankColor}`}>
                                            #{index + 1}
                                        </span>
                                    </div>

                                    {/* Movie Poster */}
                                    <div className="column is-narrow">
                                        <figure className="image">
                                            <img
                                                src={movie.poster_url || 'https://via.placeholder.com/60x90?text=No+Image'}
                                                alt={movie.title}
                                                style={{
                                                    width: '60px',
                                                    height: '90px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </figure>
                                    </div>

                                    {/* Movie Info dengan margin yang diperbaiki */}
                                    <div className="column">
                                        <div>
                                            <p className="has-text-white" style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.2', marginBottom: '0.25rem' }}>
                                                {movie.title}
                                            </p>
                                            <p className="has-text-grey-light" style={{ fontSize: '0.8rem', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                                                {movie.genre}
                                            </p>
                                            <p className="has-text-success" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                                <strong>{movie.bookingCount}</strong> bookings
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="has-text-centered has-text-grey-light py-4">
                        <p>No booking data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopMovies;