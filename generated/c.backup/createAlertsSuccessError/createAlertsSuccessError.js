import { LightningElement, track } from 'lwc';

/**
 * @description Component that displays four types of alerts: Success, Error, Warning, and Info with icons
 * Each alert has a close button to dismiss it
 * @example <c-create-alerts-success-error></c-create-alerts-success-error>
 */
export default class CreateAlertsSuccessError extends LightningElement {
  /**
   * @description Tracks visibility state of each alert type
   * @type {Object}
   */
  @track alertVisibility = {
    success: true,
    error: true,
    warning: true,
    info: true,
  };

  /**
   * @description Handles the close event for an alert
   * @param {Event} event - The click event
   */
  closeAlert(event) {
    const alertType = event.currentTarget.dataset.alertType;
    if (alertType && this.alertVisibility.hasOwnProperty(alertType)) {
      this.alertVisibility = {
        ...this.alertVisibility,
        [alertType]: false,
      };
    }
  }
}
