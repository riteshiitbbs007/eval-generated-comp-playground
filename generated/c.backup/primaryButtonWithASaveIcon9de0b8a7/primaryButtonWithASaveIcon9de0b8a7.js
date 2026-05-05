import { LightningElement, api } from 'lwc';

/**
 * Primary Button with Save Icon
 * A reusable button component following SLDS 2 design standards
 * with proper accessibility and styling using SLDS design tokens
 */
export default class PrimaryButtonWithASaveIcon extends LightningElement {
    /**
     * Handle button click event
     * Dispatches custom event that parent components can listen to
     */
    handleClick() {
        // Dispatch custom event for parent component handling
        const clickEvent = new CustomEvent('buttonclick', {
            detail: {
                action: 'save',
                timestamp: new Date().toISOString()
            }
        });
        this.dispatchEvent(clickEvent);
    }
}