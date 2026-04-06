import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handles the button click event
     * Displays a success toast notification when the save button is clicked
     */
    handleClick() {
        // Dispatch a toast notification to provide user feedback (commented out - not available in local dev)
        // const event = new ShowToastEvent({
        //     title: 'Success',
        //     message: 'Save button clicked',
        //     variant: 'success'
        // });
        // this.dispatchEvent(event);
    }
}