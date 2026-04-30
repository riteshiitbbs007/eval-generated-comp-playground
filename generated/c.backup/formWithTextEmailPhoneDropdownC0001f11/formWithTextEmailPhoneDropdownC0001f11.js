/**
 * Form Component with Multiple Input Types
 * 
 * This component demonstrates a comprehensive form implementation using Lightning Base Components
 * including text, email, phone, dropdown (combobox), checkboxes, and textarea fields.
 * 
 * Features:
 * - Input validation for required fields
 * - Success notification after submission
 * - Form reset functionality
 * - Responsive layout using SLDS grid
 * - Full accessibility support with ARIA attributes
 * - SLDS 2 compliant styling
 */
import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

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
     * Country options for the combobox
     * Provides a list of countries for user selection
     */
    get countryOptions() {
        return [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'AU' },
            { label: 'Germany', value: 'DE' },
            { label: 'France', value: 'FR' },
            { label: 'Japan', value: 'JP' }
        ];
    }

    /**
     * Interest options for the checkbox group
     * Provides a list of interests for multi-select
     */
    get interestOptions() {
        return [
            { label: 'Technology', value: 'technology' },
            { label: 'Sports', value: 'sports' },
            { label: 'Music', value: 'music' },
            { label: 'Travel', value: 'travel' },
            { label: 'Reading', value: 'reading' }
        ];
    }

    /**
     * Handle input field changes
     * Updates the corresponding component property based on field name
     * 
     * @param {Event} event - The change event from input/combobox/textarea
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        // Update the corresponding field value
        this[field] = value;

        // Hide success message when user starts editing
        if (this.showSuccessMessage) {
            this.showSuccessMessage = false;
        }
    }

    /**
     * Handle checkbox group changes
     * Updates the interests array with selected values
     * 
     * @param {Event} event - The change event from checkbox group
     */
    handleCheckboxChange(event) {
        this.interests = event.detail.value;

        // Hide success message when user starts editing
        if (this.showSuccessMessage) {
            this.showSuccessMessage = false;
        }
    }

    /**
     * Handle form submission
     * Validates required fields and processes the form data
     * 
     * @param {Event} event - The submit event from the form
     */
    handleSubmit(event) {
        event.preventDefault();

        // Check form validity
        const isValid = this.validateForm();

        if (isValid) {
            // Process form data
            this.processFormData();

            // Show success message
            this.showSuccessMessage = true;

            // Show toast notification (commented out - not available in local dev)
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Success',
            //         message: 'Form submitted successfully!',
            //         variant: 'success'
            //     })
            // );

            // Reset form after successful submission
            setTimeout(() => {
                this.resetForm();
            }, 2000);
        } else {
            // Show error toast (commented out - not available in local dev)
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Error',
            //         message: 'Please complete all required fields.',
            //         variant: 'error'
            //     })
            // );
        }
    }

    /**
     * Validate form fields
     * Checks that all required fields are completed
     * 
     * @returns {boolean} True if form is valid, false otherwise
     */
    validateForm() {
        // Get all input components
        const inputFields = this.template.querySelectorAll('lightning-input');
        const comboboxFields = this.template.querySelectorAll('lightning-combobox');

        let isValid = true;

        // Validate lightning-input fields
        inputFields.forEach(field => {
            if (!field.reportValidity()) {
                isValid = false;
            }
        });

        // Validate lightning-combobox fields
        comboboxFields.forEach(field => {
            if (!field.reportValidity()) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Process form data
     * This method would typically send data to a server or perform other operations
     * Currently logs the form data for demonstration purposes
     */
    processFormData() {
        const formData = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            country: this.country,
            interests: this.interests,
            comments: this.comments
        };

        // Log form data (in production, this would be sent to server)
        console.log('Form Data:', JSON.stringify(formData, null, 2));

        // TODO: Implement actual form submission logic
        // Example: call Apex method to save data
        // saveFormData({ data: formData })
        //     .then(result => { ... })
        //     .catch(error => { ... });
    }

    /**
     * Handle reset button click
     * Clears all form fields and resets to initial state
     * 
     * @param {Event} event - The click event from reset button
     */
    handleReset(event) {
        event.preventDefault();
        this.resetForm();

        // Show reset confirmation toast (commented out - not available in local dev)
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Form Reset',
        //         message: 'All fields have been cleared.',
        //         variant: 'info'
        //     })
        // );
    }

    /**
     * Reset form to initial state
     * Clears all field values and hides success message
     */
    resetForm() {
        // Clear all field values
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.interests = [];
        this.comments = '';

        // Hide success message
        this.showSuccessMessage = false;

        // Reset form validation states
        const inputFields = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-checkbox-group, lightning-textarea');
        inputFields.forEach(field => {
            if (field.reset) {
                field.reset();
            }
        });
    }
}