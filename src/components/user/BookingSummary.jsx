import React from 'react';

const BookingSummary = ({
    movie,
    showtime,
    selectedSeats,
    pricePerSeat,
    onConfirm,
    onCancel,
    className = '',
}) => {
    const totalPrice = selectedSeats.length * pricePerSeat;

    const formatDateTime = (date, time) => {
        const dateTime = new Date(`${date}T${time}`);
        return dateTime.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
            <h2 className="text-xl font-semibold text-white mb-4">Booking Summary</h2>

            {/* Movie Details */}
            <div className="flex space-x-4 mb-6">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                />
                <div>
                    <h3 className="text-lg font-medium text-white">{movie.title}</h3>
                    <p className="text-gray-400">{movie.genre}</p>
                    <p className="text-gray-400">{movie.duration} minutes</p>
                </div>
            </div>

            {/* Showtime Details */}
            <div className="space-y-4 mb-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-400">Date & Time</h4>
                    <p className="text-white">
                        {formatDateTime(showtime.date, showtime.startTime)}
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-400">Studio</h4>
                    <p className="text-white">{showtime.studioName}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-400">Selected Seats</h4>
                    <p className="text-white">
                        {selectedSeats.map(seat => {
                            const [row, seatNum] = seat.split('-');
                            return `${String.fromCharCode(65 + parseInt(row))}${parseInt(seatNum) + 1}`;
                        }).join(', ')}
                    </p>
                </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Price per seat</span>
                    <span className="text-white">Rp {pricePerSeat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Number of seats</span>
                    <span className="text-white">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-indigo-400">Rp {totalPrice.toLocaleString()}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default BookingSummary;
