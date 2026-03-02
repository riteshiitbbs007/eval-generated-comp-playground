import { LightningElement, api } from 'lwc';

/**
 * @description Primary button with a save icon component
 * @class
 * @extends LightningElement
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * @type {string}
     * @description Label for the button aria-label attribute
     */
    @api label = 'Save';

    /**
     * @type {boolean}
     * @description Whether the button is disabled
     * @default false
     */
    @api disabled = false;

    /**
     * @type {boolean}
     * @description Whether to show the icon
     * @default false
     */
    @api showIcon = false;

    /**
     * @type {Function}
     * @description Event fired when the button is clicked
     */
    @api handleButtonClick;

    /**
     * @returns {string}
     * @description Returns the aria-label for the button
     */
    get buttonAriaLabel() {
        return this.label;
    }

    /**
     * @description Handles the button click event
     * @param {Event} event - The click event
     */
    handleClick(event) {
        // Prevent default behavior
        event.preventDefault();

        // Create and dispatch custom event
        const customEvent = new CustomEvent('buttonclick', {
            bubbles: true,
            composed: true,
            detail: { label: this.label }
        });
        this.dispatchEvent(customEvent);

        // Call the handler function if provided
        if (typeof this.handleButtonClick === 'function') {
            this.handleButtonClick(event);
        }
    }
}