import { parseCSV } from './csvParser';
import { getTags } from './tagManager';

export const loadData = async () => {
    try {
        const response = await fetch('/data/source.csv');
        const text = await response.text();
        const data = parseCSV(text);

        // Merge with tags from localStorage
        return data.map(record => ({
            ...record,
            tags: getTags(record.id)
        }));
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
};

