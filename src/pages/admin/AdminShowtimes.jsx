import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/admin/DataTable';

const AdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchShowtimes();
    }, []);

    const fetchShowtimes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/showtimes');
            console.log('Showtimes data:', response.data);
            setShowtimes(response.data);
        } catch (error) {
            console.error('Error fetching showtimes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (showtimeId) => {
        navigate(`/admin/showtimes/edit/${showtimeId}`);
    };

    const handleDelete = async (showtimeId) => {
        if (window.confirm('Are you sure you want to delete this showtime?')) {
            try {
                await axios.delete(`http://localhost:5000/api/showtimes/${showtimeId}`);
                fetchShowtimes(); // Refresh data
            } catch (error) {
                console.error('Error deleting showtime:', error);
                alert('Failed to delete showtime');
            }
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ✅ DEFINISI KOLOM TABEL
    const columns = [
        { 
            header: 'Movie', 
            accessor: 'movie_title',
            cell: (title) => (
                <div>
                    <strong className="has-text-white">{title || 'N/A'}</strong>
                </div>
            )
        },
        { 
            header: 'Studio', 
            accessor: 'studio_name',
            cell: (studioName, item) => (
                <div>
                    <span className="tag is-info">{studioName || 'N/A'}</span>
                    {item.total_seats && (
                        <div>
                            <small className="has-text-grey">
                                Capacity: {item.total_seats} seats
                            </small>
                        </div>
                    )}
                </div>
            )
        },
        { 
            header: 'Date', 
            accessor: 'show_date',
            cell: (date) => (
                <span className="has-text-grey-light">
                    {date ? formatDate(date) : 'N/A'}
                </span>
            )
        },
        { 
            header: 'Time', 
            accessor: 'show_time',
            cell: (time) => (
                <span className="tag is-light">
                    {time || 'N/A'}
                </span>
            )
        },
        { 
            header: 'Price', 
            accessor: 'price',
            cell: (price) => (
                <span className="has-text-success">
                    {price ? formatPrice(price) : 'N/A'}
                </span>
            )
        },
        { 
            header: 'Available Seats', 
            accessor: 'total_seats',
            cell: (seats) => (
                <span className="tag is-success">
                    {seats || 0} seats
                </span>
            )
        }
    ];

    return (
        <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
            <div className="container">
                <div className="mb-6">
                    <DataTable 
                        title="Showtime Management"
                        columns={columns}
                        data={showtimes}
                        loading={loading}
                        onAdd={() => navigate('/admin/showtimes/create')}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </section>
    );
};

export default AdminShowtimes;