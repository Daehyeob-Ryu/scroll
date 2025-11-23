
const STORAGE_KEY = 'data_explorer_tags';

export const getTags = (recordId) => {
    try {
        const allTags = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return allTags[recordId] || [];
    } catch (e) {
        console.error('Error reading tags from localStorage', e);
        return [];
    }
};

export const addTag = (recordId, tag) => {
    try {
        const allTags = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const recordTags = allTags[recordId] || [];
        if (!recordTags.includes(tag)) {
            allTags[recordId] = [...recordTags, tag];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allTags));
        }
        return allTags[recordId];
    } catch (e) {
        console.error('Error adding tag to localStorage', e);
        return [];
    }
};

export const removeTag = (recordId, tag) => {
    try {
        const allTags = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const recordTags = allTags[recordId] || [];
        allTags[recordId] = recordTags.filter(t => t !== tag);
        if (allTags[recordId].length === 0) {
            delete allTags[recordId];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTags));
        return allTags[recordId] || [];
    } catch (e) {
        console.error('Error removing tag from localStorage', e);
        return [];
    }
};
