import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div>
                        <h3 className="footer-title">TiketGercep</h3>
                        <p className="footer-description">
                            The fastest way to book movie tickets online. Experience cinema like never before.
                        </p>
                    </div>
                    <div>
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/movies" className="footer-link">Movies</Link></li>
                            <li><Link to="/cinemas" className="footer-link">Cinemas</Link></li>
                            <li><Link to="/promotions" className="footer-link">Promotions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="footer-title">Legal</h3>
                        <ul className="footer-links">
                            <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                            <li><Link to="/refund" className="footer-link">Refund Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="footer-title">Connect With Us</h3>
                        <div className="footer-social">
                            <a href="#" className="footer-social-link"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="footer-social-link"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="footer-social-link"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="footer-social-link"><i className="fab fa-youtube"></i></a>
                        </div>
                        <div className="footer-newsletter">
                            <h4 className="footer-newsletter-title">Subscribe to Newsletter</h4>
                            <div className="footer-newsletter-form">
                                <input type="email" placeholder="Your email" className="footer-newsletter-input" />
                                <button className="btn btn-primary footer-newsletter-btn">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-copyright">&copy; {new Date().getFullYear()} TiketGercep. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
