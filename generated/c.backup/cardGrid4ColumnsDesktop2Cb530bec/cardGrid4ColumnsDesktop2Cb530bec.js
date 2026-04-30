import { LightningElement, api } from 'lwc';

/**
 * Responsive card grid component that displays cards in a responsive layout:
 * - Desktop (large): 4 columns
 * - Tablet (medium): 2 columns
 * - Mobile (small): 1 column
 * 
 * Uses SLDS grid utilities for responsive behavior and follows SLDS 2 design patterns.
 */
export default class CardGrid4ColumnsDesktop2 extends LightningElement {
    /**
     * Array of card data to display in the grid.
     * Each card contains an id, title, and description.
     * Default provides 8 sample cards to demonstrate grid behavior.
     */
    cards = [
        {
            id: '1',
            title: 'Card 1',
            description: 'This is the first card demonstrating the responsive grid layout. It adapts to different screen sizes.'
        },
        {
            id: '2',
            title: 'Card 2',
            description: 'This is the second card showing how content flows in the grid system with proper spacing.'
        },
        {
            id: '3',
            title: 'Card 3',
            description: 'This is the third card illustrating SLDS design patterns and utility classes for layout.'
        },
        {
            id: '4',
            title: 'Card 4',
            description: 'This is the fourth card demonstrating the 4-column layout on desktop screens.'
        },
        {
            id: '5',
            title: 'Card 5',
            description: 'This is the fifth card showing the responsive behavior on tablet devices with 2 columns.'
        },
        {
            id: '6',
            title: 'Card 6',
            description: 'This is the sixth card displaying single column layout on mobile devices for optimal readability.'
        },
        {
            id: '7',
            title: 'Card 7',
            description: 'This is the seventh card using SLDS spacing utilities for consistent visual rhythm.'
        },
        {
            id: '8',
            title: 'Card 8',
            description: 'This is the eighth card completing the grid demonstration with proper alignment and spacing.'
        }
    ];
}