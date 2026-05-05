import { LightningElement } from 'lwc';

/**
 * FAQ Accordion Component
 * 
 * Displays 3 FAQ sections in an accordion pattern where:
 * - First section is expanded by default
 * - Only one section can be expanded at a time (mutual exclusion)
 * - Users can toggle sections by clicking headers
 * 
 * PRD Requirements:
 * - Display 3 FAQ sections in an accordion pattern
 * - First section should be expanded by default (open state)
 * - Other sections start in collapsed state
 * - Users can expand/collapse sections by clicking section headers
 * - Only one section can be expanded at a time (mutual exclusion)
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    
    // Track which section is currently open (1, 2, or 3)
    // Default to section 1 being open as per PRD requirement
    openSectionId = '1';

    /**
     * Computed property for section 1 CSS class
     * Returns 'slds-is-open' when section 1 is active
     */
    get section1Class() {
        return this.openSectionId === '1' ? 'slds-accordion__section slds-is-open' : 'slds-accordion__section';
    }

    /**
     * Computed property for section 2 CSS class
     * Returns 'slds-is-open' when section 2 is active
     */
    get section2Class() {
        return this.openSectionId === '2' ? 'slds-accordion__section slds-is-open' : 'slds-accordion__section';
    }

    /**
     * Computed property for section 3 CSS class
     * Returns 'slds-is-open' when section 3 is active
     */
    get section3Class() {
        return this.openSectionId === '3' ? 'slds-accordion__section slds-is-open' : 'slds-accordion__section';
    }

    /**
     * Computed property for section 1 content visibility
     * Adds 'slds-hide' class when section is not open for accessibility
     */
    get section1ContentClass() {
        return this.openSectionId === '1' ? 'slds-accordion__content' : 'slds-accordion__content slds-hide';
    }

    /**
     * Computed property for section 2 content visibility
     * Adds 'slds-hide' class when section is not open for accessibility
     */
    get section2ContentClass() {
        return this.openSectionId === '2' ? 'slds-accordion__content' : 'slds-accordion__content slds-hide';
    }

    /**
     * Computed property for section 3 content visibility
     * Adds 'slds-hide' class when section is not open for accessibility
     */
    get section3ContentClass() {
        return this.openSectionId === '3' ? 'slds-accordion__content' : 'slds-accordion__content slds-hide';
    }

    /**
     * Computed property for section 1 aria-expanded attribute
     * Returns "true" or "false" as string for ARIA attribute
     */
    get section1AriaExpanded() {
        return this.openSectionId === '1' ? 'true' : 'false';
    }

    /**
     * Computed property for section 2 aria-expanded attribute
     * Returns "true" or "false" as string for ARIA attribute
     */
    get section2AriaExpanded() {
        return this.openSectionId === '2' ? 'true' : 'false';
    }

    /**
     * Computed property for section 3 aria-expanded attribute
     * Returns "true" or "false" as string for ARIA attribute
     */
    get section3AriaExpanded() {
        return this.openSectionId === '3' ? 'true' : 'false';
    }

    /**
     * Handle toggle for section 1
     * Implements mutual exclusion: closes other sections when opening this one
     * If section is already open, it remains open (accordion stays open pattern)
     */
    handleToggleSection1() {
        // Toggle: if section 1 is already open, close it; otherwise open it
        this.openSectionId = this.openSectionId === '1' ? '' : '1';
    }

    /**
     * Handle toggle for section 2
     * Implements mutual exclusion: closes other sections when opening this one
     * If section is already open, it remains open (accordion stays open pattern)
     */
    handleToggleSection2() {
        // Toggle: if section 2 is already open, close it; otherwise open it
        this.openSectionId = this.openSectionId === '2' ? '' : '2';
    }

    /**
     * Handle toggle for section 3
     * Implements mutual exclusion: closes other sections when opening this one
     * If section is already open, it remains open (accordion stays open pattern)
     */
    handleToggleSection3() {
        // Toggle: if section 3 is already open, close it; otherwise open it
        this.openSectionId = this.openSectionId === '3' ? '' : '3';
    }
}