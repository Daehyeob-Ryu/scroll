
import { ChevronRight, ChevronLeft, ArrowDown, ChevronsUpDown } from 'lucide-react';
import Tag from './Tag';


const DataTable = ({ data, onRowClick, currentPage, totalPages, onPageChange }) => {
    if (data.length === 0) {
        return (
            <div style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '3rem', opacity: 0.2 }}>🔍</div>
                <p>No results found matching your criteria.</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Try adjusting your search or filters.</p>
            </div>
        );
    }

    // Pagination helper to show window of pages
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '1000px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-surface)', zIndex: 1 }}>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                                <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Org <ChevronsUpDown size={14} style={{ color: 'var(--text-secondary)' }} />
                                </div>
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Category <ChevronsUpDown size={14} style={{ color: 'var(--text-secondary)' }} />
                                </div>
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Code Display <ArrowDown size={14} style={{ color: 'var(--primary)' }} />
                                </div>
                            </th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem' }}>Concept Name</th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem' }}>Vocab</th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem' }}>Count</th>
                            <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.75rem' }}>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick(row)}
                                style={{
                                    borderBottom: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.1s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <input type="checkbox" style={{ accentColor: 'var(--primary)' }} onClick={(e) => e.stopPropagation()} />
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>{row.org}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>{row.category}</td>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: 'var(--primary)' }}>{row.code_display}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>{row.concept_name}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>{row.vocab}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>{row.count}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                        {row.tags && row.tags.slice(0, 2).map(tag => <Tag key={tag} label={tag} />)}
                                        {row.tags && row.tags.length > 2 && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>+{row.tags.length - 2}</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)'
            }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Showing {(currentPage - 1) * 50 + 1} to {Math.min(currentPage * 50, (currentPage - 1) * 50 + data.length)} results
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            disabled={page === '...'}
                            style={{
                                minWidth: '32px',
                                height: '32px',
                                padding: '0 0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: page === currentPage ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                background: page === currentPage ? 'rgba(96, 122, 251, 0.1)' : 'transparent',
                                color: page === currentPage ? 'var(--primary)' : 'var(--text-primary)',
                                fontWeight: page === currentPage ? 600 : 400,
                                cursor: page === '...' ? 'default' : 'pointer'
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
