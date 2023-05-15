import { LightningElement } from 'lwc';

export default class AutoCompleteCombobox extends LightningElement {

    statusOptions = [
      { value: 'new', label: 'New', description: 'A new item' },
      {
          value: 'in-progress',
          label: 'In Progress',
          description: 'Currently working on this item',
      },
      {
          value: 'finished',
          label: 'Finished',
          description: 'Done working on this item',
      },
  ];

  value = 'new';

  handleChange(event) {
      // Get the string of the "value" attribute on the selected option
      this.value = event.detail.value;
  }

}