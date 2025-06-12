// src/pages/admin/MovieFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import MovieForm from '../../components/admin/MovieForm';
import { movieService } from '../../services/MovieService';

const MovieFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return; // Skip if adding new movie

            setLoading(true);
            try {
                const response = await movieService.getById(id);
                if (response && response.data) {
                    setMovie(response.data);
                }
            } catch (err) {
                console.error('Error fetching movie:', err);
                setError('Failed to load movie data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            if (id) {
                // Update existing movie
                await movieService.update(id, formData);
                // Show success message before redirecting
                alert(`Movie "${formData.title}" has been updated successfully.`);
            } else {
                // Create new movie
                await movieService.create(formData);
                // Show success message before redirecting
                alert(`Movie "${formData.title}" has been added successfully.`);
            }
            // Redirect back to movies list
            navigate('/admin/movies');
        } catch (err) {
            console.error('Error saving movie:', err);
            setError('Failed to save movie data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/movies');
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {id ? 'Edit Movie' : 'Add New Movie'}
                            </h1>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Back to Movies
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
                                <MovieForm 
                                    initialData={movie} 
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

export default MovieFormPage;
