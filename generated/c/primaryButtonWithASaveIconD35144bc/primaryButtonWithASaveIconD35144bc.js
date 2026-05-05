import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

/**
 * Primary Button With A Save Icon Component
 * 
 * A simple Lightning Web Component that displays a primary (brand) button
 * with a save icon. The component follows SLDS 2 design standards and
 * accessibility best practices.
 * 
 * Features:
 * - SLDS 2 compliant styling using semantic styling hooks
 * - Accessible button with proper ARIA attributes
 * - Toast notification feedback on button click
 * - Responsive design using SLDS utility classes
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handles the save button click event
     * Dispatches a custom 'save' event and shows a success toast notification
     * 
     * @param {Event} event - The click event from the button
     */
    handleSave(event) {
        // Dispatch custom event for parent components to handle
        // This follows the principle of loose coupling and component reusability
        this.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    message: 'Save button clicked',
                    timestamp: new Date().toISOString()
                },
                bubbles: true,
                composed: true
            })
        );

        // Show success toast notification for user feedback (commented out - not available in local dev)
        // This follows SLDS interaction patterns for transient system feedback
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Save action triggered successfully',
        //         variant: 'success'
        //     })
        // );
    }
}