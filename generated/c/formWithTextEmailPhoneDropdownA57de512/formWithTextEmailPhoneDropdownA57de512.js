import { LightningElement } from 'lwc';

/**
 * FormWithTextEmailPhoneDropdown Component
 * 
 * A comprehensive form component that collects user information including:
 * - Text input (Full Name)
 * - Email input with validation
 * - Phone input with pattern validation
 * - Dropdown/Combobox for country selection
 * - Checkbox group for interests
 * - Textarea for additional comments
 * 
 * Features:
 * - Client-side validation using lightning-input validation
 * - Form submission handling
 * - Reset functionality
 * - Success message display
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form data object to store all form field values
    formData = {
        fullName: '',
        email: '',
        phone: '',
        country: '',
        interests: [],
        comments: ''
    };

    // Flag to control success message visibility
    showSuccessMessage = false;

    /**
     * Country options for the dropdown
     * Uses value-label pairs as required by lightning-combobox
     */
    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Australia', value: 'AU' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Japan', value: 'JP' },
        { label: 'India', value: 'IN' }
    ];

    /**
     * Interest options for checkbox group
     * Uses value-label pairs as required by lightning-checkbox-group
     */
    interestOptions = [
        { label: 'Technology', value: 'technology' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
        { label: 'Support', value: 'support' },
        { label: 'Product Updates', value: 'product_updates' }
    ];

    /**
     * Handle input change events for text, email, phone, dropdown, and textarea fields
     * Updates the formData object with the new value
     * 
     * @param {Event} event - The change event from the input component
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this.formData = { ...this.formData, [field]: value };
    }

    /**
     * Handle checkbox group change events
     * Updates the formData.interests array with selected values
     * 
     * @param {Event} event - The change event from the checkbox group
     */
    handleCheckboxChange(event) {
        this.formData = { ...this.formData, interests: event.detail.value };
    }

    /**
     * Handle form submission
     * Prevents default form submission behavior
     * Validates all required fields using lightning-input's reportValidity()
     * Displays success message on successful validation
     * 
     * @param {Event} event - The form submit event
     */
    handleSubmit(event) {
        event.preventDefault();
        
        // Query all input components for validation
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            // Form is valid - process the submission
            console.log('Form submitted with data:', JSON.stringify(this.formData, null, 2));
            
            // Show success message
            this.showSuccessMessage = true;
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);
            
            // TODO: Add actual form submission logic here (e.g., Apex call, platform event)
        }
    }

    /**
     * Handle reset button click
     * Resets all form fields to their initial empty state
     * Hides the success message if visible
     */
    handleReset() {
        // Reset form data to initial state
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            country: '',
            interests: [],
            comments: ''
        };
        
        // Hide success message
        this.showSuccessMessage = false;
        
        // Reset validation states on all input fields
        this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea, lightning-checkbox-group')
            .forEach(input => {
                if (typeof input.reset === 'function') {
                    input.reset();
                }
            });
    }
}