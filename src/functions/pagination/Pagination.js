module.exports = {
    PaginateContent: require("./index"),
    splitArrayIntoChunksOfLen,
};

function splitArrayIntoChunksOfLen(arr, len) {
    const chunks = [];
    const n = arr.length;
    let i = 0;

    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
}
