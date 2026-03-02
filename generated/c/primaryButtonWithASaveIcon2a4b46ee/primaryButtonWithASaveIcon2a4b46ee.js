import { LightningElement, api } from 'lwc';

export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Label for the button that will be displayed
     * @type {String}
     */
    @api label = 'Save';

    /**
     * Additional CSS class names to apply to the button
     * @type {String}
     */
    @api className = '';

    /**
     * Whether the button is disabled
     * @type {Boolean}
     */
    @api disabled = false;

    /**
     * Whether to show the save icon
     * @type {Boolean}
     */
    @api showIcon = false;

    /**
     * ARIA label for the button for improved accessibility
     * @type {String}
     */
    @api ariaLabel = '';

    /**
     * Whether the button is in loading state
     * @type {Boolean}
     */
    @api loading = false;

    /**
     * Method to handle button clicks
     * Prevents default action and dispatches custom 'buttonclick' event
     */
    handleClick(event) {
        event.preventDefault();
        if (!this.disabled && !this.loading) {
            this.dispatchEvent(new CustomEvent('buttonclick', {
                bubbles: true,
                composed: true
            }));
        }
    }

    /**
     * Returns computed classes for the button based on props and state
     */
    get computedButtonClass() {
        const classes = [
            'slds-button',
            'slds-button_brand'
        ];

        if (this.className) {
            classes.push(this.className);
        }

        return classes.join(' ');
    }

    /**
     * Returns ARIA label for the button
     */
    get computedAriaLabel() {
        return this.ariaLabel || this.label;
    }

    /**
     * Returns icon position class
     */
    get iconClass() {
        return this.showIcon ? 'slds-button__icon slds-button__icon_left' : '';
    }
}