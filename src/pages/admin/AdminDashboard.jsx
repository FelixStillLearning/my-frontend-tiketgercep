import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
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
                        <h3 className="title is-4">Quick Stats</h3>
                        <div className="columns is-multiline">
                            <div className="column is-one-third">
                                <div className="notification is-primary">
                                    <p className="heading">Total Movies</p>
                                    <p className="title">0</p>
                                </div>
                            </div>
                            <div className="column is-one-third">
                                <div className="notification is-info">
                                    <p className="heading">Active Studios</p>
                                    <p className="title">0</p>
                                </div>
                            </div>
                            <div className="column is-one-third">
                                <div className="notification is-success">
                                    <p className="heading">Today's Shows</p>
                                    <p className="title">0</p>
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
