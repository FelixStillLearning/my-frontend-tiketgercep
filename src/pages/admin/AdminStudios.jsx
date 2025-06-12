import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import studioService from '../../services/studioService';

const AdminStudios = () => {
    const navigate = useNavigate();
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudios = async () => {
        setLoading(true);
        try {
            const data = await studioService.getAll();
            console.log('Studios data received:', data);
            
            if (Array.isArray(data)) {
                setStudios(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setStudios(data.data);
            } else {
                console.warn('Data is not an array:', data);
                setStudios([]);
            }
        } catch (err) {
            console.error('Error fetching studios:', err);
            setStudios([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudios();
    }, []);    const columns = [
        { key: 'name', label: 'Studio Name', accessor: 'name' },
        { key: 'capacity', label: 'Capacity', accessor: 'capacity' },
        { key: 'rows', label: 'Rows', accessor: 'rows' },
        { key: 'seats_per_row', label: 'Seats per Row', accessor: 'seats_per_row' },
        {
            key: 'status',
            label: 'Status',
            accessor: 'status',
            render: (status, item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'active' ? 'bg-green-500/20 text-green-500' :
                    status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-500/20 text-gray-500'
                }`}>
                    {status && typeof status === 'string' 
                        ? status.charAt(0).toUpperCase() + status.slice(1) 
                        : status || 'Unknown'
                    }
                </span>
            ),
        }
    ];

    const handleEdit = (studio) => {
        // Navigate to edit studio page with studio ID
        navigate(`/admin/studios/edit/${studio.studio_id || studio.id}`);
    };

    const handleDelete = async (studio) => {
        if (!window.confirm(`Are you sure you want to delete "${studio.name}"?`)) {
            return;
        }
        
        try {
            await studioService.delete(studio.studio_id || studio.id);
            // Refresh studios list after delete
            fetchStudios();
            alert(`Studio "${studio.name}" has been deleted successfully.`);
        } catch (err) {
            console.error('Error deleting studio:', err);
            alert('Failed to delete studio. Please try again.');
        }
    };

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white-800">Studios Management</h1>
                            <button
                                onClick={() => navigate('/admin/studios/add')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Add Studio</span>
                            </button>
                        </div>

                        {/* Studios Table */}
                        <DataTable
                            columns={columns}
                            data={studios}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            searchable={true}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStudios;
