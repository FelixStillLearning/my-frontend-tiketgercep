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
    }, []);

    const columns = [
        { key: 'name', label: 'Studio Name' },
        { key: 'capacity', label: 'Capacity' },
        { key: 'rows', label: 'Rows' },
        { key: 'seats_per_row', label: 'Seats per Row' },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'active' ? 'bg-green-500/20 text-green-500' :
                    item.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-500/20 text-gray-500'
                }`}>
                    {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : ''}
                </span>
            ),
        },
        {
            key: 'facilities',
            label: 'Facilities',
            render: (item) => (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(item.facilities) && item.facilities.length > 0 ? item.facilities.map((facility, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs"
                        >
                            {facility}
                        </span>
                    )) : (
                        <span className="text-gray-400 text-xs">No facilities</span>
                    )}
                </div>
            )
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
                            <h1 className="text-3xl font-bold text-gray-800">Studios Management</h1>
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
