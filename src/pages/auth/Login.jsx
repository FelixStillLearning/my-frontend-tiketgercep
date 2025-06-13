import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const user = await login(formData.email, formData.password);
            
            console.log('Logged in user:', user); // Debug log
            
            // Check if there's a redirect location from the state
            const redirectTo = location.state?.from;
            const message = location.state?.message;
            
            // Show message if provided
            if (message) {
                console.log('Login redirect message:', message);
            }
            
            // Redirect based on role and redirect state
            if (user && user.role === 'admin') {
                console.log('Redirecting to admin dashboard'); // Debug log
                navigate('/admin');
            } else if (redirectTo) {
                console.log('Redirecting to:', redirectTo); // Debug log
                navigate(redirectTo);
            } else {
                console.log('Redirecting to user homepage'); // Debug log
                navigate('/'); // User ke homepage yang sudah authenticated
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-gray-900">
            {/* Blurred cinema lights background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>
            </div>
            
            {/* Login Form */}
            <div className="w-full max-w-md z-10 bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                <div className="p-8">                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">
                            {location.state?.message || 'Login to your TicketGercep account'}
                        </p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-white placeholder-gray-500 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        
                        <div className="mb-8">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-white placeholder-gray-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <a href="#forgot" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot Password?</a>
                            </div>
                        </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 mb-6"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        
                        <div className="text-center text-gray-400 text-sm">
                            Don't have an account? 
                            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium ml-1">Sign up</Link>
                        </div>
                    </form>
                    
                    {/* Demo credentials */}                    
            
                </div>
                
                <div className="px-8 py-4 bg-gray-800/50 border-t border-gray-700/50 text-center">
                    <p className="text-xs text-gray-500">
                        By continuing, you agree to our <a href="#terms" className="text-gray-400 hover:underline">Terms of Service</a> and <a href="#privacy" className="text-gray-400 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
            
            {/* Back to Home */}
            <Link 
                to="/"
                className="absolute top-4 left-4 text-gray-400 hover:text-white flex items-center z-20"
            >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Home
            </Link>        </div>
    );
};

export default Login;
