import { LightningElement } from 'lwc';

/**
 * Responsive Card Grid Component
 * Displays cards in a responsive grid layout:
 * - 4 columns on desktop (large screens)
 * - 2 columns on tablet (medium screens)
 * - 1 column on mobile (small screens)
 */
export default class CardGrid4ColumnsDesktop2 extends LightningElement {
    /**
     * Array of card data to display in the grid
     * Each card contains: id, title, description, and icon
     * Minimum 8 cards to demonstrate the grid layout as per PRD
     */
    cards = [
        {
            id: '1',
            title: 'Account Management',
            description: 'Manage your customer accounts and track important details efficiently.',
            icon: 'standard:account'
        },
        {
            id: '2',
            title: 'Contact Directory',
            description: 'Access and organize all your business contacts in one central location.',
            icon: 'standard:contact'
        },
        {
            id: '3',
            title: 'Opportunity Tracking',
            description: 'Monitor sales opportunities and track progress through the pipeline.',
            icon: 'standard:opportunity'
        },
        {
            id: '4',
            title: 'Lead Generation',
            description: 'Capture and nurture leads to convert them into valuable customers.',
            icon: 'standard:lead'
        },
        {
            id: '5',
            title: 'Case Management',
            description: 'Handle customer support cases and resolve issues promptly.',
            icon: 'standard:case'
        },
        {
            id: '6',
            title: 'Campaign Analytics',
            description: 'Track marketing campaign performance and measure ROI effectively.',
            icon: 'standard:campaign'
        },
        {
            id: '7',
            title: 'Task Planning',
            description: 'Organize and prioritize tasks to stay productive and meet deadlines.',
            icon: 'standard:task'
        },
        {
            id: '8',
            title: 'Event Calendar',
            description: 'Schedule and manage events, meetings, and important appointments.',
            icon: 'standard:event'
        }
    ];
}