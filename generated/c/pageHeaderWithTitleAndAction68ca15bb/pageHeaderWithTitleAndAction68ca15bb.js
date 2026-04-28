import { LightningElement, api } from 'lwc';

/**
 * Page Header with Title and Action Buttons
 * 
 * A reusable component that displays a page header following SLDS blueprint patterns.
 * Includes a prominent title and configurable action buttons.
 * 
 * @example
 * <c-page-header-with-title-and-action
 *     page-title="Accounts"
 *     primary-action-label="New"
 *     secondary-action-label="Import"
 *     show-secondary-action>
 * </c-page-header-with-title-and-action>
 */
export default class PageHeaderWithTitleAndAction extends LightningElement {
    /**
     * The main page title to display in the header
     * @type {string}
     */
    @api pageTitle = 'Page Title';

    /**
     * Label for the primary action button
     * @type {string}
     */
    @api primaryActionLabel = 'New';

    /**
     * Label for the secondary action button
     * @type {string}
     */
    @api secondaryActionLabel = 'Edit';

    /**
     * Controls visibility of the secondary action button
     * @type {boolean}
     */
    @api showSecondaryAction = false;

    /**
     * Handles primary action button click
     * Dispatches a custom event that parent components can listen to
     * @fires PageHeaderWithTitleAndAction#primaryaction
     */
    handlePrimaryAction() {
        // Dispatch custom event for primary action
        this.dispatchEvent(
            new CustomEvent('primaryaction', {
                detail: {
                    action: 'primary',
                    label: this.primaryActionLabel
                }
            })
        );
    }

    /**
     * Handles secondary action button click
     * Dispatches a custom event that parent components can listen to
     * @fires PageHeaderWithTitleAndAction#secondaryaction
     */
    handleSecondaryAction() {
        // Dispatch custom event for secondary action
        this.dispatchEvent(
            new CustomEvent('secondaryaction', {
                detail: {
                    action: 'secondary',
                    label: this.secondaryActionLabel
                }
            })
        );
    }
}