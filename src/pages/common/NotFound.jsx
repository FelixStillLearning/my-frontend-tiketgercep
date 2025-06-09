import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container mt-6">
            <div className="has-text-centered">
                <h1 className="title is-1">404</h1>
                <h2 className="subtitle is-3">Page Not Found</h2>
                <p className="mb-4">The page you are looking for does not exist.</p>
                <Link to="/" className="button is-primary">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound; 