import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import BookingForm from '../../components/admin/BookingForm';
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import showtimeService from '../../services/showtimeService';

const BookingFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [users, setUsers] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch users and showtimes
                const [usersData, showtimesResponse] = await Promise.all([
                    userService.getAllUsers(),
                    showtimeService.getAllShowtimes()
                ]);
                
                setUsers(usersData || []);
                
                // Handle showtimes response structure
                const showtimesData = showtimesResponse?.data || showtimesResponse || [];
                setShowtimes(showtimesData);

                // If editing, fetch booking data
                if (id) {
                    const bookingData = await bookingService.getBookingById(id);
                    setBooking(bookingData);
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
                // Update existing booking
                await bookingService.updateBooking(id, formData);
                alert(`Booking "${formData.booking_code}" has been updated successfully.`);
            } else {
                // Create new booking
                await bookingService.createBooking(formData);
                alert(`Booking "${formData.booking_code}" has been created successfully.`);
            }
            // Redirect back to bookings list
            navigate('/admin/bookings');
        } catch (err) {
            console.error('Error saving booking:', err);
            setError('Failed to save booking data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/bookings');
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white-800">
                                {id ? 'Edit Booking' : 'Add New Booking'}
                            </h1>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Back to Bookings
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
                                <BookingForm 
                                    initialData={booking} 
                                    users={users}
                                    showtimes={showtimes}
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

export default BookingFormPage;
