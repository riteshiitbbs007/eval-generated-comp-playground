import { LightningElement } from 'lwc';

/**
 * Component displaying four alert types: Success, Error, Warning, and Info
 * Each alert includes an icon and message using SLDS feedback color system
 */
export default class Component4AlertsSuccessErrorWarningInfoC07Simple20260305 extends LightningElement {

    /**
     * Success alert message
     * Displayed in the success alert with green success styling
     */
    get successMessage() {
        return 'Operation completed successfully!';
    }

    /**
     * Error alert message
     * Displayed in the error alert with red error styling
     */
    get errorMessage() {
        return 'An error occurred. Please try again.';
    }

    /**
     * Warning alert message
     * Displayed in the warning alert with yellow/orange warning styling
     */
    get warningMessage() {
        return 'Please review the information before proceeding.';
    }

    /**
     * Info alert message
     * Displayed in the info alert with blue info styling
     */
    get infoMessage() {
        return 'This is informational content for your reference.';
    }
}
