import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Tag from './Tag';
import { addTag, removeTag, getTags } from '../utils/tagManager';

const DetailView = ({ item, onClose }) => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (item) {
            setTags(getTags(item.id));
        }
    }, [item]);

    if (!item) return null;

    const handleAddTag = (e) => {
        e.preventDefault();
        if (newTag.trim()) {
            const updatedTags = addTag(item.id, newTag.trim());
            setTags(updatedTags);
            setNewTag('');
            item.tags = updatedTags;
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = removeTag(item.id, tagToRemove);
        setTags(updatedTags);
        item.tags = updatedTags;
    };

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 40,
                    transition: 'opacity 0.3s ease-in-out'
                }}
            />
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
                transform: item ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{item.code_display}</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>ID: {item.code_id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Details Section */}
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Details</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '1rem'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Organization</span>
                                    <span style={{ fontSize: '0.875rem' }}>{item.org}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category</span>
                                    <span style={{ fontSize: '0.875rem' }}>{item.category}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vocabulary</span>
                                    <span style={{ fontSize: '0.875rem' }}>{item.vocab}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Count</span>
                                    <span style={{ fontSize: '0.875rem' }}>{item.count}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Concept Name</span>
                                    <span style={{ fontSize: '0.875rem' }}>{item.concept_name}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Concept ID</span>
                                    <span style={{ fontSize: '0.875rem' }}>{item.concept_id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tags</h3>
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {tags.map(tag => (
                                        <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Tag label={tag} />
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddTag} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add a tag..."
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-background)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}>
                        Export
                    </button>
                    <button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}>
                        View Full Report
                    </button>
                </div>
            </div>
        </>
    );
};

export default DetailView;
