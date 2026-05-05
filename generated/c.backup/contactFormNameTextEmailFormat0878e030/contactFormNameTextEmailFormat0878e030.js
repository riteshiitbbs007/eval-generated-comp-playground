import { LightningElement, api } from 'lwc';

export default class ContactFormNameTextEmailFormat extends LightningElement {
    // Public properties
    @api showSuccessMessage = false;
    @api successMessage = 'Form submitted successfully!';

    // Private properties for field values
    name = '';
    email = '';
    message = '';

    // Error tracking
    nameError = '';
    emailError = '';
    messageError = '';

    // Validation state tracking
    nameValidated = false;
    emailValidated = false;
    messageValidated = false;

    // Email validation regex
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Name field handlers
    handleNameChange(event) {
        this.name = event.target.value;
        if (this.nameValidated) {
            this.validateName();
        }
    }

    handleNameBlur() {
        this.nameValidated = true;
        this.validateName();
    }

    validateName() {
        if (!this.name || this.name.trim() === '') {
            this.nameError = 'Please enter your name';
            return false;
        }
        this.nameError = '';
        return true;
    }

    // Email field handlers
    handleEmailChange(event) {
        this.email = event.target.value;
        if (this.emailValidated) {
            this.validateEmail();
        }
    }

    handleEmailBlur() {
        this.emailValidated = true;
        this.validateEmail();
    }

    validateEmail() {
        if (!this.email || this.email.trim() === '') {
            this.emailError = 'Please enter your email';
            return false;
        }

        if (!this.emailRegex.test(this.email)) {
            this.emailError = 'Please enter a valid email address';
            return false;
        }

        this.emailError = '';
        return true;
    }

    // Message field handlers
    handleMessageChange(event) {
        this.message = event.target.value;
        if (this.messageValidated) {
            this.validateMessage();
        }
    }

    handleMessageBlur() {
        this.messageValidated = true;
        this.validateMessage();
    }

    validateMessage() {
        if (!this.message || this.message.trim() === '') {
            this.messageError = 'Please enter your message';
            return false;
        }

        if (this.message.trim().length < 10) {
            this.messageError = 'Message must be at least 10 characters long';
            return false;
        }

        this.messageError = '';
        return true;
    }

    // Form submission handler
    handleSubmit() {
        // Validate all fields
        this.nameValidated = true;
        this.emailValidated = true;
        this.messageValidated = true;

        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();

        // Submit if all fields are valid
        if (isNameValid && isEmailValid && isMessageValid) {
            // Dispatch form submission event with form data
            const formData = {
                name: this.name,
                email: this.email,
                message: this.message
            };

            this.dispatchEvent(new CustomEvent('submit', {
                detail: formData
            }));

            // Reset form if showSuccessMessage is true
            if (this.showSuccessMessage) {
                this.resetForm();
            }
        }
    }

    resetForm() {
        this.name = '';
        this.email = '';
        this.message = '';

        this.nameError = '';
        this.emailError = '';
        this.messageError = '';

        this.nameValidated = false;
        this.emailValidated = false;
        this.messageValidated = false;

        // Reset form fields
        const nameInput = this.template.querySelector('[data-field="name"] input');
        const emailInput = this.template.querySelector('[data-field="email"] input');
        const messageInput = this.template.querySelector('[data-field="message"] textarea');

        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';
    }

    // Computed properties for CSS classes
    get nameInputClass() {
        return this.getInputClass(this.hasNameError);
    }

    get emailInputClass() {
        return this.getInputClass(this.hasEmailError);
    }

    get messageInputClass() {
        return this.getInputClass(this.hasMessageError);
    }

    // Helper method for generating input CSS class
    getInputClass(hasError) {
        return `slds-input ${hasError ? 'slds-has-error' : ''}`;
    }

    // Computed properties for error status
    get hasNameError() {
        return this.nameValidated && this.nameError !== '';
    }

    get hasEmailError() {
        return this.emailValidated && this.emailError !== '';
    }

    get hasMessageError() {
        return this.messageValidated && this.messageError !== '';
    }

    get nameErrorMessage() {
        return this.nameError;
    }

    get emailErrorMessage() {
        return this.emailError;
    }

    get messageErrorMessage() {
        return this.messageError;
    }

    // Computed property to determine if submit button should be disabled
    get isSubmitDisabled() {
        return (this.nameValidated && this.hasNameError) ||
               (this.emailValidated && this.hasEmailError) ||
               (this.messageValidated && this.hasMessageError);
    }

    // Computed properties for aria-describedby attributes
    get nameHasError() {
        return this.hasNameError ? 'name-error' : '';
    }

    get emailHasError() {
        return this.hasEmailError ? 'email-error' : '';
    }

    get messageHasError() {
        return this.hasMessageError ? 'message-error' : '';
    }
}