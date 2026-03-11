import { LightningElement, api } from 'lwc';

/**
 * Vertical Navigation Menu Component
 * Displays a vertical navigation menu with 5 items following SLDS 2 patterns
 */
export default class VerticalNavMenuWith5Items extends LightningElement {
    /**
     * Public API property to control which menu item is active
     * @type {string}
     * @default 'dashboard'
     */
    @api activeItem = 'dashboard';

    /**
     * Navigation menu items configuration
     * Each item includes id, label, icon, and accessibility properties
     * @private
     */
    get menuItems() {
        const items = [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: 'utility:home'
            },
            {
                id: 'reports',
                label: 'Reports',
                icon: 'utility:file'
            },
            {
                id: 'analytics',
                label: 'Analytics',
                icon: 'utility:chart'
            },
            {
                id: 'settings',
                label: 'Settings',
                icon: 'utility:settings'
            },
            {
                id: 'help',
                label: 'Help',
                icon: 'utility:help'
            }
        ];

        // Compute dynamic properties for each item
        return items.map(item => ({
            ...item,
            computedClass: this.getItemClass(item.id),
            ariaCurrent: this.getAriaCurrent(item.id),
            ariaLabel: this.getAriaLabel(item.label, item.id),
            alternativeText: this.getAlternativeText(item.label)
        }));
    }

    /**
     * Computes the CSS class for a menu item based on active state
     * @param {string} itemId - The menu item identifier
     * @returns {string} CSS class string
     * @private
     */
    getItemClass(itemId) {
        return itemId === this.activeItem
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
    }

    /**
     * Computes aria-current attribute for accessibility
     * @param {string} itemId - The menu item identifier
     * @returns {string|undefined} 'page' if active, undefined otherwise
     * @private
     */
    getAriaCurrent(itemId) {
        return itemId === this.activeItem ? 'page' : undefined;
    }

    /**
     * Computes aria-label for menu item
     * @param {string} label - The menu item label
     * @param {string} itemId - The menu item identifier
     * @returns {string} Accessible label text
     * @private
     */
    getAriaLabel(label, itemId) {
        const suffix = itemId === this.activeItem ? ' (Current Page)' : '';
        return `Navigate to ${label}${suffix}`;
    }

    /**
     * Computes alternative text for icon
     * @param {string} label - The menu item label
     * @returns {string} Alternative text
     * @private
     */
    getAlternativeText(label) {
        return `${label} icon`;
    }

    /**
     * Handles navigation item click events
     * Prevents default link behavior and dispatches custom event
     * @param {Event} event - Click event
     * @private
     */
    handleNavItemClick(event) {
        event.preventDefault();

        const itemId = event.currentTarget.dataset.itemId;

        // Update active item
        this.activeItem = itemId;

        // Dispatch custom event for parent component to handle navigation
        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: {
                    itemId: itemId
                },
                bubbles: true,
                composed: true
            })
        );
    }
}