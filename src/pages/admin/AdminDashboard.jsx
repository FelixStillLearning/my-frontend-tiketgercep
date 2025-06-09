import React from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import AdminCard from '../../components/admin/AdminCard';
import DataTable from '../../components/admin/DataTable';

const AdminDashboard = () => {
    // Mock data for demonstration
    const stats = [
        {
            title: 'Total Movies',
            value: '24',
            icon: 'movie',
            color: 'blue',
            trend: 'up',
            trendValue: '12%',
        },
        {
            title: 'Total Bookings',
            value: '1,234',
            icon: 'ticket',
            color: 'green',
            trend: 'up',
            trendValue: '8%',
        },
        {
            title: 'Total Revenue',
            value: 'Rp 45.2M',
            icon: 'money',
            color: 'purple',
            trend: 'up',
            trendValue: '15%',
        },
        {
            title: 'Active Users',
            value: '892',
            icon: 'users',
            color: 'orange',
            trend: 'down',
            trendValue: '3%',
        },
    ];

    const recentBookings = [
        {
            id: 1,
            movie: 'The Dark Knight',
            customer: 'John Doe',
            seats: 'A1, A2',
            amount: 'Rp 80,000',
            status: 'completed',
            date: '2024-03-15',
        },
        {
            id: 2,
            movie: 'Inception',
            customer: 'Jane Smith',
            seats: 'B3, B4',
            amount: 'Rp 80,000',
            status: 'pending',
            date: '2024-03-15',
        },
        // Add more mock data as needed
    ];

    const bookingColumns = [
        { key: 'movie', label: 'Movie' },
        { key: 'customer', label: 'Customer' },
        { key: 'seats', label: 'Seats' },
        { key: 'amount', label: 'Amount' },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            ),
        },
        { key: 'date', label: 'Date' },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                <AdminNavigation />

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <AdminCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                color={stat.color}
                                trend={stat.trend}
                                trendValue={stat.trendValue}
                            />
                        ))}
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
                        <DataTable
                            columns={bookingColumns}
                            data={recentBookings}
                            searchable={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
