import { LightningElement, api } from 'lwc';

/**
 * @description A primary button with a save icon
 * @class PrimaryButtonWithASaveIcon
 * @extends LightningElement
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * @description The button label text
     * @type {string}
     * @default 'Save'
     */
    @api label = 'Save';

    /**
     * @description The aria label for accessibility
     * @type {string}
     */
    @api ariaLabel;

    /**
     * @description The title attribute for the button
     * @type {string}
     */
    @api title;

    /**
     * @description Whether to show the save icon
     * @type {boolean}
     * @default false
     */
    @api showIcon = false;

    /**
     * @description Whether the button is disabled
     * @type {boolean}
     * @default false
     */
    @api isDisabled = false;

    /**
     * @description Event fired when the button is clicked
     * @event save
     */

    /**
     * @description Gets the computed aria-label for the button
     * @returns {string} Computed aria-label
     */
    get computedAriaLabel() {
        return this.ariaLabel || this.label;
    }

    /**
     * @description Gets the computed title for the button
     * @returns {string} Computed title
     */
    get computedTitle() {
        return this.title || this.label;
    }

    /**
     * @description Handles the button click event
     * @param {Event} event - The click event
     */
    handleClick(event) {
        // Prevent default behavior if needed
        if (this.isDisabled) {
            event.preventDefault();
            return;
        }

        // Dispatch a custom 'save' event
        this.dispatchEvent(new CustomEvent('save', {
            bubbles: true,
            composed: true
        }));
    }
}