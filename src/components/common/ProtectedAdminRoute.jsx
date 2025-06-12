import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <span className="ml-3 text-white">Loading...</span>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to homepage if not admin
    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Render admin component if authenticated and is admin
    return children;
};

export default ProtectedAdminRoute;
