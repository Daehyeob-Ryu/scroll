import { supabase } from '../lib/supabase';

/**
 * Supabase에서 활성 레코드 가져오기 (전체 데이터)
 */
export const loadRecords = async () => {
    try {
        let allRecords = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;

        console.log('Starting to load records from Supabase...');

        // 페이지네이션으로 전체 데이터 가져오기
        while (hasMore) {
            const { data, error } = await supabase
                .from('records')
                .select('*')
                .eq('is_active', true)
                .order('code_display')
                .range(from, from + pageSize - 1);

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            if (data && data.length > 0) {
                allRecords = [...allRecords, ...data];
                console.log(`Loaded ${allRecords.length} records so far...`);
                from += pageSize;
                hasMore = data.length === pageSize;
            } else {
                hasMore = false;
            }
        }

        console.log(`✅ Total loaded records: ${allRecords.length}`);

        // 데이터 형식 변환 (기존 앱 형식과 호환)
        return allRecords.map(record => ({
            id: record.id,
            code_id: record.code_id,
            code_display: record.code_display,
            concept_id: record.concept_id,
            concept_name: record.concept_name,
            org: record.org,
            category: record.category,
            vocab: record.vocab,
            count: record.count,
            tags: [] // 태그는 DetailView에서 별도로 로드
        }));
    } catch (error) {
        console.error('Error loading records:', error);
        return [];
    }
};

/**
 * 필터 옵션 가져오기 (org, category, vocab의 고유 값)
 */
export const getFilterOptions = async () => {
    try {
        const { data, error } = await supabase
            .from('records')
            .select('org, category, vocab')
            .eq('is_active', true);

        if (error) throw error;

        // 고유 값 추출
        const orgs = [...new Set(data.map(r => r.org))].sort();
        const categories = [...new Set(data.map(r => r.category))].sort();
        const vocabs = [...new Set(data.map(r => r.vocab))].sort();

        return {
            org: orgs,
            category: categories,
            vocab: vocabs
        };
    } catch (error) {
        console.error('Error loading filter options:', error);
        return {
            org: [],
            category: [],
            vocab: []
        };
    }
};

/**
 * 검색 (클라이언트 사이드 필터링)
 */
export const searchRecords = async (query, filters = {}) => {
    try {
        let queryBuilder = supabase
            .from('records')
            .select('*')
            .eq('is_active', true);

        // 필터 적용
        if (filters.org && filters.org.length > 0) {
            queryBuilder = queryBuilder.in('org', filters.org);
        }

        if (filters.category && filters.category.length > 0) {
            queryBuilder = queryBuilder.in('category', filters.category);
        }

        if (filters.vocab && filters.vocab.length > 0) {
            queryBuilder = queryBuilder.in('vocab', filters.vocab);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

        // 데이터 형식 변환
        let results = data.map(record => ({
            id: record.id,
            code_id: record.code_id,
            code_display: record.code_display,
            concept_id: record.concept_id,
            concept_name: record.concept_name,
            org: record.org,
            category: record.category,
            vocab: record.vocab,
            count: record.count,
            tags: []
        }));

        // 검색어가 있으면 클라이언트 사이드 필터링
        if (query && query.trim()) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(record =>
                record.code_display?.toLowerCase().includes(lowerQuery) ||
                record.concept_name?.toLowerCase().includes(lowerQuery) ||
                record.code_id?.toLowerCase().includes(lowerQuery)
            );
        }

        return results;
    } catch (error) {
        console.error('Error searching records:', error);
        return [];
    }
};
