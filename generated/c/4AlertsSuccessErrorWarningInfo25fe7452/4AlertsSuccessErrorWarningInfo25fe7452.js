import { LightningElement } from 'lwc';

/**
 * Component that displays four types of alerts: Success, Error, Warning, and Info.
 * Each alert includes an appropriate icon and message following SLDS 2 design standards.
 * 
 * @component component4AlertsSuccessErrorWarningInfoC07Simple20260402
 * @description Displays four static alert messages with different feedback types
 */
export default class Component4AlertsSuccessErrorWarningInfoC07Simple20260402 extends LightningElement {
    /**
     * Component lifecycle hook - called when component is inserted into the DOM
     * No initialization logic required as alerts are static
     */
    connectedCallback() {
        // All alerts are rendered statically in the template
        // No dynamic data or event handling required per PRD
    }
}