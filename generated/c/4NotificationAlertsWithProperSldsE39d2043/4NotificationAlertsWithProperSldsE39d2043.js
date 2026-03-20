import { LightningElement, track } from 'lwc';

/**
 * NotificationAlertsWithProperSlds
 *
 * A Lightning Web Component that displays 4 notification alerts (success, error, warning, info)
 * with proper SLDS 2 styling using semantic color hooks and full accessibility compliance.
 *
 * Features:
 * - Success, Error, Warning, and Info alerts with semantic SLDS colors
 * - Full width responsive design
 * - Lightning icons with proper sizing and spacing
 * - Close buttons with accessibility support
 * - SLDS border-radius utilities for visual consistency
 * - Role="alert" for screen reader announcements
 *
 * @component
 */
export default class NotificationAlertsWithProperSlds extends LightningElement {
    /**
     * Tracked property to control success alert visibility
     * Defaults to true to show alert on component load
     * @type {boolean}
     */
    @track showSuccessAlert = true;

    /**
     * Tracked property to control error alert visibility
     * Defaults to true to show alert on component load
     * @type {boolean}
     */
    @track showErrorAlert = true;

    /**
     * Tracked property to control warning alert visibility
     * Defaults to true to show alert on component load
     * @type {boolean}
     */
    @track showWarningAlert = true;

    /**
     * Tracked property to control info alert visibility
     * Defaults to true to show alert on component load
     * @type {boolean}
     */
    @track showInfoAlert = true;

    /**
     * Handler for closing the success alert
     * Sets showSuccessAlert to false to hide the alert
     * @param {Event} event - Click event from close button
     */
    handleCloseSuccess(event) {
        event.preventDefault();
        this.showSuccessAlert = false;
    }

    /**
     * Handler for closing the error alert
     * Sets showErrorAlert to false to hide the alert
     * @param {Event} event - Click event from close button
     */
    handleCloseError(event) {
        event.preventDefault();
        this.showErrorAlert = false;
    }

    /**
     * Handler for closing the warning alert
     * Sets showWarningAlert to false to hide the alert
     * @param {Event} event - Click event from close button
     */
    handleCloseWarning(event) {
        event.preventDefault();
        this.showWarningAlert = false;
    }

    /**
     * Handler for closing the info alert
     * Sets showInfoAlert to false to hide the alert
     * @param {Event} event - Click event from close button
     */
    handleCloseInfo(event) {
        event.preventDefault();
        this.showInfoAlert = false;
    }
}