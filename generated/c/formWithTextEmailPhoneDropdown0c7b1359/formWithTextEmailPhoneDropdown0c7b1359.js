import { LightningElement, track } from 'lwc';

/**
 * Form component with multiple input types:
 * - Text input for full name
 * - Email input with validation
 * - Phone input with pattern validation
 * - Dropdown/combobox for country selection
 * - Multiple checkboxes for interests
 * - Textarea for additional comments
 *
 * Implements SLDS 2 best practices with Lightning Base Components
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field values
    @track fullName = '';
    @track email = '';
    @track phone = '';
    @track country = '';
    @track selectedInterests = [];
    @track comments = '';

    // UI state
    @track showSuccessMessage = false;

    /**
     * Country options for the dropdown
     * Each option has a label and value property
     */
    get countryOptions() {
        return [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'GB' },
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
     * Interest options for checkboxes
     * Users can select multiple interests
     */
    get interestOptions() {
        return [
            { label: 'Technology', value: 'technology' },
            { label: 'Business', value: 'business' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Sales', value: 'sales' },
            { label: 'Customer Service', value: 'service' },
            { label: 'Development', value: 'development' }
        ];
    }

    /**
     * Computed property to disable submit button
     * Button is disabled if required fields are empty
     */
    get isSubmitDisabled() {
        return !this.fullName || !this.email || !this.phone || !this.country;
    }

    /**
     * Handle changes to the full name input
     * @param {Event} event - Input change event
     */
    handleFullNameChange(event) {
        this.fullName = event.target.value;
        this.hideSuccessMessage();
    }

    /**
     * Handle changes to the email input
     * @param {Event} event - Input change event
     */
    handleEmailChange(event) {
        this.email = event.target.value;
        this.hideSuccessMessage();
    }

    /**
     * Handle changes to the phone input
     * @param {Event} event - Input change event
     */
    handlePhoneChange(event) {
        this.phone = event.target.value;
        this.hideSuccessMessage();
    }

    /**
     * Handle changes to the country dropdown
     * @param {Event} event - Combobox change event
     */
    handleCountryChange(event) {
        this.country = event.detail.value;
        this.hideSuccessMessage();
    }

    /**
     * Handle changes to the interests checkboxes
     * @param {Event} event - Checkbox group change event
     */
    handleInterestsChange(event) {
        this.selectedInterests = event.detail.value;
        this.hideSuccessMessage();
    }

    /**
     * Handle changes to the comments textarea
     * @param {Event} event - Textarea change event
     */
    handleCommentsChange(event) {
        this.comments = event.target.value;
        this.hideSuccessMessage();
    }

    /**
     * Handle form submission
     * Validates required fields and displays success message
     */
    handleSubmit() {
        // Get all input fields for validation
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            // Log form data for debugging
            console.log('Form Submitted:', {
                fullName: this.fullName,
                email: this.email,
                phone: this.phone,
                country: this.country,
                interests: this.selectedInterests,
                comments: this.comments
            });

            // Show success message
            this.showSuccessMessage = true;

            // Hide success message after 3 seconds
            setTimeout(() => {
                this.hideSuccessMessage();
            }, 3000);

            // TODO: Integrate with Salesforce data service (LDS or Apex)
            // Example: Use Lightning Data Service to create a record
            // or call an Apex method to process the form data
        }
    }

    /**
     * Handle clear form action
     * Resets all form fields to their default values
     */
    handleClear() {
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.country = '';
        this.selectedInterests = [];
        this.comments = '';
        this.hideSuccessMessage();
    }

    /**
     * Hide the success message
     * Helper method to manage UI state
     */
    hideSuccessMessage() {
        this.showSuccessMessage = false;
    }
}