import { LightningElement, api, track } from 'lwc';

/**
 * @description A 3-step wizard component with progress indicator and navigation buttons
 * @class Create3stepWizard
 * @extends LightningElement
 */
export default class Create3stepWizard extends LightningElement {
    /**
     * @type {String[]} Array of step titles
     * @default ['Step 1', 'Step 2', 'Step 3']
     * @memberof Create3stepWizard
     */
    @api
    get stepTitles() {
        return this._stepTitles;
    }
    set stepTitles(value) {
        this._stepTitles = Array.isArray(value) && value.length ? value : ['Step 1', 'Step 2', 'Step 3'];
        this.updateStepsData();
    }

    /**
     * @type {Number} Current active step (0-indexed)
     * @default 0
     * @memberof Create3stepWizard
     */
    @api
    get currentStep() {
        return this._currentStep;
    }
    set currentStep(value) {
        const newStep = parseInt(value, 10);
        if (isNaN(newStep) || newStep < 0 || newStep > 2) {
            this._currentStep = 0;
        } else {
            this._currentStep = newStep;
        }
        this.updateStepsData();
    }

    /**
     * @type {Boolean} Whether to show step numbers
     * @default false
     * @memberof Create3stepWizard
     */
    @api showStepNumbers = false;

    /**
     * @type {String} Progress indicator style variant
     * @default 'base'
     * @memberof Create3stepWizard
     */
    @api variant = 'base';

    // Private properties
    _stepTitles = ['Step 1', 'Step 2', 'Step 3'];
    _currentStep = 0;
    @track stepsData = [];

    // Initialize component
    connectedCallback() {
        this.updateStepsData();
    }

    /**
     * Update steps data for rendering
     * @private
     */
    updateStepsData() {
        this.stepsData = this._stepTitles.map((title, index) => {
            const isComplete = index < this._currentStep;
            const isCurrent = index === this._currentStep;
            const stepNumber = index + 1;

            // Calculate CSS classes for step
            let baseClasses = 'slds-path__item';
            if (isComplete) {
                baseClasses += ' slds-is-complete';
            } else if (isCurrent) {
                baseClasses += ' slds-is-current';
            } else {
                baseClasses += ' slds-is-incomplete';
            }

            // Calculate ARIA attributes
            let ariaLabel = `${title}: ${isComplete ? 'Completed' : isCurrent ? 'Current Stage' : 'Incomplete'}`;

            // Tab index: current step is focusable
            const tabIndex = isCurrent ? 0 : -1;

            return {
                id: `step-${index}`,
                contentId: `step-content-${index + 1}`,
                title,
                stepNumber,
                isComplete,
                isCurrent,
                classes: baseClasses,
                ariaLabel,
                tabIndex
            };
        });
    }

    /**
     * Handle step click event
     * @param {Event} event The click event
     * @private
     */
    handleStepClick(event) {
        // Steps are intentionally not clickable for direct navigation
        // This follows the standard Path behavior where clicks just focus but don't navigate
        event.preventDefault();

        // For keyboard navigation and accessibility, focus on the element
        const index = parseInt(event.currentTarget.dataset.stepIndex, 10);
        if (!isNaN(index)) {
            // Just focus without navigation
            this.template.querySelector(`[data-step-index="${index}"]`).focus();
        }
    }

    /**
     * Handle Back button click
     * @private
     */
    handleBackClick() {
        if (this._currentStep > 0) {
            const prevStep = this._currentStep - 1;
            this._currentStep = prevStep;
            this.updateStepsData();

            // Dispatch events
            this.dispatchEvent(new CustomEvent('back', {
                detail: { step: prevStep }
            }));
            this.dispatchEvent(new CustomEvent('stepchange', {
                detail: { step: prevStep }
            }));
        }
    }

    /**
     * Handle Next button click
     * @private
     */
    handleNextClick() {
        if (this._currentStep < 2) {
            const nextStep = this._currentStep + 1;
            this._currentStep = nextStep;
            this.updateStepsData();

            // Determine if this is the last step (completed)
            const isComplete = nextStep === 2;

            // Dispatch events
            if (isComplete) {
                this.dispatchEvent(new CustomEvent('complete'));
            } else {
                this.dispatchEvent(new CustomEvent('next', {
                    detail: { step: nextStep }
                }));
            }

            this.dispatchEvent(new CustomEvent('stepchange', {
                detail: { step: nextStep }
            }));
        }
    }

    /**
     * @returns {Boolean} Whether this is the first step
     * @readonly
     */
    get isFirstStep() {
        return this._currentStep === 0;
    }

    /**
     * @returns {Boolean} Whether this is the last step
     * @readonly
     */
    get isLastStep() {
        return this._currentStep === 2;
    }

    /**
     * @returns {Boolean} Whether current step is step one
     * @readonly
     */
    get isStepOne() {
        return this._currentStep === 0;
    }

    /**
     * @returns {Boolean} Whether current step is step two
     * @readonly
     */
    get isStepTwo() {
        return this._currentStep === 1;
    }

    /**
     * @returns {Boolean} Whether current step is step three
     * @readonly
     */
    get isStepThree() {
        return this._currentStep === 2;
    }

    /**
     * @returns {String} ID of the current step for ARIA labelling
     * @readonly
     */
    get currentStepId() {
        return `step-${this._currentStep}`;
    }

    /**
     * @returns {String} Aria label for back button
     * @readonly
     */
    get backButtonLabel() {
        return `Go back to ${this._stepTitles[this._currentStep - 1] || 'previous step'}`;
    }

    /**
     * @returns {String} Aria label for next button
     * @readonly
     */
    get nextButtonLabel() {
        return `Continue to ${this._stepTitles[this._currentStep + 1] || 'next step'}`;
    }
}