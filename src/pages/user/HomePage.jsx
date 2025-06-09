import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/common/Navbar';
import Carousel from '../../components/common/Carousel';
import MovieCard from '../../components/user/MovieCard';
import FeatureCard from '../../components/common/FeatureCard';
import Footer from '../../components/common/Footer';

const HomePage = () => {
    const { user } = useAuth();
    const [nowPlaying, setNowPlaying] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);

    // Mock data for demonstration
    useEffect(() => {
        // In a real app, this would be an API call
        setNowPlaying([
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
            }
        ]);

        setComingSoon([
            {
                id: 4,
                title: 'Oppenheimer',
                posterUrl: 'https://image.tmdb.org/t/p/original/5mzr6JZbrqnqD8rCEvPhuCE5Fw2.jpg',
                releaseDate: '2023-07-21'
            },
            {
                id: 5,
                title: 'Barbie',
                posterUrl: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
                releaseDate: '2023-07-21'
            },
            {
                id: 6,
                title: 'Mission Impossible',
                posterUrl: 'https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
                releaseDate: '2023-07-12'
            },
            {
                id: 7,
                title: 'Meg 2: The Trench',
                posterUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
                releaseDate: '2023-08-04'
            }
        ]);
    }, []);

    const features = [
        {
            icon: 'bolt',
            title: 'Instant Booking',
            description: 'Book your tickets in seconds with our lightning-fast platform. No waiting, no hassle.',
            color: 'indigo'
        },
        {
            icon: 'ticket-alt',
            title: 'Best Seats',
            description: 'Choose your perfect seat with our interactive seating map before anyone else.',
            color: 'amber'
        },
        {
            icon: 'gem',
            title: 'VIP Rewards',
            description: 'Earn points with every purchase and unlock exclusive VIP benefits and discounts.',
            color: 'purple'
        }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                {/* Hero Section */}
                <section className="hero hero-gradient">
                    <div className="container hero-content">
                        <h1 className="hero-title glow-text">Experience Movie Magic</h1>
                        <p className="hero-description">Book tickets instantly to your favorite movies. No queues, no waiting.</p>
                        <div>
                            <Link to="/movies" className="btn btn-primary">Book Now</Link>
                        </div>
                    </div>
                </section>

                {/* Now Playing Section */}
                <section className="now-playing">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title"><span className="glow-text">Now</span> Playing</h2>
                        </div>
                        <Carousel items={nowPlaying} />
                    </div>
                </section>

                {/* Coming Soon Section */}
                <section className="coming-soon">
                    <div className="container">
                        <h2 className="section-title"><span className="glow-text">Coming</span> Soon</h2>
                        <div className="movie-grid">
                            {comingSoon.map(movie => (
                                <MovieCard
                                    key={movie.id}
                                    {...movie}
                                    isComingSoon={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <div className="container">
                        <div className="features-header">
                            <h2 className="features-title">Why <span className="glow-text">Choose</span> TicketGercep?</h2>
                            <p className="features-description">We provide the best service for movie lovers with instant booking, great rewards, and more.</p>
                        </div>
                        <div className="features-grid">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
