import { LightningElement, api } from 'lwc';

/**
 * PageHeaderJohnSmithWithAccount Component
 * Displays a page header with title, icon, and action buttons.
 * @example
 * <c-page-header-john-smith-with-account
 *      title="John Smith"
 *      show-edit-button
 *      show-delete-button
 *      show-clone-button>
 * </c-page-header-john-smith-with-account>
 */
export default class PageHeaderJohnSmithWithAccount extends LightningElement {
    /**
     * The title displayed in the page header
     * @type {String}
     * @default John Smith
     */
    @api
    title = 'John Smith';

    /**
     * The subtitle displayed below the title
     * @type {String}
     */
    @api
    subtitle = '';

    /**
     * Size of the icon
     * @type {String}
     * @default medium
     */
    @api
    iconSize = 'medium';

    /**
     * Whether to show the Edit button
     * @type {Boolean}
     * @default false
     */
    @api
    showEditButton = false;

    /**
     * Whether to show the Delete button
     * @type {Boolean}
     * @default false
     */
    @api
    showDeleteButton = false;

    /**
     * Whether to show the Clone button
     * @type {Boolean}
     * @default false
     */
    @api
    showCloneButton = false;

    /**
     * Label for the Edit button
     * @type {String}
     * @default Edit
     */
    @api
    editButtonLabel = 'Edit';

    /**
     * Label for the Delete button
     * @type {String}
     * @default Delete
     */
    @api
    deleteButtonLabel = 'Delete';

    /**
     * Label for the Clone button
     * @type {String}
     * @default Clone
     */
    @api
    cloneButtonLabel = 'Clone';

    /**
     * Variant for the Edit button
     * @type {String}
     * @default neutral
     */
    @api
    editButtonVariant = 'neutral';

    /**
     * Variant for the Delete button
     * @type {String}
     * @default neutral
     */
    @api
    deleteButtonVariant = 'neutral';

    /**
     * Variant for the Clone button
     * @type {String}
     * @default neutral
     */
    @api
    cloneButtonVariant = 'neutral';

    /**
     * Determines if the subtitle should be displayed
     * @returns {Boolean} True if subtitle has a value
     */
    get hasSubtitle() {
        return !!this.subtitle;
    }

    /**
     * Creates an accessible aria label for the title
     * @returns {String} Formatted aria label
     */
    get titleAriaLabel() {
        return `${this.title} page`;
    }

    /**
     * Handles the Edit button click event
     * @param {Event} event - The click event
     */
    handleEditClick(event) {
        this.dispatchCustomEvent('edit');
    }

    /**
     * Handles the Delete button click event
     * @param {Event} event - The click event
     */
    handleDeleteClick(event) {
        this.dispatchCustomEvent('delete');
    }

    /**
     * Handles the Clone button click event
     * @param {Event} event - The click event
     */
    handleCloneClick(event) {
        this.dispatchCustomEvent('clone');
    }

    /**
     * Helper method to dispatch custom events
     * @param {String} eventName - The name of the event to dispatch
     */
    dispatchCustomEvent(eventName) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}