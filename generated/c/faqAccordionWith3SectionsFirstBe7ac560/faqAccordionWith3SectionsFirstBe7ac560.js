import { LightningElement } from 'lwc';

/**
 * FAQ Accordion Component
 * Displays 3 FAQ sections with the first section expanded by default.
 * Uses SLDS lightning-accordion base component for accessibility and consistency.
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    /**
     * Allow multiple sections open at the same time
     * IMPORTANT: Must default to false per LWC1099 rule for boolean @api properties
     */
    allowMultipleSectionsOpen = false;

    /**
     * Active section name - controls which section is expanded
     * Set to 'section1' to expand first section by default
     */
    activeSectionName = 'section1';

    /**
     * Handle section toggle event
     * Updates the active section when user clicks on a section header
     *
     * @param {Event} event - Section toggle event from lightning-accordion
     */
    handleSectionToggle(event) {
        // Get the name of the section that was opened
        const openSections = event.detail.openSections;

        // Update active section name (lightning-accordion handles the UI state)
        if (openSections && openSections.length > 0) {
            this.activeSectionName = openSections[0];
        }
    }
}