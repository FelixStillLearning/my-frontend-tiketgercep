import React, { useState, useEffect } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import StudioForm from '../../components/admin/StudioForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import studioService from '../../services/studioService';

const AdminStudios = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudio, setSelectedStudio] = useState(null);
    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudios();
    }, []);

    const fetchStudios = async () => {
        try {
            setLoading(true);
            const data = await studioService.getAll();
            setStudios(data);
        } catch (err) {
            setError('Failed to load studios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (studio) => {
        setSelectedStudio(studio);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this studio?')) {
            try {
                await studioService.delete(id);
                setStudios(studios.filter(studio => studio.id !== id));
            } catch (err) {
                setError('Failed to delete studio');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedStudio) {
                await studioService.update(selectedStudio.id, formData);
                setStudios(studios.map(studio => 
                    studio.id === selectedStudio.id ? { ...studio, ...formData } : studio
                ));
            } else {
                const newStudio = await studioService.create(formData);
                setStudios([...studios, newStudio]);
            }
            setIsModalOpen(false);
            setSelectedStudio(null);
        } catch (err) {
            setError('Failed to save studio');
            console.error(err);
        }
    };

    const columns = [
        {
            header: 'Name',
            accessor: 'name'
        },
        {
            header: 'Capacity',
            accessor: 'capacity'
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'active' ? 'bg-green-100 text-green-800' :
                    status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            )
        },
        {
            header: 'Facilities',
            accessor: 'facilities',
            render: (facilities) => (
                <div className="flex flex-wrap gap-1">
                    {facilities.map((facility, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                            {facility}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (_, row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];    if (loading) {
        return (
            <div className="admin-layout">
                <AdminNavigation />
                <div className="admin-main-content">
                    <div className="p-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading studios...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Manage Studios</h1>
                        <Button
                            onClick={() => {
                                setSelectedStudio(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Studio
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={studios}
                            searchable
                        />
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedStudio(null);
                        }}
                        title={selectedStudio ? 'Edit Studio' : 'Add Studio'}
                    >
                        <StudioForm
                            onSubmit={handleSubmit}
                            initialData={selectedStudio}
                        />
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default AdminStudios; 