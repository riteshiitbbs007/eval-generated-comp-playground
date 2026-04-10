import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

/**
 * Form component that collects user information through multiple input types
 * Implements text, email, phone, dropdown, checkboxes, and textarea fields
 * Following SLDS 2 design guidelines with proper validation and accessibility
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Track form data reactively for validation and submission
    @track formData = {
        fullName: '',
        email: '',
        phone: '',
        department: '',
        interests: [],
        comments: ''
    };

    // Control success message visibility
    @track showSuccessMessage = false;

    /**
     * Department dropdown options
     * Each option follows the Lightning combobox value-label structure
     */
    get departmentOptions() {
        return [
            { label: 'Sales', value: 'sales' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Engineering', value: 'engineering' },
            { label: 'Customer Support', value: 'support' },
            { label: 'Human Resources', value: 'hr' },
            { label: 'Finance', value: 'finance' }
        ];
    }

    /**
     * Interest checkbox options
     * Each option follows the Lightning checkbox-group value-label structure
     */
    get interestOptions() {
        return [
            { label: 'Product Updates', value: 'products' },
            { label: 'Training & Webinars', value: 'training' },
            { label: 'Community Events', value: 'events' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Technical Documentation', value: 'documentation' }
        ];
    }

    /**
     * Handle input changes for all form fields
     * Updates formData object reactively based on field name
     * @param {Event} event - The change event from the input field
     */
    handleInputChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        // Update the corresponding field in formData
        this.formData = {
            ...this.formData,
            [fieldName]: fieldValue
        };
    }

    /**
     * Validate all required form fields
     * Checks that required fields are filled and valid
     * @returns {boolean} True if form is valid, false otherwise
     */
    validateForm() {
        // Get all lightning-input, lightning-combobox, lightning-checkbox-group, and lightning-textarea components
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-checkbox-group'),
            ...this.template.querySelectorAll('lightning-textarea')
        ].reduce((validSoFar, inputCmp) => {
            // reportValidity() triggers browser validation and displays error messages
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid;
    }

    /**
     * Handle form submission
     * Validates form, processes data, and shows success message
     * @param {Event} event - The click event from the submit button
     */
    handleSubmit(event) {
        event.preventDefault();

        // Validate all form fields before submission
        if (!this.validateForm()) {
            // Show error toast if validation fails
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Validation Error',
            //         message: 'Please complete all required fields correctly.',
            //         variant: 'error',
            //         mode: 'dismissable'
            //     })
            // );
            console.log('Validation Error: Please complete all required fields correctly.');
            return;
        }

        // Log submitted data (in production, this would send to server)
        console.log('Form submitted with data:', JSON.stringify(this.formData, null, 2));

        // Show success message
        this.showSuccessMessage = true;

        // Dispatch success toast event
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Your form has been submitted successfully!',
        //         variant: 'success',
        //         mode: 'dismissable'
        //     })
        // );
        console.log('Success: Your form has been submitted successfully!');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 3000);
    }

    /**
     * Handle form reset
     * Clears all form fields and resets to initial state
     * @param {Event} event - The click event from the reset button
     */
    handleReset(event) {
        event.preventDefault();

        // Reset form data to empty values
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            department: '',
            interests: [],
            comments: ''
        };

        // Reset validation states on all input fields
        const inputFields = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-checkbox-group'),
            ...this.template.querySelectorAll('lightning-textarea')
        ];

        inputFields.forEach(field => {
            field.value = field.name === 'interests' ? [] : '';
        });

        // Hide success message if visible
        this.showSuccessMessage = false;

        // Show reset confirmation toast
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Form Reset',
        //         message: 'All fields have been cleared.',
        //         variant: 'info',
        //         mode: 'dismissable'
        //     })
        // );
        console.log('Form Reset: All fields have been cleared.');
    }

    /**
     * Close success message manually
     * @param {Event} event - The click event from the close button
     */
    closeSuccessMessage(event) {
        event.preventDefault();
        this.showSuccessMessage = false;
    }
}