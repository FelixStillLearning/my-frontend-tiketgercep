import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/admin/DataTable';

const AdminBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/bookings');
            console.log('Bookings data:', response.data);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (bookingId) => {
        navigate(`/admin/bookings/edit/${bookingId}`);
    };

    const handleDelete = async (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
                fetchBookings(); // Refresh data
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert('Failed to delete booking');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': 'is-warning',
            'confirmed': 'is-success',
            'cancelled': 'is-danger',
            'completed': 'is-info'
        };
        return `tag ${statusMap[status] || 'is-light'}`;
    };

    // ✅ DEFINISI KOLOM TABEL
    const columns = [
        { 
            header: 'Booking ID', 
            accessor: 'booking_id',
            cell: (id) => (
                <span className="has-text-warning">
                    #{id}
                </span>
            )
        },
        { 
            header: 'Customer', 
            accessor: 'customer_name',
            cell: (name, item) => (
                <div>
                    <strong className="has-text-white">{name || 'N/A'}</strong>
                    {item.customer_email && (
                        <div>
                            <small className="has-text-grey">
                                {item.customer_email}
                            </small>
                        </div>
                    )}
                </div>
            )
        },
        { 
            header: 'Movie', 
            accessor: 'movie_title',
            cell: (title) => (
                <span className="has-text-info">{title || 'N/A'}</span>
            )
        },
        { 
            header: 'Studio & Time', 
            accessor: 'studio_name',
            cell: (studioName, item) => (
                <div>
                    <span className="tag is-info">{studioName || 'N/A'}</span>
                    {item.show_date && item.show_time && (
                        <div>
                            <small className="has-text-grey-light">
                                {new Date(item.show_date).toLocaleDateString('id-ID')} - {item.show_time}
                            </small>
                        </div>
                    )}
                </div>
            )
        },
        { 
            header: 'Seats', 
            accessor: 'total_seats', // ✅ UBAH DARI seat_numbers KE total_seats
            cell: (seats) => (
                <span className="tag is-light">
                    {seats || 0} seats
                </span>
            )
        },
        { 
            header: 'Total Price', 
            accessor: 'total_price',
            cell: (price) => (
                <span className="has-text-success">
                    {price ? formatPrice(price) : 'N/A'}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessor: 'status',
            cell: (status) => (
                <span className={getStatusBadge(status)}>
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                </span>
            )
        },
        { 
            header: 'Booking Date', 
            accessor: 'created_at',
            cell: (date) => (
                <span className="has-text-grey-light">
                    {date ? formatDateTime(date) : 'N/A'}
                </span>
            )
        }
    ];

    return (
        <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
            <div className="container">
                <div className="mb-6">
                    <DataTable 
                        title="Booking Management"
                        columns={columns}
                        data={bookings}
                        loading={loading}
                        onAdd={() => navigate('/admin/bookings/create')}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </section>
    );
};

export default AdminBooking;