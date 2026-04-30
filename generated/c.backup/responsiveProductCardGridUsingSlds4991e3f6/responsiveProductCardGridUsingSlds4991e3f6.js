import { LightningElement } from 'lwc';

/**
 * Responsive Product Card Grid Component
 * Displays a grid of product cards that adapts to different screen sizes using SLDS grid system.
 *
 * Features:
 * - Responsive layout: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
 * - SLDS design tokens for consistent styling
 * - Hover effects with smooth transitions
 * - Accessible card structure with semantic HTML
 */
export default class ResponsiveProductCardGridUsingSlds extends LightningElement {
    /**
     * Sample product data
     * Each product contains:
     * - id: Unique identifier for the product (required for for:each iteration)
     * - name: Product title/name
     * - price: Formatted price string
     * - imageUrl: URL to product image
     * - imageAlt: Accessibility text for the image
     */
    products = [
        {
            id: '1',
            name: 'Premium Widget',
            price: '$199.99',
            imageUrl: 'https://via.placeholder.com/300x200/0176d3/ffffff?text=Premium+Widget',
            imageAlt: 'Premium Widget product image'
        },
        {
            id: '2',
            name: 'Deluxe Gadget',
            price: '$299.99',
            imageUrl: 'https://via.placeholder.com/300x200/0176d3/ffffff?text=Deluxe+Gadget',
            imageAlt: 'Deluxe Gadget product image'
        },
        {
            id: '3',
            name: 'Standard Tool',
            price: '$149.99',
            imageUrl: 'https://via.placeholder.com/300x200/0176d3/ffffff?text=Standard+Tool',
            imageAlt: 'Standard Tool product image'
        },
        {
            id: '4',
            name: 'Advanced Device',
            price: '$399.99',
            imageUrl: 'https://via.placeholder.com/300x200/0176d3/ffffff?text=Advanced+Device',
            imageAlt: 'Advanced Device product image'
        },
        {
            id: '5',
            name: 'Basic Kit',
            price: '$99.99',
            imageUrl: 'https://via.placeholder.com/300x200/0176d3/ffffff?text=Basic+Kit',
            imageAlt: 'Basic Kit product image'
        },
        {
            id: '6',
            name: 'Professional Set',
            price: '$499.99',
            imageUrl: 'https://via.placeholder.com/300x200/0176d3/ffffff?text=Professional+Set',
            imageAlt: 'Professional Set product image'
        }
    ];
}