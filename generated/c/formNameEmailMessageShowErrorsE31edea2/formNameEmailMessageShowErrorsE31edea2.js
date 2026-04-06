import { LightningElement, track } from 'lwc';

/**
 * Form component with name, email, and message fields.
 * Validates all fields are required and shows error messages for empty fields.
 * Follows SLDS 2 design patterns and accessibility guidelines.
 */
export default class FormNameEmailMessageShowErrors extends LightningElement {
    // Form field values
    @track nameValue = '';
    @track emailValue = '';
    @track messageValue = '';

    // Error messages for validation
    @track nameError = '';
    @track emailError = '';
    @track messageError = '';

    // Success state
    @track showSuccess = false;

    /**
     * Handles name field change event
     * Clears error when user starts typing
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
        // Clear error when user types
        if (this.nameValue) {
            this.nameError = '';
        }
    }

    /**
     * Handles email field change event
     * Clears error when user starts typing
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
        // Clear error when user types
        if (this.emailValue) {
            this.emailError = '';
        }
    }

    /**
     * Handles message field change event
     * Clears error when user starts typing
     */
    handleMessageChange(event) {
        this.messageValue = event.target.value;
        // Clear error when user types
        if (this.messageValue) {
            this.messageError = '';
        }
    }

    /**
     * Validates all form fields
     * Returns true if all validations pass, false otherwise
     */
    validateForm() {
        let isValid = true;

        // Reset all errors
        this.nameError = '';
        this.emailError = '';
        this.messageError = '';

        // Validate name field
        if (!this.nameValue || this.nameValue.trim() === '') {
            this.nameError = 'Name is required';
            isValid = false;
        }

        // Validate email field
        if (!this.emailValue || this.emailValue.trim() === '') {
            this.emailError = 'Email is required';
            isValid = false;
        } else if (!this.isValidEmail(this.emailValue)) {
            this.emailError = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate message field
        if (!this.messageValue || this.messageValue.trim() === '') {
            this.messageError = 'Message is required';
            isValid = false;
        }

        return isValid;
    }

    /**
     * Validates email format using standard regex pattern
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid email format
     */
    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    /**
     * Handles form submission
     * Validates all fields and shows errors if validation fails
     */
    handleSubmit() {
        // Hide previous success message
        this.showSuccess = false;

        // Validate form
        if (this.validateForm()) {
            // Form is valid - process submission
            console.log('Form submitted with values:');
            console.log('Name:', this.nameValue);
            console.log('Email:', this.emailValue);
            console.log('Message:', this.messageValue);

            // Show success message
            this.showSuccess = true;

            // Reset form after successful submission
            this.resetForm();
        } else {
            // Form has validation errors
            console.log('Form validation failed');
        }
    }

    /**
     * Resets all form fields to empty state
     */
    resetForm() {
        this.nameValue = '';
        this.emailValue = '';
        this.messageValue = '';
        this.nameError = '';
        this.emailError = '';
        this.messageError = '';

        // Hide success message after 3 seconds
        setTimeout(() => {
            this.showSuccess = false;
        }, 3000);
    }

    /**
     * Computed property for name field CSS class
     * Adds error styling when validation fails
     */
    get nameFieldClass() {
        return this.nameError ? 'slds-has-error' : '';
    }

    /**
     * Computed property for email field CSS class
     * Adds error styling when validation fails
     */
    get emailFieldClass() {
        return this.emailError ? 'slds-has-error' : '';
    }

    /**
     * Computed property for message field CSS class
     * Adds error styling when validation fails
     */
    get messageFieldClass() {
        return this.messageError ? 'slds-has-error' : '';
    }
}