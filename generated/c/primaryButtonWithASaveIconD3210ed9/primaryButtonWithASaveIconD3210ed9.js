import { LightningElement } from 'lwc';

/**
 * Primary Button with Save Icon Component
 * 
 * This component displays a primary button with a save icon positioned to the left of the text.
 * It follows SLDS 2 design system guidelines and uses Lightning Base Components for
 * optimal accessibility and theme compatibility.
 * 
 * Features:
 * - Primary (brand) button styling using SLDS accent colors
 * - Save icon from utility icon set positioned left of label
 * - Emits custom 'save' event when clicked
 * - Fully accessible with ARIA support via lightning-button
 * - Keyboard navigable with proper focus states
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handles button click events
     * 
     * When the button is clicked:
     * 1. Dispatches a custom 'save' event for parent components to handle
     * 2. Event bubbles and is composed to cross shadow DOM boundaries
     * 
     * Parent components can listen via: onsave={handleSave}
     */
    handleSaveClick() {
        // Create and dispatch custom save event
        // CustomEvent allows parent components to listen and respond
        // bubbles: true - event propagates up the DOM tree
        // composed: true - event crosses shadow DOM boundaries
        const saveEvent = new CustomEvent('save', {
            bubbles: true,
            composed: true,
            detail: {
                timestamp: new Date().toISOString(),
                source: 'primaryButtonWithASaveIcon'
            }
        });
        
        this.dispatchEvent(saveEvent);
    }
}