import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import BookingSeatForm from '../../components/admin/BookingSeatForm';
import FormWrapper from '../../components/common/FormWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import bookingSeatService from '../../services/bookingSeatService';
import bookingService from '../../services/bookingService';
import seatService from '../../services/seatService';

const BookingSeatManager = () => {
    const [bookingSeats, setBookingSeats] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingBookingSeat, setEditingBookingSeat] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [bookingSeatToDelete, setBookingSeatToDelete] = useState(null);

    // Mock data - replace with API calls later
    useEffect(() => {
        fetchBookingSeats();
        fetchBookings();
        fetchSeats();
    }, []);    const fetchBookingSeats = async () => {
        setLoading(true);
        try {
            const response = await bookingSeatService.getAll();
            setBookingSeats(response.data || []);
        } catch (error) {
            console.error('Error fetching booking seats:', error);
            // Fallback to mock data if API fails
            const mockBookingSeats = [
                {
                    booking_seat_id: 1,
                    booking_id: 1,
                    seat_id: 1,
                    Booking: { 
                        booking_code: 'BK001', 
                        User: { full_name: 'John Doe' }
                    },
                    Seat: { 
                        seat_label: 'A1', 
                        Studio: { studio_name: 'Studio A' }
                    },
                    created_at: '2024-01-01T00:00:00Z'
                },
                {
                    booking_seat_id: 2,
                    booking_id: 1,
                    seat_id: 2,
                    Booking: { 
                        booking_code: 'BK001', 
                        User: { full_name: 'John Doe' }
                    },
                    Seat: { 
                        seat_label: 'A2', 
                        Studio: { studio_name: 'Studio A' }
                    },
                    created_at: '2024-01-01T00:00:00Z'
                }
            ];
            setBookingSeats(mockBookingSeats);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getAll();
            setBookings(response.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Fallback to mock data if API fails
            const mockBookings = [
                { 
                    booking_id: 1, 
                    booking_code: 'BK001', 
                    User: { full_name: 'John Doe' }
                },
                { 
                    booking_id: 2, 
                    booking_code: 'BK002', 
                    User: { full_name: 'Jane Smith' }
                }
            ];
            setBookings(mockBookings);
        }
    };

    const fetchSeats = async () => {
        try {
            const response = await seatService.getAll();
            setSeats(response.data || []);
        } catch (error) {
            console.error('Error fetching seats:', error);
            // Fallback to mock data if API fails
            const mockSeats = [
                { 
                    seat_id: 1, 
                    seat_label: 'A1',
                    Studio: { studio_name: 'Studio A' }
                },
                { 
                    seat_id: 2, 
                    seat_label: 'A2',
                    Studio: { studio_name: 'Studio A' }
                },
                { 
                    seat_id: 3, 
                    seat_label: 'B1',
                    Studio: { studio_name: 'Studio B' }
                }
            ];
            setSeats(mockSeats);
        }
    };

    const handleAdd = () => {
        setEditingBookingSeat(null);
        setShowForm(true);
    };

    const handleEdit = (bookingSeat) => {
        setEditingBookingSeat(bookingSeat);
        setShowForm(true);
    };

    const handleDelete = (bookingSeat) => {
        setBookingSeatToDelete(bookingSeat);
        setShowDeleteDialog(true);
    };    const handleFormSubmit = async (formData) => {
        try {
            if (editingBookingSeat) {
                await bookingSeatService.update(editingBookingSeat.booking_seat_id, formData);
                console.log('Booking seat updated successfully');
                setBookingSeats(bookingSeats.map(bs => 
                    bs.booking_seat_id === editingBookingSeat.booking_seat_id 
                        ? { 
                            ...bs, 
                            ...formData,
                            Booking: bookings.find(b => b.booking_id === formData.booking_id),
                            Seat: seats.find(s => s.seat_id === formData.seat_id)
                        }
                        : bs
                ));
            } else {
                const response = await bookingSeatService.create(formData);
                console.log('Booking seat created successfully');
                const newBookingSeat = {
                    ...formData,
                    booking_seat_id: response.data?.booking_seat_id || Date.now(),
                    Booking: bookings.find(b => b.booking_id === formData.booking_id),
                    Seat: seats.find(s => s.seat_id === formData.seat_id),
                    created_at: new Date().toISOString()
                };
                setBookingSeats([...bookingSeats, newBookingSeat]);
            }
            setShowForm(false);
            setEditingBookingSeat(null);
        } catch (error) {
            console.error('Error saving booking seat:', error);
            alert('Error saving booking seat. Please try again.');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await bookingSeatService.delete(bookingSeatToDelete.booking_seat_id);
            console.log('Booking seat deleted successfully');
            setBookingSeats(bookingSeats.filter(bs => bs.booking_seat_id !== bookingSeatToDelete.booking_seat_id));
            setShowDeleteDialog(false);
            setBookingSeatToDelete(null);
        } catch (error) {
            console.error('Error deleting booking seat:', error);
            alert('Error deleting booking seat. Please try again.');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingBookingSeat(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setBookingSeatToDelete(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Booking Seat Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage seat assignments for bookings.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Assign Seat
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
                                                Booking Code
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Seat
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Studio
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
                                        {bookingSeats.map((bookingSeat) => (
                                            <tr key={bookingSeat.booking_seat_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {bookingSeat.Booking?.booking_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {bookingSeat.Booking?.User?.full_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {bookingSeat.Seat?.seat_label}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {bookingSeat.Seat?.Studio?.studio_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(bookingSeat.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(bookingSeat)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            title="Edit Booking Seat"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(bookingSeat)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Delete Booking Seat"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {bookingSeats.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-gray-500">No booking seats found. Start assigning seats to bookings.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Seat Form Modal */}
            {showForm && (
                <FormWrapper
                    title={editingBookingSeat ? 'Edit Booking Seat' : 'Assign New Seat'}
                    onClose={handleCancelForm}
                >
                    <BookingSeatForm
                        initialData={editingBookingSeat}
                        bookings={bookings}
                        seats={seats}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                    />
                </FormWrapper>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <ConfirmDialog
                    title="Remove Seat Assignment"
                    message={`Are you sure you want to remove seat "${bookingSeatToDelete?.Seat?.seat_label}" from booking "${bookingSeatToDelete?.Booking?.booking_code}"? This action cannot be undone.`}
                    confirmText="Remove"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    type="danger"
                />
            )}
        </div>
    );
};

export default BookingSeatManager;
