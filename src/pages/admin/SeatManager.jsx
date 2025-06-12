import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SeatForm from '../../components/admin/SeatForm';
import FormWrapper from '../../components/common/FormWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import seatService from '../../services/seatService';
import studioService from '../../services/studioService';

const SeatManager = () => {
    const [seats, setSeats] = useState([]);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSeat, setEditingSeat] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [seatToDelete, setSeatToDelete] = useState(null);

    // Mock data - replace with API calls later
    useEffect(() => {
        fetchSeats();
        fetchStudios();
    }, []);    const fetchSeats = async () => {
        setLoading(true);
        try {
            const response = await seatService.getAll();
            setSeats(response.data || []);
        } catch (error) {
            console.error('Error fetching seats:', error);
            // Fallback to mock data if API fails
            const mockSeats = [
                {
                    seat_id: 1,
                    studio_id: 1,
                    seat_row: 'A',
                    seat_number: 1,
                    seat_label: 'A1',
                    Studio: { studio_name: 'Studio A' },
                    created_at: '2024-01-01T00:00:00Z'
                },
                {
                    seat_id: 2,
                    studio_id: 1,
                    seat_row: 'A',
                    seat_number: 2,
                    seat_label: 'A2',
                    Studio: { studio_name: 'Studio A' },
                    created_at: '2024-01-01T00:00:00Z'
                },
                {
                    seat_id: 3,
                    studio_id: 2,
                    seat_row: 'B',
                    seat_number: 1,
                    seat_label: 'B1',
                    Studio: { studio_name: 'Studio B' },
                    created_at: '2024-01-01T00:00:00Z'
                }
            ];
            setSeats(mockSeats);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudios = async () => {
        try {
            const response = await studioService.getAll();
            setStudios(response.data || []);
        } catch (error) {
            console.error('Error fetching studios:', error);
            // Fallback to mock data if API fails
            const mockStudios = [
                { studio_id: 1, studio_name: 'Studio A' },
                { studio_id: 2, studio_name: 'Studio B' }
            ];
            setStudios(mockStudios);
        }
    };

    const handleAdd = () => {
        setEditingSeat(null);
        setShowForm(true);
    };

    const handleEdit = (seat) => {
        setEditingSeat(seat);
        setShowForm(true);
    };

    const handleDelete = (seat) => {
        setSeatToDelete(seat);
        setShowDeleteDialog(true);
    };    const handleFormSubmit = async (formData) => {
        try {
            if (editingSeat) {
                await seatService.update(editingSeat.seat_id, formData);
                console.log('Seat updated successfully');
                setSeats(seats.map(seat => 
                    seat.seat_id === editingSeat.seat_id 
                        ? { ...seat, ...formData, Studio: studios.find(s => s.studio_id === formData.studio_id) }
                        : seat
                ));
            } else {
                const response = await seatService.create(formData);
                console.log('Seat created successfully');
                const newSeat = {
                    ...formData,
                    seat_id: response.data?.seat_id || Date.now(),
                    Studio: studios.find(s => s.studio_id === formData.studio_id),
                    created_at: new Date().toISOString()
                };
                setSeats([...seats, newSeat]);
            }
            setShowForm(false);
            setEditingSeat(null);
        } catch (error) {
            console.error('Error saving seat:', error);
            alert('Error saving seat. Please try again.');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await seatService.delete(seatToDelete.seat_id);
            console.log('Seat deleted successfully');
            setSeats(seats.filter(seat => seat.seat_id !== seatToDelete.seat_id));
            setShowDeleteDialog(false);
            setSeatToDelete(null);
        } catch (error) {
            console.error('Error deleting seat:', error);
            alert('Error deleting seat. Please try again.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingSeat(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setSeatToDelete(null);
    };    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Seat Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage individual seats in cinema studios.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Seat
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
                                                Seat Label
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Studio
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Row
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Number
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
                                        {seats.map((seat) => (
                                            <tr key={seat.seat_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {seat.seat_label}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {seat.Studio?.studio_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {seat.seat_row}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {seat.seat_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(seat.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(seat)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            title="Edit Seat"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(seat)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Delete Seat"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {seats.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-gray-500">No seats found. Add your first seat to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Seat Form Modal */}
            {showForm && (
                <FormWrapper
                    title={editingSeat ? 'Edit Seat' : 'Add New Seat'}
                    onClose={handleCancelForm}
                >
                    <SeatForm
                        initialData={editingSeat}
                        studios={studios}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                    />
                </FormWrapper>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <ConfirmDialog
                    title="Delete Seat"
                    message={`Are you sure you want to delete seat "${seatToDelete?.seat_label}"? This action cannot be undone.`}
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

export default SeatManager;
