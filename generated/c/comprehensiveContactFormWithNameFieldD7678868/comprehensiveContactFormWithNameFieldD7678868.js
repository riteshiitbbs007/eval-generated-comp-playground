import { LightningElement, track } from 'lwc';

export default class ComprehensiveContactFormWithNameField extends LightningElement {
    // Form field values
    @track nameValue = '';
    @track emailValue = '';
    @track messageValue = '';

    // Validation states
    @track nameTouched = false;
    @track emailTouched = false;
    @track messageTouched = false;
    @track formSubmitted = false;

    // Error messages
    @track nameError = '';
    @track emailError = '';
    @track messageError = '';

    // Success state
    @track showSuccess = false;

    // Name validation pattern: letters and spaces only
    namePattern = /^[A-Za-z\s]+$/;

    /**
     * Computed getter for name input CSS class
     * Applies error styling when validation fails
     */
    get nameInputClass() {
        const baseClass = 'slds-input';
        return this.hasNameError ? `${baseClass} slds-has-error` : baseClass;
    }

    /**
     * Computed getter for email input CSS class
     * Applies error styling when validation fails
     */
    get emailInputClass() {
        const baseClass = 'slds-input';
        return this.hasEmailError ? `${baseClass} slds-has-error` : baseClass;
    }

    /**
     * Computed getter for message textarea CSS class
     * Applies error styling when validation fails
     */
    get messageInputClass() {
        const baseClass = 'slds-textarea';
        return this.hasMessageError ? `${baseClass} slds-has-error` : baseClass;
    }

    /**
     * Computed getter for character count display
     * Shows current/max characters for message field
     */
    get characterCountText() {
        const currentLength = this.messageValue.length;
        return `${currentLength}/500`;
    }

    /**
     * Computed getter for name error ID
     * Used for aria-describedby attribute
     */
    get nameErrorId() {
        return 'name-error';
    }

    /**
     * Computed getter for email error ID
     * Used for aria-describedby attribute
     */
    get emailErrorId() {
        return 'email-error';
    }

    /**
     * Computed getter for message error ID
     * Used for aria-describedby attribute
     */
    get messageErrorId() {
        return 'message-error';
    }

    /**
     * Computed getter for message aria-describedby
     * Combines error and character counter IDs
     */
    get messageDescribedBy() {
        const ids = ['char-counter'];
        if (this.showMessageError) {
            ids.unshift(this.messageErrorId);
        }
        return ids.join(' ');
    }

    /**
     * Computed getter to determine if name error should be shown
     */
    get showNameError() {
        return this.hasNameError && (this.nameTouched || this.formSubmitted);
    }

    /**
     * Computed getter to determine if email error should be shown
     */
    get showEmailError() {
        return this.hasEmailError && (this.emailTouched || this.formSubmitted);
    }

    /**
     * Computed getter to determine if message error should be shown
     */
    get showMessageError() {
        return this.hasMessageError && (this.messageTouched || this.formSubmitted);
    }

    /**
     * Computed getter to check if name field has validation errors
     */
    get hasNameError() {
        return this.nameError !== '';
    }

    /**
     * Computed getter to check if email field has validation errors
     */
    get hasEmailError() {
        return this.emailError !== '';
    }

    /**
     * Computed getter to check if message field has validation errors
     */
    get hasMessageError() {
        return this.messageError !== '';
    }

    /**
     * Computed getter to determine if submit button should be disabled
     */
    get isSubmitDisabled() {
        return !this.isFormValid();
    }

    /**
     * Handle name input change
     * Updates value and validates on change
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
        if (this.nameTouched || this.formSubmitted) {
            this.validateName();
        }
    }

    /**
     * Handle name field blur
     * Marks field as touched and validates
     */
    handleNameBlur() {
        this.nameTouched = true;
        this.validateName();
    }

    /**
     * Handle email input change
     * Updates value and validates on change
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
        if (this.emailTouched || this.formSubmitted) {
            this.validateEmail();
        }
    }

    /**
     * Handle email field blur
     * Marks field as touched and validates
     */
    handleEmailBlur() {
        this.emailTouched = true;
        this.validateEmail();
    }

