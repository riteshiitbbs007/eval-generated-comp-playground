import { LightningElement, api } from 'lwc';

/**
 * Page Header Component with Account Icon
 * 
 * Displays a page header with an account icon, title, subtitle, and action buttons.
 * Follows SLDS design system patterns for page headers.
 */
export default class PageHeaderWithAccountIconAt extends LightningElement {
    /**
     * The title to display in the page header
     * @type {string}
     */
    @api title = 'John Smith';

    /**
     * The subtitle to display below the title
     * @type {string}
     */
    @api subtitle = 'Account • Customer';

    /**
     * Handler for Edit button click
     * Dispatches a custom event that parent components can listen to
     */
    handleEdit() {
        this.dispatchEvent(
            new CustomEvent('edit', {
                detail: {
                    action: 'edit',
                    title: this.title
                }
            })
        );
    }

    /**
     * Handler for Delete button click
     * Dispatches a custom event that parent components can listen to
     */
    handleDelete() {
        this.dispatchEvent(
            new CustomEvent('delete', {
                detail: {
                    action: 'delete',
                    title: this.title
                }
            })
        );
    }

    /**
     * Handler for Clone button click
     * Dispatches a custom event that parent components can listen to
     */
    handleClone() {
        this.dispatchEvent(
            new CustomEvent('clone', {
                detail: {
                    action: 'clone',
                    title: this.title
                }
            })
        );
    }
}