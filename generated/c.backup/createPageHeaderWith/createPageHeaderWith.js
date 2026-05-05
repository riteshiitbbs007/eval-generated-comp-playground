import { LightningElement, api } from 'lwc';

/**
 * @description Page header component with title and action buttons
 * @implements {LightningElement}
 */
export default class CreatePageHeaderWith extends LightningElement {
  /**
   * @description Main title for the page header
   * @type {String}
   */
  @api title;

  /**
   * @description Optional subtitle for the page header
   * @type {String}
   */
  @api subtitle;

  /**
   * @description Array of action buttons to display
   * @type {Array}
   * @example [{ label: 'New', variant: 'brand', name: 'new' }, { label: 'Delete', variant: 'destructive', name: 'delete' }]
   */
  @api
  get actions() {
    return this._actions || [];
  }
  set actions(value) {
    this._actions = Array.isArray(value) ? value : [];
  }

  /**
   * @private
   */
  _actions = [];

  /**
   * @description Handle action button clicks
   * @param {Event} event - Click event
   */
  handleActionClick(event) {
    const actionName = event.target.dataset.name;

    // Dispatch custom event with action name
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: { name: actionName },
      }),
    );
  }
}
