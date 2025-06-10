import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMovies: 0,
        activeStudios: 0,
        todaysShows: 0
    });
    const [loading, setLoading] = useState(true);

    const adminSections = [
        {
            title: 'Movies',
            description: 'Manage movie listings, details, and schedules',
            icon: '🎬',
            path: '/admin/movies'
        },
        {
            title: 'Studios',
            description: 'Manage cinema studios and seating arrangements',
            icon: '🎭',
            path: '/admin/studios'
        },
        {
            title: 'Showtimes',
            description: 'Schedule movie showtimes and manage bookings',
            icon: '⏰',
            path: '/admin/showtimes'
        }
    ];

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            
            // Parallel API calls untuk performa yang lebih baik
            const [moviesResponse, studiosResponse, showtimesResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/movies'),
                axios.get('http://localhost:5000/api/studios'),
                axios.get('http://localhost:5000/api/showtimes')
            ]);

            // Hitung today's shows
            const today = new Date().toISOString().split('T')[0];
            const todaysShows = showtimesResponse.data.filter(showtime => {
                const showtimeDate = new Date(showtime.show_date).toISOString().split('T')[0];
                return showtimeDate === today;
            });

            setStats({
                totalMovies: moviesResponse.data.length,
                activeStudios: studiosResponse.data.length,
                todaysShows: todaysShows.length
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Set default values jika error
            setStats({
                totalMovies: 0,
                activeStudios: 0,
                todaysShows: 0
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-6">
            <h1 className="title is-2 has-text-centered mb-6">Admin Dashboard</h1>
            
            <div className="columns is-multiline">
                {adminSections.map((section) => (
                    <div key={section.title} className="column is-one-third">
                        <Link to={section.path} className="box has-text-centered" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 150 }}>
                            <span className="icon is-large" style={{ marginBottom: 12 }}>
                                <span className="is-size-1">{section.icon}</span>
                            </span>
                            <h2 className="title is-4" style={{ margin: 0 }}>{section.title}</h2>
                            <p className="subtitle is-6" style={{ marginTop: 4 }}>{section.description}</p>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="columns mt-6">
                <div className="column">
                    <div className="box">
                        <div className="level">
                            <div className="level-left">
                                <h3 className="title is-4">Quick Stats</h3>
                            </div>
                            <div className="level-right">
                                <button 
                                    className={`button is-small ${loading ? 'is-loading' : ''}`}
                                    onClick={fetchDashboardStats}
                                    disabled={loading}
                                >
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>
                        
                        <div className="columns is-multiline">
                            <div className="column is-one-third">
                                <div className="notification is-primary">
                                    <p className="heading">Total Movies</p>
                                    <p className="title">
                                        {loading ? (
                                            <span className="loader"></span>
                                        ) : (
                                            stats.totalMovies
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="column is-one-third">
                                <div className="notification is-info">
                                    <p className="heading">Active Studios</p>
                                    <p className="title">
                                        {loading ? (
                                            <span className="loader"></span>
                                        ) : (
                                            stats.activeStudios
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="column is-one-third">
                                <div className="notification is-success">
                                    <p className="heading">Today's Shows</p>
                                    <p className="title">
                                        {loading ? (
                                            <span className="loader"></span>
                                        ) : (
                                            stats.todaysShows
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hapus bagian Quick Actions */}
                        <div className="columns is-multiline mt-4">
                            <div className="column">
                                <div className="box has-background-light">
                                    <h4 className="title is-6">📈 System Status</h4>
                                    <div className="content">
                                        <p className="is-size-7">
                                            <span className="tag is-success is-small">✅ Online</span> Database Connected
                                        </p>
                                        <p className="is-size-7">
                                            <span className="tag is-info is-small">🔄 Auto</span> Stats refresh every visit
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;