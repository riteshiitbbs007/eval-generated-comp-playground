import { LightningElement, api } from 'lwc';

/**
 * FAQ Accordion Component with 3 sections
 * First section is expanded by default
 * Implements SLDS 2 accordion pattern with accessibility support
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    /**
     * Visual variant for the accordion
     * @type {string}
     * @default 'base'
     */
    @api variant = 'base';

    /**
     * Controls whether multiple sections can be open simultaneously
     * When false (default), only one section can be open at a time
     * @type {boolean}
     */
    @api allowMultipleOpen = false;

    /**
     * Internal state tracking which section is currently open
     * section1 is open by default per requirements
     */
    openSection = 'section1';

    /**
     * Handles toggle of accordion sections
     * Implements single-open behavior: opening a section closes others
     * Updates ARIA attributes for accessibility
     * @param {Event} event - Click event from accordion button
     */
    handleToggleSection(event) {
        // Prevent default button behavior
        event.preventDefault();

        // Get the section identifier from data attribute
        const sectionId = event.currentTarget.dataset.section;

        // Toggle the section: if already open, close it; otherwise open it
        if (this.openSection === sectionId) {
            // Close the currently open section
            this.openSection = null;
        } else {
            // Open the clicked section (automatically closes others)
            this.openSection = sectionId;
        }

        // Update the DOM to reflect the new state
        this.updateSectionStates();
    }

    /**
     * Updates the visual state and ARIA attributes of all accordion sections
     * Adds/removes 'slds-is-open' class and updates aria-expanded
     * Called after any section toggle
     */
    updateSectionStates() {
        // Query all accordion sections
        const sections = this.template.querySelectorAll('.slds-accordion__section');
        
        sections.forEach((section, index) => {
            const sectionId = `section${index + 1}`;
            const button = section.querySelector('.slds-accordion__summary-action');
            const content = section.querySelector('.slds-accordion__content');
            
            // Determine if this section should be open
            const isOpen = this.openSection === sectionId;
            
            // Update section visual state
            if (isOpen) {
                section.classList.add('slds-is-open');
            } else {
                section.classList.remove('slds-is-open');
            }
            
            // Update ARIA attributes for accessibility
            if (button) {
                button.setAttribute('aria-expanded', isOpen.toString());
            }
            
            if (content) {
                content.setAttribute('aria-hidden', (!isOpen).toString());
            }
        });
    }

    /**
     * Lifecycle hook: Called when component is inserted into DOM
     * Ensures first section is open on initial render
     */
    renderedCallback() {
        // Ensure proper state on initial render
        // This handles the case where the component is dynamically loaded
        if (this.openSection === 'section1') {
            this.updateSectionStates();
        }
    }
}