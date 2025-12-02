import { useState, useEffect, useMemo } from 'react'
import './index.css'
import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import DataTable from './components/DataTable'
import DetailView from './components/DetailView'
import { loadRecords, searchRecords, getFilterOptions } from './utils/dataLoader'
import { supabase } from './lib/supabase'
import { ChevronLeft, ChevronRight, Settings, Bell, X } from 'lucide-react'
import Tag from './components/Tag'

function App() {
    const [data, setData] = useState([])
    const [searchKeywords, setSearchKeywords] = useState([])
    const [filters, setFilters] = useState({
        org: [],
        category: [],
        vocab: []
    })
    const [selectedItem, setSelectedItem] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 50

    // 데이터 로드
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const loadedData = await loadRecords()
            setData(loadedData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Extract unique values for filters (클라이언트 사이드)
    const filterOptions = useMemo(() => ({
        org: [...new Set(data.map(item => item.org))].sort(),
        category: [...new Set(data.map(item => item.category))].sort(),
        vocab: [...new Set(data.map(item => item.vocab))].sort()
    }), [data])

    // Filter logic
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Search filter
            const matchesSearch = searchKeywords.length === 0 || searchKeywords.every(keyword => {
                const lowerKeyword = keyword.toLowerCase();
                return (
                    (item.code_display && item.code_display.toLowerCase().includes(lowerKeyword)) ||
                    (item.concept_name && item.concept_name.toLowerCase().includes(lowerKeyword)) ||
                    (item.code_id && item.code_id.toLowerCase().includes(lowerKeyword)) ||
                    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
                );
            });

            // Org filter
            const matchesOrg = filters.org.length === 0 || filters.org.includes(item.org);

            // Category filter
            const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);

            // Vocab filter
            const matchesVocab = filters.vocab.length === 0 || filters.vocab.includes(item.vocab);

            return matchesSearch && matchesOrg && matchesCategory && matchesVocab;
        });
    }, [data, searchKeywords, filters]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeywords, filters]);

    const handleAddKeyword = (keyword) => {
        if (keyword && !searchKeywords.includes(keyword)) {
            setSearchKeywords([...searchKeywords, keyword]);
        }
    };

    const handleRemoveKeyword = (keywordToRemove) => {
        setSearchKeywords(searchKeywords.filter(k => k !== keywordToRemove));
    };

    // 로딩 중
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: 'var(--bg-background)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--bg-background)'
        }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-color)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--primary)', display: 'flex' }}>
                        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>DataExplorer</h1>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>
                    <div style={{ width: '100%', maxWidth: '600px' }}>
                        <SearchBar
                            onSearch={handleAddKeyword}
                            tags={searchKeywords}
                            onRemoveTag={handleRemoveKeyword}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <Settings size={24} />
                    </button>
                    <button style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <Bell size={24} />
                    </button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e0e0', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASzyzStHAxTAJ-Bi1wGxaJxyMbBgB1WXn2Zw4P5so0YuaK2TsOm7vvMlYeYrOG69Kvhs-d9z6b_GoHjlG4-EfJ80DHvWqbDDY8eq5VaL7HhvvclCpYbKoTgubqPGHAX67OkFgCLgu2O9QUy2PMsHRfpwNBMoYrQxuj4BEO4b8LFBeQmuOyF4N_65sgug5ZwG6ZCjBYQuPxl2bNEPN0LHmOp5PdVb9rqar9vnIZa2C1XZFqqsmnbJ-Em9ItFwOVltWt8D2VL2bT0w")', backgroundSize: 'cover' }}></div>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <aside style={{
                    width: '280px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1rem',
                    overflowY: 'auto'
                }}>
                    <FilterPanel
                        filters={filters}
                        onFilterChange={setFilters}
                        options={filterOptions}
                    />
                </aside>

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    overflowY: 'auto',
                    backgroundColor: 'var(--bg-background)'
                }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '32px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1, marginRight: '1rem' }}>
                            {/* Tags are now displayed in the SearchBar */}
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
                            Showing {filteredData.length.toLocaleString()} Results
                        </h2>
                    </div>

                    <div style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        <DataTable
                            data={paginatedData}
                            onRowClick={setSelectedItem}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </main>
            </div>

            <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    )
}

export default App
