import React, { useState, useEffect } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import BookingForm from '../../components/admin/BookingForm';
import FormWrapper from '../../components/common/FormWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import showtimeService from '../../services/showtimeService';

const BookingManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);    useEffect(() => {
        fetchBookings();
        fetchUsers();
        fetchShowtimes();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAllBookings();
            setBookings(data);
        } catch (err) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const fetchShowtimes = async () => {
        try {
            const data = await showtimeService.getAllShowtimes();
            setShowtimes(data);
        } catch (err) {
            console.error('Failed to load showtimes:', err);
        }
    };    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleAddBooking = () => {
        setEditingBooking(null);
        setIsFormOpen(true);
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setIsFormOpen(true);
    };

    const handleDeleteBooking = (booking) => {
        setBookingToDelete(booking);
        setShowDeleteDialog(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingBooking) {
                await bookingService.updateBooking(editingBooking.booking_id, formData);
            } else {
                await bookingService.createBooking(formData);
            }
            
            setIsFormOpen(false);
            setEditingBooking(null);
            await fetchBookings();
        } catch (error) {
            setError('Failed to save booking');
            console.error('Error saving booking:', error);
        }
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingBooking(null);
    };

    const confirmDelete = async () => {
        try {
            await bookingService.deleteBooking(bookingToDelete.booking_id);
            setShowDeleteDialog(false);
            setBookingToDelete(null);
            await fetchBookings();
        } catch (error) {
            setError('Failed to delete booking');
            console.error('Error deleting booking:', error);
        }
    };    const handleStatusChange = async (id, newStatus) => {
        try {
            await bookingService.updateBooking(id, { status: newStatus });
            setBookings(bookings.map(booking => 
                booking.booking_id === id ? { ...booking, status: newStatus } : booking
            ));
            setError(null);
        } catch (err) {
            setError('Failed to update booking status');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };    const columns = [
        {
            key: 'booking_id',
            label: 'Booking ID',
            accessor: 'booking_id'
        },
        {
            key: 'booking_code',
            label: 'Booking Code',
            accessor: 'booking_code'
        },
        {
            key: 'user_id',
            label: 'User ID',
            accessor: 'user_id'
        },
        {
            key: 'showtime_id',
            label: 'Showtime ID',
            accessor: 'showtime_id'
        },
        {
            key: 'total_seats',
            label: 'Total Seats',
            accessor: 'total_seats'
        },
        {
            key: 'total_price',
            label: 'Total Price',
            accessor: 'total_price',
            render: (price) => formatCurrency(price)
        },
        {
            key: 'status',
            label: 'Status',
            accessor: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {status && typeof status === 'string' 
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : status || 'Unknown'
                    }
                </span>
            )
        },
        {
            key: 'booking_date',
            label: 'Booking Date',
            accessor: 'booking_date',
            render: (date) => formatDate(date)
        },
        {
            key: 'actions',
            label: 'Actions',
            accessor: 'actions',
            render: (_, row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleViewDetails(row)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleEditBooking(row)}
                        className="text-green-600 hover:text-green-800 font-medium"
                    >
                        Edit
                    </button>
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(row.booking_id, 'confirmed')}
                                className="text-green-600 hover:text-green-800 font-medium"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => handleStatusChange(row.booking_id, 'cancelled')}
                                className="text-red-600 hover:text-red-800 font-medium"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handleDeleteBooking(row)}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminNavigation />
                <div className="admin-main-content">
                    <div className="p-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading bookings...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
                        <div className="flex space-x-2">
                            <Button
                                onClick={handleAddBooking}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Add New Booking
                            </Button>
                            <Button
                                onClick={fetchBookings}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">{error}</p>
                                </div>
                                <div className="ml-auto">
                                    <button
                                        onClick={() => setError(null)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-lg shadow overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={bookings}
                            searchable
                        />
                    </div>                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedBooking(null);
                        }}
                        title="Booking Details"
                    >
                        {selectedBooking && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Booking ID:</span>
                                                <span className="font-medium">{selectedBooking.booking_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Booking Code:</span>
                                                <span className="font-medium font-mono">{selectedBooking.booking_code}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Booking Date:</span>
                                                <span className="font-medium">{formatDate(selectedBooking.booking_date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">User ID:</span>
                                                <span className="font-medium">{selectedBooking.user_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Showtime ID:</span>
                                                <span className="font-medium">{selectedBooking.showtime_id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Seats:</span>
                                                <span className="font-medium">{selectedBooking.total_seats}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Price:</span>
                                                <span className="font-medium text-green-600">{formatCurrency(selectedBooking.total_price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setSelectedBooking(null);
                                            }}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Close
                                        </Button>
                                        {selectedBooking.status === 'pending' && (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        handleStatusChange(selectedBooking.booking_id, 'confirmed');
                                                        setIsModalOpen(false);
                                                        setSelectedBooking(null);
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    Confirm Booking
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        handleStatusChange(selectedBooking.booking_id, 'cancelled');
                                                        setIsModalOpen(false);
                                                        setSelectedBooking(null);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    Cancel Booking
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal>

                    <FormWrapper
                        title={editingBooking ? 'Edit Booking' : 'Add New Booking'}
                        isOpen={isFormOpen}
                        onClose={handleFormCancel}
                        maxWidth="max-w-4xl"
                    >
                        <BookingForm
                            initialData={editingBooking}
                            users={users}
                            showtimes={showtimes}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </FormWrapper>

                    <ConfirmDialog
                        isOpen={showDeleteDialog}
                        onClose={() => setShowDeleteDialog(false)}
                        onConfirm={confirmDelete}
                        title="Delete Booking"
                        message={`Are you sure you want to delete booking "${bookingToDelete?.booking_code}"? This action cannot be undone.`}
                        confirmText="Delete"
                        type="danger"
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingManager;