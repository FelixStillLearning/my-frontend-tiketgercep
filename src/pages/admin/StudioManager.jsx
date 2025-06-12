import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import StudioForm from '../../components/admin/StudioForm';
import FormWrapper from '../../components/common/FormWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import studioService from '../../services/studioService';

const StudioManager = () => {
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStudio, setEditingStudio] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [studioToDelete, setStudioToDelete] = useState(null);    useEffect(() => {
        fetchStudios();
    }, []);    const fetchStudios = async () => {
        setLoading(true);
        try {
            const response = await studioService.getAll();
            setStudios(response.data || []);
        } catch (error) {
            console.error('Error fetching studios:', error);
            // Fallback to mock data if API fails
            const mockStudios = [
                {
                    studio_id: 1,
                    studio_name: 'Studio A',
                    total_seats: 50,
                    rows: 5,
                    seats_per_row: 10,
                    created_at: '2024-01-01T00:00:00Z'
                },
                {
                    studio_id: 2,
                    studio_name: 'Studio B',
                    total_seats: 30,
                    rows: 3,
                    seats_per_row: 10,
                    created_at: '2024-01-01T00:00:00Z'
                }
            ];
            setStudios(mockStudios);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingStudio(null);
        setShowForm(true);
    };

    const handleEdit = (studio) => {
        setEditingStudio(studio);
        setShowForm(true);
    };

    const handleDelete = (studio) => {
        setStudioToDelete(studio);
        setShowDeleteDialog(true);
    };    const handleFormSubmit = async (formData) => {
        try {
            if (editingStudio) {
                await studioService.update(editingStudio.studio_id, formData);
                console.log('Studio updated successfully');
                setStudios(studios.map(studio => 
                    studio.studio_id === editingStudio.studio_id 
                        ? { ...studio, ...formData }
                        : studio
                ));
            } else {
                const response = await studioService.create(formData);
                console.log('Studio created successfully');
                const newStudio = {
                    ...formData,
                    studio_id: response.data?.studio_id || Date.now(),
                    created_at: new Date().toISOString()
                };
                setStudios([...studios, newStudio]);
            }
            setShowForm(false);
            setEditingStudio(null);
        } catch (error) {
            console.error('Error saving studio:', error);
            alert('Error saving studio. Please try again.');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await studioService.delete(studioToDelete.studio_id);
            console.log('Studio deleted successfully');
            setStudios(studios.filter(studio => studio.studio_id !== studioToDelete.studio_id));
            setShowDeleteDialog(false);
            setStudioToDelete(null);
        } catch (error) {
            console.error('Error deleting studio:', error);
            alert('Error deleting studio. Please try again.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingStudio(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setStudioToDelete(null);
    };    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Studio Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage cinema studios and their seating configurations.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Studio
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="mt-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Studio Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Seats
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Layout
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {studios.map((studio) => (
                                            <tr key={studio.studio_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {studio.studio_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {studio.total_seats} seats
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {studio.rows} rows × {studio.seats_per_row} seats
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(studio.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(studio)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            title="Edit Studio"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(studio)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Delete Studio"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {studios.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-gray-500">No studios found. Add your first studio to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Studio Form Modal */}
            {showForm && (
                <FormWrapper
                    title={editingStudio ? 'Edit Studio' : 'Add New Studio'}
                    onClose={handleCancelForm}
                >
                    <StudioForm
                        initialData={editingStudio}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                    />
                </FormWrapper>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <ConfirmDialog
                    title="Delete Studio"
                    message={`Are you sure you want to delete "${studioToDelete?.studio_name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    type="danger"
                />
            )}
        </div>
    );
};

export default StudioManager;
