import { LightningElement, api } from 'lwc';

/**
 * Three Step Wizard Component with Progress Indicator
 *
 * This component provides a 3-step wizard interface with:
 * - Visual progress indicator showing completed, current, and upcoming steps
 * - Navigation controls (Back/Next buttons)
 * - Accessible ARIA labels for screen readers
 * - SLDS 2 compliant styling
 */
export default class ThreeStepWizardWithProgressIndicatorAnd extends LightningElement {

    // Private property to track current step (1, 2, or 3)
    currentStep = 1;

    /**
     * Public API to programmatically set the current step
     * Note: Boolean @api properties MUST default to false per LWC1099
     */
    @api
    get step() {
        return this.currentStep;
    }
    set step(value) {
        const stepNum = parseInt(value, 10);
        if (stepNum >= 1 && stepNum <= 3) {
            this.currentStep = stepNum;
        }
    }

    // ==================== Step Display Logic ====================

    /**
     * Computed properties to determine which step content to show
     */
    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3;
    }

    // ==================== Button State Logic ====================

    /**
     * Back button should be disabled on step 1
     */
    get isBackDisabled() {
        return this.currentStep === 1;
    }

    /**
     * Next button label changes to "Finish" on step 3
     */
    get nextButtonLabel() {
        return this.currentStep === 3 ? 'Finish' : 'Next';
    }

    // ==================== Progress Indicator Classes ====================

    /**
     * Step 1 CSS classes for progress indicator
     * Shows: completed (if past), active (if current), or default (if upcoming)
     */
    get step1Class() {
        if (this.currentStep > 1) {
            return 'slds-progress__item slds-is-completed';
        } else if (this.currentStep === 1) {
            return 'slds-progress__item slds-is-active';
        }
        return 'slds-progress__item';
    }

    /**
     * Step 2 CSS classes for progress indicator
     */
    get step2Class() {
        if (this.currentStep > 2) {
            return 'slds-progress__item slds-is-completed';
        } else if (this.currentStep === 2) {
            return 'slds-progress__item slds-is-active';
        }
        return 'slds-progress__item';
    }

    /**
     * Step 3 CSS classes for progress indicator
     */
    get step3Class() {
        if (this.currentStep === 3) {
            return 'slds-progress__item slds-is-active';
        } else if (this.currentStep > 3) {
            return 'slds-progress__item slds-is-completed';
        }
        return 'slds-progress__item';
    }

    // ==================== Accessibility - ARIA Labels ====================

    /**
     * ARIA labels for step buttons (for screen readers)
     * Using getters to avoid template literals in HTML attributes
     */
    get step1AriaLabel() {
        if (this.currentStep > 1) {
            return 'Step 1 - Completed: Getting Started';
        } else if (this.currentStep === 1) {
            return 'Step 1 - Current: Getting Started';
        }
        return 'Step 1 - Upcoming: Getting Started';
    }

    get step2AriaLabel() {
        if (this.currentStep > 2) {
            return 'Step 2 - Completed: Configuration';
        } else if (this.currentStep === 2) {
            return 'Step 2 - Current: Configuration';
        }
        return 'Step 2 - Upcoming: Configuration';
    }

    get step3AriaLabel() {
        if (this.currentStep === 3) {
            return 'Step 3 - Current: Review and Finish';
        } else if (this.currentStep > 3) {
            return 'Step 3 - Completed: Review and Finish';
        }
        return 'Step 3 - Upcoming: Review and Finish';
    }

    /**
     * Status text for assistive technology
     */
    get step1Status() {
        if (this.currentStep > 1) return 'Complete';
        if (this.currentStep === 1) return 'Current Step';
        return 'Not Complete';
    }

    get step2Status() {
        if (this.currentStep > 2) return 'Complete';
        if (this.currentStep === 2) return 'Current Step';
        return 'Not Complete';
    }

    get step3Status() {
        if (this.currentStep === 3) return 'Current Step';
        if (this.currentStep > 3) return 'Complete';
        return 'Not Complete';
    }

    /**
     * Disable step buttons to prevent direct navigation in this implementation
     * If you want to enable direct step navigation, set these to false
     */
    get isStep1Disabled() {
        return true;
    }

    get isStep2Disabled() {
        return true;
    }

    get isStep3Disabled() {
        return true;
    }

    // ==================== Navigation Handlers ====================

    /**
     * Handle Back button click - moves to previous step
     */
    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.dispatchStepChangeEvent();
        }
    }

    /**
     * Handle Next button click - moves to next step or finishes
     */
    handleNext() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.dispatchStepChangeEvent();
        } else {
            // Step 3: Finish button clicked
            this.handleFinish();
        }
    }

    /**
     * Handle direct step click (if enabled)
     * Currently disabled, but logic included for potential future enhancement
     */
    handleStepClick(event) {
        // Direct step navigation is currently disabled
        // To enable, set isStep1Disabled, isStep2Disabled, isStep3Disabled to false
        const targetStep = parseInt(event.currentTarget.dataset.step, 10);
        if (targetStep && targetStep !== this.currentStep) {
            this.currentStep = targetStep;
            this.dispatchStepChangeEvent();
        }
    }

    /**
     * Handle Finish action (on step 3)
     * Dispatches a custom event for parent component to handle
     */
    handleFinish() {
        const finishEvent = new CustomEvent('finish', {
            detail: {
                message: 'Wizard completed successfully'
            }
        });
        this.dispatchEvent(finishEvent);
    }

    /**
     * Dispatch step change event for parent components
     */
    dispatchStepChangeEvent() {
        const stepChangeEvent = new CustomEvent('stepchange', {
            detail: {
                step: this.currentStep
            }
        });
        this.dispatchEvent(stepChangeEvent);
    }
}