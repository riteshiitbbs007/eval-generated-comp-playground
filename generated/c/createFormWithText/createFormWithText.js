import { LightningElement, track } from 'lwc';

/**
 * @description Form component that implements various input types including
 * text, email, phone, dropdown, checkboxes, and textarea
 */
export default class CreateFormWithText extends LightningElement {
  /**
   * @description Tracks form data state
   * @type {Object}
   */
  @track formData = {
    name: '',
    email: '',
    phone: '',
    preferredContact: '',
    interests: [],
    comments: '',
  };

  /**
   * @description Tracks validation errors
   * @type {Object}
   */
  @track errors = {};

  /**
   * @description Tracks success state of form submission
   * @type {Boolean}
   */
  @track isSuccess = false;

  /**
   * @description Options for preferred contact dropdown
   * @type {Array}
   */
  contactOptions = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Both', value: 'both' },
  ];

  /**
   * @description Options for interests checkboxes
   * @type {Array}
   */
  interestOptions = [
    { label: 'Products', value: 'products' },
    { label: 'Services', value: 'services' },
    { label: 'Support', value: 'support' },
    { label: 'News & Updates', value: 'news' },
  ];

  /**
   * @description Handles changes in form input fields
   * @param {Event} event - The change event
   */
  handleInputChange(event) {
    const { name, value } = event.target;
    this.formData = { ...this.formData, [name]: value };
    this.validateField(name, value);
  }

  /**
   * @description Handles changes in checkbox group
   * @param {Event} event - The change event
   */
  handleCheckboxChange(event) {
    const { name, value } = event.target;
    this.formData = { ...this.formData, [name]: value };
  }

  /**
   * @description Validates a specific form field
   * @param {String} fieldName - The name of the field to validate
   * @param {*} fieldValue - The value to validate
   */
  validateField(fieldName, fieldValue) {
    let errors = { ...this.errors };

    switch (fieldName) {
      case 'name':
        if (!fieldValue || fieldValue.trim() === '') {
          errors.name = 'Name is required';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        if (!fieldValue) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
          errors.email = 'Enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (fieldValue && !/^[0-9+()-\s]*$/.test(fieldValue)) {
          errors.phone = 'Enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'preferredContact':
        if (!fieldValue) {
          errors.preferredContact = 'Please select a preferred contact method';
        } else {
          delete errors.preferredContact;
        }
        break;
      default:
        break;
    }

    this.errors = errors;
  }

  /**
   * @description Validates the entire form
   * @returns {Boolean} True if form is valid, false otherwise
   */
  validateForm() {
    let isValid = true;
    let errors = {};

    // Validate name
    if (!this.formData.name || this.formData.name.trim() === '') {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!this.formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      errors.email = 'Enter a valid email address';
      isValid = false;
    }

    // Validate phone (if provided)
    if (this.formData.phone && !/^[0-9+()-\s]*$/.test(this.formData.phone)) {
      errors.phone = 'Enter a valid phone number';
      isValid = false;
    }

    // Validate preferred contact
    if (!this.formData.preferredContact) {
      errors.preferredContact = 'Please select a preferred contact method';
      isValid = false;
    }

    this.errors = errors;
    return isValid;
  }

  /**
   * @description Handles form submission
   */
  handleSubmit() {
    if (this.validateForm()) {
      // In a real implementation, this would send data to a server
      console.log('Form submitted with data:', this.formData);
      this.isSuccess = true;
      this.resetForm();
    }
  }

  /**
   * @description Resets the form data
   */
  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      preferredContact: '',
      interests: [],
      comments: '',
    };
    this.errors = {};
  }

  /**
   * @description Closes the success message
   */
  closeSuccess() {
    this.isSuccess = false;
  }
}
