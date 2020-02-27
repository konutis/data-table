const columns = require('../data/columns.json');

function getColumns() {
    return new Promise((resolve) => {
        resolve(columns);
    })
}

module.exports = {
    getColumns
};