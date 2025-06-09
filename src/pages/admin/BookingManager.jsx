// src/pages/admin/BookingManager.jsx
// TODO: Implement bookings management page

import React, { useState, useEffect } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import bookingService from '../../services/bookingService';

const BookingManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAll();
            setBookings(data);
        } catch (err) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await bookingService.updateStatus(id, newStatus);
            setBookings(bookings.map(booking => 
                booking.id === id ? { ...booking, status: newStatus } : booking
            ));
        } catch (err) {
            setError('Failed to update booking status');
            console.error(err);
        }
    };

    const columns = [
        {
            header: 'Booking ID',
            accessor: 'id'
        },
        {
            header: 'Customer',
            accessor: 'user',
            render: (user) => user.name
        },
        {
            header: 'Movie',
            accessor: 'movie',
            render: (movie) => movie.title
        },
        {
            header: 'Showtime',
            accessor: 'showtime',
            render: (showtime) => new Date(showtime.startTime).toLocaleString()
        },
        {
            header: 'Seats',
            accessor: 'seats',
            render: (seats) => seats.join(', ')
        },
        {
            header: 'Total Amount',
            accessor: 'totalAmount',
            render: (amount) => `Rp ${amount.toLocaleString()}`
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (_, row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleViewDetails(row)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View Details
                    </button>
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(row.id, 'confirmed')}
                                className="text-green-600 hover:text-green-800"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => handleStatusChange(row.id, 'cancelled')}
                                className="text-red-600 hover:text-red-800"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <AdminNavigation />
                <div className="p-8">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavigation />
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Bookings</h1>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <DataTable
                    columns={columns}
                    data={bookings}
                    searchable
                    className="bg-white rounded-lg shadow"
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBooking(null);
                    }}
                    title="Booking Details"
                >
                    {selectedBooking && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Booking Information</h3>
                                <p>ID: {selectedBooking.id}</p>
                                <p>Status: {selectedBooking.status}</p>
                                <p>Total Amount: Rp {selectedBooking.totalAmount.toLocaleString()}</p>
                                <p>Booking Date: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Customer Information</h3>
                                <p>Name: {selectedBooking.user.name}</p>
                                <p>Email: {selectedBooking.user.email}</p>
                                <p>Phone: {selectedBooking.user.phone}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Movie Information</h3>
                                <p>Title: {selectedBooking.movie.title}</p>
                                <p>Showtime: {new Date(selectedBooking.showtime.startTime).toLocaleString()}</p>
                                <p>Studio: {selectedBooking.showtime.studio.name}</p>
                                <p>Seats: {selectedBooking.seats.join(', ')}</p>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedBooking(null);
                                    }}
                                >
                                    Close
                                </Button>
                                {selectedBooking.status === 'pending' && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                handleStatusChange(selectedBooking.id, 'confirmed');
                                                setIsModalOpen(false);
                                                setSelectedBooking(null);
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Confirm Booking
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleStatusChange(selectedBooking.id, 'cancelled');
                                                setIsModalOpen(false);
                                                setSelectedBooking(null);
                                            }}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Cancel Booking
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default BookingManager;
