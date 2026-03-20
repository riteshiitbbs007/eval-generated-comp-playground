import { LightningElement, api } from 'lwc';

/**
 * Three Step Wizard Component
 *
 * A wizard component that guides users through a 3-step process with:
 * - Visual progress indicator showing current, completed, and upcoming steps
 * - Navigation controls (Back/Next/Finish buttons)
 * - Step-specific content areas
 * - Full SLDS 2 compliance with design tokens and accessibility
 *
 * @extends LightningElement
 */
export default class ThreeStepWizard extends LightningElement {
    // ========================================
    // PUBLIC PROPERTIES
    // ========================================

    /**
     * Show or hide step numbers in the progress indicator
     * @type {boolean}
     * @default false
     * @api
     */
    @api showStepNumbers = false;

    // ========================================
    // PRIVATE PROPERTIES
    // ========================================

    /**
     * Current active step (1-based index)
     * @type {number}
     * @private
     */
    _currentStep = 1;

    /**
     * Total number of steps in the wizard
     * @type {number}
     * @private
     */
    totalSteps = 3;

    /**
     * Configuration for each step with labels
     * @type {Array<Object>}
     * @private
     */
    steps = [
        { number: 1, label: 'Account Information' },
        { number: 2, label: 'Contact Details' },
        { number: 3, label: 'Review & Submit' }
    ];

