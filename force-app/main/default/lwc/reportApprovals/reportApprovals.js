import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDataController.getAccounts';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Name', fieldName: 'Name', sortable: "true" },
    { label: 'Phone', fieldName: 'Phone', sortable: "true" },
    { label: 'Type', fieldName: 'Type', sortable: "true" },
    { label: 'Rating', fieldName: 'Rating', sortable: "true" },
    { label: 'Industry', fieldName: 'Industry', sortable: "true" },
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
    },
    {
        type: "button", label: 'Edit', initialWidth: 100, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconPosition: 'left',
            iconName:'utility:edit',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Delete', initialWidth: 110, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'destructive'
        }
    }
];

export default class ButtonsInLWC extends NavigationMixin(LightningElement) {
    @track data;
    @track wireResult;
    @track error;
    columns = columns;

    @wire(getAccounts)
    wiredAccounts(result) {
        this.wireResult = result;
        if (result.data) {
            this.data = result.data;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    callRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(recId, 'edit');
        } else if (actionName === 'Delete') {
            this.handleDeleteRow(recId);
        } else if (actionName === 'View') {
            this.handleAction(recId, 'view');
        }
    }

    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: mode
            }
        })
    }

    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
            .then(result => {
                this.showToast('Success!!', 'Record deleted successfully!!', 'success', 'dismissable');
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
            });
    }

    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
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
}  