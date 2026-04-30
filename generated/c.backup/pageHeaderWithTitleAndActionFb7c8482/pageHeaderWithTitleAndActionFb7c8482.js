import { LightningElement, api } from 'lwc';

/**
 * Page Header Component with Title and Action Buttons
 * 
 * This component displays a page header following SLDS 2 design patterns.
 * It includes a configurable title, optional subtitle, and action buttons.
 * 
 * @property {string} title - The main title displayed in the page header
 * @property {string} subtitle - Optional subtitle text displayed below the title
 * @property {Array} actions - Array of action button configurations
 * @property {boolean} showActions - Controls visibility of action buttons (defaults to false per LWC1099)
 */
export default class PageHeaderWithTitleAndAction extends LightningElement {
    // Public API properties following LWC best practices
    
    /**
     * Main title text for the page header
     * @type {string}
     * @default 'Page Title'
     */
    @api title = 'Page Title';
    
    /**
     * Optional subtitle text displayed below the main title
     * @type {string}
     */
    @api subtitle = '';
    
    /**
     * Array of action button configurations
     * Each button should have: id, label, variant, iconName (optional), iconPosition (optional), disabled (optional)
     * @type {Array}
     */
    @api actions = [];
    
    /**
     * Controls whether action buttons are displayed
     * Must default to false per LWC1099 requirement
     * @type {boolean}
     * @default false
     */
    @api showActions = false;
    
    /**
     * Computed property that returns the processed action buttons array
     * Ensures each button has required properties and generates ARIA labels
     * @returns {Array} Processed array of action button configurations
     */
    get actionButtons() {
        if (!this.showActions || !Array.isArray(this.actions) || this.actions.length === 0) {
            return [];
        }
        
        // Process actions array and ensure all required properties exist
        return this.actions.map((action, index) => {
            return {
                id: action.id || `action-${index}`,
                label: action.label || 'Action',
                variant: action.variant || 'neutral',
                iconName: action.iconName || '',
                iconPosition: action.iconPosition || 'left',
                disabled: action.disabled || false,
                // Generate accessible ARIA label if not provided
                ariaLabel: action.ariaLabel || this.generateAriaLabel(action.label || 'Action')
            };
        });
    }
    
    /**
     * Generates an accessible ARIA label for action buttons
     * @param {string} label - The button label
     * @returns {string} Generated ARIA label
     * @private
     */
    generateAriaLabel(label) {
        // Create descriptive ARIA label that includes context
        // Using getter pattern to avoid template literal in HTML
        return `${label} action for ${this.title}`;
    }
    
    /**
     * Handles click events on action buttons
     * Dispatches a custom event to notify parent components
     * @param {Event} event - The click event
     * @fires PageHeaderWithTitleAndAction#actionclick
     */
    handleActionClick(event) {
        // Prevent default button behavior
        event.preventDefault();
        
        // Get the action ID from the clicked button
        const actionId = event.currentTarget.dataset.actionId;
        
        // Find the full action object
        const action = this.actions.find(a => (a.id || `action-${this.actions.indexOf(a)}`) === actionId);
        
        /**
         * Action Click Event
         * Fired when an action button is clicked
         * @event PageHeaderWithTitleAndAction#actionclick
         * @type {CustomEvent}
         * @property {Object} detail - Event details
         * @property {string} detail.actionId - ID of the clicked action
         * @property {Object} detail.action - Full action configuration object
         */
        const actionClickEvent = new CustomEvent('actionclick', {
            detail: {
                actionId: actionId,
                action: action ? { ...action } : null
            },
            bubbles: true,
            composed: true
        });
        
        this.dispatchEvent(actionClickEvent);
    }
}