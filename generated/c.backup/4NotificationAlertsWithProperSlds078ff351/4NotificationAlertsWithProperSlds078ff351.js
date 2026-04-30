import { LightningElement } from 'lwc';

/**
 * Component displaying 4 notification alerts with proper SLDS styling
 * Each alert includes:
 * - Appropriate icon with standard size and spacing
 * - Message text with standard sizing
 * - Close button positioned right
 * - SLDS border-radius utilities
 * - Full width layout
 */
export default class Component4NotificationAlertsWithProperSldsC07Detailed20260312 extends LightningElement {
    // Track visibility state for each alert (reactive properties automatically tracked in modern LWC)
    showSuccessAlert = true;
    showErrorAlert = true;
    showWarningAlert = true;
    showInfoAlert = true;

    /**
     * Handle close action for success alert
     */
    handleCloseSuccess() {
        this.showSuccessAlert = false;
    }

    /**
     * Handle close action for error alert
     */
    handleCloseError() {
        this.showErrorAlert = false;
    }

    /**
     * Handle close action for warning alert
     */
    handleCloseWarning() {
        this.showWarningAlert = false;
    }

    /**
     * Handle close action for info alert
     */
    handleCloseInfo() {
        this.showInfoAlert = false;
    }
}