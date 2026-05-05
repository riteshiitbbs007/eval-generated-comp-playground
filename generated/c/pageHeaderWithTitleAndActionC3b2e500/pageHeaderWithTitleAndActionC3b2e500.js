import { LightningElement, api } from 'lwc';

/**
 * Page Header with Title and Action Buttons
 * 
 * Displays a page header following SLDS 2 design guidelines with:
 * - Configurable title and subtitle
 * - Optional icon
 * - Primary and secondary action buttons
 * - Full accessibility support
 */
export default class PageHeaderWithTitleAndAction extends LightningElement {
    // Public API properties for configuration
    
    /**
     * The main title displayed in the page header
     * @type {string}
     */
    @api title = 'Page Title';
    
    /**
     * Optional subtitle or metadata text displayed below the title
     * @type {string}
     */
    @api subtitle = '';
    
    /**
     * Optional icon name to display next to the title
     * Format: category:name (e.g., 'standard:account', 'utility:user')
     * @type {string}
     */
    @api iconName = '';
    
    /**
     * Alternative text for the icon (accessibility)
     * @type {string}
     */
    @api iconAlternativeText = 'Icon';
    
    /**
     * Label for the primary action button
     * @type {string}
     */
    @api primaryActionLabel = 'Primary Action';
    
    /**
     * Label for the secondary action button
     * @type {string}
     */
    @api secondaryActionLabel = 'Secondary Action';
    
    /**
     * Hide the primary action button (defaults to false, meaning button is shown)
     * @type {boolean}
     */
    @api hidePrimaryAction = false;

    /**
     * Hide the secondary action button (defaults to false, meaning button is shown)
     * @type {boolean}
     */
    @api hideSecondaryAction = false;

    /**
     * Computed property to determine if primary action should be displayed
     * @returns {boolean} True if primary action should be shown
     */
    get showPrimaryAction() {
        return !this.hidePrimaryAction;
    }

    /**
     * Computed property to determine if secondary action should be displayed
     * @returns {boolean} True if secondary action should be shown
     */
    get showSecondaryAction() {
        return !this.hideSecondaryAction;
    }
    
    /**
     * Computed property to determine if icon should be displayed
     * @returns {boolean} True if iconName is provided
     */
    get showIcon() {
        return !!this.iconName;
    }
    
    /**
     * Handler for primary action button click
     * Dispatches custom event 'primaryaction' that parent components can listen to
     * @param {Event} event - Click event
     */
    handlePrimaryAction(event) {
        // Dispatch custom event for parent components to handle
        this.dispatchEvent(new CustomEvent('primaryaction', {
            detail: {
                actionType: 'primary',
                timestamp: new Date().toISOString()
            },
            bubbles: true,
            composed: true
        }));
    }
    
    /**
     * Handler for secondary action button click
     * Dispatches custom event 'secondaryaction' that parent components can listen to
     * @param {Event} event - Click event
     */
    handleSecondaryAction(event) {
        // Dispatch custom event for parent components to handle
        this.dispatchEvent(new CustomEvent('secondaryaction', {
            detail: {
                actionType: 'secondary',
                timestamp: new Date().toISOString()
            },
            bubbles: true,
            composed: true
        }));
    }
}