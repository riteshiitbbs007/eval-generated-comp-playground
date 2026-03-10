import { LightningElement, api } from 'lwc';

/**
 * Delete Confirmation Modal Component
 *
 * A reusable modal dialog for confirming delete actions. Provides a warning context
 * with Cancel and Delete action buttons. Implements SLDS 2 modal patterns with
 * full accessibility support including keyboard navigation and focus management.
 *
 * @fires DeleteConfirmationModalWithCancelAnd#delete - Fired when user confirms deletion
 * @fires DeleteConfirmationModalWithCancelAnd#cancel - Fired when user cancels the action
 */
export default class DeleteConfirmationModalWithCancelAnd extends LightningElement {

    // Public API Properties

    /**
     * Modal heading text displayed in the header
     * @type {string}
     * @default 'Confirm Delete'
     */
    @api title = 'Confirm Delete';

    /**
     * Main confirmation message displayed in the modal body
     * @type {string}
     * @default 'Are you sure you want to delete this item? This action cannot be undone.'
     */
    @api message = 'Are you sure you want to delete this item? This action cannot be undone.';

    /**
     * Label text for the delete button
     * @type {string}
     * @default 'Delete'
     */
    @api deleteLabel = 'Delete';

    /**
     * Label text for the cancel button
     * @type {string}
     * @default 'Cancel'
     */
    @api cancelLabel = 'Cancel';

    /**
     * Controls modal visibility
     * IMPORTANT: Must default to false per LWC1099 rule
     * @type {boolean}
     * @default false
     */
    @api show = false;

    // Private Properties for Focus Management

    /**
     * Stores the element that had focus before modal opened
     * Used to restore focus when modal closes
     * @type {HTMLElement|null}
     */
    previousFocusElement = null;

    // Computed Properties for Accessibility

    /**
     * Generates accessible aria-label for close button
     * Avoids template literals in HTML per LWC1058 restriction
     * @returns {string} Aria label for close button
     */
    get closeButtonAriaLabel() {
        return `Close ${this.title} dialog`;
    }

    // Lifecycle Hooks

    /**
     * Called when component is inserted into DOM
     * Sets up focus management when modal is shown
     */
    connectedCallback() {
        if (this.show) {
            this.setupFocusManagement();
        }
    }

    /**
     * Called when a public property changes
     * Handles focus management when show property changes
     * @param {Object} changedProps - Map of changed properties
     */
    renderedCallback() {
        if (this.show) {
            this.setupFocusManagement();
        } else if (this.previousFocusElement) {
            // Restore focus to previous element when modal closes
            this.previousFocusElement.focus();
            this.previousFocusElement = null;
        }
    }

    // Event Handlers

    /**
     * Handles Delete button click
     * Dispatches 'delete' custom event to parent component
     * @param {Event} event - Click event
     */
    handleDelete(event) {
        event.preventDefault();

        // Dispatch custom event to notify parent of deletion confirmation
        this.dispatchEvent(new CustomEvent('delete', {
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handles Cancel button click and close icon click
     * Dispatches 'cancel' custom event to parent component
     * @param {Event} event - Click event
     */
    handleCancel(event) {
        event.preventDefault();

        // Dispatch custom event to notify parent of cancellation
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handles backdrop click to close modal
     * Clicking outside the modal should cancel the action
     * @param {Event} event - Click event
     */
    handleBackdropClick(event) {
        event.preventDefault();
        this.handleCancel(event);
    }

    /**
     * Handles keyboard events for accessibility
     * Supports ESC key to close modal and Tab for focus trap
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        // ESC key closes the modal
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.preventDefault();
            this.handleCancel(event);
        }

        // Tab key - implement focus trap
        if (event.key === 'Tab' || event.keyCode === 9) {
            this.trapFocus(event);
        }
    }

    // Focus Management Methods

    /**
     * Sets up focus management when modal opens
     * Stores previous focus and moves focus to modal
     */
    setupFocusManagement() {
        // Store the element that currently has focus
        if (!this.previousFocusElement && document.activeElement) {
            this.previousFocusElement = document.activeElement;
        }

        // Move focus to the modal dialog
        const modalElement = this.template.querySelector('[role="dialog"]');
        if (modalElement) {
            // Use setTimeout to ensure modal is fully rendered
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                modalElement.focus();
            }, 0);
        }
    }

    /**
     * Implements focus trap to keep focus within modal
     * Ensures keyboard users can't tab outside the modal
     * @param {KeyboardEvent} event - Tab key event
     */
    trapFocus(event) {
        const modalElement = this.template.querySelector('[role="dialog"]');
        if (!modalElement) return;

        // Get all focusable elements within the modal
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If shift+tab on first element, move to last element
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
        // If tab on last element, move to first element
        else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}