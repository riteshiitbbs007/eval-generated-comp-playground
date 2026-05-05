import { LightningElement, api } from 'lwc';

/**
 * Responsive product card grid component using SLDS grid system.
 * Displays products in a responsive grid:
 * - Desktop: 4 columns
 * - Tablet: 2 columns
 * - Mobile: 1 column
 */
export default class ResponsiveProductCardGridUsingSlds extends LightningElement {
    /**
     * Private property to store the base product data.
     * Using getter/setter pattern to allow @api property override.
     */
    _productsData = [
        {
            id: 'prod-001',
            name: 'Premium Wireless Headphones',
            price: 299.99,
            imageUrl: 'https://via.placeholder.com/400x300/4a90e2/ffffff?text=Headphones'
        },
        {
            id: 'prod-002',
            name: 'Smart Watch Pro',
            price: 399.99,
            imageUrl: 'https://via.placeholder.com/400x300/7b68ee/ffffff?text=Smart+Watch'
        },
        {
            id: 'prod-003',
            name: 'Portable Bluetooth Speaker',
            price: 149.99,
            imageUrl: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Speaker'
        },
        {
            id: 'prod-004',
            name: 'Ultra HD Webcam',
            price: 179.99,
            imageUrl: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Webcam'
        },
        {
            id: 'prod-005',
            name: 'Mechanical Gaming Keyboard',
            price: 249.99,
            imageUrl: 'https://via.placeholder.com/400x300/95e1d3/ffffff?text=Keyboard'
        },
        {
            id: 'prod-006',
            name: 'Ergonomic Wireless Mouse',
            price: 89.99,
            imageUrl: 'https://via.placeholder.com/400x300/f38181/ffffff?text=Mouse'
        }
    ];

    /**
     * Getter to compute products with formatted properties.
     * Returns products with computed properties for use in template.
     * This demonstrates the correct pattern: dynamic string generation in JS, not in HTML.
     */
    get products() {
        // Return products with computed properties for use in template
        return this._productsData.map(product => ({
            ...product,
            // Compute formatted price string in JavaScript (not in HTML template)
            formattedPrice: `$${product.price.toFixed(2)}`,
            // Compute image alt text in JavaScript (not in HTML template)
            imageAlt: `${product.name} product image`
        }));
    }

    /**
     * Setter for products API property.
     * Allows parent components to override the default product data.
     */
    @api
    set products(value) {
        if (value && Array.isArray(value)) {
            this._productsData = value;
        }
    }
}