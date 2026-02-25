import { LightningElement, api, track } from 'lwc';

/**
 * Contact Form component that collects name, email and message
 * with validation and error display
 */
export default class CreateContactFormName extends LightningElement {
    // Public properties
    @api submitButtonLabel = 'Submit';
    @api showHeader = false;
    @api headerText = 'Contact Form';

    // Private tracked properties for field values
    @track name = '';
    @track email = '';
    @track message = '';

    // Error states
    @track nameError = '';
    @track emailError = '';
    @track messageError = '';

    // Track form submission state
    @track isSubmitting = false;
    @track submitSuccess = false;
    @track submitError = false;

    // Email validation regex
    emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Minimum message length
    messageMinLength = 10;

    /**
     * Handles input change events and updates tracked properties
     * @param {Event} event - The input change event
     */
    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        // Update the field value
        this[fieldName] = fieldValue;

        // Clear the field error
        this[`${fieldName}Error`] = '';
    }

    /**
     * Validates the name field
     * @returns {boolean} - True if valid, false otherwise
     */
    validateName() {
        if (!this.name || this.name.trim() === '') {
            this.nameError = 'Name is required';
            return false;
        }
        return true;
    }

    /**
     * Validates the email field format
     * @returns {boolean} - True if valid, false otherwise
     */
    validateEmail() {
        if (!this.email || this.email.trim() === '') {
            this.emailError = 'Email is required';
            return false;
        }
        if (!this.emailRegex.test(this.email)) {
            this.emailError = 'Please enter a valid email address';
            return false;
        }
        return true;
    }

    /**
     * Validates the message field length
     * @returns {boolean} - True if valid, false otherwise
     */
    validateMessage() {
        if (!this.message || this.message.trim() === '') {
            this.messageError = 'Message is required';
            return false;
        }
        if (this.message.trim().length < this.messageMinLength) {
            this.messageError = `Message must be at least ${this.messageMinLength} characters`;
            return false;
        }
        return true;
    }

    /**
     * Validates all form fields
     * @returns {boolean} - True if all fields are valid, false otherwise
     */
    validateForm() {
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const messageValid = this.validateMessage();

        return nameValid && emailValid && messageValid;
    }

    /**
     * Handles form submission
     */
    handleSubmit() {
        if (this.validateForm()) {
            this.isSubmitting = true;

            // Create form data object
            const formData = {
                name: this.name,
                email: this.email,
                message: this.message
            };

            // Dispatch custom event with form data
            this.dispatchEvent(new CustomEvent('formsubmit', {
                detail: formData
            }));

            // Reset form after successful submission
            this.submitSuccess = true;
            this.isSubmitting = false;
            this.resetForm();
        }
    }

    /**
     * Resets the form fields and states
     */
    resetForm() {
        this.name = '';
        this.email = '';
        this.message = '';
        this.nameError = '';
        this.emailError = '';
        this.messageError = '';
    }

    /**
     * Returns the appropriate classes for input fields
     * @param {string} fieldName - The field name
     * @returns {string} - CSS classes for the input field
     */
    fieldClass(fieldName) {
        return this[`${fieldName}Error`] ? 'slds-has-error' : '';
    }

    /**
     * Computed property to determine if name field has error
     */
    get nameHasError() {
        return this.nameError !== '';
    }

    /**
     * Computed property to determine if email field has error
     */
    get emailHasError() {
        return this.emailError !== '';
    }

    /**
     * Computed property to determine if message field has error
     */
    get messageHasError() {
        return this.messageError !== '';
    }

    /**
     * Computed property for submit button disabled state
     */
    get isSubmitDisabled() {
        return this.isSubmitting;
    }

    /**
     * Aria label for name field
     */
    get nameAriaDescribedBy() {
        return this.nameHasError ? 'name-error' : '';
    }

    /**
     * Aria label for email field
     */
    get emailAriaDescribedBy() {
        return this.emailHasError ? 'email-error' : '';
    }

    /**
     * Aria label for message field
     */
    get messageAriaDescribedBy() {
        return this.messageHasError ? 'message-error' : '';
    }
}