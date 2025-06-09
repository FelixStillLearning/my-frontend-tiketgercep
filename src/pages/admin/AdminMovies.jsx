import React, { useState } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import MovieForm from '../../components/admin/MovieForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const AdminMovies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Mock data for demonstration
    const movies = [
        {
            id: 1,
            title: 'The Dark Knight',
            genre: 'Action, Crime, Drama',
            duration: 152,
            rating: 4.8,
            status: 'now_playing',
            releaseDate: '2024-03-01',
        },
        {
            id: 2,
            title: 'Inception',
            genre: 'Action, Adventure, Sci-Fi',
            duration: 148,
            rating: 4.7,
            status: 'upcoming',
            releaseDate: '2024-03-15',
        },
        // Add more mock data as needed
    ];

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
                    item.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-gray-500/20 text-gray-500'
                }`}>
                    {item.status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                </span>
            ),
        },
        { key: 'releaseDate', label: 'Release Date' },
    ];

    const handleEdit = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleDelete = (movie) => {
        // Implement delete functionality
        console.log('Delete movie:', movie);
    };

    const handleSubmit = (formData) => {
        // Implement submit functionality
        console.log('Submit movie:', formData);
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                <AdminNavigation />

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-white">Movies</h1>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSelectedMovie(null);
                                setIsModalOpen(true);
                            }}
                        >
                            Add Movie
                        </Button>
                    </div>

                    {/* Movies Table */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <DataTable
                            columns={columns}
                            data={movies}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            searchable={true}
                        />
                    </div>

                    {/* Add/Edit Movie Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedMovie(null);
                        }}
                        title={selectedMovie ? 'Edit Movie' : 'Add Movie'}
                        size="lg"
                    >
                        <MovieForm
                            initialData={selectedMovie}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setSelectedMovie(null);
                            }}
                        />
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default AdminMovies; 