import { LightningElement, track } from 'lwc';

/**
 * Form component with multiple input types including text, email, phone, dropdown, checkboxes, and textarea.
 * Implements comprehensive form handling with validation, clear functionality, and success feedback.
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Text input fields
    firstName = '';
    lastName = '';
    email = '';
    phone = '';

    // Dropdown/combobox fields
    department = '';
    country = '';

    // Checkbox group field
    @track selectedInterests = [];

    // Textarea field
    comments = '';

    // UI state
    showSuccessMessage = false;

    /**
     * Department options for the dropdown
     * These represent common departments in an organization
     */
    get departmentOptions() {
        return [
            { label: 'Sales', value: 'sales' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Engineering', value: 'engineering' },
            { label: 'Human Resources', value: 'hr' },
            { label: 'Finance', value: 'finance' },
            { label: 'Customer Support', value: 'support' }
        ];
    }

    /**
     * Country options for the dropdown
     * These represent a subset of commonly selected countries
     */
    get countryOptions() {
        return [
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Australia', value: 'au' },
            { label: 'Germany', value: 'de' },
            { label: 'France', value: 'fr' },
            { label: 'India', value: 'in' },
            { label: 'Japan', value: 'jp' }
        ];
    }

    /**
     * Interest options for checkboxes
     * Allows users to select multiple areas of interest
     */
    get interestOptions() {
        return [
            { label: 'Product Updates', value: 'product_updates' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Events & Webinars', value: 'events' },
            { label: 'Training Resources', value: 'training' },
            { label: 'Community Forums', value: 'community' }
        ];
    }

    /**
     * Computed property to disable submit button when required fields are empty
     * Checks firstName, lastName, email, and department as required fields
     */
    get isSubmitDisabled() {
        return !this.firstName || !this.lastName || !this.email || !this.department;
    }

    /**
     * Generic handler for input changes (text, email, phone, textarea, combobox)
     * Updates the corresponding property based on the field name
     * @param {Event} event - The input change event
     */
    handleInputChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        // Update the corresponding property dynamically
        this[fieldName] = fieldValue;

        // Hide success message when user modifies the form after submission
        if (this.showSuccessMessage) {
            this.showSuccessMessage = false;
        }
    }

    /**
     * Handler for checkbox group changes
     * Updates the selected interests array
     * @param {Event} event - The checkbox change event
     */
    handleCheckboxChange(event) {
        this.selectedInterests = event.detail.value;

        // Hide success message when user modifies the form after submission
        if (this.showSuccessMessage) {
            this.showSuccessMessage = false;
        }
    }

    /**
     * Handler for form submission
     * Validates all fields and processes the form data
     * @param {Event} event - The submit event
     */
    handleSubmit(event) {
        // Prevent default form submission behavior
        if (event) {
            event.preventDefault();
        }

        // Validate all lightning-input fields
        const allInputs = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea');
        const allValid = Array.from(allInputs).reduce((validSoFar, inputCmp) => {
            // reportValidity() will show validation errors on the UI
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        if (allValid) {
            // Collect form data
            const formData = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                phone: this.phone,
                department: this.department,
                country: this.country,
                interests: this.selectedInterests,
                comments: this.comments
            };

            // Log form data for demonstration
            // In production, this would typically call an Apex method or external API
            console.log('Form submitted with data:', JSON.stringify(formData, null, 2));

            // Show success message
            this.showSuccessMessage = true;

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 5000);

            // TODO: Implement actual form submission logic
            // Example: Call Apex method to save data
            // this.saveFormData(formData);
        } else {
            // Form validation failed - errors are already displayed by reportValidity()
            console.log('Form validation failed. Please check the fields.');
        }
    }

    /**
     * Handler for clearing all form fields
     * Resets all form values to their initial state
     */
    handleClear() {
        // Reset all text and selection fields
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.department = '';
        this.country = '';
        this.selectedInterests = [];
        this.comments = '';

        // Hide success message
        this.showSuccessMessage = false;

        // Clear validation errors from all input components
        const allInputs = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea, lightning-checkbox-group');
        allInputs.forEach(input => {
            // Reset each input component to clear any validation states
            if (input.reset) {
                input.reset();
            }
        });
    }
}