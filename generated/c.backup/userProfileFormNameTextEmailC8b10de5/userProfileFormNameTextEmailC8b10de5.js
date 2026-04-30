import { LightningElement, api, track } from 'lwc';

export default class UserProfileFormNameTextEmail extends LightningElement {
    // API properties
    @api showRequiredFields = false;
    @api showCountry = false;
    @api showPhone = false;

    // Private tracked properties
    @track name = '';
    @track email = '';
    @track phone = '';
    @track selectedCountry = '';
    @track bio = '';
    @track selectedInterests = [];

    // Field validation states
    @track nameHasError = false;
    @track nameErrorMessage = '';
    @track emailHasError = false;
    @track emailErrorMessage = '';

    // Available countries for selection
    @track countries = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'mx', label: 'Mexico' },
        { value: 'gb', label: 'United Kingdom' },
        { value: 'fr', label: 'France' },
        { value: 'de', label: 'Germany' },
        { value: 'jp', label: 'Japan' },
        { value: 'au', label: 'Australia' },
        { value: 'in', label: 'India' },
        { value: 'br', label: 'Brazil' }
    ];

    // Available interests for selection
    @track interests = [
        { id: 'interest-tech', value: 'technology', label: 'Technology', checked: false },
        { id: 'interest-sports', value: 'sports', label: 'Sports', checked: false },
        { id: 'interest-music', value: 'music', label: 'Music', checked: false },
        { id: 'interest-art', value: 'art', label: 'Art', checked: false },
        { id: 'interest-travel', value: 'travel', label: 'Travel', checked: false },
        { id: 'interest-food', value: 'food', label: 'Food & Cooking', checked: false }
    ];

    // Getters for computed values
    get nameInputClass() {
        return this.nameHasError ? 'slds-input slds-has-error' : 'slds-input';
    }

    get emailInputClass() {
        return this.emailHasError ? 'slds-input slds-has-error' : 'slds-input';
    }

    get emailAriaDescribedBy() {
        return this.emailHasError ? 'email-error' : '';
    }

    // Event handlers
    handleNameChange(event) {
        this.name = event.target.value;
        this.validateName();
    }

    handleEmailChange(event) {
        this.email = event.target.value;
        this.validateEmail();
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleCountryChange(event) {
        this.selectedCountry = event.target.value;
    }

    handleInterestChange(event) {
        const value = event.target.value;
        const checked = event.target.checked;

        // Update the interests array
        this.interests = this.interests.map(item => {
            if (item.value === value) {
                return { ...item, checked };
            }
            return item;
        });

        // Update selected interests array for submission
        if (checked) {
            this.selectedInterests.push(value);
        } else {
            this.selectedInterests = this.selectedInterests.filter(interest => interest !== value);
        }
    }

    handleBioChange(event) {
        this.bio = event.target.value;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSubmit(event) {
        event.preventDefault();

        // Validate all fields
        this.validateName();
        this.validateEmail();

        // If there are no errors, submit the form
        if (!this.nameHasError && !this.emailHasError) {
            const formData = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                country: this.selectedCountry,
                interests: this.selectedInterests,
                bio: this.bio
            };

            this.dispatchEvent(new CustomEvent('submit', {
                detail: formData
            }));
        }
    }

    // Validation methods
    validateName() {
        if (!this.name || this.name.trim() === '') {
            this.nameHasError = true;
            this.nameErrorMessage = 'Name is required';
            return false;
        }

        this.nameHasError = false;
        this.nameErrorMessage = '';
        return true;
    }

    validateEmail() {
        if (!this.email || this.email.trim() === '') {
            this.emailHasError = true;
            this.emailErrorMessage = 'Email is required';
            return false;
        }

        // Basic email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            this.emailHasError = true;
            this.emailErrorMessage = 'Please enter a valid email address';
            return false;
        }

        this.emailHasError = false;
        this.emailErrorMessage = '';
        return true;
    }
}