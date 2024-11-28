export const transformMap = (flatMap: string): string[][] => {
    const lines = flatMap.split(/\r?\n/);
    if (lines[0] === '') {
        lines.shift();
    }
    const result = lines.map((line) => line.split(''));
    const numCols = Math.max(...lines.map((line) => line.length));
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < numCols; j++) {
            if (result[i]?.[j] === undefined) {
                result[i][j] = ' ';
            }
        }
    }
    return result;
};
