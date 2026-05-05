import { LightningElement } from 'lwc';

/**
 * Primary Button with Save Icon Component
 * 
 * A reusable Lightning Web Component that displays a primary button
 * with a save icon. Follows SLDS 2 accessibility and design guidelines.
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handles the save button click event
     * Dispatches a custom 'save' event that parent components can listen to
     */
    handleSaveClick() {
        // Dispatch custom event for parent components to handle save logic
        const saveEvent = new CustomEvent('save', {
            detail: {
                message: 'Save button clicked'
            }
        });
        this.dispatchEvent(saveEvent);
    }
}