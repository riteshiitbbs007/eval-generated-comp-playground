import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

export default class FormWithTextEmailPhoneDropdown extends LightningElement {
    // Track form field values
    fullName = '';
    email = '';
    phone = '';
    contactMethod = '';
    comments = '';
    
    // Track selected checkboxes
    @track selectedInterests = [];
    
    // Control success message visibility
    showSuccessMessage = false;

    // Options for contact method dropdown
    get contactMethodOptions() {
        return [
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'Text Message', value: 'text' },
            { label: 'Mail', value: 'mail' }
        ];
    }

    // Options for interest checkboxes
    get interestOptions() {
        return [
            { label: 'Product Updates', value: 'product_updates' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Events', value: 'events' },
            { label: 'Special Offers', value: 'special_offers' }
        ];
    }

    /**
     * Handle input changes for text, email, phone, textarea, and combobox fields
     * @param {Event} event - The change event from the input field
     */
    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        
        // Update the corresponding property based on field name
        this[field] = value;
    }

    /**
     * Handle checkbox group changes for multiple selections
     * @param {Event} event - The change event from the checkbox group
     */
    handleCheckboxChange(event) {
        this.selectedInterests = event.detail.value;
    }

    /**
     * Handle form submission with validation
     * @param {Event} event - The form submit event
     */
    handleSubmit(event) {
        // Prevent default form submission
        event.preventDefault();
        
        // Check validity of all input fields
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
        
        if (allValid) {
            // Process form data
            this.processFormSubmission();
        } else {
            // Show error toast if validation fails (commented out - not available in local dev)
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Validation Error',
            //         message: 'Please complete all required fields correctly.',
            //         variant: 'error'
            //     })
            // );
        }
    }

    /**
     * Process the form submission after successful validation
     */
    processFormSubmission() {
        // Collect all form data
        const formData = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            contactMethod: this.contactMethod,
            interests: this.selectedInterests,
            comments: this.comments
        };
        
        // Log form data (in production, this would be sent to server)
        console.log('Form Data Submitted:', JSON.stringify(formData, null, 2));
        
        // Show success message
        this.showSuccessMessage = true;

        // Show success toast (commented out - not available in local dev)
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Your form has been submitted successfully!',
        //         variant: 'success'
        //     })
        // );

        // Hide success message after 3 seconds
        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 3000);
        
        // TODO: Implement server-side submission logic using Apex or LDS
        // This could involve calling an Apex method to save the data to Salesforce records
    }

    /**
     * Reset all form fields to their initial state
     */
    handleReset() {
        // Clear all field values
        this.fullName = '';
        this.email = '';
        this.phone = '';
        this.contactMethod = '';
        this.selectedInterests = [];
        this.comments = '';
        this.showSuccessMessage = false;
        
        // Reset input field UI state
        const inputFields = this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea, lightning-checkbox-group');
        inputFields.forEach(field => {
            field.value = field.name === 'interests' ? [] : '';
        });
    }
}