import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

/**
 * FormWithTextEmailPhoneDropdown Component
 *
 * A comprehensive form component featuring multiple input types:
 * - Text input for full name (required)
 * - Email input with validation (required)
 * - Phone input with format validation
 * - Dropdown for country selection
 * - Checkbox group for interests
 * - Textarea for comments
 *
 * Follows SLDS 2 design patterns and accessibility guidelines.
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {

    /**
     * Form data model
     * Tracks all form field values
     */
    @track formData = {
        fullName: '',
        email: '',
        phone: '',
        country: '',
        comments: ''
    };

    /**
     * Country options for dropdown
     * Following SLDS combobox pattern
     */
    countryOptions = [
        { label: 'USA', value: 'USA' },
        { label: 'Canada', value: 'Canada' },
        { label: 'UK', value: 'UK' },
        { label: 'Australia', value: 'Australia' },
        { label: 'Other', value: 'Other' }
    ];

    /**
     * Interest options for checkboxes
     * Tracks checked state for each option
     */
    @track interestOptions = [
        { label: 'Technology', value: 'technology', checked: false },
        { label: 'Sports', value: 'sports', checked: false },
        { label: 'Music', value: 'music', checked: false },
        { label: 'Travel', value: 'travel', checked: false }
    ];

    /**
     * Submission state flag
     * Prevents duplicate submissions
     */
    @track isSubmitting = false;

    /**
     * Handles changes to standard input fields
     * Updates formData model with new values
     *
     * @param {Event} event - Input change event
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        this.formData = {
            ...this.formData,
            [field]: value
        };
    }

    /**
     * Handles checkbox state changes
     * Updates the checked state in interestOptions array
     *
     * @param {Event} event - Checkbox change event
     */
    handleCheckboxChange(event) {
        const checkboxValue = event.target.dataset.id;
        const isChecked = event.target.checked;

        this.interestOptions = this.interestOptions.map(option => {
            if (option.value === checkboxValue) {
                return { ...option, checked: isChecked };
            }
            return option;
        });
    }

    /**
     * Validates all required form fields
     * Triggers native HTML5 validation
     *
     * @returns {boolean} - True if form is valid
     */
    validateForm() {
        // Query all input components
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
     * Collects selected interests from checkbox group
     *
     * @returns {Array} - Array of selected interest values
     */
    getSelectedInterests() {
        return this.interestOptions
            .filter(option => option.checked)
            .map(option => option.value);
    }

    /**
     * Handles form submission
     * Validates fields and displays success/error toast
     *
     * @param {Event} event - Submit event
     */
    handleSubmit(event) {
        event.preventDefault();

        // Prevent duplicate submissions
        if (this.isSubmitting) {
            return;
        }

        // Validate all fields
        if (!this.validateForm()) {
            this.showToast(
                'Error',
                'Please complete all required fields correctly.',
                'error'
            );
            return;
        }

        this.isSubmitting = true;

        // Collect form data
        const selectedInterests = this.getSelectedInterests();
        const submissionData = {
            ...this.formData,
            interests: selectedInterests
        };

        // Simulate form submission
        // In production, this would call an Apex method or API
        try {
            console.log('Form submitted:', JSON.stringify(submissionData, null, 2));

            this.showToast(
                'Success',
                'Form submitted successfully!',
                'success'
            );

            // Reset form after successful submission
            this.handleReset();

        } catch (error) {
            console.error('Submission error:', error);
            this.showToast(
                'Error',
                'An error occurred while submitting the form. Please try again.',
                'error'
            );
        } finally {
            this.isSubmitting = false;
        }
    }

    /**
     * Resets all form fields to initial state
     * Clears validation errors
     */
    handleReset() {
        // Reset form data
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            country: '',
            comments: ''
        };

        // Reset checkboxes
        this.interestOptions = this.interestOptions.map(option => ({
            ...option,
            checked: false
        }));

        // Clear validation errors
        const inputs = [
            ...this.template.querySelectorAll('lightning-input'),
            ...this.template.querySelectorAll('lightning-combobox'),
            ...this.template.querySelectorAll('lightning-textarea')
        ];

        inputs.forEach(input => {
            input.setCustomValidity('');
            input.reportValidity();
        });

        this.isSubmitting = false;
    }

    /**
     * Displays a toast notification
     *
     * @param {string} title - Toast title
     * @param {string} message - Toast message
     * @param {string} variant - Toast variant (success, error, warning, info)
     */
    showToast(title, message, variant) {
        // const event = new ShowToastEvent({
        //     title: title,
        //     message: message,
        //     variant: variant
        // });
        // this.dispatchEvent(event);
        console.log(`Toast [${variant}]: ${title} - ${message}`);
    }
}