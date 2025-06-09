import React, { useState, useEffect } from 'react';

const MovieForm = ({
    initialData = null,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        genre: '',
        releaseDate: '',
        posterUrl: '',
        status: 'upcoming',
        rating: '',
        director: '',
        cast: '',
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
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Genre
                    </label>
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Release Date
                    </label>
                    <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Director
                    </label>
                    <input
                        type="text"
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Cast
                    </label>
                    <input
                        type="text"
                        name="cast"
                        value={formData.cast}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Rating
                    </label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        max="5"
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
                        <option value="upcoming">Upcoming</option>
                        <option value="now_playing">Now Playing</option>
                        <option value="ended">Ended</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="form-input"
                ></textarea>
            </div>

            <div className="form-group">
                <label className="form-label">
                    Poster URL
                </label>
                <input
                    type="url"
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
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
                    {initialData ? 'Update Movie' : 'Add Movie'}
                </button>
            </div>
        </form>
    );
};

export default MovieForm;
