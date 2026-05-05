import { LightningElement, api } from 'lwc';

/**
 * Delete Confirmation Modal
 *
 * A reusable modal component that asks for confirmation before deleting an item.
 * Provides Cancel and Delete buttons for user interaction.
 *
 * @fires DeleteConfirmationModal#cancel - When the user cancels deletion
 * @fires DeleteConfirmationModal#delete - When the user confirms deletion
 */
export default class CreateDeleteConfirmationModal extends LightningElement {
  /**
   * Title for the modal header
   * @type {string}
   * @default "Delete Confirmation"
   */
  @api title = 'Delete Confirmation';

  /**
   * Message to display in the modal body
   * @type {string}
   * @default "Are you sure you want to delete this item? This action cannot be undone."
   */
  @api message = 'Are you sure you want to delete this item? This action cannot be undone.';

  /**
   * Handler for cancel button click
   * Dispatches a cancel event to notify the parent component
   * @private
   */
  handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  /**
   * Handler for delete button click
   * Dispatches a delete event to notify the parent component
   * @private
   */
  handleDelete() {
    this.dispatchEvent(new CustomEvent('delete'));
  }

  /**
   * Returns true if the modal is shown in a hidden state
   * @returns {boolean}
   * @private
   */
  connectedCallback() {
    // Add keydown listener to handle ESC key
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Cleanup event listeners when component is removed
   * @private
   */
  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handles keyboard events, specifically ESC key to close the modal
   * @param {KeyboardEvent} event - The keyboard event
   * @private
   */
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.handleCancel();
    }
  }
}
