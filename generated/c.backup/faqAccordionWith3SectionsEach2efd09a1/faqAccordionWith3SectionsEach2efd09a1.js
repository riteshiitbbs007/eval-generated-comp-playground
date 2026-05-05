import { LightningElement, api, track } from 'lwc';

export default class FaqAccordionWith3SectionsEach extends LightningElement {
    // Using @track to properly track changes to complex objects
    @track _sections = [
        {
            id: '01',
            question: 'How do I reset my password?',
            answer: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password.',
            expanded: true
        },
        {
            id: '02',
            question: 'How do I update my account information?',
            answer: 'You can update your account information by navigating to the Profile section after logging in. Click on the "Edit" button to modify your details.',
            expanded: false
        },
        {
            id: '03',
            question: 'How do I contact customer support?',
            answer: 'Our customer support team is available 24/7. You can reach us by phone at (555) 123-4567 or by email at support@example.com.',
            expanded: false
        }
    ];

    // Public properties - All booleans must default to false per LWC1099 rule
    @api allowMultiple = false;
    @api showIcons = false;
    @api allowCollapse = false;

    // Getters
    get sections() {
        return this._sections.map((section, index) => ({
            ...section,
            sectionClass: section.expanded ?
                'slds-accordion__section slds-is-open' :
                'slds-accordion__section',
            expandedState: section.expanded ? 'true' : 'false',
            ariaHidden: section.expanded ? 'false' : 'true',
            accordionId: 'accordion-details-' + section.id
        }));
    }

    // Allow custom sections to be passed in
    @api
    set sections(value) {
        if (Array.isArray(value) && value.length > 0) {
            // Initialize with passed sections but ensure expanded state is correct
            this._sections = value.map((section, index) => {
                return {
                    ...section,
                    id: section.id || `0${index + 1}`,
                    expanded: index === 0 // First section expanded by default
                };
            });
        }
    }

    // Helper methods for template expressions to avoid template literals in HTML
    getSectionClass(index) {
        return this._sections[index]?.expanded ?
            'slds-accordion__section slds-is-open' :
            'slds-accordion__section';
    }

    getSectionExpandedState(index) {
        return this._sections[index]?.expanded ? 'true' : 'false';
    }

    getSectionAriaHidden(index) {
        return this._sections[index]?.expanded ? 'false' : 'true';
    }

    getAccordionId(section) {
        return 'accordion-details-' + section.id;
    }

    // Handle toggling sections
    toggleSection(event) {
        event.preventDefault();
        const sectionIndex = parseInt(event.currentTarget.dataset.section, 10);

        if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= this._sections.length) {
            return;
        }

        const sections = JSON.parse(JSON.stringify(this._sections));

        // Toggle the clicked section
        sections[sectionIndex].expanded = !sections[sectionIndex].expanded;

        // If allowMultiple is false, close all other sections
        if (!this.allowMultiple && sections[sectionIndex].expanded) {
            sections.forEach((section, index) => {
                if (index !== sectionIndex) {
                    section.expanded = false;
                }
            });
        }

        // If allowCollapse is false and this is the only open section, don't allow it to close
        if (!this.allowCollapse) {
            const openSections = sections.filter(section => section.expanded);
            if (openSections.length === 0) {
                sections[sectionIndex].expanded = true;
            }
        }

        this._sections = sections;

        // Dispatch a custom event to notify parent components of the change
        this.dispatchEvent(new CustomEvent('sectiontoggle', {
            detail: {
                sectionId: sections[sectionIndex].id,
                expanded: sections[sectionIndex].expanded,
                sectionIndex
            }
        }));
    }
}