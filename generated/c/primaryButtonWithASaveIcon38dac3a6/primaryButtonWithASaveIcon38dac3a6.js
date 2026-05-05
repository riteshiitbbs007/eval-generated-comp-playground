import { LightningElement, api } from 'lwc';

/**
 * Primary Button with Save Icon Component
 *
 * A simple primary button component that displays a save icon using SLDS design patterns.
 * This component follows SLDS 2 design system guidelines and uses Lightning Base Components.
 *
 * @component
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Button label text
     * @type {string}
     * @default 'Save'
     */
    @api buttonLabel = 'Save';

    /**
     * Icon position relative to button label
     * @type {string}
     * @default 'left'
     */
    @api iconPosition = 'left';

    /**
     * Determines if the button is disabled
     * @type {boolean}
     * @default false
     * Note: ALL boolean @api properties MUST default to false per LWC requirements
     */
    @api disabled = false;

    /**
     * Computed property for button title (tooltip)
     * Uses getter to avoid template literals in HTML attributes
     * @returns {string} Button title for accessibility
     */
    get buttonTitle() {
        return `Click to ${this.buttonLabel.toLowerCase()}`;
    }

    /**
     * Handle button click event
     * Dispatches a custom 'save' event to parent components
     * @param {Event} event - Click event object
     */
    handleClick(event) {
        // Prevent default button behavior
        event.preventDefault();

        // Dispatch custom save event for parent components to handle
        this.dispatchEvent(new CustomEvent('save', {
            detail: {
                timestamp: new Date().toISOString()
            }
        }));
    }
}