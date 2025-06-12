import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import bookingService from '../../services/bookingService';

const AdminBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getAllBookings();
            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

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
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await bookingService.updateBooking(id, { status: newStatus });
            // Refresh bookings list after status update
            fetchBookings();
            alert(`Booking status has been updated to ${newStatus}.`);
        } catch (err) {
            console.error('Error updating booking status:', err);
            alert('Failed to update booking status. Please try again.');
        }
    };

    const columns = [
        { key: 'booking_id', label: 'Booking ID', accessor: 'booking_id' },
        { key: 'booking_code', label: 'Booking Code', accessor: 'booking_code' },
        { key: 'user_id', label: 'User ID', accessor: 'user_id' },
        { key: 'showtime_id', label: 'Showtime ID', accessor: 'showtime_id' },
        { key: 'total_seats', label: 'Total Seats', accessor: 'total_seats' },
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
            render: (status, item) => (
                <div className="flex items-center space-x-2">
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
                    {status === 'pending' && (
                        <div className="flex space-x-1">
                            <button
                                onClick={() => handleStatusChange(item.booking_id, 'confirmed')}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                                title="Confirm"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => handleStatusChange(item.booking_id, 'cancelled')}
                                className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                title="Cancel"
                            >
                                ✗
                            </button>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'booking_date',
            label: 'Booking Date',
            accessor: 'booking_date',
            render: (date) => formatDate(date)
        },
    ];

    const handleEdit = (booking) => {
        // Navigate to edit booking page with booking ID
        navigate(`/admin/bookings/edit/${booking.booking_id}`);
    };

    const handleDelete = async (booking) => {
        if (!window.confirm(`Are you sure you want to delete booking "${booking.booking_code}"?`)) {
            return;
        }
        
        try {
            await bookingService.deleteBooking(booking.booking_id);
            // Refresh bookings list after delete
            fetchBookings();
            alert(`Booking "${booking.booking_code}" has been deleted successfully.`);
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Failed to delete booking. Please try again.');
        }
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white-800">Bookings Management</h1>
                            <button
                                onClick={() => navigate('/admin/bookings/add')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Add Booking</span>
                            </button>
                        </div>

                        {/* Bookings Table */}
                        <DataTable
                            columns={columns}
                            data={bookings}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            searchable={true}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
