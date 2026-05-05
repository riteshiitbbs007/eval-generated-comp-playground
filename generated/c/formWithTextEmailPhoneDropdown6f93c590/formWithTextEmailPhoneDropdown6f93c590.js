import { LightningElement } from 'lwc';

/**
 * Form component with multiple input types including text, email, phone, dropdown, checkboxes, and textarea.
 * Follows SLDS 2 standards and uses Lightning Base Components for consistent UI/UX.
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    /**
     * Form data object to store all field values
     * @type {Object}
     */
    formData = {
        fullName: '',
        email: '',
        phone: '',
        country: '',
        newsletter: [],
        comments: ''
    };

    /**
     * Flag to control success message visibility
     * @type {boolean}
     */
    showSuccessMessage = false;

    /**
     * Country dropdown options
     * @type {Array<Object>}
     */
    countryOptions = [
        { label: 'United States', value: 'USA' },
        { label: 'Canada', value: 'Canada' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Australia', value: 'Australia' },
        { label: 'Germany', value: 'Germany' }
    ];

    /**
     * Newsletter subscription options
     * @type {Array<Object>}
     */
    newsletterOptions = [
        { label: 'Product Updates', value: 'productUpdates' },
        { label: 'Marketing News', value: 'marketingNews' },
        { label: 'Event Invitations', value: 'eventInvitations' }
    ];

    /**
     * Handle input change events from all form fields
     * Updates the formData object with the new value
     * @param {Event} event - The change event from the input field
     */
    handleInputChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.detail.value;

        // Update the form data with the new value
        this.formData = {
            ...this.formData,
            [fieldName]: fieldValue
        };
    }

    /**
     * Handle form submission
     * Validates form and displays success message
     * @param {Event} event - The submit event from the form
     */
    handleSubmit(event) {
        event.preventDefault();

        // Check if all required fields are filled
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            // Display success message
            this.showSuccessMessage = true;

            // Log form data (in production, this would send data to server)
            console.log('Form submitted with data:', JSON.stringify(this.formData, null, 2));

            // Hide success message after 5 seconds
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 5000);
        }
    }

    /**
     * Handle clear button click
     * Resets all form fields to their initial state
     */
    handleClear() {
        // Reset form data
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            country: '',
            newsletter: [],
            comments: ''
        };

        // Hide success message if visible
        this.showSuccessMessage = false;

        // Reset all input fields in the template
        const inputFields = this.template.querySelectorAll(
            'lightning-input, lightning-combobox, lightning-textarea, lightning-checkbox-group'
        );
        
        if (inputFields) {
            inputFields.forEach(field => {
                field.value = field.name === 'newsletter' ? [] : '';
            });
        }
    }
}