    /**
     * Industry options for combobox in Step 1
     * @type {Array<Object>}
     * @private
     */
    industryOptions = [
        { label: 'Technology', value: 'technology' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Retail', value: 'retail' }
    ];

    // ========================================
    // PUBLIC API METHODS
    // ========================================

    /**
     * Navigate to a specific step
     * @param {number} stepNumber - The step number to navigate to (1-3)
     * @api
     */
    @api
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this._currentStep = stepNumber;
            this.dispatchStepChangeEvent();
        }
    }

    /**
     * Reset the wizard to the first step
     * @api
     */
    @api
    reset() {
        this._currentStep = 1;
        this.dispatchStepChangeEvent();
    }

    /**
     * Get current step value (exposed via @api for external access)
     * @returns {number} Current step number
     * @api
     */
    @api
    get currentStep() {
        return this._currentStep;
    }

    set currentStep(value) {
        if (value >= 1 && value <= this.totalSteps) {
            this._currentStep = value;
        }
    }

    // ========================================
    // COMPUTED PROPERTIES - STEP VISIBILITY
    // ========================================

    /**
     * Check if current step is Step 1
     * @returns {boolean}
     */
    get isStep1() {
        return this._currentStep === 1;
    }

    /**
     * Check if current step is Step 2
     * @returns {boolean}
     */
    get isStep2() {
        return this._currentStep === 2;
    }

    /**
     * Check if current step is Step 3
     * @returns {boolean}
     */
    get isStep3() {
        return this._currentStep === 3;
    }

    // ========================================
    // COMPUTED PROPERTIES - BUTTON STATES
    // ========================================

    /**
     * Determine if Back button should be disabled
     * @returns {boolean} True when on first step
     */
    get isBackDisabled() {
        return this._currentStep === 1;
    }

    /**
     * Get label for Next/Finish button
     * @returns {string} "Finish" on last step, "Next" otherwise
     */
    get nextButtonLabel() {
        return this._currentStep === this.totalSteps ? 'Finish' : 'Next';
    }

    // ========================================
    // COMPUTED PROPERTIES - PROGRESS INDICATOR
    // ========================================

    /**
     * Get current step value for aria-valuenow
     * @returns {number}
     */
    get currentStepValue() {
        return this._currentStep;
    }

    /**
     * Get SLDS class for Step 1 progress indicator item
     * @returns {string} SLDS classes based on step state
     */
    get step1Class() {
        return this.getStepClass(1);
    }

    /**
     * Get SLDS class for Step 2 progress indicator item
     * @returns {string} SLDS classes based on step state
     */
    get step2Class() {
        return this.getStepClass(2);
    }

    /**
     * Get SLDS class for Step 3 progress indicator item
     * @returns {string} SLDS classes based on step state
     */
    get step3Class() {
        return this.getStepClass(3);
    }

    /**
     * Determine if Step 1 marker should be disabled
     * @returns {boolean}
     */
    get isStep1Disabled() {
        return this._currentStep === 1;
    }

    /**
     * Determine if Step 2 marker should be disabled
     * @returns {boolean}
     */
    get isStep2Disabled() {
        return this._currentStep === 2 || this._currentStep < 2;
    }

    /**
     * Determine if Step 3 marker should be disabled
     * @returns {boolean}
     */
    get isStep3Disabled() {
        return this._currentStep === 3 || this._currentStep < 3;
    }

    // ========================================
    // COMPUTED PROPERTIES - ACCESSIBILITY
    // ========================================

    /**
     * Get Step 1 label
     * @returns {string}
     */
    get step1Label() {
        return this.steps[0].label;
    }

    /**
     * Get Step 2 label
     * @returns {string}
     */
    get step2Label() {
        return this.steps[1].label;
    }

    /**
     * Get Step 3 label
     * @returns {string}
     */
    get step3Label() {
        return this.steps[2].label;
    }

    /**
     * Get ARIA label for Step 1 marker button
     * @returns {string}
     */
    get step1AriaLabel() {
        return `Step 1: ${this.steps[0].label}`;
    }

    /**
     * Get ARIA label for Step 2 marker button
     * @returns {string}
     */
    get step2AriaLabel() {
        return `Step 2: ${this.steps[1].label}`;
    }

    /**
     * Get ARIA label for Step 3 marker button
     * @returns {string}
     */
    get step3AriaLabel() {
        return `Step 3: ${this.steps[2].label}`;
    }

    /**
     * Get status text for Step 1 (for screen readers)
     * @returns {string}
     */
    get step1Status() {
        return this.getStepStatus(1);
    }

    /**
     * Get status text for Step 2 (for screen readers)
     * @returns {string}
     */
    get step2Status() {
        return this.getStepStatus(2);
    }

    /**
     * Get status text for Step 3 (for screen readers)
     * @returns {string}
     */
    get step3Status() {
        return this.getStepStatus(3);
    }

    /**
     * Get ARIA label for current step content area
     * @returns {string}
     */
    get currentStepAriaLabel() {
        return `Step ${this._currentStep} of ${this.totalSteps}: ${this.steps[this._currentStep - 1].label}`;
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Get SLDS classes for a step based on its state
     * @param {number} stepNumber - The step number
     * @returns {string} SLDS classes
     * @private
     */
    getStepClass(stepNumber) {
        const baseClass = 'slds-progress__item';

        if (stepNumber < this._currentStep) {
            return `${baseClass} slds-is-completed`;
        } else if (stepNumber === this._currentStep) {
            return `${baseClass} slds-is-active`;
        }

        return baseClass;
    }

    /**
     * Get status text for a step (for assistive technology)
     * @param {number} stepNumber - The step number
     * @returns {string} Status text
     * @private
     */
    getStepStatus(stepNumber) {
        if (stepNumber < this._currentStep) {
            return 'Completed';
        } else if (stepNumber === this._currentStep) {
            return 'Current Step';
        }
        return 'Not Started';
    }

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Handle Back button click
     * @param {Event} event - Click event
     * @private
     */
    handleBack(event) {
        event.preventDefault();
        if (this._currentStep > 1) {
            this._currentStep--;
            this.dispatchStepChangeEvent();
            this.announceStepChange();
        }
    }

    /**
     * Handle Next/Finish button click
     * @param {Event} event - Click event
     * @private
     */
    handleNext(event) {
        event.preventDefault();

        if (this._currentStep < this.totalSteps) {
            this._currentStep++;
            this.dispatchStepChangeEvent();
            this.announceStepChange();
        } else {
            // On last step, fire finish event
            this.dispatchFinishEvent();
        }
    }

    /**
     * Handle Step 1 marker click
     * @param {Event} event - Click event
     * @private
     */
    handleStep1Click(event) {
        event.preventDefault();
        if (this._currentStep !== 1 && this._currentStep > 1) {
            this.goToStep(1);
            this.announceStepChange();
        }
    }

    /**
     * Handle Step 2 marker click
     * @param {Event} event - Click event
     * @private
     */
    handleStep2Click(event) {
        event.preventDefault();
        if (this._currentStep !== 2 && this._currentStep > 2) {
            this.goToStep(2);
            this.announceStepChange();
        }
    }

    /**
     * Handle Step 3 marker click
     * @param {Event} event - Click event
     * @private
     */
    handleStep3Click(event) {
        event.preventDefault();
        if (this._currentStep !== 3 && this._currentStep > 3) {
            this.goToStep(3);
            this.announceStepChange();
        }
    }

    // ========================================
    // EVENT DISPATCHERS
    // ========================================

    /**
     * Dispatch stepchange event
     * @fires ThreeStepWizard#stepchange
     * @private
     */
    dispatchStepChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('stepchange', {
                detail: {
                    step: this._currentStep,
                    label: this.steps[this._currentStep - 1].label
                },
                bubbles: true,
                composed: true
            })
        );
    }

    /**
     * Dispatch finish event when wizard is completed
     * @fires ThreeStepWizard#finish
     * @private
     */
    dispatchFinishEvent() {
        this.dispatchEvent(
            new CustomEvent('finish', {
                detail: {
                    message: 'Wizard completed successfully'
                },
                bubbles: true,
                composed: true
            })
        );
    }

    /**
     * Announce step change to screen readers
     * @private
     */
    announceStepChange() {
        // The aria-live region in the template will automatically announce changes
        // This is handled by the aria-live="polite" attribute on the step content area
    }
}