import { LightningElement, track, wire } from 'lwc';
import fetchContacts from '@salesforce/apex/ContactDataController.fetchContacts';

export default class DatatableWithPagination extends LightningElement {
    
    // JS Properties 
    @track isModalOpen = false;
    @track objectName = 'Contact';
    @track recordId;
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    records = []; //All records available in the data table
    columns = []; //columns information available in the data table
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page

    get bDisableFirst() {
        return this.pageNumber == 1;
    }

    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }

    // connectedCallback method called when the element is inserted into a document
    connectedCallback() {
        // set datatable columns info
        this.columns =[
            { label: 'Name', fieldName: 'Name', sortable: "true" },
            { label: 'Phone', fieldName: 'Phone', sortable: "true" },
            { label: 'Title', fieldName: 'Title', sortable: "true" },
            { label: 'Email', fieldName: 'Email', sortable: "true" },

            {
                type: "button", label: 'View', initialWidth: 100, typeAttributes: {
                    label: 'View',
                    name: 'View',
                    title: 'View',
                    disabled: false,
                    value: 'view',
                    iconPosition: 'left',
                    iconName:'utility:preview',
                    variant:'Brand'
                }
            }
        ];


        // fetch contact records from apex method 
        fetchContacts()
            .then((result) => {
                if (result != null) {
                    console.log('RESULT--> ' + JSON.stringify(result));
                    this.records = result;
                    this.totalRecords = result.length; // update total records count                 
                    this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
                    this.paginationHelper(); // call helper menthod to update pagination logic 
                }
            })
            .catch((error) => {
                console.log('error while fetch contacts--> ' + JSON.stringify(error));
            });
    }

     // ON ROW ACTION BUTTON --- VIEW
     openModal(event) {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        this.recordId = event.detail.row.Id;
        console.log('test id---'+JSON.stringify(this.recordId));     
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    // PAGINATION
    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }

    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }

    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }

    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }

    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }

    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }

    // SORTING LOGIC
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }
    
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.records));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.records = parseData;
        this.totalRecords = parseData.length; // update total records count                 
        this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
        this.paginationHelper(); // call helper menthod to update pagination logic
        console.log('After sorting ----',this.records);
    } 

    handleClick(event){
       this.recordId = event.currentTarget.dataset.id;
       console.log('@@  recordId----'+recordId);
    }
}