import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { movieService } from '../../services/MovieService';

const HomePage = () => {
    // Using auth context without destructuring unused user variable
    useAuth();
    const [nowPlaying, setNowPlaying] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real data from API
    useEffect(() => {
        const fetchNowPlayingMovies = async () => {
            try {
                setLoading(true);
                // Get movies with 'now_playing' status
                const response = await movieService.getByStatus('now_playing');
                
                // Map API response to the format our components expect
                const moviesData = response.map(movie => ({
                    id: movie.movie_id,
                    title: movie.title,
                    poster_path: movie.poster_url ? movie.poster_url : 'https://via.placeholder.com/300x450?text=No+Image',
                    backdrop_path: movie.poster_url ? movie.poster_url : 'https://via.placeholder.com/1280x720?text=No+Image',
                    rating: 4.5, // Default rating if not available from API
                    genre: movie.genre,
                    duration: `${movie.duration}m`,
                    release_date: movie.release_date,
                    description: movie.synopsis
                }));
                
                setNowPlaying(moviesData.length > 0 ? moviesData : []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching now playing movies:', err);
                setError('Failed to load movies. Please try again later.');
                setLoading(false);
            }
        };

        fetchNowPlayingMovies();
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
            <nav className="bg-gray-900/80 backdrop-blur-md fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-indigo-400 glow-text">
                                    Ticket<span className="text-amber-400">Gercep</span>
                                </h1>
                            </div>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    <Link to="/" className="text-indigo-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                    <Link to="/movies" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Movies</Link>
                                    <Link to="/cinemas" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Cinemas</Link>
                                    <a href="#promotions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Promotions</a>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none">
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>            {/* Hero Section */}
            <div className="pt-16 pb-12 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Experience Movie Magic
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Book tickets instantly to your favorite movies. No queues, no waiting.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            <div className="rounded-md shadow">
                                <Link to="/movies" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 md:py-4 md:text-lg md:px-10">
                                    Book Now
                                </Link>
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
                                            className={`carousel-item h-full w-full relative ${index === currentSlide ? 'active' : ''}`}
                                        >
                                            <img 
                                                src={movie.backdrop_path} 
                                                alt={movie.title} 
                                                className="w-full h-full object-cover opacity-40"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                                                <div className="max-w-xl">
                                                    <h3 className="text-3xl font-bold text-white mb-2">{movie.title}</h3>
                                                    <div className="flex items-center mb-4">
                                                        <span className="text-amber-400 mr-2">
                                                            <i className="fas fa-star"></i> {movie.rating}
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
                        {[
                            {
                                id: 4,
                                title: 'Oppenheimer',
                                poster_path: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
                                release_date: 'July 21, 2023'
                            },
                            {
                                id: 5,
                                title: 'Barbie',
                                poster_path: 'https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
                                release_date: 'July 21, 2023'
                            },
                            {
                                id: 6,
                                title: 'Mission: Impossible',
                                poster_path: 'https://image.tmdb.org/t/p/original/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
                                release_date: 'July 12, 2023'
                            },
                            {
                                id: 7,
                                title: 'Meg 2: The Trench',
                                poster_path: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
                                release_date: 'August 4, 2023'
                            }
                        ].map((movie) => (
                            <div key={movie.id} className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300">
                                <div className="relative pb-2/3 h-64">
                                    <img 
                                        src={movie.poster_path} 
                                        alt={movie.title} 
                                        className="absolute h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <Link 
                                            to={`/movies/${movie.id}`}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium mb-2 text-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-400">{movie.release_date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white">
                            Why <span className="text-indigo-400 glow-text">Choose</span> TicketGercep?
                        </h2>
                        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                            We provide the best service for movie lovers with instant booking, great rewards, and more.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-800 rounded-xl p-6 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <i className="fas fa-bolt text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Instant Booking</h3>
                            <p className="text-gray-300">Book your tickets in seconds with our lightning-fast platform. No waiting, no hassle.</p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl p-6 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center">
                                    <i className="fas fa-ticket-alt text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Best Seats</h3>
                            <p className="text-gray-300">Choose your perfect seat with our interactive seating map before anyone else.</p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl p-6 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
                                    <i className="fas fa-gem text-2xl text-white"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">VIP Rewards</h3>
                            <p className="text-gray-300">Earn points with every purchase and unlock exclusive VIP benefits and discounts.</p>
                        </div>
                    </div>
                </div>
            </section>

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
