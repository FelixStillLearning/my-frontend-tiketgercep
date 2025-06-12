// src/components/admin/DataTable.jsx
import React, { useState, useMemo } from 'react';

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    onSort,
    searchable = true,
    className = '',
    loading = false,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredData = useMemo(() => {
        let filtered = [...data];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Search */}
            {searchable && (
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto bg-gray-700 rounded-lg">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-4 text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {sortConfig.key === column.key && (
                                            <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-indigo-400`}></i>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {paginatedData.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-600 transition-colors">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                                                >
                                                    <i className="fas fa-edit mr-1"></i>
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                                                >
                                                    <i className="fas fa-trash mr-1"></i>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {paginatedData.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No data found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded-md transition-colors ${
                                            currentPage === page
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                            if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="text-gray-400">...</span>;
                            }
                            return null;
                        })}
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}        </div>
    );
};

export default DataTable;
