import { LightningElement } from 'lwc';

/**
 * Primary Button With A Save Icon Component
 * 
 * A simple component that displays a primary button with a save icon.
 * Follows SLDS design patterns and ensures accessibility compliance.
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handles the save button click event
     * Dispatches a custom 'save' event for parent components to handle
     */
    handleSave() {
        // Dispatch custom event to notify parent components
        const saveEvent = new CustomEvent('save', {
            detail: {
                message: 'Save button clicked'
            }
        });
        this.dispatchEvent(saveEvent);
    }
}