import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import showtimeService from '../../services/showtimeServiceNew';

const AdminShowtimes = () => {
    const navigate = useNavigate();
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchShowtimes();
    }, []);    const fetchShowtimes = async () => {
        setLoading(true);
        try {
            const response = await showtimeService.getAll();
            if (response.success) {
                setShowtimes(response.data || []);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error fetching showtimes:', error);
            setError('Failed to load showtimes. Please try again.');
            // Fallback to mock data if API fails
            const mockShowtimes = [
                {
                    showtime_id: 1,
                    movie_id: 1,
                    studio_id: 1,
                    show_date: '2024-06-15',
                    show_time: '19:30:00',
                    ticket_price: 50000,
                    Movie: { title: 'Avengers: Endgame' },
                    Studio: { studio_name: 'Studio A' },
                    created_at: '2024-01-01T00:00:00Z'
                },
                {
                    showtime_id: 2,
                    movie_id: 2,
                    studio_id: 2,
                    show_date: '2024-06-15',
                    show_time: '21:00:00',
                    ticket_price: 55000,
                    Movie: { title: 'Spider-Man: No Way Home' },
                    Studio: { studio_name: 'Studio B' },
                    created_at: '2024-01-01T00:00:00Z'
                }
            ];
            setShowtimes(mockShowtimes);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (showtime) => {
        navigate(`/admin/showtimes/edit/${showtime.showtime_id}`);
    };    const handleDelete = async (showtime) => {
        if (!window.confirm(`Are you sure you want to delete showtime for "${showtime.Movie?.title}"?`)) {
            return;
        }
        
        try {
            const result = await showtimeService.delete(showtime.showtime_id);
            if (result.success) {
                // Refresh showtimes list after delete
                fetchShowtimes();
                alert('Showtime has been deleted successfully.');
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('Error deleting showtime:', err);
            alert('Failed to delete showtime. Please try again.');
        }
    };

    const columns = [
        { key: 'showtime_id', label: 'ID' },
        { 
            key: 'Movie', 
            label: 'Movie',
            render: (item) => item.Movie?.title || 'Unknown Movie'
        },
        { 
            key: 'Studio', 
            label: 'Studio',
            render: (item) => item.Studio?.studio_name || 'Unknown Studio'
        },
        { 
            key: 'show_date', 
            label: 'Date',
            render: (item) => new Date(item.show_date).toLocaleDateString()
        },
        { key: 'show_time', label: 'Time' },
        { 
            key: 'ticket_price', 
            label: 'Price',
            render: (item) => `Rp ${item.ticket_price?.toLocaleString()}`
        },
    ];

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Showtimes Management</h1>
                            <button
                                onClick={() => navigate('/admin/showtimes/add')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Add Showtime</span>
                            </button>                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {error}</span>
                            </div>
                        )}

                        {/* Showtimes Table */}
                        <DataTable
                            columns={columns}
                            data={showtimes}
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

export default AdminShowtimes;
