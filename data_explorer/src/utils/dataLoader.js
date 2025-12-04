import { supabase } from '../lib/supabase';

/**
 * 모든 태그를 record_id별로 그룹화하여 가져오기
 */
export const loadAllTags = async () => {
    try {
        const { data, error } = await supabase
            .from('tags')
            .select('record_id, tag_text');

        if (error) throw error;

        // record_id별로 태그 텍스트 그룹화
        return (data || []).reduce((acc, tag) => {
            if (!acc[tag.record_id]) acc[tag.record_id] = [];
            acc[tag.record_id].push(tag.tag_text);
            return acc;
        }, {});
    } catch (error) {
        console.error('Error loading tags:', error);
        return {};
    }
};

/**
 * Supabase에서 활성 레코드 가져오기 (전체 데이터 + 태그)
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

        // 모든 태그 로드
        console.log('Loading tags...');
        const recordTags = await loadAllTags();
        console.log(`✅ Tags loaded for ${Object.keys(recordTags).length} records`);

        // 데이터 형식 변환 (태그 포함)
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
            tags: recordTags[record.id] || []
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
