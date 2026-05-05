import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

/**
 * FormWithTextEmailPhoneDropdown Component
 *
 * A comprehensive form component that captures contact information including:
 * - Text input for full name
 * - Email input with validation
 * - Phone number input with pattern validation
 * - Country dropdown/picklist
 * - Checkbox group for interests
 * - Textarea for additional comments
 *
 * Features:
 * - SLDS 2 compliant styling using design tokens
 * - Form validation with inline error messages
 * - Accessible form controls with proper labels and ARIA attributes
 * - Responsive layout using SLDS grid system
 * - Success feedback with toast notification
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {

    // Form field values tracked for reactivity
    @track fullName = '';
    @track email = '';
    @track phone = '';
    @track country = '';
    @track selectedInterests = [];
    @track comments = '';
    @track showSuccessMessage = false;

    /**
     * Country options for the dropdown/picklist
     * Following Lightning Base Component combobox option format
     */
    get countryOptions() {
        return [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'AU' },
            { label: 'Germany', value: 'DE' },
            { label: 'France', value: 'FR' },
            { label: 'Japan', value: 'JP' },
            { label: 'India', value: 'IN' },
            { label: 'Brazil', value: 'BR' },
            { label: 'Mexico', value: 'MX' }
        ];
    }

    /**
     * Interest options for the checkbox group
     * Following Lightning Base Component checkbox-group option format
     */
    get interestOptions() {
        return [
            { label: 'Technology', value: 'technology' },
            { label: 'Business', value: 'business' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Sales', value: 'sales' },
            { label: 'Customer Service', value: 'service' },
            { label: 'Analytics', value: 'analytics' }
        ];
    }

    /**
     * Handle input changes for text, email, phone, dropdown, and textarea fields
     * Updates the corresponding tracked property based on the field name
     *
     * @param {Event} event - The input change event
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        // Update the corresponding field based on the input name
        if (field === 'fullName') {
            this.fullName = value;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'country') {
            this.country = value;
        } else if (field === 'comments') {
            this.comments = value;
        }
    }

    /**
     * Handle checkbox group changes
     * Updates the selectedInterests array with the current selections
     *
     * @param {Event} event - The checkbox change event containing detail.value array
     */
    handleCheckboxChange(event) {
        this.selectedInterests = event.detail.value;
    }

    /**
     * Validate all form fields
     * Uses Lightning Base Component validity checking
     *
     * @returns {boolean} - True if all fields are valid, false otherwise
     */
    validateForm() {
        const allInputs = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-checkbox-group'),
            ...this.template.querySelectorAll('lightning-textarea')
        ];

        // Use reduce to check validity of all inputs
        const allValid = allInputs.reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid;
    }

    /**
     * Handle form submission
     * Validates all fields and displays success message/toast if valid
     *
     * @param {Event} event - The submit button click event
     */
    handleSubmit(event) {
        // Prevent default form submission behavior
        event.preventDefault();

        // Validate all form fields
        if (this.validateForm()) {
            // Show success message in the component
            this.showSuccessMessage = true;

            // Show success toast notification (commented out - not available in local dev)
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Success',
            //         message: 'Form has been submitted successfully!',
            //         variant: 'success'
            //     })
            // );

            // Log form data for demonstration
            console.log('Form Data Submitted:', {
                fullName: this.fullName,
                email: this.email,
                phone: this.phone,
                country: this.country,
                interests: this.selectedInterests,
                comments: this.comments
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 5000);

            // In a real implementation, you would send this data to an Apex controller
            // or use LDS to create/update records
        } else {
            // Show error toast if validation fails (commented out - not available in local dev)
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Error',
            //         message: 'Please check all required fields and correct any errors.',
            //         variant: 'error'
            //     })
            // );
        }
    }

    /**
     * Reset all form fields to their initial empty state
     * Clears validation errors and hides success message
     *
     * @param {Event} event - The reset button click event
     */
    handleReset(event) {
        // Prevent default form reset behavior
        event.preventDefault();

        // Reset all tracked field values
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.selectedInterests = [];
        this.comments = '';
        this.showSuccessMessage = false;

        // Clear all input values and validation messages
        const allInputs = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-checkbox-group'),
            ...this.template.querySelectorAll('lightning-textarea')
        ];

        allInputs.forEach(input => {
            input.value = '';
            // Reset validity state
            if (input.setCustomValidity) {
                input.setCustomValidity('');
            }
        });

        // Show reset confirmation toast (commented out - not available in local dev)
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Form Reset',
        //         message: 'All fields have been cleared.',
        //         variant: 'info'
        //     })
        // );
    }
}