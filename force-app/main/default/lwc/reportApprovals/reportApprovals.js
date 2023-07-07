import { LightningElement } from 'lwc';
import generateData from './generateData';

const columns = [
    { label: 'ACTION', fieldName: 'name', sortable: "true"},
    { label: 'SERVICE DATE THRU', fieldName: 'closeAt', type: 'date', sortable: "true" },
    { label: 'CASE REPORT / EMPLOYEE NAME', fieldName: 'fullname', sortable: "true" },
    { label: 'ACCOUNT', fieldName: 'account', sortable: "true" },
    { label: 'PRIORITY', fieldName: 'priority', sortable: "true"},
    { label: 'IN REVIEW', fieldName: 'review', sortable: "true"},
    { label: 'MOST RECENT APPROVER', fieldName: 'fullname', sortable: "true" },
    { label: 'CASE REPORT / OPPORTUNITY RECORD TYPE', fieldName: 'name', sortable: "true" },
];

export default class ReportApprovals extends LightningElement {
    data = [];
    columns = columns;
   

    connectedCallback() {
        const data = generateData({ amountOfRecords: 9 });
        this.data = data;
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }
    
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.data));
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
        this.data = parseData;
    } 

//------------------------------------------------------//
    get bDisableFirst() {
        return this.pageNumber == 1;
    }

    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }

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


//???????????????????????//
    
}
