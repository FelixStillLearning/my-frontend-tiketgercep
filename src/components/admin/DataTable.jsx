// src/components/admin/DataTable.jsx
// TODO: Implement admin data table component

import React, { useState, useMemo } from 'react';

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    onSort,
    searchable = true,
    className = '',
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
        if (onSort) {
            onSort(key, direction);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={`data-table-container card ${className}`}>
            {searchable && (
                <div className="data-table-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-input"
                    />
                </div>
            )}

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead className="data-table-thead">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className="data-table-th"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="data-table-sortable-header">
                                        <span>{column.label}</span>
                                        {sortConfig.key === column.key && (
                                            <span>
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th scope="col" className="data-table-th data-table-actions-th">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="data-table-tbody">
                        {paginatedData.map((item, index) => (
                            <tr key={index} className="data-table-tr">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="data-table-td"
                                    >
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="data-table-td data-table-actions-td">
                                        <div className="data-table-actions-group">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="btn-link btn-link-primary"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="btn-link btn-link-danger"
                                                >
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
            </div>

            {totalPages > 1 && (
                <div className="data-table-pagination">
                    <div className="data-table-pagination-info">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
                    </div>
                    <div className="data-table-pagination-controls">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-secondary btn-sm data-table-pagination-button"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`btn btn-secondary btn-sm data-table-pagination-button ${
                                    currentPage === page ? 'active' : ''
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn btn-secondary btn-sm data-table-pagination-button"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
