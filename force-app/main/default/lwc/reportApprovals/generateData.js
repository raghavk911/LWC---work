export default function generateData({ amountOfRecords }) {
    return [...Array(amountOfRecords)].map((_, index) => {
        return {
            name: `(${index}) Name`,
            fullname : `First (${index}) Last (${index}) Name`,
            account : `Account (${index})`,
            priority : `High`,
            review : `Pending`,
            website: 'www.salesforce.com',
            amount: Math.floor(Math.random() * 100),
            phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            closeAt: new Date(
                Date.now() + 86400000 * Math.ceil(Math.random() * 20)
            ),
        };
    });
}


{ label: 'ACTION', fieldName: 'name', sortable: "true"},
{ label: 'SERVICE DATE THRU', fieldName: 'closeAt', type: 'date', sortable: "true" },
{ label: 'CASE REPORT / EMPLOYEE NAME', fieldName: 'fullname', sortable: "true" },
{ label: 'ACCOUNT', fieldName: 'account', sortable: "true" },
{ label: 'PRIORITY', fieldName: 'priority', sortable: "true"},
{ label: 'IN REVIEW', fieldName: 'review', sortable: "true"},
{ label: 'MOST RECENT APPROVER', fieldName: 'fullname', sortable: "true" },
{ label: 'CASE REPORT / OPPORTUNITY RECORD TYPE', fieldName: 'name', sortable: "true" },