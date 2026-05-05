import { LightningElement, track } from 'lwc';

export default class CreateFormNameEmail extends LightningElement {
  // Track form data for reactive updates
  @track formData = {
    name: '',
    email: '',
    message: '',
  };

  // Track validation errors
  @track errors = {
    name: { show: false, message: 'Name is required' },
    email: { show: false, message: 'Email is required' },
    message: { show: false, message: 'Message is required' },
  };

  // Handle input changes
  handleInputChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    // Update form data
    this.formData = {
      ...this.formData,
      [fieldName]: fieldValue,
    };

    // Clear error if field is now valid
    if (fieldValue && fieldValue.trim() !== '') {
      this.errors[fieldName].show = false;
    }
  }

  // Validate a specific field on blur
  handleBlur(event) {
    const fieldName = event.target.name;
    this.validateField(fieldName, this.formData[fieldName]);
  }

  // Validate a specific field
  validateField(fieldName, value) {
    // Check if field is empty
    const isValid = value && value.trim() !== '';

    // Additional validation for email field
    if (fieldName === 'email' && isValid) {
      // Simple email format validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        this.errors.email.show = true;
        this.errors.email.message = 'Please enter a valid email address';
        return false;
      }
    }

    // Update error state
    this.errors[fieldName].show = !isValid;
    return isValid;
  }

  // Validate all fields
  validateForm() {
    let isValid = true;

    // Validate each field
    Object.keys(this.formData).forEach((fieldName) => {
      const fieldValid = this.validateField(fieldName, this.formData[fieldName]);
      isValid = isValid && fieldValid;
    });

    return isValid;
  }

  // Handle form submission
  handleSubmit() {
    // Validate form before submitting
    if (this.validateForm()) {
      // Dispatch event with form data
      const submitEvent = new CustomEvent('formsubmit', {
        detail: { ...this.formData },
      });
      this.dispatchEvent(submitEvent);

      // Reset form after submission
      this.resetForm();
    }
  }

  // Reset form to initial state
  resetForm() {
    this.formData = {
      name: '',
      email: '',
      message: '',
    };

    // Reset errors
    Object.keys(this.errors).forEach((fieldName) => {
      this.errors[fieldName].show = false;
    });
  }
}
