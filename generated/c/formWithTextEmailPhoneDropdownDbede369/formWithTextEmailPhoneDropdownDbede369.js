import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field properties
    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    country = '';
    interests = [];
    comments = '';
    showSuccessMessage = false;

    // Country dropdown options
    get countryOptions() {
        return [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'AU' },
            { label: 'Germany', value: 'DE' }
        ];
    }

    // Interest checkbox options
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
     * @param {Event} event - Change event from input fields
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this[field] = value;
        // Hide success message when user starts editing
        if (this.showSuccessMessage) {
            this.showSuccessMessage = false;
        }
    }

    /**
     * Handle checkbox group changes
     * @param {Event} event - Change event from checkbox group
     */
    handleCheckboxChange(event) {
        this.interests = event.detail.value;
        // Hide success message when user starts editing
        if (this.showSuccessMessage) {
            this.showSuccessMessage = false;
        }
    }

    /**
     * Validate all form fields
     * @returns {boolean} True if form is valid
     */
    validateForm() {
        // Get all lightning-input, lightning-combobox, and lightning-textarea fields
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-textarea')
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid;
    }

    /**
     * Handle form submission
     */
    handleSubmit() {
        // Validate form fields
        if (!this.validateForm()) {
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Error',
            //         message: 'Please complete all required fields correctly.',
            //         variant: 'error'
            //     })
            // );
            return;
        }

        // Show success message
        this.showSuccessMessage = true;

        // Dispatch success toast notification
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Form submitted successfully!',
        //         variant: 'success'
        //     })
        // );

        // Log form data (in real implementation, this would send data to server)
        console.log('Form Data:', {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            country: this.country,
            interests: this.interests,
            comments: this.comments
        });

        // Hide success message after 3 seconds
        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 3000);
    }

    /**
     * Reset all form fields to initial state
     */
    handleReset() {
        // Clear all form field values
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.interests = [];
        this.comments = '';
        this.showSuccessMessage = false;

        // Reset input field validation states
        const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea, lightning-checkbox-group');
        if (inputs) {
            inputs.forEach(input => {
                input.value = input.name === 'interests' ? [] : '';
            });
        }

        // Dispatch info toast notification
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Form Reset',
        //         message: 'All fields have been cleared.',
        //         variant: 'info'
        //     })
        // );
    }
}