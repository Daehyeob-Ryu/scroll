

const Tag = ({ label }) => {
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
            padding: '0.25rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '0.35rem',
            marginBottom: '0.25rem',
            lineHeight: 1
        }}>
            {label}
        </span>
    );
};

export default Tag;
