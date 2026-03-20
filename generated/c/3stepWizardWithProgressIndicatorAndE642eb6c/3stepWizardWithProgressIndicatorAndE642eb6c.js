import { LightningElement } from 'lwc';

/**
 * 3-Step Wizard Component with Progress Indicator
 * Implements a wizard interface with visual progress tracking and navigation controls
 */
export default class ThreeStepWizardWithProgressIndicatorAnd extends LightningElement {
    // Current step tracking (1, 2, or 3)
    currentStep = 1;

    // Form data - Step 1: Basic Information
    name = '';
    email = '';

    // Form data - Step 2: Additional Details
    phone = '';
    address = '';

    /**
     * Step 1 computed properties for progress indicator styling
     */
    get isStep1() {
        return this.currentStep === 1;
    }

    get step1Class() {
        if (this.currentStep === 1) {
            return 'slds-path__item slds-is-current slds-is-active';
        } else if (this.currentStep > 1) {
            return 'slds-path__item slds-is-complete';
        }
        return 'slds-path__item slds-is-incomplete';
    }

    get step1Selected() {
        return this.currentStep === 1 ? 'true' : 'false';
    }

    /**
     * Step 2 computed properties for progress indicator styling
     */
    get isStep2() {
        return this.currentStep === 2;
    }

    get step2Class() {
        if (this.currentStep === 2) {
            return 'slds-path__item slds-is-current slds-is-active';
        } else if (this.currentStep > 2) {
            return 'slds-path__item slds-is-complete';
        }
        return 'slds-path__item slds-is-incomplete';
    }

    get step2Selected() {
        return this.currentStep === 2 ? 'true' : 'false';
    }

    /**
     * Step 3 computed properties for progress indicator styling
     */
    get isStep3() {
        return this.currentStep === 3;
    }

    get step3Class() {
        if (this.currentStep === 3) {
            return 'slds-path__item slds-is-current slds-is-active';
        } else if (this.currentStep > 3) {
            return 'slds-path__item slds-is-complete';
        }
        return 'slds-path__item slds-is-incomplete';
    }

    get step3Selected() {
        return this.currentStep === 3 ? 'true' : 'false';
    }

    /**
     * Navigation button visibility and state
     */
    get isBackDisabled() {
        return this.currentStep === 1;
    }

    get showNextButton() {
        return this.currentStep < 3;
    }

    get showFinishButton() {
        return this.currentStep === 3;
    }

    /**
     * Display properties for review step
     */
    get phoneDisplay() {
        return this.phone || 'Not provided';
    }

    get addressDisplay() {
        return this.address || 'Not provided';
    }

    /**
     * Form input handlers - Step 1
     */
    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    /**
     * Form input handlers - Step 2
     */
    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleAddressChange(event) {
        this.address = event.target.value;
    }

    /**
     * Navigation handlers
     */
    handleNext() {
        // Validate required fields before advancing
        if (this.currentStep === 1) {
            if (!this.validateStep1()) {
                return;
            }
        }

        if (this.currentStep < 3) {
            this.currentStep += 1;
        }
    }

    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep -= 1;
        }
    }

    handleFinish() {
        // Fire completion event or perform final action
        this.dispatchEvent(
            new CustomEvent('wizardcomplete', {
                detail: {
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    address: this.address
                }
            })
        );
    }

    /**
     * Progress indicator click handlers
     */
    handleStep1Click(event) {
        event.preventDefault();
        // Allow navigation to completed steps
        if (this.currentStep > 1) {
            this.currentStep = 1;
        }
    }

    handleStep2Click(event) {
        event.preventDefault();
        // Allow navigation only if step 1 is complete
        if (this.currentStep > 1) {
            this.currentStep = 2;
        }
    }

    handleStep3Click(event) {
        event.preventDefault();
        // Allow navigation only if step 2 is complete
        if (this.currentStep > 2) {
            this.currentStep = 3;
        }
    }

    /**
     * Validation logic
     */
    validateStep1() {
        if (!this.name || !this.email) {
            // Show validation error
            this.dispatchEvent(
                new CustomEvent('showerror', {
                    detail: {
                        message: 'Please fill in all required fields (Name and Email)'
                    }
                })
            );
            return false;
        }

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.email)) {
            this.dispatchEvent(
                new CustomEvent('showerror', {
                    detail: {
                        message: 'Please enter a valid email address'
                    }
                })
            );
            return false;
        }

        return true;
    }
}