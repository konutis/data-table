const fs = require('fs');

const createId = () => {
    let uuid = '';

    for (let i = 0; i < 8; i++) {
        const random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }

    return uuid;
};

function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.id === id);
        if (!row) {
            reject({
                message: 'ID is invalid',
                status: 404
            });
        }
        resolve(row);
    })
}

function writeJSONFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.error(err);
        }
    })
}

module.exports = {
    createId,
    mustBeInArray,
    writeJSONFile
};