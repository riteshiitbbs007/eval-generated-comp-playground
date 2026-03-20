import { LightningElement } from 'lwc';

/**
 * Vertical Navigation Menu Component
 *
 * PRD: Create a vertical navigation menu with 5 items, with Dashboard as the active item.
 *
 * Features:
 * - Displays 5 navigation items: Dashboard, Reports, Accounts, Contacts, Settings
 * - Dashboard is marked as active by default
 * - Uses SLDS vertical navigation pattern for consistent styling
 * - Keyboard navigable and screen reader friendly
 */
export default class VerticalNavMenuWith5Items extends LightningElement {
    /**
     * Handle navigation item click
     *
     * PRD: Static navigation menu (no routing in this version)
     * This handler prevents default anchor behavior
     *
     * @param {Event} event - Click event from navigation link
     */
    handleNavClick(event) {
        // Prevent default anchor navigation behavior
        event.preventDefault();

        // TODO: In future versions, implement actual navigation logic
        // This could include:
        // - Updating active state dynamically
        // - Navigating to different views/pages
        // - Dispatching custom events to parent components
    }
}