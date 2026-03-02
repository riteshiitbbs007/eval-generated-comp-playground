import { LightningElement, api } from 'lwc';

/**
 * @description A component that displays various types of alerts (success, error, warning, info)
 * Each alert includes an icon, message, and close button
 */
export default class Component4AlertsSuccessGreenErrorRed extends LightningElement {
    // API Properties
    @api successMessage = 'Success! Operation completed successfully.';
    @api errorMessage = 'Error! There was a problem with your request.';
    @api warningMessage = 'Warning! Please review the information.';
    @api infoMessage = 'Information: This is an informational message.';

    // Boolean properties to control alert visibility
    // All boolean @api properties MUST default to false per LWC1099 requirement
    @api showSuccess = false;
    @api showError = false;
    @api showWarning = false;
    @api showInfo = false;

    // Methods to hide alerts
    hideSuccessAlert() {
        this.showSuccess = false;
        this.dispatchHideEvent('success');
    }

    hideErrorAlert() {
        this.showError = false;
        this.dispatchHideEvent('error');
    }

    hideWarningAlert() {
        this.showWarning = false;
        this.dispatchHideEvent('warning');
    }

    hideInfoAlert() {
        this.showInfo = false;
        this.dispatchHideEvent('info');
    }

    // Helper method to dispatch hide events
    dispatchHideEvent(alertType) {
        this.dispatchEvent(new CustomEvent('hidealert', {
            detail: {
                type: alertType
            }
        }));
    }

    // Public methods to show alerts
    @api
    showSuccessAlert() {
        this.showSuccess = true;
    }

    @api
    showErrorAlert() {
        this.showError = true;
    }

    @api
    showWarningAlert() {
        this.showWarning = true;
    }

    @api
    showInfoAlert() {
        this.showInfo = true;
    }
}