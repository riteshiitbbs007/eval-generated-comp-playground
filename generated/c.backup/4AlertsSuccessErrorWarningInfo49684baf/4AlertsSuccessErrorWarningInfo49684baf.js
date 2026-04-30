import { LightningElement } from 'lwc';

/**
 * Component that displays 4 different alert types (Success, Error, Warning, Info)
 * with appropriate icons and semantic SLDS 2 styling.
 *
 * @component component-4AlertsSuccessErrorWarningInfo-C07-Simple-20260304
 * @description Displays four alert boxes with different feedback states
 */
export default class Component4AlertsSuccessErrorWarningInfoC07Simple20260304 extends LightningElement {
    /**
     * Component lifecycle hook - called when component is inserted into the DOM
     * No dynamic behavior needed for this static display component
     */
    connectedCallback() {
        // All alerts are static and rendered via template
        // No additional initialization required
    }
}