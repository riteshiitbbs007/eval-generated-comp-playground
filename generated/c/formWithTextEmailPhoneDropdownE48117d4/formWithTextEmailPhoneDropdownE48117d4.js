import { LightningElement, api } from 'lwc';

/**
 * FormWithTextEmailPhoneDropdown Component
 *
 * A comprehensive form component that demonstrates various input types including:
 * - Text input (Full Name)
 * - Email input with validation
 * - Phone input with pattern validation
 * - Dropdown/Combobox for country selection
 * - Checkbox group for multiple interests
 * - Textarea for comments
 *
 * Features:
 * - Built-in validation for required fields
 * - Custom validation patterns
 * - Toast notifications on successful submission
 * - Form reset functionality
 * - SLDS 2 compliant styling
 * - Accessible with proper ARIA attributes
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field values - track changes for reactivity
    fullName = '';
    email = '';
    phone = '';
    country = '';
    interests = [];
    comments = '';

    /**
     * Country options for the dropdown
     * Following SLDS combobox pattern with value-label pairs
     */
    get countryOptions() {
        return [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Germany', value: 'DE' },
            { label: 'France', value: 'FR' },
            { label: 'Australia', value: 'AU' },
            { label: 'Japan', value: 'JP' },
            { label: 'India', value: 'IN' },
            { label: 'Brazil', value: 'BR' },
            { label: 'Mexico', value: 'MX' }
        ];
    }

    /**
     * Interest options for checkbox group
     * Multiple selections allowed
     */
    get interestOptions() {
        return [
            { label: 'Product Updates', value: 'product_updates' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Events & Webinars', value: 'events' },
            { label: 'Training & Certification', value: 'training' },
            { label: 'Partner Programs', value: 'partners' }
        ];
    }

    /**
     * Handle input change events from all form fields
     * Updates the corresponding property based on the field name
     *
     * @param {Event} event - The change event from lightning input components
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        // Update the corresponding field based on the input name
        switch (field) {
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
            case 'interests':
                this.interests = value;
                break;
            case 'comments':
                this.comments = value;
                break;
            default:
                break;
        }
    }

    /**
     * Validate all form fields
     * Uses Lightning Web Components' built-in validation via reportValidity()
     *
     * @returns {boolean} - True if all fields are valid, false otherwise
     */
    validateForm() {
        // Get all lightning input components
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-textarea'),
            ...this.template.querySelectorAll('lightning-checkbox-group')
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        return allValid;
    }

    /**
     * Handle form submission
     * Validates all fields before processing
     * Shows success toast on valid submission
     * Resets form after successful submission
     */
    handleSubmit() {
        // Validate all form fields
        if (this.validateForm()) {
            // Create form data object for submission
            const formData = {
                fullName: this.fullName,
                email: this.email,
                phone: this.phone,
                country: this.country,
                interests: this.interests,
                comments: this.comments
            };

            // Log form data (in real implementation, this would be sent to server)
            console.log('Form submitted successfully:', JSON.stringify(formData, null, 2));

            // Show success toast notification
            this.showSuccessToast();

            // Reset form after successful submission
            this.resetForm();
        } else {
            // Show error toast if validation fails
            this.showErrorToast();
        }
    }

    /**
     * Reset all form fields to their initial empty state
     */
    handleReset() {
        this.resetForm();

        // Log reset confirmation (OSS LWC: no toast API available)
        console.log('ℹ️ Form Reset: All fields have been cleared');
    }

    /**
     * Reset form helper method
     * Clears all field values
     */
    resetForm() {
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.interests = [];
        this.comments = '';
    }

    /**
     * Show success notification
     * Displayed after successful form submission
     * (OSS LWC: using console.log instead of toast API)
     */
    showSuccessToast() {
        console.log('✅ Success: Form submitted successfully!');
    }

    /**
     * Show error notification
     * Displayed when form validation fails
     * (OSS LWC: using console.log instead of toast API)
     */
    showErrorToast() {
        console.log('❌ Error: Please complete all required fields correctly');
    }
}