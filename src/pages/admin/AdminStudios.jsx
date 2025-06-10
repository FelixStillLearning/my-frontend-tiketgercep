import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Gunakan axios langsung karena studioService mungkin tidak sesuai

const AdminStudios = () => {
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudios();
    }, []);

    const fetchStudios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/studios');
            console.log('Studio data:', response.data); // Debug
            setStudios(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch studios');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this studio?')) {
            try {
                await axios.delete(`http://localhost:5000/api/studios/${id}`);
                fetchStudios(); // Refresh list
            } catch (err) {
                setError('Failed to delete studio');
            }
        }
    };

    if (loading) {
        return (
            <div className="container mt-6">
                <div className="has-text-centered">
                    <p className="is-size-4">Loading studios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-6">
                <div className="notification is-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-6">
            <h1 className="title is-2">Manage Studios</h1>
            
            {/* Tombol Add New Studio */}
            <Link to="/admin/studios/create" className="button is-success mb-4">
                Add New Studio
            </Link>
            
            <div className="table-container">
                <table className="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Studio Name</th>
                            <th>Total Seats</th>
                            <th>Layout</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studios.map((studio, index) => (
                            <tr key={studio.studio_id}>
                                <td>{index + 1}</td>
                                <td>
                                    <strong>{studio.studio_name || 'N/A'}</strong>
                                </td>
                                <td>
                                    <span className="tag is-info">
                                        {studio.total_seats || 0} seats
                                    </span>
                                </td>
                                <td>
                                    {studio.rows && studio.seats_per_row ? (
                                        <span className="has-text-grey">
                                            {studio.rows} rows × {studio.seats_per_row} seats
                                        </span>
                                    ) : (
                                        <span className="has-text-grey">No layout info</span>
                                    )}
                                </td>
                                <td>
                                    {studio.created_at ? 
                                        new Date(studio.created_at).toLocaleDateString('id-ID') : 
                                        'N/A'
                                    }
                                </td>
                                <td>
                                    <div className="buttons">
                                        <Link 
                                            to={`/admin/studios/edit/${studio.studio_id}`}
                                            className="button is-small is-info"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            className="button is-small is-danger"
                                            onClick={() => handleDelete(studio.studio_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {studios.length === 0 && (
                <div className="notification is-info">
                    No studios found. <Link to="/admin/studios/create">Create your first studio</Link>
                </div>
            )}
        </div>
    );
};

export default AdminStudios;