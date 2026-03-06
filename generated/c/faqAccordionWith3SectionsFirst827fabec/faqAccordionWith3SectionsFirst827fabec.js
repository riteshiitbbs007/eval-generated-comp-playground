import { LightningElement, api, track } from 'lwc';

/**
 * FAQ Accordion Component
 * Displays FAQ content in an accordion format with 3 sections.
 * First section is expanded by default.
 * Implements WCAG 2.1 AA accessibility standards with proper ARIA attributes.
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    /**
     * Public API: Array of FAQ section objects
     * Each object should have { question: string, answer: string }
     * Defaults to false per LWC requirements but initialized in connectedCallback
     */
    @api sections = false;

    /**
     * Public API: Index of section to expand by default
     * Defaults to 0 (first section)
     * Note: Must be number type, not boolean, so using default value approach
     */
    @api defaultExpandedIndex = 0;

    /**
     * Public API: Allow multiple sections to be open simultaneously
     * Defaults to false for true accordion behavior (one section open at a time)
     */
    @api allowMultipleOpen = false;

    /**
     * Private: Track expanded section indices
     * Reactive property to trigger re-render when expanded sections change
     */
    @track expandedIndices = new Set();

    /**
     * Default FAQ content if no sections provided via @api
     * Implements the PRD requirement for 3 FAQ sections with specified content
     */
    defaultSections = [
        {
            question: 'What is the Lightning Design System?',
            answer: 'The Lightning Design System (SLDS) is Salesforce\'s design framework that provides design patterns, components, and guidelines for creating enterprise applications with a consistent user experience.'
        },
        {
            question: 'How do I get started with Lightning Web Components?',
            answer: 'To get started with LWC, you\'ll need to set up your Salesforce Developer Edition org, install the Salesforce CLI, and follow the official Trailhead modules for hands-on learning and best practices.'
        },
        {
            question: 'What are SLDS design tokens?',
            answer: 'SLDS design tokens are named variables that store design decisions such as colors, spacing, and typography. They ensure consistency across all Salesforce applications and make theming easier.'
        }
    ];

    /**
     * Lifecycle hook: Initialize expanded state on component load
     * PRD Requirement: First section must be expanded by default
     */
    connectedCallback() {
        // Set first section as expanded by default (PRD requirement)
        this.expandedIndices.add(this.defaultExpandedIndex);
    }

    /**
     * Computed property: Get FAQ sections with enhanced metadata for rendering
     * Returns enriched section objects with:
     * - Unique IDs for ARIA attributes
     * - Expanded state
     * - CSS classes for styling
     * - ARIA attribute values
     *
     * This getter ensures no template literals are used in HTML (LWC requirement)
     */
    get faqSections() {
        const sourceSections = this.sections && Array.isArray(this.sections) && this.sections.length > 0
            ? this.sections
            : this.defaultSections;

        return sourceSections.map((section, index) => {
            const isExpanded = this.expandedIndices.has(index);
            const sectionId = `faq-section-${index}`;
            const contentId = `${sectionId}-content`;
            const headingId = `${sectionId}-heading`;

            return {
                // Original content
                question: section.question,
                answer: section.answer,

                // Metadata for rendering
                id: sectionId,
                index: index,
                contentId: contentId,
                headingId: headingId,

                // State
                isExpanded: isExpanded,

                // ARIA attributes (as strings for HTML)
                ariaExpanded: isExpanded.toString(),
                ariaHidden: (!isExpanded).toString(),

                // CSS classes
                contentClass: this.getContentClass(isExpanded),
                iconClass: this.getIconClass(isExpanded),

                // Accessibility
                iconAltText: this.getIconAltText(isExpanded)
            };
        });
    }

    /**
     * Computed getter: Content section CSS class based on expanded state
     * Returns appropriate SLDS class for show/hide animation
     *
     * @param {boolean} isExpanded - Whether section is currently expanded
     * @returns {string} CSS class name
     */
    getContentClass(isExpanded) {
        return isExpanded
            ? 'slds-accordion__content-wrapper slds-is-open'
            : 'slds-accordion__content-wrapper slds-is-closed';
    }

    /**
     * Computed getter: Icon CSS class for rotation based on expanded state
     * Rotates chevron from right to down when expanded
     *
     * @param {boolean} isExpanded - Whether section is currently expanded
     * @returns {string} CSS class name
     */
    getIconClass(isExpanded) {
        return isExpanded
            ? 'slds-accordion__icon slds-icon_rotate-90'
            : 'slds-accordion__icon';
    }

    /**
     * Computed getter: Icon alt text for accessibility
     * Provides screen reader context for expand/collapse state
     *
     * @param {boolean} isExpanded - Whether section is currently expanded
     * @returns {string} Alt text for icon
     */
    getIconAltText(isExpanded) {
        return isExpanded ? 'Collapse section' : 'Expand section';
    }

    /**
     * Event handler: Toggle accordion section on click
     * PRD Requirements:
     * - Only one section can be expanded at a time (unless allowMultipleOpen is true)
     * - Update ARIA attributes dynamically
     * - Keyboard navigation support (handled by button element)
     *
     * @param {Event} event - Click event from accordion header button
     */
    handleToggle(event) {
        // Get clicked section index from data attribute
        const clickedIndex = parseInt(event.currentTarget.dataset.index, 10);

        if (this.allowMultipleOpen) {
            // Multiple sections can be open - toggle clicked section
            if (this.expandedIndices.has(clickedIndex)) {
                this.expandedIndices.delete(clickedIndex);
            } else {
                this.expandedIndices.add(clickedIndex);
            }
        } else {
            // Accordion behavior - only one section open at a time
            if (this.expandedIndices.has(clickedIndex)) {
                // Clicking expanded section collapses it
                this.expandedIndices.delete(clickedIndex);
            } else {
                // Clicking collapsed section expands it and collapses others
                this.expandedIndices.clear();
                this.expandedIndices.add(clickedIndex);
            }
        }

        // Trigger re-render by creating new Set instance (LWC reactivity requirement)
        this.expandedIndices = new Set(this.expandedIndices);
    }
}