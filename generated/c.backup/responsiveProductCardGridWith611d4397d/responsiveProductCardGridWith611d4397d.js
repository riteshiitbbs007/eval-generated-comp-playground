import { LightningElement, api } from 'lwc';

/**
 * @description Responsive product card grid component that displays up to 6 products
 * in a responsive grid layout (4 columns on desktop, 2 columns on tablet, 1 column on mobile)
 */
export default class ResponsiveProductCardGridWith6 extends LightningElement {
    /**
     * @description Array of product objects to display in the grid
     * @type {Array}
     */
    @api products = [];

    /**
     * @description Alternative text for the product grid
     * @type {String}
     */
    @api gridLabel = 'Product Grid';

    /**
     * @description Whether to show product prices
     * @type {Boolean}
     */
    @api showPrices = false;

    /**
     * @description Whether to show product descriptions
     * @type {Boolean}
     */
    @api showDescriptions = false;

    /**
     * @description Whether to show badges for new products
     * @type {Boolean}
     */
    @api showBadges = false;

    /**
     * @description Whether to show action buttons
     * @type {Boolean}
     */
    @api showButtons = false;

    /**
     * @description Whether to display products in a compact layout
     * @type {Boolean}
     */
    @api compactLayout = false;

    /**
     * @description Whether to highlight new products
     * @type {Boolean}
     */
    @api highlightNew = false;

    /**
     * @description Computed property to determine if we should show the empty state
     * @returns {Boolean} True if there are no products, false otherwise
     */
    get showEmptyState() {
        return !this.products || this.products.length === 0;
    }

    /**
     * @description Handler for product selection
     * @param {Event} event - The click event
     */
    handleProductSelect(event) {
        // Prevent default behavior
        event.preventDefault();

        // Get the product id from the data attribute
        const productId = event.currentTarget.dataset.id;

        // Find the selected product
        const selectedProduct = this.products.find(product => product.id === productId);

        if (selectedProduct) {
            // Dispatch a custom event with the selected product
            const selectEvent = new CustomEvent('productselect', {
                detail: {
                    productId: productId,
                    product: selectedProduct
                }
            });
            this.dispatchEvent(selectEvent);
        }
    }

    /**
     * @description Returns the appropriate aria label for a product button
     * @param {Object} product - The product object
     * @returns {String} The aria label for the button
     */
    get productButtonAriaLabel() {
        return (product) => `View details for ${product.name}`;
    }
}