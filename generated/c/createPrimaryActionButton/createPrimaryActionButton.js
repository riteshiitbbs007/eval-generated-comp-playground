import { LightningElement, api } from 'lwc';

/**
 * @description Primary Action Button component with configurable label and icon
 * This component creates a button with an icon (by default "save") and a label (by default "Save Changes")
 * It follows SLDS 2 guidelines and design tokens
 */
export default class CreatePrimaryActionButton extends LightningElement {
    /**
     * @description Text to display on the button
     * @api
     * @type {String}
     * @default "Save Changes"
     */
    @api label = 'Save Changes';

    /**
     * @description Button variant (brand, neutral, success, destructive)
     * @api
     * @type {String}
     * @default "brand"
     */
    @api variant = 'brand';

    /**
     * @description Boolean to disable the button
     * @api
     * @type {Boolean}
     * @default false
     */
    @api disabled = false;

    /**
     * @description Icon name to display
     * @api
     * @type {String}
     * @default "utility:save"
     */
    @api iconName = 'utility:save';

    /**
     * @description Position of the icon (left, right)
     * @api
     * @type {String}
     * @default "left"
     */
    @api iconPosition = 'left';

    /**
     * @description Optional custom aria-label for accessibility
     * @api
     * @type {String}
     */
    @api ariaLabel;

    /**
     * @description Computed class for the button based on variant
     * @returns {String} CSS class string
     */
    get buttonClass() {
        const baseClasses = 'slds-button';
        const variantClass = this.variant ? `slds-button_${this.variant}` : 'slds-button_brand';

        return `${baseClasses} ${variantClass}`;
    }

    /**
     * @description Computed class for the icon container
     * @returns {String} CSS class string
     */
    get iconContainerClass() {
        const baseClasses = 'slds-button__icon';
        const positionClass = this.iconPosition === 'right' ? 'slds-button__icon_right' : 'slds-button__icon_left';

        return `${baseClasses} ${positionClass}`;
    }

    /**
     * @description Computed property to determine if icon should be on the left
     * @returns {Boolean} True if icon position is left
     */
    get isIconLeft() {
        return this.iconPosition === 'left';
    }

    /**
     * @description Computed property to determine if icon should be on the right
     * @returns {Boolean} True if icon position is right
     */
    get isIconRight() {
        return this.iconPosition === 'right';
    }

    /**
     * @description Computed alternative text for the icon
     * @returns {String} Alternative text
     */
    get iconAlternativeText() {
        return `${this.label} Icon`;
    }

    /**
     * @description Computed aria-label for the button
     * @returns {String} Aria label text
     */
    get computedAriaLabel() {
        return this.ariaLabel || this.label;
    }

    /**
     * @description Handle button click event
     * @param {Event} event - The click event
     */
    handleClick(event) {
        // Prevent default to avoid any unexpected navigation
        event.preventDefault();

        // If not disabled, dispatch a 'click' event
        if (!this.disabled) {
            // Create and dispatch a custom event
            this.dispatchEvent(new CustomEvent('click', {
                bubbles: true,
                composed: true,
                detail: {
                    originalEvent: event
                }
            }));
        }
    }
}