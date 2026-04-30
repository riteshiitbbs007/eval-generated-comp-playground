import { LightningElement, api } from 'lwc';

/**
 * Three-Step Wizard Component with Progress Indicator
 * Implements a guided wizard experience with visual progress tracking,
 * navigation controls, and step content management.
 */
export default class ThreeStepWizard extends LightningElement {
    // ========================================
    // Public API Properties
    // ========================================

    /**
     * @api Label for step 1
     * Default: "Get Started"
     */
    @api step1Label = 'Get Started';

    /**
     * @api Label for step 2
     * Default: "Configure"
     */
    @api step2Label = 'Configure';

    /**
     * @api Label for step 3
     * Default: "Review"
     */
    @api step3Label = 'Review';

    // ========================================
    // Private Properties
    // ========================================

    /**
     * Current active step (1, 2, or 3)
     * Tracks the user's position in the wizard flow
     */
    currentStep = 1;

    // ========================================
    // Lifecycle Hooks
    // ========================================

    /**
     * Component initialization
     * Sets up initial state and ensures step 1 is active
     */
    connectedCallback() {
        // Ensure we start at step 1
        this.currentStep = 1;
    }

    // ========================================
    // Step State Computed Properties
    // ========================================

    /**
     * Check if current step is step 1
     * @returns {boolean} True if on step 1
     */
    get isStep1() {
        return this.currentStep === 1;
    }

    /**
     * Check if current step is step 2
     * @returns {boolean} True if on step 2
     */
    get isStep2() {
        return this.currentStep === 2;
    }

    /**
     * Check if current step is step 3
     * @returns {boolean} True if on step 3
     */
    get isStep3() {
        return this.currentStep === 3;
    }

    // ========================================
    // Progress Indicator Computed Properties
    // ========================================

    /**
     * CSS classes for step 1 progress indicator
     * @returns {string} SLDS classes based on step state
     */
    get step1Class() {
        const baseClass = 'slds-progress__item';
        if (this.currentStep === 1) {
            return `${baseClass} slds-is-active`;
        }
        if (this.currentStep > 1) {
            return `${baseClass} slds-is-completed`;
        }
        return baseClass;
    }

    /**
     * CSS classes for step 2 progress indicator
     * @returns {string} SLDS classes based on step state
     */
    get step2Class() {
        const baseClass = 'slds-progress__item';
        if (this.currentStep === 2) {
            return `${baseClass} slds-is-active`;
        }
        if (this.currentStep > 2) {
            return `${baseClass} slds-is-completed`;
        }
        return baseClass;
    }

    /**
     * CSS classes for step 3 progress indicator
     * @returns {string} SLDS classes based on step state
     */
    get step3Class() {
        const baseClass = 'slds-progress__item';
        if (this.currentStep === 3) {
            return `${baseClass} slds-is-active`;
        }
        if (this.currentStep > 3) {
            return `${baseClass} slds-is-completed`;
        }
        return baseClass;
    }

    /**
     * Screen reader status for step 1
     * @returns {string} Accessibility status text
     */
    get step1Status() {
        if (this.currentStep === 1) {
            return 'Current Step: Get Started';
        }
        if (this.currentStep > 1) {
            return 'Completed Step: Get Started';
        }
        return 'Step: Get Started';
    }

    /**
     * Screen reader status for step 2
     * @returns {string} Accessibility status text
     */
    get step2Status() {
        if (this.currentStep === 2) {
            return 'Current Step: Configure';
        }
        if (this.currentStep > 2) {
            return 'Completed Step: Configure';
        }
        return 'Step: Configure';
    }

    /**
     * Screen reader status for step 3
     * @returns {string} Accessibility status text
     */
    get step3Status() {
        if (this.currentStep === 3) {
            return 'Current Step: Review';
        }
        if (this.currentStep > 3) {
            return 'Completed Step: Review';
        }
        return 'Step: Review';
    }

    // ========================================
    // Navigation Computed Properties
    // ========================================

    /**
     * Determine if Back button should be shown
     * Hidden on first step, visible on steps 2 and 3
     * @returns {boolean} True if back button should be visible
     */
    get showBackButton() {
        return this.currentStep > 1;
    }

    /**
     * Label for Next/Finish button
     * Changes to "Finish" on final step
     * @returns {string} Button label text
     */
    get nextButtonLabel() {
        return this.currentStep === 3 ? 'Finish' : 'Next';
    }

    /**
     * ARIA label for Next/Finish button
     * Provides context for screen readers
     * @returns {string} Accessible button label
     */
    get nextButtonAriaLabel() {
        if (this.currentStep === 3) {
            return 'Finish wizard';
        }
        return 'Go to next step';
    }

    // ========================================
    // Navigation Event Handlers
    // ========================================

    /**
     * Handle Back button click
     * Navigates to previous step with boundary checking
     * Dispatches stepchange event for parent components
     */
    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep--;

            // Dispatch event to notify parent components
            this.dispatchEvent(new CustomEvent('stepchange', {
                detail: {
                    currentStep: this.currentStep,
                    direction: 'back',
                    stepLabel: this.getCurrentStepLabel()
                }
            }));

            // Announce step change to screen readers
            this.announceStepChange();
        }
    }

    /**
     * Handle Next/Finish button click
     * Navigates to next step or completes wizard
     * Dispatches stepchange or complete events
     */
    handleNext() {
        if (this.currentStep < 3) {
            // Move to next step
            this.currentStep++;

            // Dispatch event to notify parent components
            this.dispatchEvent(new CustomEvent('stepchange', {
                detail: {
                    currentStep: this.currentStep,
                    direction: 'next',
                    stepLabel: this.getCurrentStepLabel()
                }
            }));

            // Announce step change to screen readers
            this.announceStepChange();
        } else {
            // Wizard complete
            this.dispatchEvent(new CustomEvent('complete', {
                detail: {
                    completedSteps: 3
                }
            }));
        }
    }

    // ========================================
    // Public API Methods
    // ========================================

    /**
     * @api Navigate to a specific step programmatically
     * @param {number} stepNumber - Step number (1-3)
     */
    @api
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= 3) {
            this.currentStep = stepNumber;
            this.announceStepChange();
        }
    }

    /**
     * @api Reset wizard to first step
     */
    @api
    reset() {
        this.currentStep = 1;
        this.announceStepChange();
    }

    /**
     * @api Get current step number
     * @returns {number} Current step (1-3)
     */
    @api
    getCurrentStep() {
        return this.currentStep;
    }

    // ========================================
    // Helper Methods
    // ========================================

    /**
     * Get label for current step
     * @returns {string} Current step label
     */
    getCurrentStepLabel() {
        switch (this.currentStep) {
            case 1:
                return this.step1Label;
            case 2:
                return this.step2Label;
            case 3:
                return this.step3Label;
            default:
                return '';
        }
    }

    /**
     * Announce step change to screen readers
     * Creates a live region announcement for accessibility
     */
    announceStepChange() {
        const stepLabel = this.getCurrentStepLabel();
        const announcement = `Step ${this.currentStep} of 3: ${stepLabel}`;

        // TODO: Implement ARIA live region announcement
        // This would typically involve updating a live region element
        // that screen readers monitor for dynamic content changes
        console.log('Step changed:', announcement);
    }
}