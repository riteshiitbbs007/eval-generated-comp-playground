import { LightningElement, api } from 'lwc';

/**
 * Comprehensive Contact Form Component
 *
 * A fully-featured contact form with name, email, and message fields.
 * Includes robust validation, error handling, and SLDS styling.
 *
 * Features:
 * - Name field: required, max 100 chars, letters and spaces only
 * - Email field: required, proper email validation
 * - Message field: required, min 10 chars, max 500 chars, character counter
 * - Real-time validation on blur and form submit
 * - SLDS error styling with error icons
 * - Success message after submission
 * - Accessibility compliant with ARIA labels and error announcements
 */
export default class ComprehensiveContactFormWithNameField extends LightningElement {
    // ======================
    // Form Field Values
    // ======================

    /** Current value of the name field */
    nameValue = '';

    /** Current value of the email field */
    emailValue = '';

    /** Current value of the message field */
    messageValue = '';

    // ======================
    // Validation Error States
    // ======================

    /** Error message for name field (null if no error) */
    nameError = null;

    /** Error message for email field (null if no error) */
    emailError = null;

    /** Error message for message field (null if no error) */
    messageError = null;

    // ======================
    // Component State
    // ======================

    /** Flag indicating if form is currently being submitted */
    isSubmitting = false;

    /** Flag to show success message after submission */
    showSuccessMessage = false;

    // ======================
    // Validation Constants
    // ======================

    /** Maximum allowed characters for name field */
    static MAX_NAME_LENGTH = 100;

    /** Minimum required characters for message field */
    static MIN_MESSAGE_LENGTH = 10;

    /** Maximum allowed characters for message field */
    static MAX_MESSAGE_LENGTH = 500;

    /** Regex pattern for name validation (letters and spaces only) */
    static NAME_PATTERN = /^[a-zA-Z\s]*$/;

    /** Regex pattern for email validation */
    static EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ======================
    // Computed Properties - Error IDs
    // ======================

    /**
     * Computed ID for name error element (for ARIA describedby)
     * Using getter to avoid template literals in HTML
     */
    get nameErrorId() {
        return 'name-error';
    }

    /**
     * Computed ID for email error element (for ARIA describedby)
     * Using getter to avoid template literals in HTML
     */
    get emailErrorId() {
        return 'email-error';
    }

    /**
     * Computed ID for message error element (for ARIA describedby)
     * Using getter to avoid template literals in HTML
     */
    get messageErrorId() {
        return 'message-error';
    }

    // ======================
    // Computed Properties - CSS Classes
    // ======================

    /**
     * CSS class for name field with error state
     * Returns appropriate class based on whether field has error
     */
    get nameFieldClass() {
        return this.nameError ? 'slds-has-error' : '';
    }

    /**
     * CSS class for email field with error state
     * Returns appropriate class based on whether field has error
     */
    get emailFieldClass() {
        return this.emailError ? 'slds-has-error' : '';
    }

    /**
     * CSS class for message field with error state
     * Returns appropriate class based on whether field has error
     */
    get messageFieldClass() {
        return this.messageError ? 'slds-has-error' : '';
    }

    // ======================
    // Computed Properties - ARIA States
    // ======================

    /**
     * ARIA invalid state for name field
     * Returns string 'true' or 'false' for aria-invalid attribute
     */
    get hasNameError() {
        return this.nameError ? 'true' : 'false';
    }

    /**
     * ARIA invalid state for email field
     * Returns string 'true' or 'false' for aria-invalid attribute
     */
    get hasEmailError() {
        return this.emailError ? 'true' : 'false';
    }

    /**
     * ARIA invalid state for message field
     * Returns string 'true' or 'false' for aria-invalid attribute
     */
    get hasMessageError() {
        return this.messageError ? 'true' : 'false';
    }

    // ======================
    // Computed Properties - Character Counter
    // ======================

    /**
     * Character count display text
     * Shows current character count vs maximum (e.g., "25 / 500 characters")
     * Using getter to avoid template literals in HTML
     */
    get characterCountText() {
        const currentLength = this.messageValue ? this.messageValue.length : 0;
        return `${currentLength} / ${ComprehensiveContactFormWithNameField.MAX_MESSAGE_LENGTH} characters`;
    }

    /**
     * CSS class for character counter
     * Changes color based on character count approaching limit
     */
    get characterCountClass() {
        const currentLength = this.messageValue ? this.messageValue.length : 0;
        const maxLength = ComprehensiveContactFormWithNameField.MAX_MESSAGE_LENGTH;

        // Show warning color when approaching limit (90% or more)
        if (currentLength >= maxLength * 0.9) {
            return 'slds-text-color_error';
        }

        // Show info color when halfway (50% or more)
        if (currentLength >= maxLength * 0.5) {
            return 'slds-text-color_weak';
        }

        // Default color
        return 'slds-text-color_default';
    }

    // ======================
    // Computed Properties - Submit Button
    // ======================

    /**
     * Icon name for submit button
     * Shows spinner when submitting, null otherwise
     */
    get submitButtonIcon() {
        return this.isSubmitting ? 'utility:spinner' : null;
    }

    // ======================
    // Event Handlers - Field Changes
    // ======================

    /**
     * Handles changes to the name field
     * Updates the name value and clears any existing error
     * @param {Event} event - The change event from lightning-input
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
        // Clear error when user starts typing
        this.nameError = null;
    }

    /**
     * Handles changes to the email field
     * Updates the email value and clears any existing error
     * @param {Event} event - The change event from lightning-input
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
        // Clear error when user starts typing
        this.emailError = null;
    }

    /**
     * Handles changes to the message field
     * Updates the message value and clears any existing error
     * Character counter updates automatically via getter
     * @param {Event} event - The change event from lightning-textarea
     */
    handleMessageChange(event) {
        this.messageValue = event.target.value;
        // Clear error when user starts typing
        this.messageError = null;
    }

