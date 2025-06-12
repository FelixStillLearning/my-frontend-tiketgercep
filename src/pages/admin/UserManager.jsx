import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import UserForm from '../../components/admin/UserForm';
import FormWrapper from '../../components/common/FormWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import userService from '../../services/userService';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Table columns configuration
    const columns = [
        { key: 'user_id', label: 'ID' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'full_name', label: 'Full Name' },
        { key: 'phone', label: 'Phone' },
        { 
            key: 'role', 
            label: 'Role',
            render: (value) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                    value === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {value}
                </span>
            )
        },
    ];

    // Mock data - replace with actual API calls
    useEffect(() => {
        fetchUsers();
    }, []);    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAll();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to mock data if API fails
            const mockUsers = [
                {
                    user_id: 1,
                    username: 'admin',
                    email: 'admin@example.com',
                    full_name: 'Admin User',
                    phone: '08123456789',
                    role: 'admin'
                },
                {
                    user_id: 2,
                    username: 'user1',
                    email: 'user1@example.com',
                    full_name: 'John Doe',
                    phone: '08987654321',
                    role: 'user'
                }
            ];
            setUsers(mockUsers);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setShowForm(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteDialog(true);
    };    const handleFormSubmit = async (formData) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.user_id, formData);
                console.log('User updated successfully');
            } else {
                await userService.create(formData);
                console.log('User created successfully');
            }
            
            setShowForm(false);
            setEditingUser(null);
            await fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user. Please try again.');
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    const confirmDelete = async () => {
        try {
            await userService.delete(userToDelete.user_id);
            console.log('User deleted successfully');
            
            setShowDeleteDialog(false);
            setUserToDelete(null);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        }
    };

    const actions = [
        {
            label: 'Edit',
            onClick: handleEditUser,
            className: 'text-blue-600 hover:text-blue-900'
        },
        {
            label: 'Delete',
            onClick: handleDeleteUser,
            className: 'text-red-600 hover:text-red-900'
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                <button
                    onClick={handleAddUser}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add New User
                </button>
            </div>

            <DataTable
                data={users}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyMessage="No users found"
            />

            <FormWrapper
                title={editingUser ? 'Edit User' : 'Add New User'}
                isOpen={showForm}
                onClose={handleFormCancel}
            >
                <UserForm
                    initialData={editingUser}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            </FormWrapper>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${userToDelete?.full_name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default UserManager;
