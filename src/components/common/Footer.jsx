import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
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
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/movies" className="text-gray-400 hover:text-white transition-colors">Movies</Link></li>
                            <li><Link to="/cinemas" className="text-gray-400 hover:text-white transition-colors">Cinemas</Link></li>
                            <li><Link to="/promotions" className="text-gray-400 hover:text-white transition-colors">Promotions</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/refund" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-6">
                            <a href="#facebook" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#twitter" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#instagram" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#youtube" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                        
                        <div>
                            <h4 className="text-sm font-medium text-white mb-2">Subscribe to Newsletter</h4>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Your email" 
                                    className="bg-gray-800 border border-gray-700 rounded-l-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md transition-colors">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-sm text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} TicketGercep. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
