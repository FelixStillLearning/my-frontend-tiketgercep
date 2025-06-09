import React, { useState, useEffect } from 'react';

const Carousel = ({ items, autoRotate = true, interval = 7000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let intervalId;
        if (autoRotate) {
            intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
            }, interval);
        }
        return () => clearInterval(intervalId);
    }, [autoRotate, interval, items.length]);

    const showSlide = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    return (
        <div className="carousel">
            <div className="carousel-inner">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`carousel-item${index === currentIndex ? ' active' : ''}`}
                    >
                        <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="carousel-image"
                        />
                        <div className="carousel-content">
                            <div className="carousel-content-wrapper">
                                <h3 className="carousel-title">{item.title}</h3>
                                <div className="carousel-info">
                                    <div className="carousel-rating">
                                        <i className="fas fa-star"></i>
                                        <span>{item.rating}/5</span>
                                    </div>
                                    <span className="carousel-duration">{item.duration}</span>
                                </div>
                                <p className="carousel-description">{item.description}</p>
                                <button className="btn btn-primary carousel-button">
                                    <i className="fas fa-ticket-alt"></i>
                                    <span>Book Tickets</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Controls */}
                <div className="carousel-controls">
                    <button onClick={prevSlide} className="btn btn-secondary carousel-control-btn">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button onClick={nextSlide} className="btn btn-secondary carousel-control-btn">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
                {/* Indicators */}
                <div className="carousel-indicators">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => showSlide(index)}
                            className={`carousel-indicator${index === currentIndex ? ' active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel; 