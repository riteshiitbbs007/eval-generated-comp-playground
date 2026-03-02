import { LightningElement, api } from 'lwc';
import { onboardingData } from 'data/onboardingData';

export default class OnboardingModal extends LightningElement {
  // Onboarding data
  steps = onboardingData.steps;
  version = onboardingData.version;
  storageKey = onboardingData.storageKey;

  // Current step tracking
  currentStepIndex = 0;

  // Modal state
  _isOpen = false;

  connectedCallback() {
    console.log('[Onboarding] Component connected');
    console.log('[Onboarding] Steps loaded:', this.steps?.length);
    // Check if user has completed onboarding
    const completed = this.checkOnboardingCompleted();
    console.log('[Onboarding] Completed?', completed);
    if (!completed) {
      // Show onboarding modal
      console.log('[Onboarding] Showing modal');
      this.showModal();
    }
  }

  renderedCallback() {
    // Inject HTML content into manual DOM container
    if (this._isOpen) {
      const contentContainer = this.template.querySelector('.slds-text-longform');
      if (contentContainer && this.currentStep.content) {
        // eslint-disable-next-line @lwc/lwc/no-inner-html
        contentContainer.innerHTML = this.currentStep.content;
      }
    }
  }

  /**
   * Check if user has completed onboarding
   */
  checkOnboardingCompleted() {
    try {
      const completedVersion = localStorage.getItem(this.storageKey);
      return completedVersion === this.version;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  markOnboardingCompleted() {
    try {
      localStorage.setItem(this.storageKey, this.version);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }

  /**
   * Show the modal (can be called programmatically)
   */
  showModal() {
    console.log('[Onboarding] Setting _isOpen to true');
    this._isOpen = true;
    this.currentStepIndex = 0; // Reset to first step
    console.log('[Onboarding] Modal should be visible now, isOpen:', this.isOpen);
  }

  /**
   * Public API to restart onboarding from anywhere
   */
  @api
  restartOnboarding() {
    console.log('[Onboarding] Manually restarted');
    this.showModal();
  }

  /**
   * Hide the modal
   */
  hideModal() {
    this._isOpen = false;
  }

  /**
   * Get current step
   */
  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  /**
   * Check if modal is open
   */
  get isOpen() {
    return this._isOpen;
  }

  /**
   * Check if current step is first
   */
  get isFirstStep() {
    return this.currentStepIndex === 0;
  }

  /**
   * Check if current step is last
   */
  get isLastStep() {
    return this.currentStepIndex === this.steps.length - 1;
  }

  /**
   * Get progress percentage
   */
  get progressPercent() {
    return Math.round(((this.currentStepIndex + 1) / this.steps.length) * 100);
  }

  /**
   * Get progress bar style
   */
  get progressBarStyle() {
    return `width: ${this.progressPercent}%`;
  }

  /**
   * Get progress label
   */
  get progressLabel() {
    return `Step ${this.currentStepIndex + 1} of ${this.steps.length}`;
  }

  /**
   * Get next button label
   */
  get nextButtonLabel() {
    return this.isLastStep ? 'Get Started' : 'Next';
  }

  /**
   * Get steps with computed classes for indicators
   */
  get stepsWithClasses() {
    return this.steps.map((step, index) => {
      let className = 'slds-progress__item';
      if (index < this.currentStepIndex) {
        className += ' slds-is-completed';
      } else if (index === this.currentStepIndex) {
        className += ' slds-is-active';
      }
      return {
        ...step,
        index,
        className,
        ariaLabel: `Go to step ${index + 1}: ${step.title}`,
      };
    });
  }

  /**
   * Handle next button click
   */
  handleNext() {
    if (this.isLastStep) {
      // Complete onboarding
      this.handleComplete();
    } else {
      // Move to next step
      this.currentStepIndex++;
    }
  }

  /**
   * Handle previous button click
   */
  handlePrevious() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  /**
   * Handle skip button click
   */
  handleSkip() {
    // Just close modal without marking as completed
    console.log('[Onboarding] Skipped');
    this.hideModal();
  }

  /**
   * Handle close button click
   */
  handleClose() {
    // Just close modal without marking as completed
    console.log('[Onboarding] Closed');
    this.hideModal();
  }

  /**
   * Complete onboarding (only called on "Get Started")
   */
  handleComplete() {
    console.log('[Onboarding] Completed');
    this.markOnboardingCompleted();
    this.hideModal();

    // Dispatch event to parent
    this.dispatchEvent(
      new CustomEvent('complete', {
        detail: {
          completed: true,
          version: this.version,
        },
      })
    );
  }

  /**
   * Handle step indicator click
   */
  handleStepClick(event) {
    const stepIndex = parseInt(event.currentTarget.dataset.index, 10);
    if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStepIndex = stepIndex;
    }
  }
}
