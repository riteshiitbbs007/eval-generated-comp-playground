import { LightningElement } from 'lwc';

/**
 * Page Header with Account Icon Component
 *
 * A page header component that displays account information with:
 * - Account icon on the left (standard size)
 * - Title "John Smith" using SLDS heading styles
 * - Subtitle "Account • Customer" with neutral colors
 * - Action buttons (Edit, Delete, Clone) on the right
 * - Bottom border using SLDS utilities
 *
 * SLDS 2 Compliance:
 * - Uses SLDS styling hooks for colors, spacing, and typography
 * - Semantic color hooks (--slds-g-color-*)
 * - Numbered spacing hooks (--slds-g-spacing-*)
 * - Typography hooks (--slds-g-font-*)
 * - No hard-coded values
 *
 * Accessibility:
 * - WCAG 2.1 AA compliant
 * - Proper color contrast ratios
 * - Keyboard navigation support
 * - ARIA labels on interactive elements
 * - Screen reader friendly
 */
export default class PageHeaderWithAccountIconAtC06Detailed20260312 extends LightningElement {

    /**
     * Handler for Edit button click
     * Dispatches a custom event when the Edit button is clicked
     */
    handleEdit() {
        // Dispatch custom event for Edit action
        this.dispatchEvent(
            new CustomEvent('edit', {
                detail: {
                    action: 'edit',
                    record: 'John Smith'
                }
            })
        );
    }

    /**
     * Handler for Delete button click
     * Dispatches a custom event when the Delete button is clicked
     */
    handleDelete() {
        // Dispatch custom event for Delete action
        this.dispatchEvent(
            new CustomEvent('delete', {
                detail: {
                    action: 'delete',
                    record: 'John Smith'
                }
            })
        );
    }

    /**
     * Handler for Clone button click
     * Dispatches a custom event when the Clone button is clicked
     */
    handleClone() {
        // Dispatch custom event for Clone action
        this.dispatchEvent(
            new CustomEvent('clone', {
                detail: {
                    action: 'clone',
                    record: 'John Smith'
                }
            })
        );
    }
}