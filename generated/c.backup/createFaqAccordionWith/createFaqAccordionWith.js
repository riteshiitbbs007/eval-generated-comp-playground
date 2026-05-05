import { LightningElement } from 'lwc';

/**
 * @description A reusable FAQ accordion component that displays questions and answers in collapsible sections
 * @functionality Expands/collapses sections on click or keyboard interaction
 * @accessibility Full keyboard navigation and screen reader support
 */
export default class CreateFaqAccordionWith extends LightningElement {
  // First section is expanded by default
  connectedCallback() {
    // No need to set section1 as it's expanded by default in the HTML
  }

  /**
   * Handles section toggle on click
   * @param {Event} event - The click event
   */
  handleToggleSection(event) {
    const header = event.currentTarget;
    const sectionId = header.dataset.sectionId;
    this.toggleSection(header);
  }

  /**
   * Handles keyboard navigation (Enter and Space keys)
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleSectionKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space') {
      event.preventDefault();
      this.toggleSection(event.currentTarget);
    }
  }

  /**
   * Toggles a section between expanded and collapsed states
   * @param {HTMLElement} headerElement - The section header element
   */
  toggleSection(headerElement) {
    // Get current expanded state
    const isCurrentlyExpanded = headerElement.getAttribute('aria-expanded') === 'true';

    // Toggle expanded state
    const newExpandedState = !isCurrentlyExpanded;
    headerElement.setAttribute('aria-expanded', newExpandedState.toString());

    // Update icon
    const iconContainer = headerElement.querySelector('.faqAccordion-expandIcon lightning-icon');
    if (iconContainer) {
      iconContainer.iconName = newExpandedState ? 'utility:chevrondown' : 'utility:chevronright';
    }

    // Get content section and toggle expanded class
    const contentId = headerElement.getAttribute('aria-controls');
    const contentElement = this.template.querySelector(`#${contentId}`);

    if (contentElement) {
      if (newExpandedState) {
        contentElement.classList.add('faqAccordion-sectionContent--expanded');
      } else {
        contentElement.classList.remove('faqAccordion-sectionContent--expanded');
      }
    }

    // Dispatch custom event that can be used by parent components
    this.dispatchEvent(
      new CustomEvent('sectiontoggle', {
        detail: {
          sectionId: headerElement.dataset.sectionId,
          isExpanded: newExpandedState,
        },
      }),
    );
  }
}
