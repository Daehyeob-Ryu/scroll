import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Tag from './Tag';
import { addTag, removeTag, getTags, subscribeToTags } from '../utils/tagManager';

const DetailView = ({ item, onClose }) => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!item) return;

        // 초기 태그 로드
        loadTags();

        // 실시간 구독 시작
        const unsubscribe = subscribeToTags(item.id, (payload) => {
            // 실시간 업데이트 처리
            loadTags();
        });

        return () => {
            unsubscribe();
        };
    }, [item]);

    const loadTags = async () => {
        try {
            const fetchedTags = await getTags(item.id);
            setTags(fetchedTags);
        } catch (err) {
            console.error('Error loading tags:', err);
        }
    };

    if (!item) return null;

    const handleAddTag = async (e) => {
        e.preventDefault();
        if (!newTag.trim()) return;

        const tagText = newTag.trim();

        // Optimistic UI update: 즉시 UI에 추가
        const tempTag = {
            id: `temp-${Date.now()}`,
            tag_text: tagText,
            record_id: item.id,
            created_at: new Date().toISOString()
        };
        setTags(prevTags => [tempTag, ...prevTags]);
        setNewTag('');

        try {
            setLoading(true);
            setError(null);
            const savedTag = await addTag(item.id, tagText);
            // 임시 태그를 실제 태그로 교체
            setTags(prevTags =>
                prevTags.map(t => t.id === tempTag.id ? savedTag : t)
            );
        } catch (err) {
            // 에러 시 롤백
            setTags(prevTags => prevTags.filter(t => t.id !== tempTag.id));
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTag = async (tagId) => {
        // Optimistic UI update: 즉시 UI에서 제거
        const tagToRemove = tags.find(t => t.id === tagId);
        setTags(prevTags => prevTags.filter(t => t.id !== tagId));

        try {
            setLoading(true);
            setError(null);
            await removeTag(tagId);
        } catch (err) {
            // 에러 시 롤백
            if (tagToRemove) {
                setTags(prevTags => [...prevTags, tagToRemove]);
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                            {error && (
                                <div style={{
                                    padding: '0.5rem',
                                    backgroundColor: '#fee',
                                    color: '#c00',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    {error}
                                </div>
                            )}
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {tags.map(tag => (
                                        <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Tag label={tag.tag_text} />
                                            <button
                                                onClick={() => handleRemoveTag(tag.id)}
                                                disabled={loading}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    opacity: loading ? 0.5 : 1
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
                                        disabled={loading}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-background)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            opacity: loading ? 0.5 : 1
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: loading ? 0.5 : 1
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
