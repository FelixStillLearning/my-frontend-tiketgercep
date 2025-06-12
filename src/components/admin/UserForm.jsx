import React, { useState, useEffect } from 'react';

const UserForm = ({
    initialData = null,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'user',
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.username || '',
                email: initialData.email || '',
                password: '', // Don't pre-fill password for security
                full_name: initialData.full_name || '',
                phone: initialData.phone || '',
                role: initialData.role || 'user',
            });
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
        
        // For edit mode, only include password if it's not empty
        const submitData = { ...formData };
        if (initialData && !submitData.password) {
            delete submitData.password;
        }
        
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Username *
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Password {!initialData && '*'}
                        {initialData && (
                            <span className="text-gray-500 text-xs ml-1">(leave empty to keep current)</span>
                        )}
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!initialData}
                            placeholder={initialData ? "Enter new password (optional)" : "Enter password"}
                            minLength="6"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number (e.g., 08123456789)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Role *
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {initialData ? 'Update User' : 'Add User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
