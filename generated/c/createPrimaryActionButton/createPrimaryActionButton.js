import { LightningElement, api } from 'lwc';

/**
 * @description Primary action button with save icon positioned on the left
 * Uses SLDS brand button styling with appropriate sizing from the design system
 */
export default class CreatePrimaryActionButton extends LightningElement {
    /**
     * @description Button label text
     * @type {string}
     * @default 'Save Changes'
     */
    @api buttonLabel = 'Save Changes';

    /**
     * @description Label for the button's title attribute providing additional context
     * @type {string}
     * @default 'Save Changes'
     */
    @api buttonTitle = 'Save Changes';

    /**
     * @description Aria label for screen readers
     * @type {string}
     */
    @api ariaLabel = 'Save Changes';

    /**
     * @description Whether the button is disabled
     * @type {boolean}
     * @default false
     */
    @api disabled = false;

    /**
     * @description Event fired when the button is clicked
     * @param {Event} event - The click event
     */
    handleClick(event) {
        // Prevent default behavior if needed
        if (this.disabled) {
            event.preventDefault();
            return;
        }

        // Dispatch a custom event when button is clicked
        this.dispatchEvent(new CustomEvent('click', {
            bubbles: true,
            composed: true
        }));
    }
}