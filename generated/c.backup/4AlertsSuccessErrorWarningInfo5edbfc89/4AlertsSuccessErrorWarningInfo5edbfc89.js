import { LightningElement } from 'lwc';

/**
 * Component displaying 4 different alert types (Success, Error, Warning, Info) with icons
 * following SLDS 2 patterns and feedback color semantic hooks
 */
export default class Component4AlertsSuccessErrorWarningInfo extends LightningElement {
    /**
     * Success alert message text
     * @type {string}
     */
    get successMessage() {
        return 'This is a success alert message. The operation completed successfully.';
    }

    /**
     * Error alert message text
     * @type {string}
     */
    get errorMessage() {
        return 'This is an error alert message. An error occurred that needs attention.';
    }

    /**
     * Warning alert message text
     * @type {string}
     */
    get warningMessage() {
        return 'This is a warning alert message. Please be aware of potential issues.';
    }

    /**
     * Info alert message text
     * @type {string}
     */
    get infoMessage() {
        return 'This is an info alert message. Here is some helpful information.';
    }
}