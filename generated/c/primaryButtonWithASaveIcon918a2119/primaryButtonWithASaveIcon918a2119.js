import { LightningElement, api } from 'lwc';

/**
 * Primary Button with Save Icon Component
 *
 * A reusable button component that displays a save icon with customizable
 * label, icon, variant, and disabled state. Follows SLDS 2.0 design patterns
 * and accessibility guidelines.
 *
 * @component
 * @example
 * <c-primary-button-with-a-save-icon
 *     label="Save Record"
 *     icon-name="utility:save"
 *     variant="brand"
 *     disabled={isDisabled}
 *     onbuttonclick={handleSave}>
 * </c-primary-button-with-a-save-icon>
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * The label text displayed on the button.
     * Default: "Save"
     * @type {string}
     * @api
     */
    @api label = 'Save';

    /**
     * The SLDS icon name to display on the button.
     * Format: "utility:iconName" or "standard:iconName"
     * Default: "utility:save"
     * @type {string}
     * @api
     */
    @api iconName = 'utility:save';

    /**
     * The button variant that determines the visual style.
     * Options: 'base', 'neutral', 'brand', 'brand-outline', 'destructive',
     *          'destructive-text', 'inverse', 'success'
     * Default: "brand"
     * @type {string}
     * @api
     */
    @api variant = 'brand';

    /**
     * Whether the button is disabled.
     * CRITICAL: Must default to false per LWC1099 requirement.
     * All boolean @api properties MUST default to false.
     * @type {boolean}
     * @api
     */
    @api disabled = false;

    /**
     * Handles the button click event and dispatches a custom event.
     * Provides button details to parent components.
     *
     * @param {Event} event - The click event from lightning-button
     * @fires PrimaryButtonWithASaveIcon#buttonclick
     */
    handleClick(event) {
        // Prevent default behavior if needed
        event.preventDefault();

        // Dispatch custom event with button details for parent components
        const buttonClickEvent = new CustomEvent('buttonclick', {
            detail: {
                label: this.label,
                iconName: this.iconName,
                variant: this.variant,
                timestamp: new Date().toISOString()
            },
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(buttonClickEvent);
    }
}