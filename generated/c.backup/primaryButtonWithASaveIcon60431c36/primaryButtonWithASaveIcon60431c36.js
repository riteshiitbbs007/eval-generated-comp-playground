import { LightningElement, api } from 'lwc';

/**
 * Primary Button with Save Icon Component
 * 
 * A reusable Lightning Web Component that displays a primary button
 * with a save icon. Follows SLDS 2 design system standards and
 * accessibility guidelines.
 * 
 * @component primaryButtonWithASaveIcon
 * @category Button Components
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * The text label displayed on the button
     * @type {string}
     * @default 'Save'
     * @public
     */
    @api label = 'Save';

    /**
     * The tooltip text shown on hover
     * @type {string}
     * @default 'Save changes'
     * @public
     */
    @api title = 'Save changes';

    /**
     * Whether the button is disabled
     * @type {boolean}
     * @default false
     * @public
     */
    @api disabled = false;

    /**
     * Handles the button click event
     * Dispatches a custom 'save' event that parent components can listen to
     * 
     * @param {Event} event - The click event object
     * @fires PrimaryButtonWithASaveIcon#save
     * @private
     */
    handleClick(event) {
        // Prevent default button behavior if needed
        event.preventDefault();

        // Dispatch custom 'save' event for parent components to handle
        // This follows the event bubbling pattern for LWC components
        const saveEvent = new CustomEvent('save', {
            detail: {
                timestamp: new Date().toISOString()
            },
            bubbles: true,
            composed: true
        });
        
        this.dispatchEvent(saveEvent);
    }

    /**
     * Public method to programmatically focus the button
     * Useful for accessibility and keyboard navigation
     * 
     * @public
     * @returns {void}
     */
    @api
    focus() {
        const button = this.template.querySelector('lightning-button');
        if (button) {
            button.focus();
        }
    }

    /**
     * Public method to programmatically click the button
     * Useful for testing and programmatic interactions
     * 
     * @public
     * @returns {void}
     */
    @api
    click() {
        const button = this.template.querySelector('lightning-button');
        if (button) {
            button.click();
        }
    }
}