    // ======================
    // Event Handlers - Field Blur (Validation)
    // ======================

    /**
     * Handles blur event on name field
     * Triggers validation for the name field only
     * @param {Event} event - The blur event from lightning-input
     */
    handleNameBlur() {
        this.validateName();
    }

    /**
     * Handles blur event on email field
     * Triggers validation for the email field only
     * @param {Event} event - The blur event from lightning-input
     */
    handleEmailBlur() {
        this.validateEmail();
    }

    /**
     * Handles blur event on message field
     * Triggers validation for the message field only
     * @param {Event} event - The blur event from lightning-textarea
     */
    handleMessageBlur() {
        this.validateMessage();
    }

    // ======================
    // Validation Methods
    // ======================

    /**
     * Validates the name field
     * Checks for:
     * - Required (not empty)
     * - Letters and spaces only
     * - Maximum 100 characters
     * @returns {boolean} True if valid, false otherwise
     */
    validateName() {
        // Clear any previous error
        this.nameError = null;

        // Check if name is empty
        if (!this.nameValue || this.nameValue.trim() === '') {
            this.nameError = 'Name is required';
            return false;
        }

        // Check if name contains only letters and spaces
        if (!ComprehensiveContactFormWithNameField.NAME_PATTERN.test(this.nameValue)) {
            this.nameError = 'Name can only contain letters and spaces';
            return false;
        }

        // Check if name exceeds maximum length
        if (this.nameValue.length > ComprehensiveContactFormWithNameField.MAX_NAME_LENGTH) {
            this.nameError = `Name must be ${ComprehensiveContactFormWithNameField.MAX_NAME_LENGTH} characters or less`;
            return false;
        }

        return true;
    }

    /**
     * Validates the email field
     * Checks for:
     * - Required (not empty)
     * - Valid email format
     * @returns {boolean} True if valid, false otherwise
     */
    validateEmail() {
        // Clear any previous error
        this.emailError = null;

        // Check if email is empty
        if (!this.emailValue || this.emailValue.trim() === '') {
            this.emailError = 'Email is required';
            return false;
        }

        // Check if email matches valid pattern
        if (!ComprehensiveContactFormWithNameField.EMAIL_PATTERN.test(this.emailValue)) {
            this.emailError = 'Please enter a valid email address';
            return false;
        }

        return true;
    }

    /**
     * Validates the message field
     * Checks for:
     * - Required (not empty)
     * - Minimum 10 characters
     * - Maximum 500 characters
     * @returns {boolean} True if valid, false otherwise
     */
    validateMessage() {
        // Clear any previous error
        this.messageError = null;

        // Check if message is empty
        if (!this.messageValue || this.messageValue.trim() === '') {
            this.messageError = 'Message is required';
            return false;
        }

        // Check if message meets minimum length
        if (this.messageValue.trim().length < ComprehensiveContactFormWithNameField.MIN_MESSAGE_LENGTH) {
            this.messageError = `Message must be at least ${ComprehensiveContactFormWithNameField.MIN_MESSAGE_LENGTH} characters`;
            return false;
        }

        // Check if message exceeds maximum length
        if (this.messageValue.length > ComprehensiveContactFormWithNameField.MAX_MESSAGE_LENGTH) {
            this.messageError = `Message must be ${ComprehensiveContactFormWithNameField.MAX_MESSAGE_LENGTH} characters or less`;
            return false;
        }

        return true;
    }

    /**
     * Validates all form fields
     * Runs validation on name, email, and message fields
     * @returns {boolean} True if all fields are valid, false otherwise
     */
    validateAllFields() {
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();

        return isNameValid && isEmailValid && isMessageValid;
    }

    // ======================
    // Form Submission
    // ======================

    /**
     * Handles form submission
     * Prevents default form behavior, validates all fields,
     * and processes submission if valid
     * @param {Event} event - The submit event from the form
     */
    handleSubmit(event) {
        // Prevent default form submission behavior
        event.preventDefault();

        // Hide any existing success message
        this.showSuccessMessage = false;

        // Validate all fields before submission
        const isValid = this.validateAllFields();

        if (!isValid) {
            // Focus on first invalid field for accessibility
            this.focusFirstInvalidField();
            return;
        }

        // Set submitting state (disables button and shows spinner)
        this.isSubmitting = true;

        // Simulate form submission (replace with actual submission logic)
        // In a real implementation, this would call an Apex method or external API
        setTimeout(() => {
            this.handleSubmitSuccess();
        }, 1500);
    }

    /**
     * Handles successful form submission
     * Shows success message, clears form, and resets state
     */
    handleSubmitSuccess() {
        // Show success message
        this.showSuccessMessage = true;

        // Clear form values
        this.nameValue = '';
        this.emailValue = '';
        this.messageValue = '';

        // Clear any validation errors
        this.nameError = null;
        this.emailError = null;
        this.messageError = null;

        // Reset submitting state
        this.isSubmitting = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 5000);
    }

    /**
     * Focuses on the first invalid field for accessibility
     * Helps users quickly identify and correct validation errors
     */
    focusFirstInvalidField() {
        // Check each field in order and focus the first invalid one
        if (this.nameError) {
            const nameInput = this.template.querySelector('lightning-input[name="name"]');
            if (nameInput) {
                nameInput.focus();
            }
        } else if (this.emailError) {
            const emailInput = this.template.querySelector('lightning-input[name="email"]');
            if (emailInput) {
                emailInput.focus();
            }
        } else if (this.messageError) {
            const messageInput = this.template.querySelector('lightning-textarea[name="message"]');
            if (messageInput) {
                messageInput.focus();
            }
        }
    }
}