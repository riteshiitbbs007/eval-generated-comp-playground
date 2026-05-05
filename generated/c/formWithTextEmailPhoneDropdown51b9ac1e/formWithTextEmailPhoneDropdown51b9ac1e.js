import { LightningElement, api } from 'lwc';

/**
 * Contact Information Form Component
 * 
 * A comprehensive form component that collects user contact information including:
 * - Personal details (first name, last name)
 * - Contact methods (email, phone)
 * - Location (country dropdown)
 * - Preferences (interest checkboxes)
 * - Additional notes (comments textarea)
 * 
 * Features:
 * - SLDS 2 compliant styling with design tokens
 * - Full form validation
 * - Accessibility support (WCAG 2.1)
 * - Responsive design using SLDS grid
 * - Success/error feedback messaging
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Public API Properties
    // Note: All boolean @api properties MUST default to false per LWC1099 compliance
    @api showFormTitle = false;
    @api allowReset = false;

    // Private reactive properties for form data
    formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        interests: [],
        comments: ''
    };

    // UI state management
    showSuccess = false;
    showError = false;

    /**
     * Country dropdown options
     * Provides a list of countries for user selection
     */
    get countryOptions() {
        return [
            { label: 'United States', value: 'USA' },
            { label: 'Canada', value: 'Canada' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'Australia' }
        ];
    }

    /**
     * Interest checkbox options
     * Allows users to select multiple areas of interest
     */
    get interestOptions() {
        return [
            { label: 'Sports', value: 'Sports' },
            { label: 'Music', value: 'Music' },
            { label: 'Reading', value: 'Reading' },
            { label: 'Travel', value: 'Travel' }
        ];
    }

    /**
     * Handle input field changes
     * Updates the form data object with new values
     * 
     * @param {Event} event - Input change event
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        
        // Update form data
        this.formData = {
            ...this.formData,
            [field]: value
        };

        // Clear any existing messages when user makes changes
        this.clearMessages();
    }

    /**
     * Handle checkbox group changes
     * Updates the interests array with selected values
     * 
     * @param {Event} event - Checkbox change event
     */
    handleCheckboxChange(event) {
        this.formData = {
            ...this.formData,
            interests: event.detail.value
        };

        // Clear any existing messages when user makes changes
        this.clearMessages();
    }

    /**
     * Handle form submission
     * Validates all fields and displays success/error messages
     * 
     * @param {Event} event - Form submit event
     */
    handleSubmit(event) {
        event.preventDefault();
        
        // Validate all input fields
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        // Validate combobox
        const comboboxValid = this.template.querySelector('lightning-combobox').reportValidity();

        if (allValid && comboboxValid) {
            // Form is valid - show success message
            this.showSuccess = true;
            this.showError = false;

            // Log form data (in production, this would be sent to server)
            console.log('Form submitted with data:', JSON.stringify(this.formData, null, 2));

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                this.showSuccess = false;
            }, 5000);
        } else {
            // Form has validation errors
            this.showError = true;
            this.showSuccess = false;
        }
    }

    /**
     * Handle form reset
     * Clears all form fields and resets to initial state
     * 
     * @param {Event} event - Button click event
     */
    handleReset(event) {
        event.preventDefault();
        
        // Reset form data to initial values
        this.formData = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            interests: [],
            comments: ''
        };

        // Clear all validation errors and messages
        this.template.querySelectorAll('lightning-input').forEach(input => {
            input.value = '';
        });
        
        const combobox = this.template.querySelector('lightning-combobox');
        if (combobox) {
            combobox.value = '';
        }

        const checkboxGroup = this.template.querySelector('lightning-checkbox-group');
        if (checkboxGroup) {
            checkboxGroup.value = [];
        }

        const textarea = this.template.querySelector('lightning-textarea');
        if (textarea) {
            textarea.value = '';
        }

        // Clear messages
        this.clearMessages();
    }

    /**
     * Clear success and error messages
     * Helper method to reset UI feedback state
     */
    clearMessages() {
        this.showSuccess = false;
        this.showError = false;
    }
}