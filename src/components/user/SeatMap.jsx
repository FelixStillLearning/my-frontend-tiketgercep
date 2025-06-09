import React, { useState } from 'react';

const SeatMap = ({
    rows = 8,
    seatsPerRow = 10,
    bookedSeats = [],
    onSeatSelect,
    className = '',
}) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatClick = (row, seat) => {
        const seatId = `${row}-${seat}`;
        const isBooked = bookedSeats.includes(seatId);
        
        if (isBooked) return;

        setSelectedSeats(prev => {
            const newSelected = prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId];
            
            onSeatSelect(newSelected);
            return newSelected;
        });
    };

    const getSeatStatus = (row, seat) => {
        const seatId = `${row}-${seat}`;
        if (bookedSeats.includes(seatId)) return 'booked';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    const renderSeat = (row, seat) => {
        const status = getSeatStatus(row, seat);
        const seatId = `${row}-${seat}`;

        const statusClasses = {
            available: 'bg-gray-700 hover:bg-gray-600 cursor-pointer',
            selected: 'bg-indigo-600 cursor-pointer',
            booked: 'bg-red-600 cursor-not-allowed',
        };

        return (
            <button
                key={seatId}
                onClick={() => handleSeatClick(row, seat)}
                disabled={status === 'booked'}
                className={`
                    w-8 h-8 rounded-t-lg m-1
                    ${statusClasses[status]}
                    transition-colors
                `}
                title={`Seat ${String.fromCharCode(65 + row)}${seat + 1}`}
            />
        );
    };

    return (
        <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
            {/* Screen */}
            <div className="w-full h-16 bg-gray-700 rounded-lg mb-8 flex items-center justify-center">
                <span className="text-gray-400">Screen</span>
            </div>

            {/* Seats */}
            <div className="flex flex-col items-center">
                {Array.from({ length: rows }, (_, row) => (
                    <div key={row} className="flex">
                        {Array.from({ length: seatsPerRow }, (_, seat) => renderSeat(row, seat))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center space-x-6">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-700 rounded-t-lg mr-2" />
                    <span className="text-gray-400">Available</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-indigo-600 rounded-t-lg mr-2" />
                    <span className="text-gray-400">Selected</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded-t-lg mr-2" />
                    <span className="text-gray-400">Booked</span>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
