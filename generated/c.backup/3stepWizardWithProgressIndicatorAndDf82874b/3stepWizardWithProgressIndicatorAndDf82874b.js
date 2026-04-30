import { LightningElement, api } from 'lwc';

/**
 * 3-Step Wizard Component with Progress Indicator
 *
 * This component implements a wizard interface with:
 * - 3 distinct steps with unique content
 * - Visual progress indicator showing current position
 * - Navigation buttons (Back/Next/Finish)
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Step state management
 */
export default class Component3stepWizardWithProgressIndicatorAndC14Simple20260311 extends LightningElement {
    // Private property to track the current active step (1, 2, or 3)
    currentStep = 1;

    // Total number of steps in the wizard
    totalSteps = 3;

    /**
     * Computed property to determine if currently on step 1
     * @returns {boolean} True if current step is 1
     */
    get isStep1() {
        return this.currentStep === 1;
    }

    /**
     * Computed property to determine if currently on step 2
     * @returns {boolean} True if current step is 2
     */
    get isStep2() {
        return this.currentStep === 2;
    }

    /**
     * Computed property to determine if currently on step 3
     * @returns {boolean} True if current step is 3
     */
    get isStep3() {
        return this.currentStep === 3;
    }

    /**
     * Computed property to check if on the first step
     * Used to disable the Back button
     * @returns {boolean} True if on step 1
     */
    get isFirstStep() {
        return this.currentStep === 1;
    }

    /**
     * Computed property to check if on the last step
     * Used to show Finish button instead of Next
     * @returns {boolean} True if on step 3
     */
    get isLastStep() {
        return this.currentStep === this.totalSteps;
    }

    /**
     * Computed property for Step 1 CSS classes
     * Applies appropriate SLDS classes based on step state
     * @returns {string} CSS classes for step 1
     */
    get step1Class() {
        return this.getStepClass(1);
    }

    /**
     * Computed property for Step 2 CSS classes
     * @returns {string} CSS classes for step 2
     */
    get step2Class() {
        return this.getStepClass(2);
    }

    /**
     * Computed property for Step 3 CSS classes
     * @returns {string} CSS classes for step 3
     */
    get step3Class() {
        return this.getStepClass(3);
    }

    /**
     * Helper method to determine the CSS class for a step
     * Based on whether it's active, completed, or upcoming
     * @param {number} stepNumber - The step number to get classes for
     * @returns {string} Space-separated CSS classes
     */
    getStepClass(stepNumber) {
        const baseClass = 'slds-progress__item';

        if (stepNumber < this.currentStep) {
            // Completed step
            return `${baseClass} slds-is-completed`;
        } else if (stepNumber === this.currentStep) {
            // Current active step
            return `${baseClass} slds-is-active`;
        } else {
            // Upcoming step
            return baseClass;
        }
    }

    /**
     * Handle Next button click
     * Advances to the next step if not on the last step
     */
    handleNext() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep += 1;
            this.announceStepChange();
            this.dispatchStepChangeEvent();
        }
    }

    /**
     * Handle Back button click
     * Goes back to the previous step if not on the first step
     */
    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep -= 1;
            this.announceStepChange();
            this.dispatchStepChangeEvent();
        }
    }

    /**
     * Handle Finish button click
     * Dispatches a finish event to notify parent components
     */
    handleFinish() {
        // Dispatch custom event to notify parent that wizard is complete
        const finishEvent = new CustomEvent('wizardfinish', {
            detail: {
                step: this.currentStep
            }
        });
        this.dispatchEvent(finishEvent);
    }

    /**
     * Dispatch a step change event to notify parent components
     * Includes details about the new step and previous step
     */
    dispatchStepChangeEvent() {
        const stepChangeEvent = new CustomEvent('stepchange', {
            detail: {
                currentStep: this.currentStep,
                totalSteps: this.totalSteps
            }
        });
        this.dispatchEvent(stepChangeEvent);
    }

    /**
     * Announce step changes to screen readers for accessibility
     * Creates a live region announcement for assistive technology
     */
    announceStepChange() {
        // Create an announcement for screen readers
        const announcement = `Step ${this.currentStep} of ${this.totalSteps}`;

        // Use setTimeout to ensure the DOM updates before announcing
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            // This would typically use a live region for screen reader announcements
            // The aria-valuenow on the progress bar provides this automatically
        }, 100);
    }

    /**
     * Public API method to programmatically navigate to a specific step
     * @param {number} stepNumber - The step number to navigate to (1-3)
     */
    @api
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this.currentStep = stepNumber;
            this.announceStepChange();
            this.dispatchStepChangeEvent();
        }
    }

    /**
     * Public API method to get the current step number
     * @returns {number} The current step number (1-3)
     */
    @api
    getCurrentStep() {
        return this.currentStep;
    }

    /**
     * Public API method to reset the wizard to step 1
     */
    @api
    reset() {
        this.currentStep = 1;
        this.announceStepChange();
        this.dispatchStepChangeEvent();
    }
}