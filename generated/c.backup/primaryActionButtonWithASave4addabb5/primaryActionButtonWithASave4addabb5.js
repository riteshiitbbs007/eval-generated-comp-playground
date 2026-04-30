import { LightningElement, api } from 'lwc';

/**
 * Primary action button component with a "save" icon on the left and "Save Changes" text
 * @name PrimaryActionButtonWithASave
 * @example
 * <c-primary-action-button-with-a-save
 *   button-label="Save Changes"
 *   aria-label="Save changes to the record"
 *   disabled={isDisabled}
 *   variant="brand"
 *   onaction={handleSaveAction}>
 * </c-primary-action-button-with-a-save>
 */
export default class PrimaryActionButtonWithASave extends LightningElement {
    /**
     * Text displayed on the button
     * @type {String}
     * @default "Save Changes"
     */
    @api
    buttonLabel = 'Save Changes';

    /**
     * ARIA label for accessibility
     * @type {String}
     */
    @api
    ariaLabel;

    /**
     * Alternative text for screen readers
     * @type {String}
     */
    @api
    assistiveText;

    /**
     * Specifies the button variant (brand, neutral, etc.)
     * @type {String}
     * @default "brand"
     */
    @api
    variant = 'brand';

    /**
     * Disables the button when set to true
     * @type {Boolean}
     * @default false
     */
    @api
    disabled = false;

    /**
     * Handles click events on the button
     * Dispatches 'action' event when button is clicked
     * @param {Event} event - Click event
     */
    handleClick(event) {
        // Prevent default button behavior
        event.preventDefault();

        // Only dispatch event if button is not disabled
        if (!this.disabled) {
            // Create and dispatch custom event
            this.dispatchEvent(new CustomEvent('action', {
                bubbles: true,
                composed: true
            }));
        }
    }

    /**
     * Get CSS classes for the button based on variant and disabled state
     * @returns {String} Space-separated list of CSS classes
     */
    get buttonClasses() {
        const baseClasses = [
            'slds-button',
            'slds-button_stretch'
        ];

        // Add variant-specific class
        switch (this.variant) {
            case 'brand':
                baseClasses.push('slds-button_brand');
                break;
            case 'destructive':
                baseClasses.push('slds-button_destructive');
                break;
            case 'success':
                baseClasses.push('slds-button_success');
                break;
            case 'neutral':
            default:
                baseClasses.push('slds-button_neutral');
                break;
        }

        return baseClasses.join(' ');
    }

    /**
     * Get default ARIA label if none is provided
     * @returns {String} ARIA label for the button
     */
    get computedAriaLabel() {
        return this.ariaLabel || `Save Changes`;
    }
}