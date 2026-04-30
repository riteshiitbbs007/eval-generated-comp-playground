import { LightningElement, api } from 'lwc';

/**
 * Contact Card Component
 *
 * Displays contact information with avatar, name, title, email, phone, and optional action buttons.
 * Follows SLDS 2.x patterns with proper accessibility and semantic HTML.
 *
 * @fires ContactCard#edit - Fires when the Edit button is clicked
 * @fires ContactCard#delete - Fires when the Delete button is clicked
 * @fires ContactCard#share - Fires when the Share button is clicked
 */
export default class ContactCardWithAvatarNameTitle extends LightningElement {
    /**
     * The contact's full name
     * @type {string}
     * @api
     */
    @api contactName;

    /**
     * The contact's job title or role
     * @type {string}
     * @api
     */
    @api title;

    /**
     * The contact's email address
     * @type {string}
     * @api
     */
    @api email;

    /**
     * The contact's phone number
     * @type {string}
     * @api
     */
    @api phone;

    /**
     * URL to the contact's avatar image
     * @type {string}
     * @api
     */
    @api avatarUrl;

    /**
     * Whether to display action buttons (edit, delete, share)
     * Must default to false per LWC1099 requirement
     * @type {boolean}
     * @api
     * @default false
     */
    @api showActions = false;

    /**
     * Computed getter for email mailto link
     * Returns proper mailto: URL for email links
     * @returns {string} Mailto URL or empty string
     */
    get emailHref() {
        return this.email ? `mailto:${this.email}` : '';
    }

    /**
     * Computed getter for phone tel link
     * Returns proper tel: URL for phone links
     * @returns {string} Tel URL or empty string
     */
    get phoneHref() {
        return this.phone ? `tel:${this.phone}` : '';
    }

    /**
     * Computed getter for avatar alt text
     * Provides accessible description for avatar image
     * @returns {string} Alt text for avatar
     */
    get avatarAltText() {
        return this.contactName ? `${this.contactName} avatar` : 'Contact avatar';
    }

    /**
     * Computed getter for email link aria-label
     * Provides accessible label for email link
     * @returns {string} Aria label for email link
     */
    get emailAriaLabel() {
        return this.contactName && this.email
            ? `Send email to ${this.contactName} at ${this.email}`
            : `Send email to ${this.email}`;
    }

    /**
     * Computed getter for phone link aria-label
     * Provides accessible label for phone link
     * @returns {string} Aria label for phone link
     */
    get phoneAriaLabel() {
        return this.contactName && this.phone
            ? `Call ${this.contactName} at ${this.phone}`
            : `Call ${this.phone}`;
    }

    /**
     * Computed getter for edit button aria-label
     * Provides accessible label for edit button
     * @returns {string} Aria label for edit button
     */
    get editAriaLabel() {
        return this.contactName
            ? `Edit ${this.contactName} contact information`
            : 'Edit contact information';
    }

    /**
     * Computed getter for delete button aria-label
     * Provides accessible label for delete button
     * @returns {string} Aria label for delete button
     */
    get deleteAriaLabel() {
        return this.contactName
            ? `Delete ${this.contactName} contact`
            : 'Delete contact';
    }

    /**
     * Computed getter for share button aria-label
     * Provides accessible label for share button
     * @returns {string} Aria label for share button
     */
    get shareAriaLabel() {
        return this.contactName
            ? `Share ${this.contactName} contact information`
            : 'Share contact information';
    }

    /**
     * Handles the edit button click
     * Fires a custom 'edit' event with contact details
     * @param {Event} event - The click event
     * @fires ContactCard#edit
     */
    handleEdit(event) {
        event.preventDefault();
        this.dispatchEvent(
            new CustomEvent('edit', {
                detail: {
                    contactName: this.contactName,
                    title: this.title,
                    email: this.email,
                    phone: this.phone,
                    avatarUrl: this.avatarUrl
                }
            })
        );
    }

    /**
     * Handles the delete button click
     * Fires a custom 'delete' event with contact name
     * @param {Event} event - The click event
     * @fires ContactCard#delete
     */
    handleDelete(event) {
        event.preventDefault();
        this.dispatchEvent(
            new CustomEvent('delete', {
                detail: {
                    contactName: this.contactName
                }
            })
        );
    }

    /**
     * Handles the share button click
     * Fires a custom 'share' event with contact details
     * @param {Event} event - The click event
     * @fires ContactCard#share
     */
    handleShare(event) {
        event.preventDefault();
        this.dispatchEvent(
            new CustomEvent('share', {
                detail: {
                    contactName: this.contactName,
                    title: this.title,
                    email: this.email,
                    phone: this.phone
                }
            })
        );
    }
}