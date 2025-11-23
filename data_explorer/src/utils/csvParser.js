
export const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Handle quoted values (e.g. "Glucose, fasting")
        const row = [];
        let inQuotes = false;
        let currentValue = '';

        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        row.push(currentValue.trim());

        if (row.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index].replace(/^"|"$/g, ''); // Remove surrounding quotes if present
            });

            // Generate a unique ID based on content
            // Using a simple hash of org + code_id + code_display + count to ensure stability
            const uniqueString = `${obj.org}-${obj.code_id}-${obj.code_display}-${obj.count}`;
            obj.id = btoa(unescape(encodeURIComponent(uniqueString)));

            result.push(obj);
        }
    }
    return result;
};
