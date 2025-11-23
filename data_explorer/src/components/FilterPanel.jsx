
import { ChevronDown, Filter } from 'lucide-react';

const FilterGroup = ({ title, options, selected, onChange }) => (
    <details className="group" open style={{ borderTop: '1px solid var(--border-color)' }}>
        <summary style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            cursor: 'pointer',
            listStyle: 'none'
        }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
            <ChevronDown size={16} style={{ color: 'var(--text-secondary)', transition: 'transform 0.2s' }} className="group-open:rotate-180" />
        </summary>
        <div style={{ paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
            {options.map(option => (
                <label key={option} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}>
                    <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => onChange(option)}
                        style={{
                            accentColor: 'var(--primary)',
                            width: '1rem',
                            height: '1rem',
                            borderRadius: '0.25rem',
                            border: '1px solid var(--border-color)'
                        }}
                    />
                    {option}
                </label>
            ))}
        </div>
    </details>
);

const FilterPanel = ({ filters, onFilterChange, options }) => {
    const handleFilterChange = (key, value) => {
        const currentValues = filters[key] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        onFilterChange({ ...filters, [key]: newValues });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', marginBottom: '1rem' }}>
                <Filter size={20} style={{ color: 'var(--primary)' }} />
                <div>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Filter Results</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Refine your search</p>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <FilterGroup
                    title="Organization"
                    options={options.org || []}
                    selected={filters.org || []}
                    onChange={(val) => handleFilterChange('org', val)}
                />

                <FilterGroup
                    title="Category"
                    options={options.category || []}
                    selected={filters.category || []}
                    onChange={(val) => handleFilterChange('category', val)}
                />

                <FilterGroup
                    title="Vocabulary"
                    options={options.vocab || []}
                    selected={filters.vocab || []}
                    onChange={(val) => handleFilterChange('vocab', val)}
                />
            </div>

            <button
                onClick={() => onFilterChange({ org: [], category: [], vocab: [] })}
                style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                }}
            >
                Clear All Filters
            </button>
        </div>
    );
};

export default FilterPanel;
