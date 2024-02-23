
export const tsvToArray = (tsv) => {
    const lines = tsv.split('\n');
    const headers = lines[0].split('\t').map(d => d.replace(/\s/g, ''));
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split('\t');
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }
        if (obj[headers[0]]) result.push(obj);
    }
    return result;
};

export default tsvToArray;
