import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import { movieService } from '../../services/MovieService';

const AdminMovies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);    const fetchMovies = async () => {
        setLoading(true);
        try {
            const response = await movieService.getAll();
            // API response: { success, data, ... }
            setMovies(response.data || []);
        } catch (err) {
            console.error('Error fetching movies:', err);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'genre', label: 'Genre' },
        { key: 'duration', label: 'Duration (min)' },
        { key: 'rating', label: 'Rating' },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'now_playing' ? 'bg-green-500/20 text-green-500' :
                    item.status === 'coming_soon' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-gray-500/20 text-gray-500'
                }`}>
                    {item.status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                </span>
            ),
        },
        { key: 'release_date', label: 'Release Date' },
    ];    const handleEdit = (movie) => {
        // Navigate to edit movie page with movie ID
        navigate(`/admin/movies/edit/${movie.movie_id}`);
    };    const handleDelete = async (movie) => {
        if (!window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
            return;
        }
        
        try {
            await movieService.delete(movie.movie_id);
            // Refresh movies list after delete
            fetchMovies();
            alert(`Movie "${movie.title}" has been deleted successfully.`);
        } catch (err) {
            console.error('Error deleting movie:', err);
            alert('Failed to delete movie. Please try again.');
        }
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Movies Management</h1>
                            <button
                                onClick={() => navigate('/admin/movies/add')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Add Movie</span>
                            </button>
                        </div>

                        {/* Movies Table */}
                        <DataTable
                            columns={columns}
                            data={movies}
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

export default AdminMovies;