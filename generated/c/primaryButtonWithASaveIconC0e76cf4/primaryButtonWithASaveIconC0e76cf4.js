/**
 * Primary Button with Save Icon Component
 *
 * A reusable Lightning Web Component that renders a primary button with a save icon
 * following SLDS 2 design system standards.
 *
 * @component primaryButtonWithASaveIcon
 */
import { LightningElement, api } from 'lwc';

export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Button text label
     * @type {string}
     * @default 'Save'
     * @public
     */
    @api label = 'Save';

    /**
     * Whether the button is disabled
     * CRITICAL: Must default to false per LWC1099 requirement
     * All boolean @api properties MUST default to false
     * @type {boolean}
     * @default false
     * @public
     */
    @api disabled = false;

    /**
     * Handle button click event
     * Emits a custom 'save' event when the button is clicked
     *
     * @fires CustomEvent#save
     * @private
     */
    handleClick() {
        // Dispatch custom save event for parent components to handle
        // Includes detail object for future extensibility
        this.dispatchEvent(
            new CustomEvent('save', {
                detail: {
                    timestamp: Date.now()
                },
                bubbles: true,
                composed: true
            })
        );
    }

    /**
     * Computed property for button aria-label
     * CRITICAL: Template literals in HTML attributes cause LWC1058 error
     * Must use getter instead of inline template literals
     *
     * @returns {string} Accessible label for screen readers
     * @private
     */
    get buttonAriaLabel() {
        return `${this.label} - Click to save changes`;
    }
}