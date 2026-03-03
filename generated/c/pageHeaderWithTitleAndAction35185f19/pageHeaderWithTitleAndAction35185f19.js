import { LightningElement, api } from 'lwc';

/**
 * Page Header with Title and Action Buttons Component
 *
 * This component implements a page header following SLDS 2 Page Headers blueprint.
 * It displays a configurable title and optional action buttons in a standard SLDS layout.
 *
 * Features:
 * - Configurable page title
 * - Support for multiple action buttons
 * - Responsive SLDS layout
 * - Full accessibility support
 * - Event handling for button clicks
 */
export default class PageHeaderWithTitleAndAction extends LightningElement {
    /**
     * Main page title text
     * @type {string}
     * @required
     */
    @api title = '';

    /**
     * Show or hide action buttons
     * IMPORTANT: Must default to false per LWC1099 rules
     * @type {boolean}
     * @default false
     */
    @api showActions = false;

    /**
     * Array of button configuration objects
     * Each button should have: id, label, variant, and optional ariaLabel
     *
     * Example structure:
     * [
     *   { id: 'btn1', label: 'New', variant: 'brand', ariaLabel: 'Create new record' },
     *   { id: 'btn2', label: 'Edit', variant: 'neutral', ariaLabel: 'Edit record' }
     * ]
     *
     * @type {Array}
     * @default []
     */
    @api actionButtons = [];

    /**
     * Handle button click events
     * Dispatches a custom event with button details to parent component
     *
     * @param {Event} event - Click event from lightning-button
     * @fires PageHeaderWithTitleAndAction#buttonclick
     */
    handleButtonClick(event) {
        // Get the button ID from the data attribute
        const buttonId = event.target.dataset.buttonId;

        // Find the button configuration from the actionButtons array
        const buttonConfig = this.actionButtons.find(btn => btn.id === buttonId);

        // Dispatch custom event to parent component with button details
        // Parent component can listen for this event to handle button actions
        this.dispatchEvent(new CustomEvent('buttonclick', {
            detail: {
                buttonId: buttonId,
                buttonLabel: buttonConfig?.label,
                buttonVariant: buttonConfig?.variant
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Computed getter for button ARIA labels
     * Ensures each button has appropriate accessibility label
     * Used to avoid template literals in HTML attributes
     *
     * @returns {string} Computed ARIA label for button
     */
    getAriaLabelForButton(button) {
        return button.ariaLabel || button.label;
    }
}