import { LightningElement, api } from 'lwc';

/**
 * Page Header Component with Title and Action Buttons
 * Displays a page header following SLDS design patterns with configurable title and action buttons
 */
export default class PageHeaderWithTitleAndAction extends LightningElement {
    /**
     * @api {String} title - The title text to display in the page header
     * Public property to allow parent components to set the page title
     */
    @api title = 'Page Title';

    /**
     * @api {Array} actionButtons - Array of button configurations
     * Each button object should have:
     * - id: Unique identifier
     * - label: Button text
     * - variant: SLDS button variant (base, neutral, brand, destructive, success)
     * - iconName: Optional SLDS icon name (e.g., 'utility:add')
     */
    @api actionButtons = [
        {
            id: 'btn-1',
            label: 'New',
            variant: 'neutral',
            iconName: 'utility:add'
        },
        {
            id: 'btn-2',
            label: 'Edit',
            variant: 'brand',
            iconName: 'utility:edit'
        }
    ];

    /**
     * Handle button click events
     * Dispatches a custom event with the button ID to notify parent components
     * @param {Event} event - Click event from the button
     */
    handleButtonClick(event) {
        // Extract button ID from data attribute
        const buttonId = event.target.dataset.id;
        
        // Find the clicked button configuration
        const clickedButton = this.actionButtons.find(btn => btn.id === buttonId);
        
        // Dispatch custom event to parent with button details
        this.dispatchEvent(
            new CustomEvent('actionclick', {
                detail: {
                    buttonId: buttonId,
                    buttonLabel: clickedButton?.label
                },
                bubbles: true,
                composed: true
            })
        );
    }
}