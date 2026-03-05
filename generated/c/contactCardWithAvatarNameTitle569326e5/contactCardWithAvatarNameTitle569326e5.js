import { LightningElement, api } from 'lwc';

/**
 * Contact Card Component
 * Displays contact information with avatar, name, title, email, phone, and action buttons
 * Following SLDS 2.x design patterns and accessibility guidelines
 */
export default class ContactCardWithAvatarNameTitle extends LightningElement {
    // Public API properties for contact information
    // All boolean @api properties MUST default to false per LWC requirements

    /**
     * @api {string} name - Contact's full name (required)
     */
    @api name = '';

    /**
     * @api {string} title - Contact's job title/role
     */
    @api title = '';

    /**
     * @api {string} email - Contact's email address
     */
    @api email = '';

    /**
     * @api {string} phone - Contact's phone number
     */
    @api phone = '';

    /**
     * @api {string} avatarUrl - URL to contact's profile image
     */
    @api avatarUrl = '';

    /**
     * @api {string} avatarInitials - Fallback initials for avatar (e.g., "JD")
     */
    @api avatarInitials = '';

    /**
     * Computed getter for email href attribute
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Mailto link
     */
    get emailHref() {
        return this.email ? `mailto:${this.email}` : '';
    }

    /**
     * Computed getter for phone href attribute
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Tel link
     */
    get phoneHref() {
        return this.phone ? `tel:${this.phone}` : '';
    }

    /**
     * Computed getter for email aria-label
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Accessible label for email link
     */
    get emailAriaLabel() {
        return this.email ? `Send email to ${this.name}` : 'Email';
    }

    /**
     * Computed getter for phone aria-label
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Accessible label for phone link
     */
    get phoneAriaLabel() {
        return this.phone ? `Call ${this.name}` : 'Phone';
    }

    /**
     * Computed getter for edit button aria-label
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Accessible label for edit button
     */
    get editAriaLabel() {
        return `Edit ${this.name}'s information`;
    }

    /**
     * Computed getter for delete button aria-label
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Accessible label for delete button
     */
    get deleteAriaLabel() {
        return `Delete ${this.name}`;
    }

    /**
     * Computed getter for avatar alt text
     * Required to avoid template literals in HTML (LWC1058 compilation error)
     * @returns {string} Accessible description for avatar
     */
    get avatarAltText() {
        return `${this.name}'s avatar`;
    }

    /**
     * Check if avatarUrl is provided
     * @returns {boolean} True if avatar URL exists
     */
    get hasAvatarUrl() {
        return !!this.avatarUrl;
    }

    /**
     * Get display initials with fallback
     * Returns provided avatarInitials or generates from name
     * @returns {string} Initials to display (max 2 characters)
     */
    get displayInitials() {
        if (this.avatarInitials) {
            return this.avatarInitials.substring(0, 2).toUpperCase();
        }

        // Generate initials from name if not provided
        if (this.name) {
            const nameParts = this.name.trim().split(/\s+/);
            if (nameParts.length >= 2) {
                // First and last name initials
                return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
            } else {
                // Single name - take first two characters
                return this.name.substring(0, 2).toUpperCase();
            }
        }

        return '?';
    }

    /**
     * Handle edit button click
     * Dispatches 'edit' event to parent component
     */
    handleEdit() {
        const editEvent = new CustomEvent('edit', {
            detail: {
                name: this.name,
                title: this.title,
                email: this.email,
                phone: this.phone,
                avatarUrl: this.avatarUrl,
                avatarInitials: this.avatarInitials
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(editEvent);
    }

    /**
     * Handle delete button click
     * Dispatches 'delete' event to parent component
     */
    handleDelete() {
        const deleteEvent = new CustomEvent('delete', {
            detail: {
                name: this.name,
                email: this.email
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(deleteEvent);
    }
}