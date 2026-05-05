import { LightningElement } from 'lwc';

/**
 * Lightning Web Component that implements a comprehensive form with multiple input types
 * including text, email, phone, dropdown, checkboxes, and textarea fields.
 * Implements proper validation, accessibility, and SLDS styling.
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field values
    fullName = '';
    email = '';
    phone = '';
    contactMethod = '';
    selectedInterests = [];
    comments = '';

    // UI state
    showSuccess = false;

    /**
     * Options for the contact method dropdown
     * Using combobox options format with label and value
     */
    get contactMethodOptions() {
        return [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'SMS', value: 'sms' },
            { label: 'Mail', value: 'mail' }
        ];
    }

    /**
     * Options for the interests checkbox group
     * Each option has a label and value for proper selection tracking
     */
    get interestOptions() {
        return [
            { label: 'Product Updates', value: 'products' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Events & Webinars', value: 'events' },
            { label: 'Special Offers', value: 'offers' }
        ];
    }

    /**
     * Handles input field changes for text, email, phone, dropdown, and textarea
     * Updates the corresponding component property based on the field name
     * @param {Event} event - The change event from the input field
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        // Update the appropriate property based on field name
        if (field === 'fullName') {
            this.fullName = value;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'contactMethod') {
            this.contactMethod = value;
        } else if (field === 'comments') {
            this.comments = value;
        }
    }

    /**
     * Handles checkbox group changes
     * Updates the selectedInterests array with current selections
     * @param {Event} event - The change event from the checkbox group
     */
    handleCheckboxChange(event) {
        this.selectedInterests = event.detail.value;
    }

    /**
     * Validates all form fields using the built-in reportValidity method
     * This triggers browser validation and displays error messages
     * @returns {boolean} - True if all fields are valid, false otherwise
     */
    validateForm() {
        // Get all input fields that support validation
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-checkbox-group')
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid;
    }

    /**
     * Handles form submission
     * Validates all fields before processing the form data
     * Displays success message on successful validation
     * @param {Event} event - The click event from the submit button
     */
    handleSubmit(event) {
        // Prevent any default form submission behavior
        event.preventDefault();

        // Validate all form fields
        if (this.validateForm()) {
            // Form is valid - process the data
            const formData = {
                fullName: this.fullName,
                email: this.email,
                phone: this.phone,
                contactMethod: this.contactMethod,
                interests: this.selectedInterests,
                comments: this.comments
            };

            // Log form data for demonstration purposes
            // In a real application, this would be sent to an Apex controller or API
            console.log('Form submitted with data:', JSON.stringify(formData, null, 2));

            // Show success message
            this.showSuccess = true;

            // Hide success message after 3 seconds
            setTimeout(() => {
                this.showSuccess = false;
            }, 3000);
        }
    }

    /**
     * Resets all form fields to their initial empty state
     * Clears validation messages and hides success notification
     */
    handleReset() {
        // Reset all form values
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.contactMethod = '';
        this.selectedInterests = [];
        this.comments = '';
        this.showSuccess = false;

        // Clear any validation messages by resetting the fields
        const inputFields = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-checkbox-group, lightning-textarea');
        if (inputFields) {
            inputFields.forEach(field => {
                // Reset the field to clear validation state
                field.value = field.name === 'interests' ? [] : '';
            });
        }
    }
}