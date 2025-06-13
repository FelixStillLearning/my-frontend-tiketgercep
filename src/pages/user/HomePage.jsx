import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { movieService } from '../../services/MovieService';

const HomePage = () => {
    const { user, isAuthenticated } = useAuth();
    const [nowPlaying, setNowPlaying] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real data from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch both now playing and coming soon movies
                const [nowPlayingResponse, comingSoonResponse] = await Promise.all([
                    movieService.getByStatus('now_playing'),
                    movieService.getByStatus('coming_soon')
                ]);
                
                // Check if API calls were successful
                if (!nowPlayingResponse.success) {
                    throw new Error(nowPlayingResponse.error || 'Failed to fetch now playing movies');
                }
                
                if (!comingSoonResponse.success) {
                    console.warn('Failed to fetch coming soon movies:', comingSoonResponse.error);
                }
                
                // Map Now Playing movies
                const nowPlayingData = nowPlayingResponse.data.map(movie => ({
                    id: movie.movie_id,
                    title: movie.title,
                    poster_path: movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image',
                    backdrop_path: movie.poster_url || 'https://via.placeholder.com/1280x720?text=No+Image',
                    rating: 4.5, // Default rating if not available from API
                    genre: movie.genre,
                    duration: `${movie.duration}m`,
                    release_date: movie.release_date,
                    description: movie.synopsis
                }));
                
                // Map Coming Soon movies
                const comingSoonData = comingSoonResponse.success ? comingSoonResponse.data.map(movie => ({
                    id: movie.movie_id,
                    title: movie.title,
                    poster_path: movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image',
                    release_date: new Date(movie.release_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }),
                    genre: movie.genre,
                    description: movie.synopsis
                })) : [];
                
                setNowPlaying(nowPlayingData);
                setComingSoon(comingSoonData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % nowPlaying.length);
    }, [nowPlaying.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + nowPlaying.length) % nowPlaying.length);
    }, [nowPlaying.length]);

    useEffect(() => {
        if (nowPlaying.length > 0) {
            const interval = setInterval(nextSlide, 7000);
            return () => clearInterval(interval);
        }
    }, [nowPlaying.length, nextSlide]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Navigation */}
            <nav className="bg-gray-900/90 backdrop-blur-md fixed w-full z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link to="/" className="flex items-center">
                                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 glow-text">
                                        🎬 Ticket<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Gercep</span>
                                    </h1>
                                </Link>
                            </div>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    <Link 
                                        to="/" 
                                        className="text-indigo-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                                    >
                                        Home
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link 
                                        to="/movies" 
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                                    >
                                        Movies
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <a 
                                        href="#features" 
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                                    >
                                        Features
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                                    </a>
                                    <a 
                                        href="#promotions" 
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                                    >
                                        Promotions
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6 space-x-3">
                                <Link 
                                    to="/login" 
                                    className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                >
                                    Join Now
                                </Link>
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors duration-200">
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>            {/* Hero Section */}
            <div className="min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-amber-500/20 to-pink-500/20 rounded-full animate-pulse delay-1000"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center min-h-screen">
                    {error && (
                        <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    
                    {loading && (
                        <div className="flex justify-center items-center h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    )}
                    
                    <div className="text-center">
                        <div className="animate-fade-in-up">
                            {isAuthenticated && (
                                <div className="mb-6">
                                    <p className="text-xl text-indigo-300 mb-2">
                                        Welcome back, {user?.name || user?.email || 'User'}! 👋
                                    </p>
                                    <p className="text-gray-400">
                                        Ready to watch some amazing movies?
                                    </p>
                                </div>
                            )}
                            
                            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Experience 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 glow-text">
                                    {" "}Movie Magic
                                </span>
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 sm:text-2xl">
                                Book tickets instantly to your favorite movies. No queues, no waiting. 
                                <span className="text-amber-400 font-semibold"> Just pure entertainment.</span>
                            </p>
                        </div>
                        
                        {/* Call to Action Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/movies" 
                                className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <span className="relative z-10 flex items-center">
                                    <i className="fas fa-play mr-3"></i>
                                    Book Your Movie Now
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </Link>
                            
                            {isAuthenticated ? (
                                <Link 
                                    to="/dashboard" 
                                    className="bg-transparent border-2 border-indigo-400 hover:bg-indigo-400 text-indigo-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    <i className="fas fa-user mr-3"></i>
                                    My Account
                                </Link>
                            ) : (
                                <Link 
                                    to="/register" 
                                    className="bg-transparent border-2 border-indigo-400 hover:bg-indigo-400 text-indigo-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    <i className="fas fa-user-plus mr-3"></i>
                                    Join TicketGercep
                                </Link>
                            )}
                        </div>
                        
                        {/* Stats Section */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-amber-400">10,000+</div>
                                <div className="text-gray-300 mt-1">Happy Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-400">500+</div>
                                <div className="text-gray-300 mt-1">Movies Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-400">50+</div>
                                <div className="text-gray-300 mt-1">Cinema Locations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            {/* Now Playing Carousel */}
            {!loading && (
                <section className="py-12 bg-gray-900 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                <span className="text-indigo-400 glow-text">Now</span> Playing
                            </h2>
                            {nowPlaying.length > 0 && (
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={prevSlide}
                                        className="p-2 rounded-full bg-gray-800 hover:bg-indigo-600 text-white transition-colors"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button 
                                        onClick={nextSlide}
                                        className="p-2 rounded-full bg-gray-800 hover:bg-indigo-600 text-white transition-colors"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                          {nowPlaying.length > 0 ? (
                            <div className="relative h-96 overflow-hidden rounded-xl shadow-2xl">
                                <div className="h-full relative">
                                    {nowPlaying.map((movie, index) => (
                                        <div 
                                            key={movie.id}
                                            className={`absolute inset-0 transition-opacity duration-500 ${
                                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                        >
                                            <img 
                                                src={movie.poster_path} 
                                                alt={movie.title} 
                                                className="w-full h-full object-cover opacity-40"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                                                <div className="max-w-xl">
                                                    <h3 className="text-3xl font-bold text-white mb-2">{movie.title}</h3>
                                                    <div className="flex items-center mb-4">
                                                        <span className="text-amber-400 mr-2">
                                                            <i className="fas fa-star"></i> {movie.rating || 'N/A'}
                                                        </span>
                                                        <span className="text-gray-300 mr-4">{movie.genre}</span>
                                                        <span className="text-gray-300">{movie.duration}</span>
                                                    </div>
                                                    <p className="text-gray-300 mb-6">{movie.description}</p>
                                                    <Link 
                                                        to={`/movies/${movie.id}`}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center transition-colors"
                                                    >
                                                        <i className="fas fa-play mr-2"></i>
                                                        Book Tickets
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Indicators */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                    {nowPlaying.map((_, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-3 h-3 rounded-full transition-opacity ${
                                                index === currentSlide ? 'bg-white' : 'bg-white opacity-50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-96 overflow-hidden rounded-xl shadow-2xl bg-gray-800 flex flex-col items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="text-5xl text-gray-500 mb-4">
                                        <i className="fas fa-film"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">No Movies Currently Playing</h3>
                                    <p className="text-gray-400 mb-6">Check back soon for new releases!</p>
                                    <Link 
                                        to="/movies"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center transition-colors"
                                    >
                                        <i className="fas fa-list mr-2"></i>
                                        Browse All Movies
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Coming Soon Section */}
            <section className="py-12 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-8">
                        <span className="text-indigo-400 glow-text">Coming</span> Soon
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {comingSoon.length > 0 ? comingSoon.map((movie) => (
                            <div key={movie.id} className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover-lift">
                                <div className="relative pb-2/3 h-64">
                                    <img 
                                        src={movie.poster_path} 
                                        alt={movie.title} 
                                        className="absolute h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <Link 
                                            to={`/movies/${movie.id}`}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium mb-2 text-center transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{movie.release_date}</span>
                                        <span className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full">
                                            Coming Soon
                                        </span>
                                    </div>
                                    {movie.genre && (
                                        <p className="text-xs text-gray-500 mt-1">{movie.genre}</p>
                                    )}
                                </div>
                            </div>
                        )) : (
                            // Fallback data jika tidak ada coming soon movies dari API
                            [
                                {
                                    id: 'fallback-1',
                                    title: 'Oppenheimer',
                                    poster_path: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
                                    release_date: 'July 21, 2025'
                                },
                                {
                                    id: 'fallback-2',
                                    title: 'Barbie',
                                    poster_path: 'https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
                                    release_date: 'July 21, 2025'
                                },
                                {
                                    id: 'fallback-3',
                                    title: 'Mission: Impossible',
                                    poster_path: 'https://image.tmdb.org/t/p/original/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
                                    release_date: 'July 12, 2025'
                                },
                                {
                                    id: 'fallback-4',
                                    title: 'Meg 2: The Trench',
                                    poster_path: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
                                    release_date: 'August 4, 2025'
                                }
                            ].map((movie) => (
                                <div key={movie.id} className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover-lift">
                                    <div className="relative pb-2/3 h-64">
                                        <img 
                                            src={movie.poster_path} 
                                            alt={movie.title} 
                                            className="absolute h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <Link 
                                                to={`/movies/${movie.id}`}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium mb-2 text-center transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">{movie.release_date}</span>
                                            <span className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white">
                            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 glow-text">Choose</span> TicketGercep?
                        </h2>
                        <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                            We provide the best service for movie lovers with instant booking, great rewards, and more.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-bolt text-3xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Instant Booking</h3>
                            <p className="text-gray-300 text-lg">Book your tickets in seconds with our lightning-fast platform. No waiting, no hassle.</p>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-ticket-alt text-3xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Best Seats</h3>
                            <p className="text-gray-300 text-lg">Choose your perfect seat with our interactive seating map before anyone else.</p>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <i className="fas fa-gem text-3xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4">VIP Rewards</h3>
                            <p className="text-gray-300 text-lg">Earn points with every purchase and unlock exclusive VIP benefits and discounts.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Call to Action Before Footer */}
            {!isAuthenticated && (
                <section className="py-16 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
                    </div>
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Movie Journey?</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join TicketGercep today and experience the easiest way to book movie tickets online.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/register" 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <i className="fas fa-user-plus mr-3"></i>
                                Sign Up Free
                            </Link>
                            <Link 
                                to="/login" 
                                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
                            >
                                <i className="fas fa-sign-in-alt mr-3"></i>
                                Login
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">TicketGercep</h3>
                            <p className="text-gray-400">
                                The fastest way to book movie tickets online. Experience cinema like never before.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                                <li><Link to="/movies" className="text-gray-400 hover:text-white">Movies</Link></li>
                                <li><a href="#cinemas" className="text-gray-400 hover:text-white">Cinemas</a></li>
                                <li><a href="#promotions" className="text-gray-400 hover:text-white">Promotions</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                                <li><a href="#privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                                <li><a href="#refund" className="text-gray-400 hover:text-white">Refund Policy</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="#facebook" className="text-gray-400 hover:text-indigo-400">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#twitter" className="text-gray-400 hover:text-indigo-400">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#instagram" className="text-gray-400 hover:text-indigo-400">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#youtube" className="text-gray-400 hover:text-indigo-400">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                      <div className="mt-12 pt-8 border-t border-gray-700">
                        <p className="text-sm text-gray-400 text-center">
                            &copy; 2025 TicketGercep. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
