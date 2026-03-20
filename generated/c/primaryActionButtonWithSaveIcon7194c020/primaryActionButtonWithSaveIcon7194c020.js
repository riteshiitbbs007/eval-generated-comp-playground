import { LightningElement } from 'lwc';

/**
 * Primary Action Button with Save Icon
 *
 * Displays a brand-styled button with a save icon positioned on the left side.
 * Implements SLDS design system standards for primary action buttons.
 *
 * @fires save - Dispatched when the save button is clicked
 */
export default class PrimaryActionButtonWithSaveIcon extends LightningElement {
    /**
     * Handles the save button click event
     * Dispatches a custom 'save' event to notify parent components
     *
     * @param {Event} event - The click event
     */
    handleSaveClick(event) {
        // Prevent any default button behavior
        event.preventDefault();

        // Dispatch save event to notify parent components
        // Parent components can listen for this event to handle save logic
        // Using composed: true to allow event to cross shadow DOM boundary
        // while bubbles: false maintains encapsulation within immediate parent
        this.dispatchEvent(new CustomEvent('save', {
            detail: {
                action: 'save',
                timestamp: new Date().toISOString()
            },
            bubbles: false,
            composed: true
        }));
    }
}