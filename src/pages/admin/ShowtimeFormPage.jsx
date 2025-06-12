import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import ShowtimeForm from '../../components/admin/ShowtimeForm';
import showtimeService from '../../services/showtimeServiceNew';
import movieService from '../../services/MovieService';
import studioService from '../../services/studioService';

const ShowtimeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showtime, setShowtime] = useState(null);
    const [movies, setMovies] = useState([]);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch movies and studios data
                const [moviesData, studiosData] = await Promise.all([
                    movieService.getAll(),
                    studioService.getAll()
                ]);                setMovies(moviesData.data || []);
                setStudios(studiosData.data || studiosData || []);

                // If editing, fetch showtime data
                if (id) {
                    console.log('Fetching showtime with ID:', id);
                    const response = await showtimeService.getShowtimeById(id);
                    console.log('Showtime data received:', response);
                    if (response) {
                        // Format the data for the form
                        const formattedShowtime = {
                            movie_id: response.movie_id,
                            studio_id: response.studio_id,
                            show_date: response.show_date,
                            show_time: response.show_time,
                            ticket_price: response.ticket_price
                        };
                        setShowtime(formattedShowtime);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            if (id) {
                // Update existing showtime
                await showtimeService.updateShowtime(id, formData);
                alert('Showtime has been updated successfully.');
            } else {
                // Create new showtime
                await showtimeService.createShowtime(formData);
                alert('Showtime has been added successfully.');
            }
            // Redirect back to showtimes list
            navigate('/admin/showtimes');
        } catch (err) {
            console.error('Error saving showtime:', err);
            setError('Failed to save showtime data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/showtimes');
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white-800">
                                {id ? 'Edit Showtime' : 'Add New Showtime'}
                            </h1>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Back to Showtimes
                            </button>
                        </div>

                        {loading && <p className="text-center py-8">Loading...</p>}
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {error}</span>
                            </div>
                        )}

                        {(!loading || id === undefined) && (
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <ShowtimeForm 
                                    initialData={showtime}
                                    movies={movies}
                                    studios={studios}
                                    onSubmit={handleSubmit} 
                                    onCancel={handleCancel}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowtimeFormPage;
