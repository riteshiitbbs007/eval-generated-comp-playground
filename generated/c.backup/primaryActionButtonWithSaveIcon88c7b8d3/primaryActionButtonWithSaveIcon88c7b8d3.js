import { LightningElement, api } from 'lwc';

/**
 * Primary Action Button with Save Icon
 *
 * A reusable button component that displays a save icon on the left with proper
 * spacing and SLDS brand styling. Implements SLDS 2 design tokens for consistent
 * theming and accessibility.
 *
 * Features:
 * - SLDS brand button styling with hover and focus states
 * - Save icon positioned on left with proper spacing
 * - WCAG 2.1 accessibility compliance
 * - Customizable disabled state
 * - Event-driven architecture for parent component integration
 */
export default class PrimaryActionButtonWithSaveIcon extends LightningElement {
    /**
     * Controls whether the button is disabled
     * @type {boolean}
     * @default false
     * Note: All boolean @api properties MUST default to false per LWC1099 requirement
     */
    @api isDisabled = false;

    /**
     * Handles the save button click event
     * Dispatches a custom save event that parent components can listen to
     *
     * @fires PrimaryActionButtonWithSaveIcon#save
     */
    handleSaveClick() {
        // Dispatch custom event for parent component to handle
        // This follows the event-driven architecture pattern for LWC
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
}