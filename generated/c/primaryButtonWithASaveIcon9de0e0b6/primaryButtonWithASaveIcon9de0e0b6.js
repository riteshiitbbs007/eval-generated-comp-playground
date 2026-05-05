import { LightningElement, api } from 'lwc';

/**
 * Primary Button with Save Icon Component
 * 
 * A reusable button component that displays a primary (brand) button with a save icon.
 * Uses Lightning Base Component (lightning-button) for full SLDS 2 compliance.
 * 
 * @description Provides a configurable button with icon support for save actions
 * @example
 * <c-primary-button-with-a-save-icon 
 *     label="Save Changes" 
 *     icon-name="utility:save"
 *     disabled={isProcessing}
 *     onsaveclick={handleSave}>
 * </c-primary-button-with-a-save-icon>
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Public API: Button label text
     * @type {string}
     * @default 'Save'
     * @description The text displayed on the button, also serves as accessible label for the icon
     */
    @api label = 'Save';

    /**
     * Public API: Controls button interactivity
     * @type {boolean}
     * @default false
     * @description When true, button is disabled and cannot be clicked
     */
    @api disabled = false;

    /**
     * Public API: Icon name to display
     * @type {string}
     * @default 'utility:save'
     * @description SLDS icon name in format 'category:name' (e.g., 'utility:save', 'utility:check')
     */
    @api iconName = 'utility:save';

    /**
     * Handles button click events
     * @param {Event} event - The click event from lightning-button
     * @fires PrimaryButtonWithASaveIcon#saveclick
     * @description Dispatches a custom 'saveclick' event to notify parent components
     * Event bubbles and is composed to cross shadow DOM boundaries
     */
    handleClick(event) {
        // Prevent default button behavior if needed
        event.preventDefault();
        
        /**
         * Save click event
         * @event PrimaryButtonWithASaveIcon#saveclick
         * @type {CustomEvent}
         * @property {object} detail - Empty detail object (can be extended for future needs)
         * @description Fired when the button is clicked, allowing parent components to handle save action
         */
        const saveClickEvent = new CustomEvent('saveclick', {
            detail: {},
            bubbles: true,
            composed: true
        });
        
        this.dispatchEvent(saveClickEvent);
    }
}