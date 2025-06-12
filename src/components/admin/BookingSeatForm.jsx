import React, { useState, useEffect } from 'react';

const BookingSeatForm = ({
    initialData = null,
    bookings = [],
    seats = [],
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        booking_id: '',
        seat_id: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Booking
                    </label>
                    <select
                        name="booking_id"
                        value={formData.booking_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select a booking</option>
                        {bookings.map(booking => (
                            <option key={booking.booking_id} value={booking.booking_id}>
                                {booking.booking_code} - {booking.User?.full_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Seat
                    </label>
                    <select
                        name="seat_id"
                        value={formData.seat_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select a seat</option>                        {seats.map(seat => (
                            <option key={seat.seat_id} value={seat.seat_id}>
                                {seat.seat_label} - {seat.Studio?.studio_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Booking Seat Information
                        </h3>
                        <p className="mt-1 text-sm text-blue-700">
                            This form links a booking to specific seats. Make sure the seat belongs to the same studio as the showtime in the booking.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {initialData ? 'Update Booking Seat' : 'Add Booking Seat'}
                </button>
            </div>
        </form>
    );
};

export default BookingSeatForm;
