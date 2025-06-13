import React from 'react';

const SeatMap = ({
    studioSeats = [], // New prop: actual seat data from database
    bookedSeats = [],
    onSeatSelect,
    selectedSeats = [],
    className = '',
}) => {
    
    const handleSeatClick = (seatRow, seatNumber) => {
        const seatId = `${seatRow}-${seatNumber}`;
        const isBooked = bookedSeats.includes(seatId);
        
        if (isBooked) return;

        const newSelected = selectedSeats.includes(seatId)
            ? selectedSeats.filter(id => id !== seatId)
            : [...selectedSeats, seatId];
        
        onSeatSelect(newSelected);
    };

    const getSeatStatus = (seatRow, seatNumber) => {
        const seatId = `${seatRow}-${seatNumber}`;
        if (bookedSeats.includes(seatId)) return 'booked';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    // Group seats by row
    const seatsByRow = studioSeats.reduce((acc, seat) => {
        if (!acc[seat.seat_row]) {
            acc[seat.seat_row] = [];
        }
        acc[seat.seat_row].push(seat);
        return acc;
    }, {});

    // Sort rows alphabetically and seats by number
    const sortedRows = Object.keys(seatsByRow).sort();
    Object.keys(seatsByRow).forEach(row => {
        seatsByRow[row].sort((a, b) => a.seat_number - b.seat_number);
    });

    const renderSeat = (seat) => {
        const status = getSeatStatus(seat.seat_row, seat.seat_number);
        const seatId = `${seat.seat_row}-${seat.seat_number}`;

        const statusClasses = {
            available: 'bg-gray-700 hover:bg-gray-600 cursor-pointer',
            selected: 'bg-indigo-600 cursor-pointer',
            booked: 'bg-red-600 cursor-not-allowed',
        };

        return (
            <button
                key={seatId}
                onClick={() => handleSeatClick(seat.seat_row, seat.seat_number)}
                disabled={status === 'booked'}
                className={`
                    w-8 h-8 rounded-t-lg m-1
                    ${statusClasses[status]}
                    transition-colors text-xs text-white font-bold
                `}
                title={`Seat ${seat.seat_label}`}
            >
                {seat.seat_number}
            </button>
        );
    };

    if (studioSeats.length === 0) {
        return (
            <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
                <div className="text-center text-gray-400">
                    No seats available for this studio.
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
            {/* Screen */}
            <div className="w-full h-16 bg-gray-700 rounded-lg mb-8 flex items-center justify-center">
                <span className="text-gray-400">Screen</span>
            </div>

            {/* Seats */}
            <div className="flex flex-col items-center">
                {sortedRows.map(row => (
                    <div key={row} className="flex items-center mb-2">
                        {/* Row label */}
                        <div className="w-8 text-center text-gray-400 font-bold mr-4">
                            {row}
                        </div>
                        {/* Seats in this row */}
                        <div className="flex">
                            {seatsByRow[row].map(seat => renderSeat(seat))}
                        </div>
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
