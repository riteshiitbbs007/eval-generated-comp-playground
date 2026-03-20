import { LightningElement, api } from 'lwc';

/**
 * Confirmation Modal for Deletion using SLDS
 *
 * A reusable modal component for confirming delete actions with full accessibility support.
 * Implements SLDS design patterns with focus trap and keyboard navigation.
 *
 * Features:
 * - SLDS medium modal with backdrop
 * - Warning icon in header
 * - Focus trap implementation
 * - Keyboard navigation (Tab, Shift+Tab, ESC)
 * - Focus restoration to trigger element
 * - ARIA attributes for accessibility
 */
export default class ConfirmationModalForDeletionUsingSlds extends LightningElement {
    // Public API Properties

    /**
     * Controls modal visibility
     * MUST default to false per LWC1099 rule for boolean @api properties
     */
    @api isOpen = false;

    /**
     * Reference to the element that triggered the modal
     * Used for focus restoration when modal closes
     */
    @api triggerElement;

    // Private Properties

    /**
     * Array of focusable elements within the modal
     * Used for implementing focus trap
     */
    focusableElements = [];

    /**
     * Index of currently focused element in focusableElements array
     */
    currentFocusIndex = 0;

    /**
     * Flag to track if component has been rendered
     */
    hasRendered = false;

    // Lifecycle Hooks

    /**
     * Runs after component is inserted into DOM
     * Sets up event listeners for keyboard handling
     */
    connectedCallback() {
        // Bind keyboard handler to capture ESC and Tab keys
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    /**
     * Runs before component is removed from DOM
     * Cleans up event listeners
     */
    disconnectedCallback() {
        // Clean up to prevent memory leaks
        this.focusableElements = [];
    }

    /**
     * Runs after component renders or re-renders
     * Sets up focus trap when modal opens
     */
    renderedCallback() {
        // Only set up focus trap when modal opens
        if (this.isOpen && !this.hasRendered) {
            this.hasRendered = true;
            this.setupFocusTrap();
        } else if (!this.isOpen) {
            this.hasRendered = false;
        }
    }

    // Focus Trap Implementation

    /**
     * Sets up the focus trap for the modal
     * Finds all focusable elements and moves focus to Delete button
     */
    setupFocusTrap() {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
            // Find all focusable elements in the modal
            const modal = this.template.querySelector('[role="dialog"]');
            if (modal) {
                // Query all interactive elements
                const focusableSelectors = [
                    'button',
                    '[href]',
                    'input',
                    'select',
                    'textarea',
                    '[tabindex]:not([tabindex="-1"])'
                ].join(',');

                this.focusableElements = Array.from(
                    modal.querySelectorAll(focusableSelectors)
                );

                // Focus on Delete button (last button in footer) per requirements
                const deleteButton = this.template.querySelector('[data-id="delete-button"]');
                if (deleteButton) {
                    deleteButton.focus();
                    // Set current focus index to delete button position
                    this.currentFocusIndex = this.focusableElements.indexOf(deleteButton);
                }
            }
        }, 0);
    }

    /**
     * Handles keyboard events for focus trap and modal interactions
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        const key = event.key;

        // Handle ESC key - close modal
        if (key === 'Escape') {
            event.preventDefault();
            this.handleCancel();
            return;
        }

        // Handle Tab key - cycle through focusable elements
        if (key === 'Tab') {
            event.preventDefault();

            if (this.focusableElements.length === 0) {
                return;
            }

            // Determine direction (forward or backward)
            if (event.shiftKey) {
                // Shift+Tab - move backward
                this.currentFocusIndex--;
                if (this.currentFocusIndex < 0) {
                    // Wrap to last element
                    this.currentFocusIndex = this.focusableElements.length - 1;
                }
            } else {
                // Tab - move forward
                this.currentFocusIndex++;
                if (this.currentFocusIndex >= this.focusableElements.length) {
                    // Wrap to first element
                    this.currentFocusIndex = 0;
                }
            }

            // Focus the element at current index
            const elementToFocus = this.focusableElements[this.currentFocusIndex];
            if (elementToFocus) {
                elementToFocus.focus();
            }
        }
    }

    // Event Handlers

    /**
     * Handles cancel action (close button, cancel button, ESC key, backdrop click)
     * Fires 'cancel' event and restores focus to trigger element
     */
    handleCancel() {
        // Fire cancel event with timestamp
        this.dispatchEvent(new CustomEvent('cancel', {
            detail: {
                timestamp: new Date().toISOString()
            }
        }));

        // Restore focus to trigger element
        this.restoreFocus();
    }

    /**
     * Handles delete confirmation action
     * Fires 'delete' event and restores focus to trigger element
     */
    handleDelete() {
        // Fire delete event with timestamp
        this.dispatchEvent(new CustomEvent('delete', {
            detail: {
                timestamp: new Date().toISOString()
            }
        }));

        // Restore focus to trigger element
        this.restoreFocus();
    }

    /**
     * Handles backdrop click to close modal
     * @param {MouseEvent} event - The click event
     */
    handleBackdropClick(event) {
        // Only close if clicking directly on backdrop (not bubbled from modal)
        if (event.target.classList.contains('slds-backdrop')) {
            this.handleCancel();
        }
    }

    // Helper Methods

    /**
     * Restores focus to the trigger element that opened the modal
     * Called when modal closes
     */
    restoreFocus() {
        // Return focus to trigger element if available
        if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
            // Use setTimeout to ensure modal is closed before focusing
            setTimeout(() => {
                this.triggerElement.focus();
            }, 0);
        }
    }
}