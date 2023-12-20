
export const tsvToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split("\t");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    return csvRows.map(i => {
        const values = i.split("\t");
        return csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
        }, {});
    });
};

export default tsvToArray;
