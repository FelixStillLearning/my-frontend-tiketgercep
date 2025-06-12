import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import MovieForm from '../../components/admin/MovieForm';
import FormWrapper from '../../components/common/FormWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { movieService } from '../../services/MovieService';

const MovieManager = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    const columns = [
        { key: 'movie_id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'genre', label: 'Genre' },
        { key: 'duration', label: 'Duration (min)' },
        { key: 'rating', label: 'Rating' },
        { 
            key: 'status', 
            label: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                    value === 'now_playing' 
                        ? 'bg-green-100 text-green-800' 
                        : value === 'coming_soon'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {value.replace('_', ' ').toUpperCase()}
                </span>
            )
        },
        { key: 'release_date', label: 'Release Date' },
    ];

    useEffect(() => {
        fetchMovies();
    }, []);    const fetchMovies = async () => {
        setLoading(true);
        try {
            const response = await movieService.getAll();
            setMovies(response.data || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
            // Fallback to mock data if API fails
            const mockMovies = [
                {
                    movie_id: 1,
                    title: 'Avengers: Endgame',
                    genre: 'Action, Adventure, Drama',
                    duration: 181,
                    rating: 4.5,
                    status: 'now_playing',
                    release_date: '2019-04-26',
                    synopsis: 'After the devastating events...',
                    poster_url: 'https://example.com/poster1.jpg',
                    trailer_url: 'https://example.com/trailer1.mp4'
                }
            ];
            setMovies(mockMovies);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMovie = () => {
        setEditingMovie(null);
        setShowForm(true);
    };

    const handleEditMovie = (movie) => {
        setEditingMovie(movie);
        setShowForm(true);
    };

    const handleDeleteMovie = (movie) => {
        setMovieToDelete(movie);
        setShowDeleteDialog(true);
    };    const handleFormSubmit = async (formData) => {
        try {
            if (editingMovie) {
                await movieService.update(editingMovie.movie_id, formData);
                console.log('Movie updated successfully');
            } else {
                await movieService.create(formData);
                console.log('Movie created successfully');
            }
            
            setShowForm(false);
            setEditingMovie(null);
            await fetchMovies();
        } catch (error) {
            console.error('Error saving movie:', error);
            alert('Error saving movie. Please try again.');
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingMovie(null);
    };

    const confirmDelete = async () => {
        try {
            await movieService.delete(movieToDelete.movie_id);
            console.log('Movie deleted successfully');
            
            setShowDeleteDialog(false);
            setMovieToDelete(null);
            await fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
            alert('Error deleting movie. Please try again.');
        }
    };

    const actions = [
        {
            label: 'Edit',
            onClick: handleEditMovie,
            className: 'text-blue-600 hover:text-blue-900'
        },
        {
            label: 'Delete',
            onClick: handleDeleteMovie,
            className: 'text-red-600 hover:text-red-900'
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Movie Management</h1>
                <button
                    onClick={handleAddMovie}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add New Movie
                </button>
            </div>

            <DataTable
                data={movies}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyMessage="No movies found"
            />

            <FormWrapper
                title={editingMovie ? 'Edit Movie' : 'Add New Movie'}
                isOpen={showForm}
                onClose={handleFormCancel}
                maxWidth="max-w-4xl"
            >
                <MovieForm
                    initialData={editingMovie}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            </FormWrapper>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete Movie"
                message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default MovieManager;
