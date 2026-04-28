import { LightningElement, api } from 'lwc';

/**
 * Delete Confirmation Modal Component
 * 
 * A modal dialog that prompts users to confirm a destructive delete action.
 * Provides Cancel and Delete buttons with proper accessibility support.
 * 
 * @fires deleteConfirmationModalWithCancelAnd#cancel - Fired when user cancels the delete action
 * @fires deleteConfirmationModalWithCancelAnd#delete - Fired when user confirms the delete action
 */
export default class DeleteConfirmationModalWithCancelAnd extends LightningElement {
    /**
     * Modal header title
     * @type {string}
     * @default "Delete Confirmation"
     */
    @api title = 'Delete Confirmation';

    /**
     * Confirmation message displayed in the modal body
     * @type {string}
     * @default "Are you sure you want to delete this item? This action cannot be undone."
     */
    @api message = 'Are you sure you want to delete this item? This action cannot be undone.';

    /**
     * Label for the cancel button
     * @type {string}
     * @default "Cancel"
     */
    @api cancelLabel = 'Cancel';

    /**
     * Label for the delete button
     * @type {string}
     * @default "Delete"
     */
    @api deleteLabel = 'Delete';

    /**
     * Controls modal visibility
     * @type {boolean}
     * @private
     */
    isOpen = true;

    /**
     * Reference to the previously focused element before modal opened
     * @type {Element|null}
     * @private
     */
    previouslyFocusedElement = null;

    /**
     * Lifecycle hook - called when component is inserted into DOM
     * Sets up focus management for accessibility
     */
    connectedCallback() {
        // Store the currently focused element to restore focus later
        this.previouslyFocusedElement = document.activeElement;
        
        // Set focus to the modal after it renders
        // Using setTimeout to ensure DOM is ready
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.setInitialFocus();
        }, 0);
    }

    /**
     * Lifecycle hook - called when component is removed from DOM
     * Restores focus to the previously focused element
     */
    disconnectedCallback() {
        // Restore focus to the element that had focus before modal opened
        if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
            this.previouslyFocusedElement.focus();
        }
    }

    /**
     * Sets initial focus to the first button in the modal footer
     * @private
     */
    setInitialFocus() {
        const firstButton = this.template.querySelector('.slds-button');
        if (firstButton) {
            firstButton.focus();
        }
    }

    /**
     * Handles Cancel button click
     * Closes the modal and dispatches cancel event
     * @param {Event} event - Click event
     */
    handleCancel() {
        this.closeModal();
        // Dispatch cancel event to parent component
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    /**
     * Handles Delete button click
     * Closes the modal and dispatches delete event
     * @param {Event} event - Click event
     */
    handleDelete() {
        this.closeModal();
        // Dispatch delete event to parent component
        this.dispatchEvent(new CustomEvent('delete'));
    }

    /**
     * Handles backdrop click (clicking outside the modal)
     * Closes the modal as a cancel action
     * @param {Event} event - Click event
     */
    handleBackdropClick() {
        this.handleCancel();
    }

    /**
     * Handles keyboard events for accessibility
     * Closes modal on ESC key press
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        // Close modal on ESC key
        if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            this.handleCancel();
        }
    }

    /**
     * Closes the modal by setting isOpen to false
     * @private
     */
    closeModal() {
        this.isOpen = false;
    }
}