import { LightningElement } from 'lwc';

/**
 * FormWithTextEmailPhoneDropdown
 * A comprehensive form component that collects user contact information
 * including text inputs, email, phone, dropdown selection, checkboxes, and textarea.
 *
 * Features:
 * - Required field validation for full name and email
 * - Email format validation
 * - Phone number formatting validation
 * - Country selection dropdown
 * - Multiple interest selection via checkboxes
 * - Optional comments textarea
 * - Form submission with success message
 * - Form reset functionality
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field values
    fullName = '';
    email = '';
    phone = '';
    country = '';
    interests = [];
    comments = '';

    // UI state
    showSuccessMessage = false;

    /**
     * Country options for the dropdown
     * Using value/label pairs for proper combobox formatting
     */
    countryOptions = [
        { label: 'USA', value: 'USA' },
        { label: 'Canada', value: 'Canada' },
        { label: 'UK', value: 'UK' },
        { label: 'Australia', value: 'Australia' },
        { label: 'Other', value: 'Other' }
    ];

    /**
     * Interest options for the checkbox group
     * Using value/label pairs for proper checkbox group formatting
     */
    interestOptions = [
        { label: 'Technology', value: 'Technology' },
        { label: 'Sports', value: 'Sports' },
        { label: 'Music', value: 'Music' },
        { label: 'Travel', value: 'Travel' },
        { label: 'Reading', value: 'Reading' }
    ];

    /**
     * Handles changes to input, combobox, and textarea fields
     * Updates the corresponding component property based on the field name
     *
     * @param {Event} event - The change event from the input component
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        // Update the corresponding property based on field name
        switch(field) {
            case 'fullName':
                this.fullName = value;
                break;
            case 'email':
                this.email = value;
                break;
            case 'phone':
                this.phone = value;
                break;
            case 'country':
                this.country = value;
                break;
            case 'comments':
                this.comments = value;
                break;
            default:
                break;
        }
    }

    /**
     * Handles changes to the checkbox group
     * Updates the interests array with selected values
     *
     * @param {Event} event - The change event from the checkbox group
     */
    handleCheckboxChange(event) {
        this.interests = event.detail.value;
    }

    /**
     * Handles form submission
     * Validates required fields and displays success message
     * Uses the validity API from lightning-input components
     */
    handleSubmit() {
        // Query all input fields for validation
        const allInputs = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-textarea')
        ];

        // Check validity of all fields
        const allValid = allInputs.reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);

        // If all fields are valid, process the form submission
        if (allValid) {
            // Create form data object
            const formData = {
                fullName: this.fullName,
                email: this.email,
                phone: this.phone,
                country: this.country,
                interests: this.interests,
                comments: this.comments
            };

            // Log form data for demonstration
            // In a real application, this would be sent to a server or Apex controller
            console.log('Form submitted with data:', JSON.stringify(formData, null, 2));

            // Show success message
            this.showSuccessMessage = true;

            // Hide success message after 3 seconds
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);
        }
    }

    /**
     * Handles form reset
     * Clears all form fields and hides success message
     */
    handleReset() {
        // Reset all form field values
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.interests = [];
        this.comments = '';

        // Hide success message if visible
        this.showSuccessMessage = false;

        // Reset the validity state of all input fields
        const allInputs = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-textarea'),
            ...this.template.querySelectorAll('lightning-checkbox-group')
        ];

        // Reset each field
        allInputs.forEach(inputField => {
            if (typeof inputField.reset === 'function') {
                inputField.reset();
            }
        });
    }
}