import { LightningElement } from 'lwc';

/**
 * FAQ Accordion Component
 * Displays 3 frequently asked questions in an accordion format
 * with the first section expanded by default.
 * 
 * Features:
 * - SLDS-compliant lightning-accordion component
 * - Multiple sections can be open simultaneously
 * - First section (section1) is expanded on initial render
 * - Accessibility built-in via Lightning Base Components
 * - Keyboard navigation support provided by lightning-accordion
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    /**
     * Controls which accordion section is active (expanded) on initial render.
     * Set to 'section1' to expand the first FAQ section by default.
     * The lightning-accordion component uses this property to determine
     * which section should be open when the component loads.
     */
    activeSectionName = 'section1';
}