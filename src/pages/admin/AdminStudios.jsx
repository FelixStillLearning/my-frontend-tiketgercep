import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/admin/DataTable';

const AdminStudios = () => {
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudios();
    }, []);

    const fetchStudios = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/studios');
            console.log('Studio data:', response.data);
            setStudios(response.data);
        } catch (error) {
            console.error('Error fetching studios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (studioId) => {
        navigate(`/admin/studios/edit/${studioId}`);
    };

    const handleDelete = async (studioId) => {
        if (window.confirm('Are you sure you want to delete this studio?')) {
            try {
                await axios.delete(`http://localhost:5000/api/studios/${studioId}`);
                fetchStudios(); // Refresh data
            } catch (error) {
                console.error('Error deleting studio:', error);
                alert('Failed to delete studio');
            }
        }
    };

    // ✅ DEFINISI KOLOM TABEL
    const columns = [
        { header: 'Studio Name', accessor: 'studio_name' },
        { 
            header: 'Total Seats', 
            accessor: 'total_seats',
            cell: (seats) => <span className="tag is-info">{seats} seats</span>
        },
        { 
            header: 'Layout', 
            accessor: 'rows',
            cell: (rows, item) => (
                item.rows && item.seats_per_row ? (
                    <span className="has-text-grey-light">
                        {item.rows} rows × {item.seats_per_row} seats
                    </span>
                ) : (
                    <span className="has-text-grey">No layout info</span>
                )
            )
        },
        { 
            header: 'Created', 
            accessor: 'created_at',
            cell: (date) => date ? new Date(date).toLocaleDateString('id-ID') : 'N/A'
        }
    ];

    return (
        <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
            <div className="container">
                <div className="mb-6">
                    <DataTable 
                        title="Studio Management"
                        columns={columns}
                        data={studios}
                        loading={loading}
                        onAdd={() => navigate('/admin/studios/create')}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </section>
    );
};

export default AdminStudios;