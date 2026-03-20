import { LightningElement } from 'lwc';

/**
 * FormWithTextEmailPhoneDropdown Component
 *
 * A comprehensive form component that demonstrates various input types including:
 * - Text input (Full Name)
 * - Email input (Email Address)
 * - Phone input (Phone Number)
 * - Dropdown/Combobox (Country selection)
 * - Checkboxes (Interests: Newsletter, Updates, Promotions)
 * - Textarea (Comments)
 *
 * Features:
 * - Form validation (required fields)
 * - Submit and Reset functionality
 * - Success message display
 * - SLDS compliant styling
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field values - reactive by default, no @track needed
    fullName = '';
    email = '';
    phone = '';
    country = '';
    comments = '';

    // Checkbox states
    newsletter = false;
    updates = false;
    promotions = false;

    // UI state
    showSuccess = false;

    /**
     * Country options for the dropdown
     * Includes a diverse list of countries for user selection
     */
    countryOptions = [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Japan', value: 'JP' },
        { label: 'Australia', value: 'AU' },
        { label: 'India', value: 'IN' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Mexico', value: 'MX' }
    ];

    /**
     * Computed property for success message
     * Returns the success message text after form submission
     */
    get successMessage() {
        return 'Form submitted successfully! Thank you for your information.';
    }

    /**
     * Computed property to determine if submit button should be disabled
     * Submit is disabled if any required field is empty
     * Required fields: fullName, email, country
     */
    get isSubmitDisabled() {
        return !this.fullName || !this.email || !this.country;
    }

    /**
     * Handle changes to text, email, phone, textarea, and combobox fields
     * Updates the corresponding property based on the field name
     *
     * @param {Event} event - The change event from the input field
     */
    handleFieldChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        // Update the corresponding property
        switch(fieldName) {
            case 'fullName':
                this.fullName = fieldValue;
                break;
            case 'email':
                this.email = fieldValue;
                break;
            case 'phone':
                this.phone = fieldValue;
                break;
            case 'country':
                this.country = fieldValue;
                break;
            case 'comments':
                this.comments = fieldValue;
                break;
            default:
                break;
        }
    }

    /**
     * Handle changes to checkbox fields
     * Updates the corresponding checkbox state
     *
     * @param {Event} event - The change event from the checkbox
     */
    handleCheckboxChange(event) {
        const checkboxName = event.target.name;
        const isChecked = event.target.checked;

        // Update the corresponding checkbox state
        switch(checkboxName) {
            case 'newsletter':
                this.newsletter = isChecked;
                break;
            case 'updates':
                this.updates = isChecked;
                break;
            case 'promotions':
                this.promotions = isChecked;
                break;
            default:
                break;
        }
    }

    /**
     * Handle form submission
     * Validates required fields, displays success message, and processes form data
     *
     * @param {Event} event - The submit event from the form
     */
    handleSubmit(event) {
        event.preventDefault();

        // Validate that all required fields are filled
        if (this.isSubmitDisabled) {
            return;
        }

        // Collect form data for processing
        const formData = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            country: this.country,
            interests: {
                newsletter: this.newsletter,
                updates: this.updates,
                promotions: this.promotions
            },
            comments: this.comments
        };

        // Log form data (in production, this would be sent to a server)
        console.log('Form submitted with data:', formData);

        // Display success message
        this.showSuccess = true;

        // Hide success message after 5 seconds
        setTimeout(() => {
            this.showSuccess = false;
        }, 5000);

        // TODO: Implement server-side submission logic
        // This could involve calling an Apex method or making an API call
        // to save the form data to Salesforce or an external system
    }

    /**
     * Handle form reset
     * Clears all form fields and resets to initial state
     */
    handleReset() {
        // Reset all text fields
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.comments = '';

        // Reset all checkboxes
        this.newsletter = false;
        this.updates = false;
        this.promotions = false;

        // Hide success message if displayed
        this.showSuccess = false;

        // Note: Lightning components automatically update their displayed values
        // based on the bound properties. By resetting the properties above,
        // the template will automatically reflect the changes through data binding.
        // No manual DOM manipulation is needed.
    }
}