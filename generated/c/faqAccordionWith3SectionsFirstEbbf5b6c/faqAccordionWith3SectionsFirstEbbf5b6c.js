import { LightningElement } from 'lwc';

/**
 * FAQ Accordion Component with 3 Sections
 * 
 * This component displays a Frequently Asked Questions accordion with three sections.
 * The first section is expanded by default, and only one section can be open at a time.
 * Includes full accessibility support with ARIA attributes and keyboard navigation.
 * 
 * PRD Requirements:
 * - Display 3 FAQ sections in an accordion format
 * - First section expanded by default
 * - Only one section open at a time
 * - SLDS 2 design tokens and styling hooks
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Smooth transitions when expanding/collapsing
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
  
  /**
   * Track which section is currently expanded
   * section1 is expanded by default as per PRD requirement
   */
  activeSection = 'section1';

  /**
   * Icon names for expanded/collapsed states
   * Using utility:chevronright for collapsed, utility:chevrondown for expanded
   */
  collapsedIcon = 'utility:chevronright';
  expandedIcon = 'utility:chevrondown';

  // ========== Section 1 Computed Properties ==========
  
  /**
   * Returns true if section 1 is expanded
   */
  get section1Expanded() {
    return this.activeSection === 'section1';
  }

  /**
   * Returns the icon name for section 1 based on expanded state
   */
  get section1Icon() {
    return this.section1Expanded ? this.expandedIcon : this.collapsedIcon;
  }

  /**
   * Returns CSS class for section 1 content area
   */
  get section1ContentClass() {
    return `faq-content ${this.section1Expanded ? 'faq-content-expanded' : 'faq-content-collapsed'}`;
  }

  /**
   * Returns ARIA hidden state for section 1
   */
  get section1Hidden() {
    return !this.section1Expanded;
  }

  // ========== Section 2 Computed Properties ==========
  
  /**
   * Returns true if section 2 is expanded
   */
  get section2Expanded() {
    return this.activeSection === 'section2';
  }

  /**
   * Returns the icon name for section 2 based on expanded state
   */
  get section2Icon() {
    return this.section2Expanded ? this.expandedIcon : this.collapsedIcon;
  }

  /**
   * Returns CSS class for section 2 content area
   */
  get section2ContentClass() {
    return `faq-content ${this.section2Expanded ? 'faq-content-expanded' : 'faq-content-collapsed'}`;
  }

  /**
   * Returns ARIA hidden state for section 2
   */
  get section2Hidden() {
    return !this.section2Expanded;
  }

  // ========== Section 3 Computed Properties ==========
  
  /**
   * Returns true if section 3 is expanded
   */
  get section3Expanded() {
    return this.activeSection === 'section3';
  }

  /**
   * Returns the icon name for section 3 based on expanded state
   */
  get section3Icon() {
    return this.section3Expanded ? this.expandedIcon : this.collapsedIcon;
  }

  /**
   * Returns CSS class for section 3 content area
   */
  get section3ContentClass() {
    return `faq-content ${this.section3Expanded ? 'faq-content-expanded' : 'faq-content-collapsed'}`;
  }

  /**
   * Returns ARIA hidden state for section 3
   */
  get section3Hidden() {
    return !this.section3Expanded;
  }

  // ========== Event Handlers ==========

  /**
   * Handles toggle button click events
   * Implements accordion behavior: only one section open at a time
   * If user clicks already-expanded section, it remains expanded
   * 
   * @param {Event} event - Click event from toggle button
   */
  handleToggle(event) {
    // Get the section identifier from the data attribute
    const sectionId = event.currentTarget.dataset.section;
    
    // Toggle behavior: clicking any section expands it and collapses others
    // This ensures only one section is open at a time (accordion pattern)
    if (sectionId && sectionId !== this.activeSection) {
      this.activeSection = sectionId;
    }
    
    // Note: If clicking the already-active section, keep it expanded
    // This follows common accordion UX patterns where at least one section stays open
  }
}

/**
 * ACCESSIBILITY FEATURES:
 * - ARIA attributes (aria-expanded, aria-controls, aria-hidden) properly set
 * - Semantic HTML (sections, headings)
 * - Keyboard navigation supported through native button elements
 * - Lightning icons provide visual indicators
 * - Role attributes for regions
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Computed properties cached by LWC framework
 * - Minimal DOM manipulation
 * - Event delegation through single handler
 * - CSS transitions for smooth animations
 * 
 * SLDS COMPLIANCE:
 * - Uses Lightning Base Components (lightning-icon, lightning-card implied in HTML)
 * - Follows SLDS card pattern with header and body
 * - Uses SLDS utility classes in HTML
 * - Styling hooks used in CSS for theme-awareness
 */