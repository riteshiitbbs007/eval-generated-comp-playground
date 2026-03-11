import { LightningElement, api } from 'lwc';

/**
 * Page Header with Title and Action Buttons Component
 *
 * Displays a responsive SLDS page header with a title and configurable action buttons.
 * Follows SLDS 2.x design patterns with proper accessibility and semantic markup.
 *
 * @component pageHeaderWithTitleAndAction
 */
export default class PageHeaderWithTitleAndAction extends LightningElement {
    /**
     * The page header title text
     * @type {string}
     * @api
     */
    @api title = '';

    /**
     * Label for the primary action button
     * @type {string}
     * @api
     */
    @api primaryActionLabel = 'Primary Action';

    /**
     * Label for the secondary action button
     * @type {string}
     * @api
     */
    @api secondaryActionLabel = 'Secondary Action';

    /**
     * Whether to show the secondary action button
     * IMPORTANT: Must default to false per LWC1099 compilation requirement
     * @type {boolean}
     * @api
     */
    @api showSecondaryAction = false;

    /**
     * Handles primary action button click
     * Dispatches a 'primaryaction' custom event to parent components
     *
     * @fires PageHeaderWithTitleAndAction#primaryaction
     */
    handlePrimaryAction() {
        // Dispatch custom event to notify parent components
        const primaryActionEvent = new CustomEvent('primaryaction', {
            detail: {
                source: 'pageHeader',
                action: 'primary'
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(primaryActionEvent);
    }

    /**
     * Handles secondary action button click
     * Dispatches a 'secondaryaction' custom event to parent components
     *
     * @fires PageHeaderWithTitleAndAction#secondaryaction
     */
    handleSecondaryAction() {
        // Dispatch custom event to notify parent components
        const secondaryActionEvent = new CustomEvent('secondaryaction', {
            detail: {
                source: 'pageHeader',
                action: 'secondary'
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(secondaryActionEvent);
    }
}