import { LightningElement, api } from 'lwc';

export default class CreateContactCardWith extends LightningElement {
  // Public properties for component customization
  @api name;
  @api title;
  @api email;
  @api phone;
  @api avatarUrl = '/assets/images/avatar-placeholder.png'; // Default avatar URL

  // Computed properties for href attributes to avoid template literals in HTML
  get emailLink() {
    return `mailto:${this.email}`;
  }

  get emailAriaLabel() {
    return `Send email to ${this.name}`;
  }

  get phoneLink() {
    return `tel:${this.phone}`;
  }

  get phoneAriaLabel() {
    return `Call ${this.name} at ${this.phone}`;
  }

  get avatarTitle() {
    return `${this.name}'s photo`;
  }

  get viewDetailsTitle() {
    return `View ${this.name}'s details`;
  }

  get contactTitle() {
    return `Contact ${this.name}`;
  }

  // Event handlers
  handleViewDetails(event) {
    event.preventDefault();
    // Dispatch custom event for view details
    this.dispatchEvent(
      new CustomEvent('viewdetails', {
        detail: {
          name: this.name,
          email: this.email,
          phone: this.phone,
        },
      }),
    );
  }

  handleContact(event) {
    event.preventDefault();
    // Dispatch custom event for contact action
    this.dispatchEvent(
      new CustomEvent('contact', {
        detail: {
          name: this.name,
          email: this.email,
          phone: this.phone,
        },
      }),
    );
  }
}
