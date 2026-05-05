import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

/**
 * Page Header Component with Account Icon and Action Buttons
 *
 * Displays a page header following SLDS design patterns with:
 * - Account icon positioned at left
 * - Title and subtitle in center
 * - Action buttons (Edit, Delete, Clone) on right
 *
 * @component pageHeaderWithAccountIconAt
 * @category UI Components
 */
export default class PageHeaderWithAccountIconAt extends LightningElement {
    /**
     * Handles the Edit button click event
     * Dispatches a custom event to notify parent components
     * Shows a toast notification for user feedback
     */
    handleEdit() {
        // Dispatch custom event for parent component handling
        this.dispatchEvent(
            new CustomEvent('edit', {
                detail: {
                    action: 'edit',
                    recordName: 'John Smith'
                }
            })
        );

        // Provide user feedback via toast notification (commented out - not available in local dev)
        // this.showToast('Edit', 'Edit action triggered', 'info');
    }

    /**
     * Handles the Delete button click event
     * Dispatches a custom event to notify parent components
     * Shows a toast notification for user feedback
     */
    handleDelete() {
        // Dispatch custom event for parent component handling
        this.dispatchEvent(
            new CustomEvent('delete', {
                detail: {
                    action: 'delete',
                    recordName: 'John Smith'
                }
            })
        );

        // Provide user feedback via toast notification (commented out - not available in local dev)
        // this.showToast('Delete', 'Delete action triggered', 'warning');
    }

    /**
     * Handles the Clone button click event
     * Dispatches a custom event to notify parent components
     * Shows a toast notification for user feedback
     */
    handleClone() {
        // Dispatch custom event for parent component handling
        this.dispatchEvent(
            new CustomEvent('clone', {
                detail: {
                    action: 'clone',
                    recordName: 'John Smith'
                }
            })
        );

        // Provide user feedback via toast notification (commented out - not available in local dev)
        // this.showToast('Clone', 'Clone action triggered', 'info');
    }

    /**
     * Utility method to display toast notifications
     * Provides consistent user feedback across all actions
     * COMMENTED OUT - not available in local dev environment
     *
     * @param {string} title - Toast title
     * @param {string} message - Toast message
     * @param {string} variant - Toast variant (success, error, warning, info)
     */
    // showToast(title, message, variant) {
    //     const event = new ShowToastEvent({
    //         title: title,
    //         message: message,
    //         variant: variant
    //     });
    //     this.dispatchEvent(event);
    // }
}
