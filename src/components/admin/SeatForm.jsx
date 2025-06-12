import React, { useState, useEffect } from 'react';

const SeatForm = ({
    initialData = null,
    studios = [],
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        studio_id: '',
        seat_row: '',
        seat_number: '',
        seat_label: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-generate seat_label when seat_row or seat_number changes
        if (name === 'seat_row' || name === 'seat_number') {
            const newFormData = { ...formData, [name]: value };
            if (newFormData.seat_row && newFormData.seat_number) {
                newFormData.seat_label = `${newFormData.seat_row}${newFormData.seat_number}`;
            }
            setFormData(newFormData);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
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
                        Studio
                    </label>
                    <select
                        name="studio_id"
                        value={formData.studio_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select a studio</option>                        {studios.map(studio => (
                            <option key={studio.studio_id} value={studio.studio_id}>
                                {studio.studio_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Seat Row
                    </label>
                    <input
                        type="text"
                        name="seat_row"
                        value={formData.seat_row}
                        onChange={handleChange}
                        required
                        maxLength="1"
                        placeholder="A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Seat Number
                    </label>
                    <input
                        type="number"
                        name="seat_number"
                        value={formData.seat_number}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Seat Label
                    </label>
                    <input
                        type="text"
                        name="seat_label"
                        value={formData.seat_label}
                        onChange={handleChange}
                        required
                        placeholder="A1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        readOnly
                    />
                    <p className="text-xs text-gray-500">
                        Auto-generated from row and number
                    </p>
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
                    {initialData ? 'Update Seat' : 'Add Seat'}
                </button>
            </div>
        </form>
    );
};

export default SeatForm;
