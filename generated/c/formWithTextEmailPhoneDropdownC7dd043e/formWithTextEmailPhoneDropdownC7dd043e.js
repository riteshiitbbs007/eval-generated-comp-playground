import { LightningElement } from 'lwc';

/**
 * Form component with multiple input types:
 * - Text input (First Name)
 * - Email input with validation
 * - Phone input with formatting
 * - Dropdown (Country selection)
 * - Checkboxes (Communication preferences)
 * - Textarea (Comments)
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
  // Form field values
  firstName = '';
  email = '';
  phone = '';
  country = '';
  preferences = [];
  comments = '';

  // UI state
  showSuccessMessage = false;

  /**
   * Country options for dropdown
   * Following SLDS combobox pattern with label and value
   */
  get countryOptions() {
    return [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'United Kingdom', value: 'UK' },
      { label: 'Australia', value: 'AU' },
      { label: 'Germany', value: 'DE' },
      { label: 'France', value: 'FR' },
      { label: 'Japan', value: 'JP' },
      { label: 'India', value: 'IN' }
    ];
  }

  /**
   * Preference options for checkboxes
   * Following SLDS checkbox-group pattern
   */
  get preferenceOptions() {
    return [
      { label: 'Email notifications', value: 'email' },
      { label: 'SMS notifications', value: 'sms' },
      { label: 'Newsletter subscription', value: 'newsletter' },
      { label: 'Product updates', value: 'updates' }
    ];
  }

  /**
   * Handle input field changes
   * Unified handler for text, email, phone, dropdown, and textarea
   * @param {Event} event - Input change event
   */
  handleInputChange(event) {
    const field = event.target.name;
    const value = event.target.value;

    // Update the corresponding property
    this[field] = value;

    // Hide success message when user modifies form
    if (this.showSuccessMessage) {
      this.showSuccessMessage = false;
    }
  }

  /**
   * Handle checkbox group changes
   * Separate handler for multi-select checkbox group
   * @param {Event} event - Checkbox change event
   */
  handleCheckboxChange(event) {
    this.preferences = event.detail.value;

    // Hide success message when user modifies form
    if (this.showSuccessMessage) {
      this.showSuccessMessage = false;
    }
  }

  /**
   * Validate all form fields
   * Uses Lightning Base Component built-in validation
   * @returns {boolean} True if all fields are valid
   */
  validateForm() {
    const allInputs = [
      ...this.template.querySelectorAll('lightning-input'),
      ...this.template.querySelectorAll('lightning-combobox'),
      ...this.template.querySelectorAll('lightning-textarea')
    ];

    // Trigger validation on all inputs
    const isValid = allInputs.reduce((validSoFar, input) => {
      input.reportValidity();
      return validSoFar && input.checkValidity();
    }, true);

    return isValid;
  }

  /**
   * Handle form submission
   * Validates form and processes data
   * @param {Event} event - Button click event
   */
  handleSubmit(event) {
    event.preventDefault();

    // Validate form before submission
    if (!this.validateForm()) {
      return;
    }

    // Prepare form data
    const formData = {
      firstName: this.firstName,
      email: this.email,
      phone: this.phone,
      country: this.country,
      preferences: this.preferences,
      comments: this.comments,
      submittedAt: new Date().toISOString()
    };

    // Log form data (in production, this would call an API or Apex method)
    console.log('Form submitted with data:', JSON.stringify(formData, null, 2));

    // Show success message
    this.showSuccessMessage = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);

    // TODO: Integrate with Apex controller or platform event for data persistence
    // TODO: Add error handling for submission failures
  }

  /**
   * Reset form to initial state
   * Clears all field values and validation messages
   * @param {Event} event - Button click event
   */
  handleReset(event) {
    event.preventDefault();

    // Reset all form field values
    this.firstName = '';
    this.email = '';
    this.phone = '';
    this.country = '';
    this.preferences = [];
    this.comments = '';
    this.showSuccessMessage = false;

    // Clear validation messages on all inputs
    const allInputs = [
      ...this.template.querySelectorAll('lightning-input'),
      ...this.template.querySelectorAll('lightning-combobox'),
      ...this.template.querySelectorAll('lightning-textarea')
    ];

    allInputs.forEach(input => {
      input.value = '';
      input.setCustomValidity('');
      input.reportValidity();
    });
  }
}