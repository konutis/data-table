import './styles/table.css';

export default class Table {
    constructor(rootElem, config) {
        this.rootElem = rootElem;
        const defaultConfig = {
            width: 250
        };
        this.config = Object.assign(defaultConfig, config);
    }

    init(data) {
        this.columns = data.columns;
        this.rows = data.rows;

        if (this.columns) {
            this.buildHeader();

            if (this.rows) {
                this.buildBody();
            }
        } else {
            console.error('No columns defined!');
        }
    }

    buildHeader() {
        const headerElement = document.createElement('div');
        headerElement.className = 'table-header';

        const rowControlElement = document.createElement('div');
        rowControlElement.className = 'table-cell table-cell--controls';
        headerElement.append(rowControlElement);

        this.columns.forEach((headerCol) => {
            this.buildCell(headerElement, {html: headerCol.title}, headerCol)
        });

        this.rootElem.append(headerElement);
    }

    buildBody() {
        this.bodyElement = document.createElement('div');
        this.bodyElement.className = 'table-body';

        this.rows.forEach((row) => {
            this.addRow(row);
        });

        this.rootElem.append(this.bodyElement);
    }

    addRow(rowSettings, addRowPos) {
        const rowElement = document.createElement('div');
        rowElement.className = 'table-row';
        rowElement.id = `row-${rowSettings.id}`;

        this.createRowControls(rowElement, rowSettings);

        this.columns.forEach((headerCol) => {
            this.buildCell(rowElement, {html: rowSettings[headerCol.field]}, headerCol)
        });

        if (addRowPos === 'top') {
            this.bodyElement.prepend(rowElement);
        } else {
            this.bodyElement.append(rowElement);
        }
    }

    buildCell(rowElement, cellSettings, columnSettings) {
        const cellElement = document.createElement('div');
        cellElement.className = 'table-cell';
        cellElement.innerHTML = cellSettings.html;

        cellElement.style.width = `${columnSettings.width || this.config.width}px`;

        rowElement.append(cellElement);
    }

    createRowControls(rowElement, rowSettings) {
        // Row control wrapper
        const rowControlElement = document.createElement('div');
        rowControlElement.className = 'table-cell table-cell--controls';

        // Edit control
        const editButton = document.createElement('button');
        editButton.innerText = 'E';
        editButton.type = 'button';
        editButton.className = 'row-control row-control--edit';
        editButton.addEventListener('click', this.config.onEditClick.bind(this, rowSettings));
        rowControlElement.append(editButton);

        // Remove control
        const removeButton = document.createElement('button');
        removeButton.innerText = 'R';
        removeButton.type = 'button';
        removeButton.className = 'row-control row-control--remove';
        removeButton.addEventListener('click', this.config.onRemoveClick.bind(this, rowSettings));
        rowControlElement.append(removeButton);

        rowElement.append(rowControlElement);
    }

    removeRow(id) {
        const rowToDelete = this.bodyElement.querySelector(`#row-${id}`);
        rowToDelete.parentNode.removeChild(rowToDelete);
    }

    editRow(rowData) {
        const rowToEdit = this.bodyElement.querySelector(`#row-${rowData.id}`);
        const existingCells = rowToEdit.querySelectorAll('.table-cell:not(.table-cell--controls)');
        [].slice.call(existingCells).forEach((cell) => {
            cell.parentNode.removeChild(cell);
        });
        this.columns.forEach((column) => {
            this.buildCell(rowToEdit, {html: rowData[column.field]}, column)
        });
    }
}