    /**
     * Handle message input change
     * Updates value and validates on change
     */
    handleMessageChange(event) {
        this.messageValue = event.target.value;
        if (this.messageTouched || this.formSubmitted) {
            this.validateMessage();
        }
    }

    /**
     * Handle message field blur
     * Marks field as touched and validates
     */
    handleMessageBlur() {
        this.messageTouched = true;
        this.validateMessage();
    }

    /**
     * Validate name field
     * Rules: required, max 100 chars, letters and spaces only
     */
    validateName() {
        const trimmedName = this.nameValue.trim();
        
        if (!trimmedName) {
            this.nameError = 'Name is required';
            return false;
        }
        
        if (trimmedName.length > 100) {
            this.nameError = 'Name must not exceed 100 characters';
            return false;
        }
        
        if (!this.namePattern.test(trimmedName)) {
            this.nameError = 'Name must contain only letters and spaces';
            return false;
        }
        
        this.nameError = '';
        return true;
    }

    /**
     * Validate email field
     * Rules: required, valid email format
     */
    validateEmail() {
        const trimmedEmail = this.emailValue.trim();
        
        if (!trimmedEmail) {
            this.emailError = 'Email is required';
            return false;
        }
        
        // Basic email validation pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(trimmedEmail)) {
            this.emailError = 'Please enter a valid email address';
            return false;
        }
        
        this.emailError = '';
        return true;
    }

    /**
     * Validate message field
     * Rules: required, min 10 chars, max 500 chars
     */
    validateMessage() {
        const trimmedMessage = this.messageValue.trim();
        
        if (!trimmedMessage) {
            this.messageError = 'Message is required';
            return false;
        }
        
        if (trimmedMessage.length < 10) {
            this.messageError = 'Message must be at least 10 characters';
            return false;
        }
        
        if (trimmedMessage.length > 500) {
            this.messageError = 'Message must not exceed 500 characters';
            return false;
        }
        
        this.messageError = '';
        return true;
    }

    /**
     * Check if entire form is valid
     * Validates all fields and returns combined result
     */
    isFormValid() {
        // Create temporary validation state to avoid showing errors
        const savedNameTouched = this.nameTouched;
        const savedEmailTouched = this.emailTouched;
        const savedMessageTouched = this.messageTouched;
        
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();
        
        // Restore touch state to prevent premature error display
        this.nameTouched = savedNameTouched;
        this.emailTouched = savedEmailTouched;
        this.messageTouched = savedMessageTouched;
        
        return isNameValid && isEmailValid && isMessageValid;
    }

    /**
     * Handle form submission
     * Validates all fields and prevents default if invalid
     */
    handleSubmit(event) {
        event.preventDefault();
        this.formSubmitted = true;
        
        // Mark all fields as touched
        this.nameTouched = true;
        this.emailTouched = true;
        this.messageTouched = true;
        
        // Validate all fields
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Form is valid - submit the data
            this.submitForm();
        } else {
            // Focus on first invalid field
            this.focusFirstInvalidField();
        }
    }

    /**
     * Submit form data
     * In a real implementation, this would send data to a server
     */
    submitForm() {
        // Show success message
        this.showSuccess = true;
        
        // Reset form after 3 seconds
        setTimeout(() => {
            this.resetForm();
        }, 3000);
        
        // In a real implementation, you would dispatch an event or call an Apex method
        // Example: this.dispatchEvent(new CustomEvent('submit', { detail: formData }));
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        this.nameValue = '';
        this.emailValue = '';
        this.messageValue = '';
        this.nameTouched = false;
        this.emailTouched = false;
        this.messageTouched = false;
        this.formSubmitted = false;
        this.nameError = '';
        this.emailError = '';
        this.messageError = '';
        this.showSuccess = false;
    }

    /**
     * Focus on the first invalid field
     * Improves accessibility and user experience
     */
    focusFirstInvalidField() {
        if (this.hasNameError) {
            const nameInput = this.template.querySelector('#name-input');
            if (nameInput) nameInput.focus();
        } else if (this.hasEmailError) {
            const emailInput = this.template.querySelector('#email-input');
            if (emailInput) emailInput.focus();
        } else if (this.hasMessageError) {
            const messageInput = this.template.querySelector('#message-input');
            if (messageInput) messageInput.focus();
        }
    }
}