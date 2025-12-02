import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, tags = [], onRemoveTag }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onSearch(inputValue.trim());
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onRemoveTag(tags[tags.length - 1]);
        }
    };

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            transition: 'border-color 0.2s',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            tabIndex={-1} // Allow focus handling on container
        >
            {/* Row 1: Tags */}
            {tags.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    padding: '0.5rem 0.5rem 0 0.5rem'
                }}>
                    {tags.map(tag => (
                        <div key={tag} style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-primary)'
                        }}>
                            <span>{tag}</span>
                            <button
                                onClick={() => onRemoveTag(tag)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: '6px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Row 2: Input */}
            <div style={{ position: 'relative', width: '100%' }}>
                <Search size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                }} />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? "Search by keyword, ID, or category... (Press Enter to add tag)" : "Add another keyword..."}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default SearchBar;
