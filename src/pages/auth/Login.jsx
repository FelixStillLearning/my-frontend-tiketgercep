import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // TODO: Replace with actual API call
            // This is a mock login for demonstration
            const mockUser = {
                email: formData.email,
                role: formData.email.includes('admin') ? 'admin' : 'user'
            };

            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(mockUser));

            // Redirect based on role
            if (mockUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Blurred cinema lights background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm"></div>
            </div>
            
            {/* Login Form */}
            <div className="w-full max-w-md z-10 bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Login to your TicketGercep account</p>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
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
                                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot Password?</a>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 mb-6"
                        >
                            Login
                        </button>
                        
                        <div className="text-center text-gray-400 text-sm">
                            Don't have an account? 
                            <a href="#" className="text-amber-400 hover:text-amber-300 font-medium">Sign up</a>
                        </div>
                    </form>
                </div>
                
                <div className="px-8 py-4 bg-gray-800/50 border-t border-gray-700/50 text-center">
                    <p className="text-xs text-gray-500">
                        By continuing, you agree to our <a href="#" className="text-gray-400 hover:underline">Terms of Service</a> and <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
