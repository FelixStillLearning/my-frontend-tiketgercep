// src/pages/user/MovieList.jsx
// TODO: Implement browse movies page

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import MovieCard from '../../components/user/MovieCard';
import Footer from '../../components/common/Footer';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');

    // Mock data for demonstration
    useEffect(() => {
        // In a real app, this would be an API call
        const mockMovies = [
            {
                id: 1,
                title: 'Spider-Man: Across the Spider-Verse',
                posterUrl: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
                rating: 4.8,
                genre: 'Animation, Action',
                duration: '2h 20m',
                releaseDate: '2023-06-02',
                description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.'
            },
            {
                id: 2,
                title: 'The Flash',
                posterUrl: 'https://image.tmdb.org/t/p/original/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
                rating: 4.5,
                genre: 'Action, Adventure',
                duration: '2h 24m',
                releaseDate: '2023-06-16',
                description: 'When his attempt to save his family inadvertently alters the future, Barry Allen becomes trapped in a reality in which General Zod has returned.'
            },
            {
                id: 3,
                title: 'Transformers: Rise of the Beasts',
                posterUrl: 'https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
                rating: 4.6,
                genre: 'Action, Adventure',
                duration: '2h 7m',
                releaseDate: '2023-06-09',
                description: 'When a new threat capable of destroying the entire planet emerges, Optimus Prime and the Autobots must team up with a powerful faction known as the Maximals.'
            },
            {
                id: 4,
                title: 'Oppenheimer',
                posterUrl: 'https://image.tmdb.org/t/p/original/5mzr6JZbrqnqD8rCEvPhuCE5Fw2.jpg',
                rating: 4.7,
                genre: 'Drama, History',
                duration: '3h 0m',
                releaseDate: '2023-07-21',
                description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
            },
            {
                id: 5,
                title: 'Barbie',
                posterUrl: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
                rating: 4.9,
                genre: 'Comedy, Adventure',
                duration: '1h 54m',
                releaseDate: '2023-07-21',
                description: 'Barbie suffers a crisis that leads her to question her world and her existence.'
            }
        ];

        setMovies(mockMovies);
        setFilteredMovies(mockMovies);
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

    const genres = ['all', 'action', 'adventure', 'animation', 'comedy', 'drama', 'history'];

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            {/* Header */}
            <div className="pt-16 pb-8 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white text-center">
                        Browse <span className="text-indigo-400">Movies</span>
                    </h1>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredMovies.map(movie => (
                        <MovieCard key={movie.id} {...movie} />
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default MovieList;
