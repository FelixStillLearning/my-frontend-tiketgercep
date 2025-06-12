import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import UserForm from '../../components/admin/UserForm';
import userService from '../../services/userService';

const UserFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                setLoading(true);
                try {
                    const userData = await userService.getUserById(id);
                    setUser(userData);
                } catch (err) {
                    console.error('Error fetching user:', err);
                    setError('Failed to load user data. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            if (id) {
                // Update existing user
                await userService.updateUser(id, formData);
                alert(`User "${formData.full_name}" has been updated successfully.`);
            } else {
                // Create new user
                await userService.createUser(formData);
                alert(`User "${formData.full_name}" has been created successfully.`);
            }
            // Redirect back to users list
            navigate('/admin/users');
        } catch (err) {
            console.error('Error saving user:', err);
            setError('Failed to save user data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/users');
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {id ? 'Edit User' : 'Add New User'}
                            </h1>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Back to Users
                            </button>
                        </div>

                        {loading && <p className="text-center py-8">Loading...</p>}
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {error}</span>
                            </div>
                        )}

                        {(!loading || id === undefined) && (
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <UserForm 
                                    initialData={user} 
                                    onSubmit={handleSubmit} 
                                    onCancel={handleCancel}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserFormPage;
