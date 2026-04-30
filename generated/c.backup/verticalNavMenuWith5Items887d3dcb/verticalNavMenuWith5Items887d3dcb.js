import { LightningElement, api } from 'lwc';

/**
 * Vertical Navigation Menu Component
 * Displays a vertical navigation menu with 5 items (Dashboard, Reports, Analytics, Settings, Help)
 * Dashboard is active by default
 * Emits custom events when menu items are clicked
 */
export default class VerticalNavMenuWith5Items extends LightningElement {
    // Private property to track the currently active menu item
    // Default is 'dashboard' as per PRD requirement
    activeItem = 'dashboard';

    /**
     * Public API property to set the active menu item
     * @type {string}
     */
    @api
    get selectedItem() {
        return this.activeItem;
    }
    set selectedItem(value) {
        this.activeItem = value || 'dashboard';
    }

    // Computed getter for Dashboard item CSS class
    get dashboardItemClass() {
        return this.activeItem === 'dashboard'
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
    }

    // Computed getter for Reports item CSS class
    get reportsItemClass() {
        return this.activeItem === 'reports'
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
    }

    // Computed getter for Analytics item CSS class
    get analyticsItemClass() {
        return this.activeItem === 'analytics'
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
    }

    // Computed getter for Settings item CSS class
    get settingsItemClass() {
        return this.activeItem === 'settings'
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
    }

    // Computed getter for Help item CSS class
    get helpItemClass() {
        return this.activeItem === 'help'
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
    }

    // Computed getter for Dashboard aria-current attribute
    get dashboardAriaCurrent() {
        return this.activeItem === 'dashboard' ? 'page' : false;
    }

    // Computed getter for Reports aria-current attribute
    get reportsAriaCurrent() {
        return this.activeItem === 'reports' ? 'page' : false;
    }

    // Computed getter for Analytics aria-current attribute
    get analyticsAriaCurrent() {
        return this.activeItem === 'analytics' ? 'page' : false;
    }

    // Computed getter for Settings aria-current attribute
    get settingsAriaCurrent() {
        return this.activeItem === 'settings' ? 'page' : false;
    }

    // Computed getter for Help aria-current attribute
    get helpAriaCurrent() {
        return this.activeItem === 'help' ? 'page' : false;
    }

    /**
     * Handles menu item click events
     * Updates the active item and dispatches a custom event
     * @param {Event} event - The click event
     */
    handleMenuItemClick(event) {
        // Prevent default anchor behavior
        event.preventDefault();

        // Get the clicked item from data attribute
        const selectedItem = event.currentTarget.dataset.item;

        // Update the active item
        this.activeItem = selectedItem;

        // Dispatch custom event with the selected item details
        this.dispatchEvent(new CustomEvent('menuitemselect', {
            detail: {
                selectedItem: selectedItem,
                previousItem: this.activeItem
            },
            bubbles: true,
            composed: true
        }));
    }
}