import { LightningElement, track } from 'lwc';

/**
 * Component: formWithTextEmailPhoneDropdown
 * Description: A form component that collects contact information including:
 * - Text input (full name)
 * - Email input
 * - Phone input
 * - Dropdown for preferred contact method
 * - Checkbox group for interests
 * - Textarea for additional comments
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Track form field values
    fullName = '';
    email = '';
    phone = '';
    contactMethod = '';
    comments = '';

    // Track checkbox states as an object
    @track interests = {
        products: false,
        newsletter: false,
        events: false
    };

    /**
     * Handle text input change
     * @param {Event} event - Input change event
     */
    handleTextChange(event) {
        this.fullName = event.target.value;
    }

    /**
     * Handle email input change
     * @param {Event} event - Input change event
     */
    handleEmailChange(event) {
        this.email = event.target.value;
    }

    /**
     * Handle phone input change
     * @param {Event} event - Input change event
     */
    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    /**
     * Handle dropdown selection change
     * @param {Event} event - Select change event
     */
    handleDropdownChange(event) {
        this.contactMethod = event.target.value;
    }

    /**
     * Handle checkbox change for interests
     * @param {Event} event - Checkbox change event
     */
    handleCheckboxChange(event) {
        const checkboxValue = event.target.value;
        const isChecked = event.target.checked;

        // Update the specific checkbox state
        this.interests = {
            ...this.interests,
            [checkboxValue]: isChecked
        };
    }

    /**
     * Handle textarea change
     * @param {Event} event - Textarea change event
     */
    handleTextareaChange(event) {
        this.comments = event.target.value;
    }

    /**
     * Computed property to determine if submit button should be disabled
     * Required fields: fullName, email, contactMethod
     * @returns {boolean} - True if required fields are empty
     */
    get isSubmitDisabled() {
        return !this.fullName || !this.email || !this.contactMethod;
    }

    /**
     * Handle form submission
     * Validates required fields and collects all form data
     */
    handleSubmit() {
        // Validate required fields
        if (this.isSubmitDisabled) {
            console.error('Please fill in all required fields');
            return;
        }

        // Collect selected interests
        const selectedInterests = Object.keys(this.interests).filter(
            key => this.interests[key]
        );

        // Prepare form data
        const formData = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            contactMethod: this.contactMethod,
            interests: selectedInterests,
            comments: this.comments
        };

        // Log form data (in production, this would dispatch an event or call an API)
        console.log('Form submitted with data:', formData);

        // TODO: Dispatch custom event with form data for parent component handling
        // this.dispatchEvent(new CustomEvent('formsubmit', { detail: formData }));

        // TODO: Reset form after successful submission if needed
        // this.resetForm();
    }

    /**
     * Reset form to initial state
     * Helper method for clearing form after submission
     */
    resetForm() {
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.contactMethod = '';
        this.comments = '';
        this.interests = {
            products: false,
            newsletter: false,
            events: false
        };
    }
}