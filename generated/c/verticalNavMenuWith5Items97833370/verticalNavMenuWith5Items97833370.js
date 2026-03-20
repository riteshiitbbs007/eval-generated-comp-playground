import { LightningElement, api } from 'lwc';

/**
 * Vertical Navigation Menu Component
 *
 * Displays a vertical navigation menu with 5 items: Dashboard, Reports, Analytics, Settings, and Help.
 * The Dashboard item is active by default. Supports keyboard navigation and emits custom events
 * when navigation items are selected.
 *
 * @fires VerticalNavMenuWith5Items#navigationselect - Fired when a navigation item is clicked
 */
export default class VerticalNavMenuWith5Items extends LightningElement {
    /**
     * The currently active navigation item
     * @type {string}
     * @default 'dashboard'
     */
    @api activeItem = 'dashboard';

    /**
     * Whether to display icons next to navigation items
     * IMPORTANT: Must default to false per LWC1099 enforcement
     * @type {boolean}
     * @default false
     */
    @api showIcons = false;

    /**
     * List of all navigation items
     * @private
     */
    navigationItems = [
        { name: 'dashboard', label: 'Dashboard', icon: 'utility:home' },
        { name: 'reports', label: 'Reports', icon: 'utility:chart' },
        { name: 'analytics', label: 'Analytics', icon: 'utility:analytics' },
        { name: 'settings', label: 'Settings', icon: 'utility:settings' },
        { name: 'help', label: 'Help', icon: 'utility:help' }
    ];

    /**
     * Computed CSS class for Dashboard item
     * Adds 'slds-is-active' when this item is active
     * @returns {string}
     */
    get dashboardItemClass() {
        return this.getItemClass('dashboard');
    }

    /**
     * Computed CSS class for Reports item
     * @returns {string}
     */
    get reportsItemClass() {
        return this.getItemClass('reports');
    }

    /**
     * Computed CSS class for Analytics item
     * @returns {string}
     */
    get analyticsItemClass() {
        return this.getItemClass('analytics');
    }

    /**
     * Computed CSS class for Settings item
     * @returns {string}
     */
    get settingsItemClass() {
        return this.getItemClass('settings');
    }

    /**
     * Computed CSS class for Help item
     * @returns {string}
     */
    get helpItemClass() {
        return this.getItemClass('help');
    }

    /**
     * Computed aria-current value for Dashboard item
     * Returns 'page' if active, null otherwise
     * @returns {string|null}
     */
    get dashboardAriaCurrent() {
        return this.getAriaCurrent('dashboard');
    }

    /**
     * Computed aria-current value for Reports item
     * @returns {string|null}
     */
    get reportsAriaCurrent() {
        return this.getAriaCurrent('reports');
    }

    /**
     * Computed aria-current value for Analytics item
     * @returns {string|null}
     */
    get analyticsAriaCurrent() {
        return this.getAriaCurrent('analytics');
    }

    /**
     * Computed aria-current value for Settings item
     * @returns {string|null}
     */
    get settingsAriaCurrent() {
        return this.getAriaCurrent('settings');
    }

    /**
     * Computed aria-current value for Help item
     * @returns {string|null}
     */
    get helpAriaCurrent() {
        return this.getAriaCurrent('help');
    }

    /**
     * Helper method to get CSS class for a navigation item
     * @param {string} itemName - Name of the navigation item
     * @returns {string} CSS class string
     * @private
     */
    getItemClass(itemName) {
        const baseClass = 'slds-nav-vertical__item';
        return this.activeItem === itemName
            ? `${baseClass} slds-is-active`
            : baseClass;
    }

    /**
     * Helper method to get aria-current value for a navigation item
     * @param {string} itemName - Name of the navigation item
     * @returns {string|null} 'page' if active, null otherwise
     * @private
     */
    getAriaCurrent(itemName) {
        return this.activeItem === itemName ? 'page' : null;
    }

    /**
     * Handles click events on navigation items
     * Updates active item and dispatches navigationselect event
     * @param {Event} event - Click event
     */
    handleNavClick(event) {
        // Prevent default anchor behavior
        event.preventDefault();

        // Get the selected item name from data attribute
        const selectedItem = event.currentTarget.dataset.item;

        // Update active item
        this.activeItem = selectedItem;

        // Dispatch custom event with selected item details
        this.dispatchEvent(new CustomEvent('navigationselect', {
            detail: {
                item: selectedItem,
                label: this.getItemLabel(selectedItem)
            }
        }));
    }

    /**
     * Handles keyboard navigation (Enter and Space keys)
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        // Handle Enter or Space key press
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            // Get the selected item name from data attribute
            const selectedItem = event.currentTarget.dataset.item;

            // Update active item
            this.activeItem = selectedItem;

            // Dispatch custom event with selected item details
            this.dispatchEvent(new CustomEvent('navigationselect', {
                detail: {
                    item: selectedItem,
                    label: this.getItemLabel(selectedItem)
                }
            }));
        }
    }

    /**
     * Gets the label for a navigation item by its name
     * @param {string} itemName - Name of the navigation item
     * @returns {string} Item label
     * @private
     */
    getItemLabel(itemName) {
        const item = this.navigationItems.find(navItem => navItem.name === itemName);
        return item ? item.label : '';
    }
}