// src/pages/admin/StudioFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import StudioForm from '../../components/admin/StudioForm';
import studioService from '../../services/studioService';

const StudioFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studio, setStudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudio = async () => {
            if (!id) return; // Skip if adding new studio            setLoading(true);
            try {
                console.log('Fetching studio with ID:', id);
                const response = await studioService.getById(id);
                console.log('Studio data received:', response);
                if (response) {
                    setStudio(response);
                }
            } catch (err) {
                console.error('Error fetching studio:', err);
                setError('Failed to load studio data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudio();
    }, [id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            if (id) {
                // Update existing studio
                await studioService.update(id, formData);
                // Show success message before redirecting
                alert(`Studio "${formData.name}" has been updated successfully.`);
            } else {
                // Create new studio
                await studioService.create(formData);
                // Show success message before redirecting
                alert(`Studio "${formData.name}" has been added successfully.`);
            }
            // Redirect back to studios list
            navigate('/admin/studios');
        } catch (err) {
            console.error('Error saving studio:', err);
            setError('Failed to save studio data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/studios');
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white-800">
                                {id ? 'Edit Studio' : 'Add New Studio'}
                            </h1>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Back to Studios
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
                                <StudioForm 
                                    initialData={studio} 
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

export default StudioFormPage;
