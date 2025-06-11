import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const DataTable = ({ title, columns, data, loading, onAdd, onEdit, onDelete, currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {

    /**
     * Helper function untuk membuat rentang nomor
     */
    const range = (from, to) => {
        let i = from;
        const range = [];
        while (i <= to) {
            range.push(i);
            i++;
        }
        return range;
    };

    /**
     * Fungsi untuk menghasilkan nomor halaman yang akan ditampilkan,
     * lengkap dengan elipsis (...) jika terlalu banyak halaman.
     */
    const renderPaginationLinks = () => {
        const totalNumbers = 5; // Jumlah nomor halaman yang ingin ditampilkan + 2 elipsis
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            let pages = range(startPage, endPage);

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = ["...", ...extraPages, ...pages];
                    break;
                }
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, "..."];
                    break;
                }
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = ["...", ...pages, "..."];
                    break;
                }
            }
            pages = [1, ...pages, totalPages];

            return pages.map((page, index) => {
                if (page === "...") {
                    return <li key={index}><span className="pagination-ellipsis">&hellip;</span></li>;
                }
                return (
                    <li key={index}>
                        <button className={`pagination-link ${currentPage === page ? 'is-current has-background-danger' : 'has-background-dark has-text-white'}`} onClick={() => onPageChange(page)}>{page}</button>
                    </li>
                );
            });
        }

        return range(1, totalPages).map((page, index) => (
            <li key={index}>
                <button className={`pagination-link ${currentPage === page ? 'is-current has-background-danger' : 'has-background-dark has-text-white'}`} onClick={() => onPageChange(page)}>{page}</button>
            </li>
        ));
    };
    
    const firstItemIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="box has-background-dark">
            {/* Header Tabel */}
            <div className="level is-mobile mb-4">
                <div className="level-left">
                    <p className="title is-4 has-text-white">{title}</p>
                </div>
                <div className="level-right">
                    {onAdd && (
                        <button onClick={onAdd} className="button is-danger">
                            <span className="icon"><FontAwesomeIcon icon={faPlus} /></span>
                            <span>Add New</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Kontainer Tabel */}
            <div className="table-container">
                <table className="table is-fullwidth has-background-dark has-text-light">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="has-text-light" style={{borderBottomColor: '#4a4a4a'}}>{col.header}</th>
                            ))}
                            {(onEdit || onDelete) && <th className="has-text-light" style={{borderBottomColor: '#4a4a4a'}}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={columns.length + 1} className="has-text-centered py-6"><button className="button is-large is-danger is-loading">Loading</button></td></tr>
                        ) : data.length > 0 ? (
                            data.map((item, itemIndex) => (
                                <tr key={item.user_id || item.booking_id || item.showtime_id || item.studio_id || item.movie_id || item.id || itemIndex}>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="is-vcentered">{col.cell ? col.cell(item[col.accessor], item) : item[col.accessor]}</td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="is-vcentered">
                                            {onEdit && <button className="button is-small is-info is-outlined mr-2" onClick={() => onEdit(item.user_id || item.booking_id || item.showtime_id || item.studio_id || item.movie_id || item.id)} title="Edit"><FontAwesomeIcon icon={faEdit} /></button>}
                                            {onDelete && <button className="button is-small is-danger is-outlined" onClick={() => onDelete(item.user_id || item.booking_id || item.showtime_id || item.studio_id || item.movie_id || item.id)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={columns.length + 1} className="has-text-centered py-5">No data available.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Tabel dengan Info dan Pagination (STRUKTUR STANDAR BULMA) */}
            <div className="level is-mobile mt-4">
                <div className="level-left">
                     <p className="is-size-7 has-text-grey-light">
                        Showing {firstItemIndex} to {lastItemIndex} of {totalItems} results
                    </p>
                </div>
                <div className="level-right">
                    <nav className="pagination is-small" role="navigation" aria-label="pagination">
                        <button className="pagination-previous" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <button className="pagination-next" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                            Next page
                        </button>
                        <ul className="pagination-list">
                            {renderPaginationLinks()}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default DataTable;