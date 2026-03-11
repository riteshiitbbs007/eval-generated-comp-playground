/**
 * FAQ Accordion Component
 *
 * Displays a Frequently Asked Questions section using an accessible accordion pattern.
 * Features:
 * - 3 FAQ sections in accordion format
 * - First section expanded by default
 * - Mutually exclusive expansion (only one section open at a time)
 * - Full keyboard navigation support
 * - WCAG 2.1 AA compliant
 * - Uses Lightning Base Component for best practices
 */
import { LightningElement, api } from 'lwc';

export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    /**
     * Public API Properties
     * Note: All boolean @api properties MUST default to false per LWC requirement (LWC1099)
     */

    /**
     * Controls whether multiple sections can be open simultaneously
     * Default: false (mutually exclusive expansion)
     * @type {boolean}
     */
    @api allowMultipleSections = false;

    /**
     * Section 1 Configuration
     * Question: What is Salesforce?
     * This section is expanded by default via active-section-name="section1"
     */

    /**
     * Computed getter for Section 1 label (question)
     * Using getter to follow LWC best practice of no template literals in HTML
     * @returns {string} The question text for section 1
     */
    get section1Label() {
        return 'What is Salesforce?';
    }

    /**
     * Computed getter for Section 1 content (answer)
     * @returns {string} The answer text for section 1
     */
    get section1Content() {
        return 'Salesforce is a cloud-based customer relationship management (CRM) platform that helps businesses manage their sales, service, marketing, and more.';
    }

    /**
     * Section 2 Configuration
     * Question: How do I reset my password?
     * This section is collapsed by default
     */

    /**
     * Computed getter for Section 2 label (question)
     * @returns {string} The question text for section 2
     */
    get section2Label() {
        return 'How do I reset my password?';
    }

    /**
     * Computed getter for Section 2 content (answer)
     * @returns {string} The answer text for section 2
     */
    get section2Content() {
        return "Click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your inbox.";
    }

    /**
     * Section 3 Configuration
     * Question: Where can I find documentation?
     * This section is collapsed by default
     */

    /**
     * Computed getter for Section 3 label (question)
     * @returns {string} The question text for section 3
     */
    get section3Label() {
        return 'Where can I find documentation?';
    }

    /**
     * Computed getter for Section 3 content (answer)
     * @returns {string} The answer text for section 3
     */
    get section3Content() {
        return 'Visit help.salesforce.com for comprehensive documentation, guides, and tutorials for all Salesforce products.';
    }

    /**
     * Lifecycle Hooks
     * No additional lifecycle hooks needed for this static FAQ component
     * The lightning-accordion component handles all state management internally
     */

    /**
     * Event Handlers
     * The lightning-accordion component provides built-in event handling:
     * - Click/tap to expand/collapse sections
     * - Keyboard navigation (Tab, Enter, Space, Arrow keys)
     * - Screen reader support with proper ARIA attributes
     * No custom event handlers needed for basic functionality
     */

    /**
     * Accessibility Notes:
     * - Component uses Lightning Base Component which includes WCAG 2.1 AA compliance
     * - Proper ARIA attributes automatically applied by lightning-accordion
     * - Keyboard navigation fully supported (Tab, Enter, Space, Arrow keys)
     * - Screen reader announces section states (expanded/collapsed)
     * - Focus indicators visible and meet contrast requirements
     * - Color contrast ratio minimum 4.5:1 maintained via SLDS design tokens
     */

    /**
     * Performance Notes:
     * - Component uses Lightning Base Component for optimal performance
     * - No heavy DOM manipulations required
     * - State management handled by lightning-accordion internally
     * - Minimal JavaScript required (only getters for content)
     */

    /**
     * Customization Options:
     * To customize this component, parent components can:
     * 1. Set allowMultipleSections to true to allow multiple sections open
     * 2. Extend this component to accept dynamic content via @api properties
     * 3. Add more sections by following the existing pattern
     * 4. Override CSS using SLDS styling hooks in parent component
     */
}