import { LightningElement, api } from 'lwc';

/**
 * @description Vertical Navigation Menu component that displays 5 navigation items with Dashboard as the active item
 * @class
 * @extends LightningElement
 */
export default class CreateVerticalNavMenu extends LightningElement {
  /**
   * @description Tracks the currently active navigation item
   * @type {String}
   * @private
   */
  _activeItem = 'dashboard';

  /**
   * @description Navigation item labels with default values
   * @type {Object}
   * @private
   */
  _labels = {
    dashboard: 'Dashboard',
    reports: 'Reports',
    contacts: 'Contacts',
    tasks: 'Tasks',
    settings: 'Settings',
  };

  /**
   * @description Getter for navigation item labels
   * @returns {Object} Navigation item labels
   */
  get labels() {
    return this._labels;
  }

  /**
   * @description Sets the active navigation item
   * @param {String} value - The name of the item to set as active
   * @public
   */
  @api
  set activeItem(value) {
    if (value && typeof value === 'string') {
      this._activeItem = value.toLowerCase();
      this.updateActiveItem();
    }
  }

  /**
   * @description Gets the active navigation item
   * @returns {String} The name of the currently active item
   * @public
   */
  get activeItem() {
    return this._activeItem;
  }

  /**
   * @description Handler for navigation item clicks
   * @param {Event} event - The click event
   * @private
   */
  handleNavClick(event) {
    // Prevent default behavior of anchor tag
    event.preventDefault();

    // Find the closest list item to get the data attribute
    const listItem = event.currentTarget.closest('li');
    if (listItem) {
      const itemName = listItem.dataset.itemName;

      // Only proceed if the clicked item is not already active
      if (itemName !== this._activeItem) {
        this._activeItem = itemName;

        // Update UI to reflect the new active item
        this.updateActiveItem();

        // Dispatch custom event to notify parent component of navigation change
        this.dispatchEvent(
          new CustomEvent('navigationchange', {
            detail: {
              item: itemName,
            },
          }),
        );
      }
    }
  }

  /**
   * @description Updates the UI to mark the active navigation item
   * @private
   */
  updateActiveItem() {
    // Remove active class from all items
    this.template.querySelectorAll('.slds-nav-vertical__item').forEach((item) => {
      item.classList.remove('slds-is-active');
      const link = item.querySelector('a');
      if (link) {
        link.removeAttribute('aria-current');
      }
    });

    // Add active class to the current active item
    const activeItem = this.template.querySelector(`[data-item-name="${this._activeItem}"]`);
    if (activeItem) {
      activeItem.classList.add('slds-is-active');
      const link = activeItem.querySelector('a');
      if (link) {
        link.setAttribute('aria-current', 'page');
      }
    }
  }
}
