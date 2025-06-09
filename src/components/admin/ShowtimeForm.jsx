import React, { useState, useEffect } from 'react';

const ShowtimeForm = ({
    initialData = null,
    movies = [],
    studios = [],
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        movieId: '',
        studioId: '',
        date: '',
        startTime: '',
        endTime: '',
        price: '',
        status: 'scheduled',
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
        <form onSubmit={handleSubmit} className="form-group-spacing">
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">
                        Movie
                    </label>
                    <select
                        name="movieId"
                        value={formData.movieId}
                        onChange={handleChange}
                        required
                        className="form-input"
                    >
                        <option value="">Select a movie</option>
                        {movies.map(movie => (
                            <option key={movie.id} value={movie.id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Studio
                    </label>
                    <select
                        name="studioId"
                        value={formData.studioId}
                        onChange={handleChange}
                        required
                        className="form-input"
                    >
                        <option value="">Select a studio</option>
                        {studios.map(studio => (
                            <option key={studio.id} value={studio.id}>
                                {studio.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Start Time
                    </label>
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        End Time
                    </label>
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="form-input"
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {initialData ? 'Update Showtime' : 'Add Showtime'}
                </button>
            </div>
        </form>
    );
};

export default ShowtimeForm;
