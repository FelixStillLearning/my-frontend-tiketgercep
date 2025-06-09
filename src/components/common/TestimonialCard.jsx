import React from 'react';

const TestimonialCard = ({
    name,
    role,
    avatar,
    content,
    rating,
    className = '',
}) => {
    return (
        <div className={`testimonial-card ${className}`}>
            <div className="testimonial-content">
                <p className="testimonial-text">{content}</p>
                {rating && (
                    <div className="testimonial-rating">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <i
                                key={index}
                                className={`fas fa-star ${index < rating ? 'active' : ''}`}
                            ></i>
                        ))}
                    </div>
                )}
            </div>
            <div className="testimonial-author">
                <img
                    src={avatar}
                    alt={name}
                    className="testimonial-avatar"
                />
                <div className="testimonial-info">
                    <h4 className="testimonial-name">{name}</h4>
                    {role && <p className="testimonial-role">{role}</p>}
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard; 