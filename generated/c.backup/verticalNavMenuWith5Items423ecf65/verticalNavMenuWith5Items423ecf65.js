import { LightningElement } from 'lwc';

/**
 * Vertical Navigation Menu Component
 *
 * A vertical navigation menu with 5 items following SLDS 2 design patterns.
 * Implements proper accessibility with ARIA attributes and keyboard navigation support.
 *
 * Features:
 * - Dashboard (active by default)
 * - Accounts
 * - Contacts
 * - Opportunities
 * - Reports
 *
 * Each item includes an icon and supports hover states.
 */
export default class VerticalNavMenuWith5ItemsC11Simple20260311 extends LightningElement {
    /**
     * Handle navigation item click
     * Prevents default navigation and manages active state
     *
     * @param {Event} event - Click event from navigation item
     */
    handleNavigationClick(event) {
        // Prevent default anchor navigation
        event.preventDefault();

        // Get the clicked item identifier
        const itemName = event.currentTarget.dataset.item;

        // Remove active class from all items
        const navItems = this.template.querySelectorAll('.slds-nav-vertical__item');
        navItems.forEach(item => {
            item.classList.remove('slds-is-active');
            const link = item.querySelector('.slds-nav-vertical__action');
            if (link) {
                link.removeAttribute('aria-current');
            }
        });

        // Add active class to clicked item
        const clickedItem = event.currentTarget.closest('.slds-nav-vertical__item');
        if (clickedItem) {
            clickedItem.classList.add('slds-is-active');
            event.currentTarget.setAttribute('aria-current', 'page');
        }

        // Dispatch custom event for parent components to handle navigation
        // Parent components can listen to this event to perform actual navigation
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: {
                item: itemName
            }
        }));
    }
}