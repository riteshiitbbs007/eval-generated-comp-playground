import { LightningElement } from 'lwc';

/**
 * Contact form component with validation
 * Displays a form with name, email, and message fields
 * Shows inline error messages for empty required fields
 */
export default class FormNameEmailMessageShowErrors extends LightningElement {
    // Form field values
    nameValue = '';
    emailValue = '';
    messageValue = '';
    
    // Success state
    showSuccess = false;

    /**
     * Handle name input change
     * @param {Event} event - Input change event
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
        this.showSuccess = false;
    }

    /**
     * Handle email input change
     * @param {Event} event - Input change event
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
        this.showSuccess = false;
    }

    /**
     * Handle message textarea change
     * @param {Event} event - Textarea change event
     */
    handleMessageChange(event) {
        this.messageValue = event.target.value;
        this.showSuccess = false;
    }

    /**
     * Handle form submission
     * Validates all required fields and shows errors if empty
     */
    handleSubmit() {
        // Get all input components
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-textarea')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            // Form is valid - show success message
            this.showSuccess = true;
            
            // In a real application, you would submit the form data here
            // For example, call an Apex method or make an HTTP request
            console.log('Form submitted:', {
                name: this.nameValue,
                email: this.emailValue,
                message: this.messageValue
            });
        }
    }

    /**
     * Computed property for success message
     * Avoids template literal in HTML template
     */
    get successMessage() {
        return `Thank you, ${this.nameValue}! Your message has been submitted.`;
    }
}