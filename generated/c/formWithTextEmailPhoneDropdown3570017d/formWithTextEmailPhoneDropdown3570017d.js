import { LightningElement, track } from 'lwc';

/**
 * Lightning Web Component for collecting contact information through a form.
 * Includes text, email, phone, dropdown, checkboxes, and textarea inputs.
 * Follows SLDS 2 guidelines with proper validation and accessibility.
 */
export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Track form data reactively
    @track formData = {
        fullName: '',
        email: '',
        phone: '',
        category: '',
        preferences: [],
        comments: ''
    };

    // Control success message visibility
    @track showSuccess = false;

    /**
     * Category options for the dropdown/combobox.
     * These represent different inquiry types or user categories.
     */
    get categoryOptions() {
        return [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Technical Support', value: 'technical' },
            { label: 'Sales', value: 'sales' },
            { label: 'Feedback', value: 'feedback' },
            { label: 'Other', value: 'other' }
        ];
    }

    /**
     * Preference options for the checkbox group.
     * These represent user preferences or subscription options.
     */
    get preferenceOptions() {
        return [
            { label: 'Email Updates', value: 'email_updates' },
            { label: 'SMS Notifications', value: 'sms_notifications' },
            { label: 'Newsletter Subscription', value: 'newsletter' },
            { label: 'Product Announcements', value: 'product_announcements' }
        ];
    }

    /**
     * Handles input change events from all form fields.
     * Updates the formData object based on the field name and value.
     * 
     * @param {Event} event - The change event from the input field
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.detail.value || event.target.value;

        // Update the form data reactively
        this.formData = {
            ...this.formData,
            [field]: value
        };
    }

    /**
     * Handles form submission.
     * Validates all required fields and displays success message.
     * 
     * @param {Event} event - The form submit event
     */
    handleSubmit(event) {
        event.preventDefault();

        // Check validity of all lightning-input, lightning-combobox, and lightning-textarea components
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        if (allValid) {
            // Form is valid - process submission
            console.log('Form submitted with data:', JSON.stringify(this.formData, null, 2));

            // Show success message
            this.showSuccess = true;

            // Hide success message after 5 seconds
            setTimeout(() => {
                this.showSuccess = false;
            }, 5000);

            // TODO: Add actual form submission logic here
            // This could include:
            // - Calling an Apex method to save data
            // - Sending data to an external API
            // - Dispatching a custom event to parent component
        } else {
            // Form validation failed
            console.log('Form validation failed. Please check all required fields.');
        }
    }

    /**
     * Resets the form to its initial empty state.
     * Clears all field values and validation messages.
     */
    handleReset() {
        // Reset form data to initial values
        this.formData = {
            fullName: '',
            email: '',
            phone: '',
            category: '',
            preferences: [],
            comments: ''
        };

        // Hide success message if visible
        this.showSuccess = false;

        // Reset validation state of all input fields
        const inputFields = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea, lightning-checkbox-group');
        if (inputFields) {
            inputFields.forEach(field => {
                field.value = field.name === 'preferences' ? [] : '';
            });
        }
    }
}