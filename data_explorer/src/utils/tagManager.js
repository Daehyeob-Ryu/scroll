import { supabase } from '../lib/supabase';

/**
 * 특정 레코드의 태그 가져오기
 */
export const getTags = async (recordId) => {
    try {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('record_id', recordId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching tags:', error);
        return [];
    }
};

/**
 * 태그 추가 (익명 사용자 허용)
 */
export const addTag = async (recordId, tagText) => {
    try {
        const { data, error } = await supabase
            .from('tags')
            .insert({
                record_id: recordId,
                tag_text: tagText.trim(),
                created_by: null // 익명 사용자 허용
            })
            .select()
            .single();

        if (error) {
            // 중복 태그 처리
            if (error.code === '23505') {
                throw new Error('Tag already exists');
            }
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error adding tag:', error);
        throw error;
    }
};

/**
 * 태그 삭제
 */
export const removeTag = async (tagId) => {
    try {
        const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', tagId);

        if (error) throw error;
    } catch (error) {
        console.error('Error removing tag:', error);
        throw error;
    }
};

/**
 * 실시간 태그 구독
 */
export const subscribeToTags = (recordId, callback) => {
    const channel = supabase
        .channel(`tags:${recordId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'tags',
                filter: `record_id=eq.${recordId}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .subscribe();

    // 구독 해제 함수 반환
    return () => {
        supabase.removeChannel(channel);
    };
};

/**
 * 전체 태그 변경 구독 (검색 결과 실시간 갱신용)
 */
export const subscribeToAllTags = (callback) => {
    const channel = supabase
        .channel('all-tags-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'tags'
            },
            (payload) => {
                callback(payload);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
