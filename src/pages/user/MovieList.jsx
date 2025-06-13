// src/pages/user/MovieList.jsx
// TODO: Implement browse movies page

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import MovieCard from '../../components/common/MovieCard';
import Footer from '../../components/common/Footer';
import { movieService } from '../../services/MovieService';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real data from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await movieService.getAll();
                
                // Check if API response is successful
                if (!response.success) {
                    throw new Error(response.error || 'Failed to fetch movies');
                }
                
                // Map API response to the format our components expect
                const moviesData = response.data.map(movie => ({
                    id: movie.movie_id,
                    title: movie.title,
                    poster_path: movie.poster_url ? movie.poster_url : 'https://via.placeholder.com/300x450?text=No+Image',
                    rating: 4.5, // Default rating if not available from API
                    genre: movie.genre,
                    duration: `${movie.duration}m`,
                    release_date: movie.release_date,
                    description: movie.synopsis
                }));
                
                setMovies(moviesData);
                setFilteredMovies(moviesData);
                setError(null);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
                setMovies([]);
                setFilteredMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Filter movies based on search term and genre
    useEffect(() => {
        let filtered = movies;

        if (searchTerm) {
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGenre !== 'all') {
            filtered = filtered.filter(movie =>
                movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
            );
        }

        setFilteredMovies(filtered);
    }, [searchTerm, selectedGenre, movies]);

    const genres = ['all', 'action', 'adventure', 'animation', 'comedy', 'drama', 'history'];    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-20 pb-8 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {error && (
                        <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-white text-center">
                        Browse <span className="text-indigo-400 glow-text">Movies</span>
                    </h1>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {genres.map(genre => (
                            <button
                                key={genre}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                                    selectedGenre === genre
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>                {/* Movie Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}

                {!loading && filteredMovies.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <i className="fas fa-film text-6xl text-gray-600"></i>
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No movies found matching your criteria.</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filter settings.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MovieList;
