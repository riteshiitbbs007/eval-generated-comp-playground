import { LightningElement, track } from 'lwc';

/**
 * Form component with name, email, and message fields.
 * Validates that all fields are not empty and displays error messages.
 * Errors clear when user starts typing in a field.
 */
export default class FormNameEmailMessageShowErrors extends LightningElement {
    // Form field values
    @track nameValue = '';
    @track emailValue = '';
    @track messageValue = '';

    // Error messages for each field
    @track nameError = '';
    @track emailError = '';
    @track messageError = '';

    /**
     * Handles name field input changes.
     * Clears error message when user starts typing.
     * @param {Event} event - The input change event
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
        // Clear error when user starts typing
        if (this.nameError) {
            this.nameError = '';
        }
    }

    /**
     * Handles email field input changes.
     * Clears error message when user starts typing.
     * @param {Event} event - The input change event
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
        // Clear error when user starts typing
        if (this.emailError) {
            this.emailError = '';
        }
    }

    /**
     * Handles message field input changes.
     * Clears error message when user starts typing.
     * @param {Event} event - The input change event
     */
    handleMessageChange(event) {
        this.messageValue = event.target.value;
        // Clear error when user starts typing
        if (this.messageError) {
            this.messageError = '';
        }
    }

    /**
     * Validates the form and displays error messages for empty fields.
     * @returns {boolean} True if form is valid, false otherwise
     */
    validateForm() {
        let isValid = true;

        // Reset all errors
        this.nameError = '';
        this.emailError = '';
        this.messageError = '';

        // Validate name field
        if (!this.nameValue || this.nameValue.trim() === '') {
            this.nameError = 'Please enter your name';
            isValid = false;
        }

        // Validate email field
        if (!this.emailValue || this.emailValue.trim() === '') {
            this.emailError = 'Please enter your email';
            isValid = false;
        }

        // Validate message field
        if (!this.messageValue || this.messageValue.trim() === '') {
            this.messageError = 'Please enter a message';
            isValid = false;
        }

        return isValid;
    }

    /**
     * Handles form submission.
     * Validates all fields and shows errors if any are empty.
     * @param {Event} event - The button click event
     */
    handleSubmit(event) {
        event.preventDefault();

        // Validate form
        const isValid = this.validateForm();

        if (isValid) {
            // Form is valid - process submission
            // In a real application, this would call an Apex method or perform other actions
            console.log('Form submitted successfully', {
                name: this.nameValue,
                email: this.emailValue,
                message: this.messageValue
            });

            // Optional: Clear form after successful submission
            // this.resetForm();
        }
    }

    /**
     * Resets the form to its initial state.
     * Clears all field values and error messages.
     */
    resetForm() {
        this.nameValue = '';
        this.emailValue = '';
        this.messageValue = '';
        this.nameError = '';
        this.emailError = '';
        this.messageError = '';
    }
}