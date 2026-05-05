import { LightningElement, api, track } from 'lwc';

/**
 * FAQ Accordion Component
 * 
 * A fully accessible accordion component that displays frequently asked questions
 * in an expandable/collapsible format with SLDS 2 compliance.
 * 
 * Features:
 * - 3 default FAQ sections with first section expanded
 * - Exclusive accordion behavior (only one section open at a time)
 * - Full keyboard navigation support
 * - ARIA compliance for screen readers
 * - Responsive design with SLDS styling hooks
 * - Smooth animations with reduced motion support
 */
export default class FaqAccordionWith3SectionsFirst extends LightningElement {
    /**
     * Array of FAQ objects with question/answer properties
     * @type {Array}
     */
    @api sections = [];
    
    /**
     * Controls exclusive accordion behavior
     * When false (default), only one section can be expanded at a time
     * When true, multiple sections can be expanded simultaneously
     * @type {Boolean}
     */
    @api allowMultipleExpanded = false;
    
    /**
     * Show/hide expand/collapse icons next to section headers
     * @type {Boolean}
     */
    @api showIcons = false;

    /**
     * Internal state for FAQ sections with expanded states
     * @type {Array}
     */
    @track faqSections = [];

    /**
     * Default FAQ content as specified in PRD
     * @type {Array}
     */
    get defaultSections() {
        return [
            {
                id: 'faq-section-1',
                question: 'How do I reset my password?',
                answer: 'To reset your password, click on the \'Forgot Password\' link on the login page. Enter your email address and follow the instructions sent to your email.',
                isExpanded: true
            },
            {
                id: 'faq-section-2',
                question: 'How can I update my profile information?',
                answer: 'Navigate to your profile settings by clicking on your avatar in the top right corner, then select \'Profile Settings\'. You can edit your information and click \'Save\' to update.',
                isExpanded: false
            },
            {
                id: 'faq-section-3',
                question: 'Where can I find my order history?',
                answer: 'Your order history is available in the \'My Orders\' section of your account dashboard. You can view, track, and manage all your past and current orders there.',
                isExpanded: false
            }
        ];
    }

    /**
     * Component lifecycle - initialize FAQ sections
     */
    connectedCallback() {
        this.initializeSections();
    }

    /**
     * Initialize sections with default data or provided sections prop
     * Ensures proper ID generation and initial expansion state
     */
    initializeSections() {
        const sourceSections = this.sections && this.sections.length > 0 
            ? this.sections 
            : this.defaultSections;
        
        this.faqSections = sourceSections.map((section, index) => {
            const sectionId = section.id || `faq-section-${index + 1}`;
            return {
                ...section,
                id: sectionId,
                contentId: `${sectionId}-content`,
                buttonId: `${sectionId}-button`, 
                // First section expanded by default, preserve explicit settings
                isExpanded: index === 0 ? (section.isExpanded !== false) : (section.isExpanded === true)
            };
        });
    }

    /**
     * Handle section toggle with proper keyboard and mouse support
     * Implements exclusive accordion behavior when allowMultipleExpanded is false
     * @param {Event} event - Click or keyboard event
     */
    toggleSection(event) {
        event.preventDefault();
        
        const sectionId = event.currentTarget.dataset.sectionId;
        if (!sectionId) return;

        const sectionIndex = this.faqSections.findIndex(section => section.id === sectionId);
        if (sectionIndex === -1) return;

        const clickedSection = this.faqSections[sectionIndex];
        const wasExpanded = clickedSection.isExpanded;

        if (this.allowMultipleExpanded) {
            // Multiple sections can be expanded - toggle clicked section
            this.faqSections = this.faqSections.map(section => 
                section.id === sectionId 
                    ? { ...section, isExpanded: !section.isExpanded }
                    : section
            );
        } else {
            // Exclusive accordion behavior - only one section expanded at a time
            this.faqSections = this.faqSections.map(section => ({
                ...section,
                isExpanded: section.id === sectionId ? !wasExpanded : false
            }));
        }

        // Dispatch custom event for parent components with detailed information
        this.dispatchEvent(new CustomEvent('sectiontoggle', {
            detail: {
                sectionId: sectionId,
                sectionIndex: sectionIndex,
                isExpanded: !wasExpanded,
                section: this.faqSections[sectionIndex],
                allSections: this.faqSections
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle keyboard navigation within the accordion
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        const { key } = event;
        const currentButton = event.target;
        
        if (!currentButton.classList.contains('slds-accordion__summary-action')) {
            return;
        }

        const allButtons = [...this.template.querySelectorAll('.slds-accordion__summary-action')];
        const currentIndex = allButtons.indexOf(currentButton);

        let nextIndex = currentIndex;
        
        switch (key) {
            case 'ArrowDown':
                event.preventDefault();
                nextIndex = (currentIndex + 1) % allButtons.length;
                break;
            case 'ArrowUp':
                event.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : allButtons.length - 1;
                break;
            case 'Home':
                event.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                nextIndex = allButtons.length - 1;
                break;
            default:
                return;
        }

        if (nextIndex !== currentIndex && allButtons[nextIndex]) {
            allButtons[nextIndex].focus();
        }
    }

    /**
     * Public API method to expand a specific section by ID
     * @param {String} sectionId - The ID of the section to expand
     */
    @api
    expandSection(sectionId) {
        const sectionIndex = this.faqSections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1 || this.faqSections[sectionIndex].isExpanded) {
            return;
        }

        if (!this.allowMultipleExpanded) {
            // Close all other sections first
            this.faqSections = this.faqSections.map(section => ({
                ...section,
                isExpanded: section.id === sectionId
            }));
        } else {
            // Just expand the target section
            this.faqSections = this.faqSections.map(section => 
                section.id === sectionId 
                    ? { ...section, isExpanded: true }
                    : section
            );
        }
    }

    /**
     * Public API method to collapse a specific section by ID
     * @param {String} sectionId - The ID of the section to collapse
     */
    @api
    collapseSection(sectionId) {
        const section = this.faqSections.find(s => s.id === sectionId);
        if (!section || !section.isExpanded) {
            return;
        }

        this.faqSections = this.faqSections.map(s => 
            s.id === sectionId 
                ? { ...s, isExpanded: false }
                : s
        );
    }

    /**
     * Public API method to collapse all sections
     */
    @api
    collapseAll() {
        this.faqSections = this.faqSections.map(section => ({
            ...section,
            isExpanded: false
        }));
    }

    /**
     * Public API method to get the current state of all sections
     * @returns {Array} Array of section objects with current expansion states
     */
    @api
    getSectionStates() {
        return this.faqSections.map(section => ({
            id: section.id,
            question: section.question,
            isExpanded: section.isExpanded
        }));
    }
}