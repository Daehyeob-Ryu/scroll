

import { X } from 'lucide-react';

const Tag = ({ label, onRemove, removable }) => {
    const getColors = (label) => {
        // Simple hash for consistent colors
        const colors = [
            { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' }, // Blue
            { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },  // Green
            { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },  // Red
            { bg: 'rgba(234, 179, 8, 0.2)', text: '#facc15' },  // Yellow
            { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' }, // Purple
            { bg: 'rgba(236, 72, 153, 0.2)', text: '#f472b6' }, // Pink
        ];
        let hash = 0;
        for (let i = 0; i < label.length; i++) {
            hash = label.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const { bg, text } = getColors(label);

    return (
        <span style={{
            backgroundColor: bg,
            color: text,
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '0.35rem',
            marginBottom: '0.25rem',
            lineHeight: 1,
            gap: '0.5rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
            {label}
            {removable && (
                <button
                    onClick={onRemove}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'currentColor',
                        opacity: 0.8,
                        borderRadius: '50%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.opacity = 1;
                        e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.opacity = 0.8;
                        e.target.style.backgroundColor = 'transparent';
                    }}
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
            )}
        </span>
    );
};

export default Tag;
