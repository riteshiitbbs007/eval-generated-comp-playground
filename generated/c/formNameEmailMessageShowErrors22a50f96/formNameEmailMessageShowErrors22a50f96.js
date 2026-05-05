import { LightningElement, track } from 'lwc';

/**
 * Form component with name, email, and message fields.
 * Validates that all fields are filled before submission.
 * Shows error messages for empty fields and success message on valid submission.
 */
export default class FormNameEmailMessageShowErrors extends LightningElement {
    // Field values tracked for form data
    @track nameValue = '';
    @track emailValue = '';
    @track messageValue = '';

    // Error state tracking
    @track nameError = false;
    @track emailError = false;
    @track messageError = false;

    // Success state
    @track showSuccess = false;

    /**
     * Computed getter for name field error message.
     * Returns error message when name field has error state.
     */
    get nameErrorMessage() {
        return this.nameError ? 'Please enter your name' : '';
    }

    /**
     * Computed getter for email field error message.
     * Returns error message when email field has error state.
     */
    get emailErrorMessage() {
        return this.emailError ? 'Please enter your email' : '';
    }

    /**
     * Computed getter for message field error message.
     * Returns error message when message field has error state.
     */
    get messageErrorMessage() {
        return this.messageError ? 'Please enter a message' : '';
    }

    /**
     * Handle name field change.
     * Clears error state when user starts typing.
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
        this.nameError = false;
        this.showSuccess = false;
    }

    /**
     * Handle email field change.
     * Clears error state when user starts typing.
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
        this.emailError = false;
        this.showSuccess = false;
    }

    /**
     * Handle message field change.
     * Clears error state when user starts typing.
     */
    handleMessageChange(event) {
        this.messageValue = event.target.value;
        this.messageError = false;
        this.showSuccess = false;
    }

    /**
     * Handle form submission.
     * Validates all fields are filled and shows appropriate feedback.
     */
    handleSubmit(event) {
        // Prevent default form submission
        event.preventDefault();

        // Reset all error states
        this.nameError = false;
        this.emailError = false;
        this.messageError = false;
        this.showSuccess = false;

        // Validate all fields
        let isValid = true;

        // Check name field
        if (!this.nameValue || this.nameValue.trim() === '') {
            this.nameError = true;
            isValid = false;
        }

        // Check email field
        if (!this.emailValue || this.emailValue.trim() === '') {
            this.emailError = true;
            isValid = false;
        }

        // Check message field
        if (!this.messageValue || this.messageValue.trim() === '') {
            this.messageError = true;
            isValid = false;
        }

        // Show success if all fields are valid
        if (isValid) {
            this.showSuccess = true;

            // Log form data for verification (can be removed in production)
            console.log('Form submitted:', {
                name: this.nameValue,
                email: this.emailValue,
                message: this.messageValue
            });
        }
    }
}