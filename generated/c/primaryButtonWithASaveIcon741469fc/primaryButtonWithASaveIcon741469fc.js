import { LightningElement } from 'lwc';

/**
 * Primary Button with Save Icon Component
 * 
 * A simple SLDS 2 compliant button component that displays a primary (brand) button
 * with a save icon. This component demonstrates proper use of Lightning Base Components
 * and SLDS styling.
 * 
 * Features:
 * - Uses lightning-button for accessibility and SLDS compliance
 * - Brand variant for primary action styling
 * - Save icon positioned on the left
 * - Dispatches custom event on click for parent component handling
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handles the button click event
     * Dispatches a custom event to notify parent components
     * 
     * @param {Event} event - The click event from the button
     */
    handleSaveClick(event) {
        // Dispatch custom event for parent component to handle
        // Using CustomEvent for proper child-to-parent communication
        const saveEvent = new CustomEvent('save', {
            detail: {
                message: 'Save button clicked',
                timestamp: Date.now()
            },
            bubbles: true,
            composed: false
        });
        
        this.dispatchEvent(saveEvent);
    }
}