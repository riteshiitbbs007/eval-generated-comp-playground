import { LightningElement, api } from 'lwc';

/**
 * Confirmation Modal for Deletion
 *
 * A reusable SLDS-compliant modal component for confirming delete actions.
 * Implements full keyboard accessibility and focus trap as per WCAG 2.1 guidelines.
 *
 * Features:
 * - Medium-sized modal with warning icon
 * - Full keyboard navigation and focus trap
 * - ESC to close, Tab to cycle through focusable elements
 * - Backdrop click to close
 * - Focus returns to trigger element on close
 *
 * @fires confirm - Fired when user confirms the delete action
 * @fires cancel - Fired when user cancels the delete action
 */
export default class ConfirmationModalForDeletionUsingSlds extends LightningElement {
    /**
     * Controls visibility of the modal
     * Must default to false per LWC1099 rule
     * @type {boolean}
     */
    @api show = false;

    /**
     * Reference to the element that triggered the modal
     * Used to restore focus when modal closes
     * @private
     */
    _triggerElement = null;

    /**
     * Array of focusable elements within the modal
     * Used for focus trap implementation
     * @private
     */
    _focusableElements = [];

    /**
     * Index of currently focused element
     * Used for Tab/Shift+Tab navigation
     * @private
     */
    _currentFocusIndex = 0;

    /**
     * Lifecycle hook - called when component is inserted into DOM
     * Sets up focus trap when modal becomes visible
     */
    connectedCallback() {
        // Store reference to element that opened modal for focus restoration
        if (this.show) {
            this._triggerElement = document.activeElement;
        }
    }

    /**
     * Lifecycle hook - called after component renders
     * Initializes focus trap and sets initial focus to Delete button
     */
    renderedCallback() {
        if (this.show) {
            // Initialize focus trap on first render when modal is shown
            this.initializeFocusTrap();
        }
    }

    /**
     * Initializes the focus trap by:
     * 1. Identifying all focusable elements
     * 2. Setting focus to the Delete button (primary action)
     *
     * @private
     */
    initializeFocusTrap() {
        // Get all focusable elements in the modal
        const modal = this.template.querySelector('[role="dialog"]');
        if (!modal) return;

        // Query all interactive elements that can receive focus
        const focusableSelectors = [
            'button',
            'lightning-button',
            'lightning-icon[onclick]',
            '[tabindex]:not([tabindex="-1"])'
        ].join(',');

        const elements = modal.querySelectorAll(focusableSelectors);
        this._focusableElements = Array.from(elements);

        // Set initial focus to Delete button (destructive action)
        const deleteButton = this.template.querySelector('[data-element="delete-button"]');
        if (deleteButton) {
            // Use setTimeout to ensure DOM is fully rendered
            setTimeout(() => {
                deleteButton.focus();
                this._currentFocusIndex = this._focusableElements.indexOf(deleteButton);
            }, 0);
        }
    }

    /**
     * Handles keyboard navigation within the modal
     * Implements:
     * - ESC to close modal
     * - Tab/Shift+Tab for focus cycling (focus trap)
     *
     * @param {KeyboardEvent} event - The keyboard event
     * @private
     */
    handleKeyDown(event) {
        const key = event.key;

        // ESC key closes the modal
        if (key === 'Escape') {
            event.preventDefault();
            this.handleCancel();
            return;
        }

        // Tab key cycles through focusable elements
        if (key === 'Tab') {
            event.preventDefault();
            this.cycleFocus(event.shiftKey);
        }
    }

    /**
     * Cycles focus through focusable elements
     * Creates a focus trap by wrapping around when reaching first/last element
     *
     * @param {boolean} reverse - If true, cycle backwards (Shift+Tab)
     * @private
     */
    cycleFocus(reverse = false) {
        if (this._focusableElements.length === 0) return;

        // Calculate next focus index
        if (reverse) {
            this._currentFocusIndex--;
            if (this._currentFocusIndex < 0) {
                this._currentFocusIndex = this._focusableElements.length - 1;
            }
        } else {
            this._currentFocusIndex++;
            if (this._currentFocusIndex >= this._focusableElements.length) {
                this._currentFocusIndex = 0;
            }
        }

        // Focus the element at the new index
        const elementToFocus = this._focusableElements[this._currentFocusIndex];
        if (elementToFocus) {
            elementToFocus.focus();
        }
    }

    /**
     * Handles backdrop click event
     * Closes modal when user clicks outside the modal container
     *
     * @param {MouseEvent} event - The click event
     * @private
     */
    handleBackdropClick(event) {
        // Only close if clicking directly on backdrop, not on modal content
        if (event.target === event.currentTarget) {
            this.handleCancel();
        }
    }

    /**
     * Handles cancel action
     * Dispatches cancel event and restores focus to trigger element
     *
     * @private
     */
    handleCancel() {
        // Dispatch cancel event to parent component
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));

        // Restore focus to trigger element
        this.restoreFocus();
    }

    /**
     * Handles confirm action
     * Dispatches confirm event and restores focus to trigger element
     *
     * @private
     */
    handleConfirm() {
        // Dispatch confirm event to parent component
        this.dispatchEvent(new CustomEvent('confirm', {
            bubbles: true,
            composed: true
        }));

        // Restore focus to trigger element
        this.restoreFocus();
    }

    /**
     * Restores focus to the element that triggered the modal
     * Called when modal closes to maintain accessibility
     *
     * @private
     */
    restoreFocus() {
        if (this._triggerElement && typeof this._triggerElement.focus === 'function') {
            // Use setTimeout to ensure modal is closed before restoring focus
            setTimeout(() => {
                this._triggerElement.focus();
            }, 100);
        }
    }
}