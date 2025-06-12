import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../../components/admin/AdminNavigation';
import DataTable from '../../components/admin/DataTable';
import userService from '../../services/userService';

const AdminUsersSimple = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersData = await userService.getAllUsers();
            setUsers(usersData || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setUsers([]);
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

    const handleDelete = async (user) => {
        if (window.confirm(`Are you sure you want to delete user "${user.full_name}"?`)) {
            try {
                await userService.deleteUser(user.user_id);
                fetchUsers(); // Refresh list
                alert(`User "${user.full_name}" deleted successfully.`);
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user.');
            }
        }
    };

    const columns = [
        { key: 'user_id', label: 'ID', accessor: 'user_id' },
        { key: 'username', label: 'Username', accessor: 'username' },
        { key: 'full_name', label: 'Full Name', accessor: 'full_name' },
        { key: 'email', label: 'Email', accessor: 'email' },
        { key: 'role', label: 'Role', accessor: 'role' },
        {
            key: 'actions',
            label: 'Actions',
            render: (value, item) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                    >
                        Delete
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
                        <h1 className="text-3xl font-bold text-white-800">Users Management</h1>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            Add New User
                        </button>
                    </div>

                    <div className=" rounded-lg shadow-lg">
                        <DataTable
                            data={users}
                            columns={columns}
                            loading={loading}
                            emptyMessage="No users found"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersSimple;
