import React from 'react';

const colorMap = {
    indigo: '#4f46e5',
    amber: '#f59e42',
    purple: '#8b5cf6',
};

const FeatureCard = ({ icon, title, description, color = 'indigo' }) => {
    return (
        <div className="feature-card">
            <div className={`feature-icon feature-icon-${color}`}>
                <i className={`fas fa-${icon}`}></i>
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
};

export default FeatureCard; 