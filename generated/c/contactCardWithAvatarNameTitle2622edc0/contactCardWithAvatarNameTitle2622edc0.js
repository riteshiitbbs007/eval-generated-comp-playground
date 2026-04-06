import { LightningElement, api } from 'lwc';

/**
 * Contact Card Component
 * Displays contact information including avatar, name, title, email, phone, and action buttons
 * Follows SLDS 2 design guidelines for accessibility and responsive design
 */
export default class ContactCardWithAvatarNameTitle extends LightningElement {
  /**
   * @api contact - Contact object containing:
   *   - name (String): Contact's full name
   *   - title (String): Contact's job title/role
   *   - email (String): Contact's email address
   *   - phone (String): Contact's phone number
   *   - avatarUrl (String): URL to contact's avatar image
   */
  @api contact = {
    name: 'John Doe',
    title: 'Senior Developer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: ''
  };

  /**
   * Computed property: Generate mailto link for email
   * @returns {String} mailto URL with email address
   */
  get emailLink() {
    return this.contact?.email ? `mailto:${this.contact.email}` : '#';
  }

  /**
   * Computed property: Generate tel link for phone
   * @returns {String} tel URL with phone number
   */
  get phoneLink() {
    return this.contact?.phone ? `tel:${this.contact.phone}` : '#';
  }

  /**
   * Computed property: Disable email button if no email provided
   * @returns {Boolean} true if email is missing
   */
  get isEmailDisabled() {
    return !this.contact?.email;
  }

  /**
   * Computed property: Disable call button if no phone provided
   * @returns {Boolean} true if phone is missing
   */
  get isCallDisabled() {
    return !this.contact?.phone;
  }

  /**
   * Handle Email button click
   * Opens default email client with contact's email address
   * @param {Event} event - Click event
   */
  handleEmailClick(event) {
    // Prevent default button behavior
    event.preventDefault();

    // Check if email exists
    if (this.contact?.email) {
      // Open email client with mailto link
      window.location.href = `mailto:${this.contact.email}`;

      // Dispatch custom event for parent component tracking
      this.dispatchEvent(
        new CustomEvent('emailclick', {
          detail: {
            email: this.contact.email,
            contactName: this.contact.name
          }
        })
      );
    }
  }

  /**
   * Handle Call button click
   * Initiates phone call using tel: protocol
   * @param {Event} event - Click event
   */
  handleCallClick(event) {
    // Prevent default button behavior
    event.preventDefault();

    // Check if phone exists
    if (this.contact?.phone) {
      // Open phone dialer with tel link
      window.location.href = `tel:${this.contact.phone}`;

      // Dispatch custom event for parent component tracking
      this.dispatchEvent(
        new CustomEvent('callclick', {
          detail: {
            phone: this.contact.phone,
            contactName: this.contact.name
          }
        })
      );
    }
  }
}