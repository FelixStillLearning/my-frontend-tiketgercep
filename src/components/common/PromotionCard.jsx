import React from 'react';
import { Link } from 'react-router-dom';

const PromotionCard = ({
    title,
    description,
    image,
    validUntil,
    code,
    className = '',
}) => {
    return (
        <div className={`promotion-card ${className}`}>
            <div className="promotion-image">
                <img src={image} alt={title} />
            </div>
            <div className="promotion-content">
                <h3 className="promotion-title">{title}</h3>
                <p className="promotion-description">{description}</p>
                {validUntil && (
                    <p className="promotion-validity">
                        Valid until: {new Date(validUntil).toLocaleDateString()}
                    </p>
                )}
                {code && (
                    <div className="promotion-code">
                        <span className="promotion-code-text">{code}</span>
                        <button
                            className="promotion-code-copy"
                            onClick={() => navigator.clipboard.writeText(code)}
                        >
                            <i className="fas fa-copy"></i>
                        </button>
                    </div>
                )}
                <Link to="/promotions" className="btn btn-primary promotion-link">
                    Learn More
                </Link>
            </div>
        </div>
    );
};

export default PromotionCard; 