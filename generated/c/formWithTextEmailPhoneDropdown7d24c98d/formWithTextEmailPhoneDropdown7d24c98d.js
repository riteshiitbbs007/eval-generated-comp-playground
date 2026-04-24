import { LightningElement } from 'lwc';

/**
 * FormWithTextEmailPhoneDropdown Component
 *
 * This component implements a comprehensive form with multiple input types:
 * - Text input for name
 * - Email input with validation
 * - Phone input with pattern validation
 * - Dropdown/combobox for selection
 * - Checkbox group for multiple selections
 * - Textarea for extended comments
 *
 * The form follows SLDS design guidelines and uses Lightning Base Components
 * for consistent styling and accessibility.
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Form field values
    nameValue = '';
    emailValue = '';
    phoneValue = '';
    contactMethodValue = '';
    selectedInterests = [];
    commentsValue = '';

    // UI state
    showSuccess = false;

    /**
     * Options for the contact method dropdown
     * Provides three common contact preferences
     */
    contactMethodOptions = [
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Text Message', value: 'text' }
    ];

    /**
     * Options for the interests checkbox group
     * Allows users to select multiple areas of interest
     */
    interestOptions = [
        { label: 'Product Updates', value: 'products' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Events & Webinars', value: 'events' },
        { label: 'Special Offers', value: 'offers' }
    ];

    /**
     * Handles changes to the name text input
     * @param {Event} event - The change event from lightning-input
     */
    handleNameChange(event) {
        this.nameValue = event.target.value;
    }

    /**
     * Handles changes to the email input
     * @param {Event} event - The change event from lightning-input
     */
    handleEmailChange(event) {
        this.emailValue = event.target.value;
    }

    /**
     * Handles changes to the phone input
     * @param {Event} event - The change event from lightning-input
     */
    handlePhoneChange(event) {
        this.phoneValue = event.target.value;
    }

    /**
     * Handles changes to the contact method dropdown
     * @param {Event} event - The change event from lightning-combobox
     */
    handleContactMethodChange(event) {
        this.contactMethodValue = event.detail.value;
    }

    /**
     * Handles changes to the interests checkbox group
     * @param {Event} event - The change event from lightning-checkbox-group
     */
    handleInterestChange(event) {
        this.selectedInterests = event.detail.value;
    }

    /**
     * Handles changes to the comments textarea
     * @param {Event} event - The change event from lightning-textarea
     */
    handleCommentsChange(event) {
        this.commentsValue = event.target.value;
    }

    /**
     * Handles form submission
     * Validates all required fields and displays success message
     * @param {Event} event - The click event from submit button
     */
    handleSubmit(event) {
        // Get all input components for validation
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            // Form is valid, show success message
            this.showSuccess = true;

            // Hide success message after 3 seconds
            setTimeout(() => {
                this.showSuccess = false;
            }, 3000);

            // Log form data for debugging
            console.log('Form submitted with values:', {
                name: this.nameValue,
                email: this.emailValue,
                phone: this.phoneValue,
                contactMethod: this.contactMethodValue,
                interests: this.selectedInterests,
                comments: this.commentsValue
            });
        }
    }

    /**
     * Handles form reset
     * Clears all form fields and resets to initial state
     * @param {Event} event - The click event from reset button
     */
    handleReset(event) {
        // Reset all field values
        this.nameValue = '';
        this.emailValue = '';
        this.phoneValue = '';
        this.contactMethodValue = '';
        this.selectedInterests = [];
        this.commentsValue = '';
        this.showSuccess = false;

        // Reset input components visually
        const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-checkbox-group, lightning-textarea');
        inputs.forEach(input => {
            input.value = input.type === 'checkbox-group' ? [] : '';
        });
    }
}