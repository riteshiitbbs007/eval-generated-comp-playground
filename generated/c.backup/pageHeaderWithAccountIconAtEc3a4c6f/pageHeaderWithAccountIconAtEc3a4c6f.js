import { LightningElement, api } from 'lwc';

/**
 * Page Header component with Account icon, title, subtitle, and action buttons
 * Implements SLDS 2 design system with proper accessibility
 *
 * @component pageHeaderWithAccountIconAt
 * @description Displays a page header for Account records with icon, text content, and action buttons
 */
export default class PageHeaderWithAccountIconAt extends LightningElement {
    // ========================================
    // Public API Properties
    // ========================================

    /**
     * The main title text displayed in the header
     * @type {string}
     * @default 'John Smith'
     */
    @api title = 'John Smith';

    /**
     * The subtitle text displayed below the title
     * @type {string}
     * @default 'Account • Customer'
     */
    @api subtitle = 'Account • Customer';

    /**
     * The SLDS icon name for the header icon
     * @type {string}
     * @default 'standard:account'
     */
    @api iconName = 'standard:account';

    /**
     * Controls visibility of the Edit button
     * @type {boolean}
     * @default false
     * NOTE: MUST default to false per LWC1099 rule - all boolean @api properties must default to false
     */
    @api showEditButton = false;

    /**
     * Controls visibility of the Delete button
     * @type {boolean}
     * @default false
     * NOTE: MUST default to false per LWC1099 rule - all boolean @api properties must default to false
     */
    @api showDeleteButton = false;

    /**
     * Controls visibility of the Clone button
     * @type {boolean}
     * @default false
     * NOTE: MUST default to false per LWC1099 rule - all boolean @api properties must default to false
     */
    @api showCloneButton = false;

    // ========================================
    // Computed Getters for Dynamic Attributes
    // ========================================
    // NOTE: All dynamic attribute values must use getters to avoid LWC1058 compilation errors
    // Template literals and string concatenation are NOT allowed in HTML attributes

    /**
     * Computed ARIA label for the icon
     * @returns {string} Accessible alternative text for the icon
     */
    get iconAltText() {
        return `${this.title} account icon`;
    }

    /**
     * Computed ARIA label for the Edit button
     * @returns {string} Accessible label for Edit action
     */
    get editAriaLabel() {
        return `Edit ${this.title}`;
    }

    /**
     * Computed ARIA label for the Delete button
     * @returns {string} Accessible label for Delete action
     */
    get deleteAriaLabel() {
        return `Delete ${this.title}`;
    }

    /**
     * Computed ARIA label for the Clone button
     * @returns {string} Accessible label for Clone action
     */
    get cloneAriaLabel() {
        return `Clone ${this.title}`;
    }

    // ========================================
    // Event Handlers
    // ========================================

    /**
     * Handles Edit button click
     * Dispatches custom 'edit' event to parent components
     * @param {Event} event - Click event
     * @fires PageHeaderWithAccountIconAt#edit
     */
    handleEdit(event) {
        event.preventDefault();

        // Dispatch custom event with title context
        this.dispatchEvent(
            new CustomEvent('edit', {
                detail: {
                    title: this.title,
                    action: 'edit'
                },
                bubbles: true,
                composed: true
            })
        );
    }

    /**
     * Handles Delete button click
     * Dispatches custom 'delete' event to parent components
     * @param {Event} event - Click event
     * @fires PageHeaderWithAccountIconAt#delete
     */
    handleDelete(event) {
        event.preventDefault();

        // Dispatch custom event with title context
        this.dispatchEvent(
            new CustomEvent('delete', {
                detail: {
                    title: this.title,
                    action: 'delete'
                },
                bubbles: true,
                composed: true
            })
        );
    }

    /**
     * Handles Clone button click
     * Dispatches custom 'clone' event to parent components
     * @param {Event} event - Click event
     * @fires PageHeaderWithAccountIconAt#clone
     */
    handleClone(event) {
        event.preventDefault();

        // Dispatch custom event with title context
        this.dispatchEvent(
            new CustomEvent('clone', {
                detail: {
                    title: this.title,
                    action: 'clone'
                },
                bubbles: true,
                composed: true
            })
        );
    }
}