import React, { useState, useEffect } from 'react';

const StudioForm = ({
    initialData = null,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        description: '',
        status: 'active',
        facilities: '',
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
                        Studio Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Capacity
                    </label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
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
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Facilities
                    </label>
                    <input
                        type="text"
                        name="facilities"
                        value={formData.facilities}
                        onChange={handleChange}
                        placeholder="e.g., Dolby Atmos, 3D, IMAX"
                        className="form-input"
                    />
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
                    {initialData ? 'Update Studio' : 'Add Studio'}
                </button>
            </div>
        </form>
    );
};

export default StudioForm;
