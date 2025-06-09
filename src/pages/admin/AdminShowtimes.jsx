import React, { useState, useEffect } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import ShowtimeForm from '../../components/admin/ShowtimeForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import showtimeService from '../../services/showtimeService';
import movieService from '../../services/MovieService';
import studioService from '../../services/studioService';

const AdminShowtimes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [showtimesData, moviesData, studiosData] = await Promise.all([
                showtimeService.getAll(),
                movieService.getAll(),
                studioService.getAll()
            ]);
            setShowtimes(showtimesData);
            setMovies(moviesData);
            setStudios(studiosData);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (showtime) => {
        setSelectedShowtime(showtime);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this showtime?')) {
            try {
                await showtimeService.delete(id);
                setShowtimes(showtimes.filter(showtime => showtime.id !== id));
            } catch (err) {
                setError('Failed to delete showtime');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedShowtime) {
                await showtimeService.update(selectedShowtime.id, formData);
                setShowtimes(showtimes.map(showtime => 
                    showtime.id === selectedShowtime.id ? { ...showtime, ...formData } : showtime
                ));
            } else {
                const newShowtime = await showtimeService.create(formData);
                setShowtimes([...showtimes, newShowtime]);
            }
            setIsModalOpen(false);
            setSelectedShowtime(null);
        } catch (err) {
            setError('Failed to save showtime');
            console.error(err);
        }
    };

    const columns = [
        {
            header: 'Movie',
            accessor: 'movie',
            render: (movie) => movie.title
        },
        {
            header: 'Studio',
            accessor: 'studio',
            render: (studio) => studio.name
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            header: 'Start Time',
            accessor: 'startTime',
            render: (time) => new Date(time).toLocaleTimeString()
        },
        {
            header: 'End Time',
            accessor: 'endTime',
            render: (time) => new Date(time).toLocaleTimeString()
        },
        {
            header: 'Price',
            accessor: 'price',
            render: (price) => `Rp ${price.toLocaleString()}`
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'active' ? 'bg-green-100 text-green-800' :
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
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Delete
                    </button>
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
                    <h1 className="text-2xl font-bold">Manage Showtimes</h1>
                    <Button
                        onClick={() => {
                            setSelectedShowtime(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Add Showtime
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <DataTable
                    columns={columns}
                    data={showtimes}
                    searchable
                    className="bg-white rounded-lg shadow"
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedShowtime(null);
                    }}
                    title={selectedShowtime ? 'Edit Showtime' : 'Add Showtime'}
                >
                    <ShowtimeForm
                        onSubmit={handleSubmit}
                        initialData={selectedShowtime}
                        movies={movies}
                        studios={studios}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default AdminShowtimes; 