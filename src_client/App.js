import Table from './Table';
import './styles/main.css';
import './styles/modal.css';
import './styles/form.css';

const defaultUrl = 'http://localhost:8000';

class App {
    constructor() {
        this.columnData = [];
        this.rowData = [];

        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        const tableRootElement = document.querySelector('#table');
        this.tableInstance = new Table(tableRootElement, {
            onEditClick: this.handleEditClick,
            onRemoveClick: this.handleRemoveClick
        });

        this.init();
    }

    init() {
        // Get data and init Table
        window.fetch(`${defaultUrl}/columns`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            return result.json();
        }).then((result) => {
            this.columnData = result;
            return window.fetch(`${defaultUrl}/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }).then((result) => {
            return result.json();
        }).then((result) => {
            this.rowData = result;
            this.tableInstance.init({
                rows: this.rowData,
                columns: this.columnData
            });
            if (this.columnData) {
                this.initModal();
            }
        });
    }

    initModal() {
        const addButton = document.querySelector('#add-entry');
        this.modal = document.querySelector('.modal');
        this.modalForm = document.querySelector('.form');
        const formFieldWrapper = document.querySelector('.form-fields-container');

        this.columnData.forEach((column) => {
            const fieldHtml = `<div class="form-field">
                <label for="${column.field}-input" class="form-field-label">${column.title}</label>
                <input type="text" id="${column.field}-input" class="form-field-input">
            </div>`;
            formFieldWrapper.insertAdjacentHTML('beforeend', fieldHtml);
        });

        this.closeModalButton = document.querySelector('#close-modal');
        addButton.addEventListener('click', this.handleAddClick);

        // Open active row from hash
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace('#', '');
            const activeRow = this.rowData.find(row => row.id === id);
            if (activeRow) {
                this.handleEditClick(activeRow);
            }
        }
    }

    openModal(requestData, rowData) {
        // Set form field values if edit button clicked
        if (rowData) {
            this.columnData.forEach((column) => {
                const field = this.modalForm.querySelector(`#${column.field}-input`);
                field.value = rowData[column.field];
            });
        }
        this.requestData = requestData;
        this.modal.classList.add('modal--visible');
        this.modalForm.addEventListener('submit', this.handleFormSubmit);
        this.closeModalButton.addEventListener('click', this.handleModalClose);
    }

    handleModalClose() {
        this.requestData = null;
        this.modal.classList.remove('modal--visible');
        this.modalForm.removeEventListener('submit', this.handleFormSubmit);
        this.closeModalButton.removeEventListener('click', this.handleModalClose);
        const fieldsList = [].slice.call(this.modalForm.querySelectorAll('.form-field-input'));
        window.location.hash = '';
        fieldsList.forEach((field) => {
            field.value = '';
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const formData = {};
        // Get new values from fields
        this.columnData.forEach((column) => {
            const field = this.modalForm.querySelector(`#${column.field}-input`);
            formData[column.field] = field.value;
        });

        window.fetch(this.requestData.url, {
            method: this.requestData.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then((result) => {
            return result.json();
        }).then((result) => {
            if (result && result.content) {
                this.requestData.callback(result.content);
                console.info(result.message);
                this.handleModalClose();
            } else {
                console.error(result.message);
            }
        });
    }

    handleAddClick() {
        const formSubmitCallback = (data) => {
            this.tableInstance.addRow(data);
        };
        const requestData = {
            url: `${defaultUrl}/posts`,
            method: 'POST',
            callback: formSubmitCallback
        };
        this.openModal(requestData, null);
    }

    handleEditClick(rowData) {
        const formSubmitCallback = (data) => {
            this.tableInstance.editRow(data);
        };
        const requestData = {
            url: `${defaultUrl}/posts/${rowData.id}`,
            method: 'PUT',
            callback: formSubmitCallback
        };
        window.location.hash = rowData.id;
        this.openModal(requestData, rowData);
    }

    handleRemoveClick(rowData) {
        window.fetch(`${defaultUrl}/posts/${rowData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            return result.json();
        }).then((result) => {
            if (result && result.content && result.content.id) {
                this.tableInstance.removeRow(result.content.id);
                console.info(result.message);
            } else {
                console.error(result.message);
            }
        });
    }
}

new App();
