import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import userService from '../../services/userService';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersData = await userService.getAllUsers();
            setUsers(usersData || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = () => {
        navigate('/admin/users/add');
    };

    const handleEdit = (user) => {
        navigate(`/admin/users/edit/${user.user_id}`);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await userService.deleteUser(userToDelete.user_id);
                setUsers(users.filter(user => user.user_id !== userToDelete.user_id));
                alert(`User "${userToDelete.full_name}" has been deleted successfully.`);
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user. Please try again.');
            }
        }
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const columns = [
        {
            key: 'user_id',
            label: 'ID',
            accessor: 'user_id'
        },
        {
            key: 'username',
            label: 'Username',
            accessor: 'username'
        },
        {
            key: 'full_name',
            label: 'Full Name',
            accessor: 'full_name'
        },
        {
            key: 'email',
            label: 'Email',
            accessor: 'email'
        },
        {
            key: 'phone',
            label: 'Phone',
            accessor: 'phone'
        },
        {
            key: 'role',
            label: 'Role',
            accessor: 'role',
            render: (value, item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Created',
            accessor: 'createdAt',
            render: (value, item) => {
                if (!value) return '-';
                return new Date(value).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value, item) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        title="Edit User"
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        onClick={() => handleDeleteClick(item)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        title="Delete User"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white-800">Users Management</h1>
                            <p className="text-gray-600 mt-2">Manage system users and their roles</p>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Add New User</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-lg">
                        <DataTable
                            data={users}
                            columns={columns}
                            loading={loading}
                            emptyMessage="No users found"
                        />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal 
                isOpen={showDeleteModal} 
                onClose={handleDeleteCancel}
                title="Confirm Delete"
            >
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete user "{userToDelete?.full_name}"? 
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleDeleteCancel}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;
