import { LightningElement, api } from 'lwc';

const TAB_OVERVIEW = 'overview';
const TAB_DETAILS = 'details';
const TAB_HISTORY = 'history';

export default class CreateTabsOverviewDetails extends LightningElement {
    // Internal state to track active tab
    activeTab = TAB_OVERVIEW;

    // Private properties to track if slot content is provided
    _hasOverviewContent = false;
    _hasDetailsContent = false;
    _hasHistoryContent = false;

    // Public properties for customization
    @api showBorders = false;
    @api allowCustomContent = false;

    connectedCallback() {
        this.checkSlotContent();
    }

    renderedCallback() {
        this.checkSlotContent();
    }

    // Check if slots have content
    checkSlotContent() {
        const overviewSlot = this.template.querySelector('slot[name="overview-content"]');
        const detailsSlot = this.template.querySelector('slot[name="details-content"]');
        const historySlot = this.template.querySelector('slot[name="history-content"]');

        if (overviewSlot) {
            this._hasOverviewContent = overviewSlot.assignedNodes().length > 0;
        }
        if (detailsSlot) {
            this._hasDetailsContent = detailsSlot.assignedNodes().length > 0;
        }
        if (historySlot) {
            this._hasHistoryContent = historySlot.assignedNodes().length > 0;
        }
    }

    // Tab click handlers
    handleOverviewTab(event) {
        event.preventDefault();
        this.activeTab = TAB_OVERVIEW;
    }

    handleDetailsTab(event) {
        event.preventDefault();
        this.activeTab = TAB_DETAILS;
    }

    handleHistoryTab(event) {
        event.preventDefault();
        this.activeTab = TAB_HISTORY;
    }

    // Getters for tab indexes - for keyboard navigation
    get overviewTabIndex() {
        return this.isOverviewActive ? 0 : -1;
    }

    get detailsTabIndex() {
        return this.isDetailsActive ? 0 : -1;
    }

    get historyTabIndex() {
        return this.isHistoryActive ? 0 : -1;
    }

    // Getters for active tab state
    get isOverviewActive() {
        return this.activeTab === TAB_OVERVIEW;
    }

    get isDetailsActive() {
        return this.activeTab === TAB_DETAILS;
    }

    get isHistoryActive() {
        return this.activeTab === TAB_HISTORY;
    }

    // Getters for tab content visibility classes
    get overviewContentClass() {
        return this.generateContentClass(this.isOverviewActive);
    }

    get detailsContentClass() {
        return this.generateContentClass(this.isDetailsActive);
    }

    get historyContentClass() {
        return this.generateContentClass(this.isHistoryActive);
    }

    // Helper method to generate content class based on active state
    generateContentClass(isActive) {
        return `slds-tabs_default__content ${isActive ? 'slds-show' : 'slds-hide'}`;
    }

    // Getters for slot content
    get hasOverviewContent() {
        return this._hasOverviewContent || !this.allowCustomContent;
    }

    get hasDetailsContent() {
        return this._hasDetailsContent || !this.allowCustomContent;
    }

    get hasHistoryContent() {
        return this._hasHistoryContent || !this.allowCustomContent;
    }
}