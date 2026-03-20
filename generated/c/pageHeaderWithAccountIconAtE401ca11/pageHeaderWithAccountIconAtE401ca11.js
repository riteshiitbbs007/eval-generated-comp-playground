import { LightningElement } from 'lwc';

/**
 * Page Header Component with Account Icon
 *
 * Displays a page header following SLDS 2 design patterns with:
 * - Account icon at standard size positioned left
 * - Title "John Smith" with SLDS heading styling
 * - Subtitle "Account • Customer" with neutral colors
 * - Button group on the right with Edit, Delete, and Clone actions
 * - Responsive layout using SLDS grid system
 * - Full accessibility support with ARIA labels
 */
export default class PageHeaderWithAccountIconAt extends LightningElement {

    /**
     * Handles the Edit button click
     * Dispatches a custom event for parent components to handle the edit action
     */
    handleEdit() {
        // Dispatch custom event for edit action
        this.dispatchEvent(new CustomEvent('edit', {
            detail: {
                action: 'edit',
                recordName: 'John Smith'
            }
        }));

        // TODO: Implement edit functionality based on business requirements
        // This could navigate to edit page, open a modal, or trigger inline editing
        console.log('Edit action triggered');
    }

    /**
     * Handles the Delete button click
     * Dispatches a custom event for parent components to handle the delete action
     */
    handleDelete() {
        // Dispatch custom event for delete action
        this.dispatchEvent(new CustomEvent('delete', {
            detail: {
                action: 'delete',
                recordName: 'John Smith'
            }
        }));

        // TODO: Implement delete functionality based on business requirements
        // This should typically show a confirmation modal before deletion
        console.log('Delete action triggered');
    }

    /**
     * Handles the Clone button click
     * Dispatches a custom event for parent components to handle the clone action
     */
    handleClone() {
        // Dispatch custom event for clone action
        this.dispatchEvent(new CustomEvent('clone', {
            detail: {
                action: 'clone',
                recordName: 'John Smith'
            }
        }));

        // TODO: Implement clone functionality based on business requirements
        // This could navigate to a new record creation page with pre-filled data
        console.log('Clone action triggered');
    }
}