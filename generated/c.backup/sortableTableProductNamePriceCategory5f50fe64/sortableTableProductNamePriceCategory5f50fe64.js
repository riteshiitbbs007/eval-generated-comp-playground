import { LightningElement, api } from 'lwc';

/**
 * Sortable Product Table Component
 * Displays a sortable table of products with Name, Price, Category, and Stock Status columns
 *
 * @typedef {Object} Product
 * @property {number} id - Unique identifier for the product
 * @property {string} name - Product name
 * @property {number} price - Product price in dollars
 * @property {string} category - Product category
 * @property {string} stock - Stock status (In Stock, Low Stock, Out of Stock)
 */
export default class SortableTableProductNamePriceCategoryC03Simple20260306 extends LightningElement {
    /**
     * @api {boolean} sortable - Enable/disable sorting functionality
     * @description When true, allows users to sort table by clicking column headers
     * @default false (LWC requirement: all boolean @api properties must default to false)
     */
    @api sortable = false;

    /**
     * @api {boolean} showStockStatus - Show/hide the Stock Status column
     * @description Controls visibility of the Stock Status column
     * @default false (LWC requirement: all boolean @api properties must default to false)
     */
    @api showStockStatus = false;

    /**
     * @private {string} sortField - Currently sorted field name
     * @description Tracks which column is currently being sorted
     */
    sortField = 'name';

    /**
     * @private {boolean} sortAscending - Sort direction flag
     * @description true = ascending, false = descending
     */
    sortAscending = true;

    /**
     * @private {Array<Product>} products - Raw product data
     * @description Sample product data for the table
     */
    products = [
        { id: 1, name: 'Laptop Pro', price: 999, category: 'Electronics', stock: 'In Stock' },
        { id: 2, name: 'Running Shoes', price: 89, category: 'Sports', stock: 'Low Stock' },
        { id: 3, name: 'Coffee Maker', price: 79, category: 'Home', stock: 'In Stock' },
        { id: 4, name: 'Wireless Mouse', price: 29, category: 'Electronics', stock: 'Out of Stock' },
        { id: 5, name: 'Yoga Mat', price: 35, category: 'Sports', stock: 'In Stock' },
        { id: 6, name: 'Desk Lamp', price: 45, category: 'Home', stock: 'In Stock' },
        { id: 7, name: 'Bluetooth Speaker', price: 129, category: 'Electronics', stock: 'Low Stock' },
        { id: 8, name: 'Winter Jacket', price: 159, category: 'Clothing', stock: 'In Stock' }
    ];

    /**
     * @getter sortedProducts - Returns sorted and formatted product data
     * @description Sorts products based on current sort field and direction, adds formatted price and badge classes
     * @returns {Array<Product>} Sorted array of products with additional display properties
     */
    get sortedProducts() {
        // Create a shallow copy to avoid mutating original data
        const data = [...this.products];

        // Sort data based on current sort field and direction
        data.sort((a, b) => {
            let valueA = a[this.sortField];
            let valueB = b[this.sortField];

            // Handle string comparisons (name, category, stock)
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            // Perform comparison
            if (valueA < valueB) {
                return this.sortAscending ? -1 : 1;
            }
            if (valueA > valueB) {
                return this.sortAscending ? 1 : -1;
            }
            return 0;
        });

        // Add formatted price and stock badge class to each product
        return data.map(product => ({
            ...product,
            formattedPrice: this.formatPrice(product.price),
            stockBadgeClass: this.getStockBadgeClass(product.stock)
        }));
    }

    /**
     * @method formatPrice - Formats price as currency
     * @description Converts numeric price to USD currency format
     * @param {number} price - Price value to format
     * @returns {string} Formatted price string (e.g., "$999.00")
     */
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    /**
     * @method getStockBadgeClass - Returns CSS class for stock status badge
     * @description Determines badge styling based on stock status
     * @param {string} stock - Stock status string
     * @returns {string} SLDS badge class with appropriate theme
     */
    getStockBadgeClass(stock) {
        const baseClass = 'slds-badge';

        switch (stock) {
            case 'In Stock':
                return `${baseClass} slds-badge_success`;
            case 'Low Stock':
                return `${baseClass} slds-badge_warning`;
            case 'Out of Stock':
                return `${baseClass} slds-badge_error`;
            default:
                return baseClass;
        }
    }

    /**
     * @method handleSort - Generic sort handler
     * @description Updates sort field and toggles direction if same field clicked
     * @param {string} fieldName - Name of field to sort by
     */
    handleSort(fieldName) {
        // If clicking the same field, toggle sort direction
        if (this.sortField === fieldName) {
            this.sortAscending = !this.sortAscending;
        } else {
            // New field, reset to ascending
            this.sortField = fieldName;
            this.sortAscending = true;
        }
    }

    /**
     * @method handleSortByName - Sort by Product Name
     * @description Event handler for Name column header click
     */
    handleSortByName() {
        if (this.sortable) {
            this.handleSort('name');
        }
    }

    /**
     * @method handleSortByPrice - Sort by Price
     * @description Event handler for Price column header click
     */
    handleSortByPrice() {
        if (this.sortable) {
            this.handleSort('price');
        }
    }

    /**
     * @method handleSortByCategory - Sort by Category
     * @description Event handler for Category column header click
     */
    handleSortByCategory() {
        if (this.sortable) {
            this.handleSort('category');
        }
    }

    /**
     * @method handleSortByStock - Sort by Stock Status
     * @description Event handler for Stock Status column header click
     */
    handleSortByStock() {
        if (this.sortable) {
            this.handleSort('stock');
        }
    }

    // Computed getters for Name column sort indicators
    // These getters avoid template literals in HTML attributes (LWC requirement)

    /**
     * @getter nameSortIcon - Icon name for Name column sort indicator
     * @returns {string} Lightning icon name
     */
    get nameSortIcon() {
        if (this.sortField !== 'name') return 'utility:arrowup';
        return this.sortAscending ? 'utility:arrowup' : 'utility:arrowdown';
    }

    /**
     * @getter nameSortIconAlt - Alt text for Name column sort icon
     * @returns {string} Descriptive text for screen readers
     */
    get nameSortIconAlt() {
        if (this.sortField !== 'name') return 'Not sorted';
        return this.sortAscending ? 'Sorted ascending' : 'Sorted descending';
    }

    /**
     * @getter nameSortAriaSort - ARIA sort attribute for Name column
     * @returns {string} ARIA sort value (ascending, descending, none)
     */
    get nameSortAriaSort() {
        if (this.sortField !== 'name') return 'none';
        return this.sortAscending ? 'ascending' : 'descending';
    }

    /**
     * @getter nameSortAriaLabel - ARIA label for Name column sort button
     * @returns {string} Accessible button label
     */
    get nameSortAriaLabel() {
        const action = this.sortField === 'name' && !this.sortAscending ? 'ascending' : 'descending';
        return `Sort Product Name ${action}`;
    }

    // Computed getters for Price column sort indicators

    /**
     * @getter priceSortIcon - Icon name for Price column sort indicator
     * @returns {string} Lightning icon name
     */
    get priceSortIcon() {
        if (this.sortField !== 'price') return 'utility:arrowup';
        return this.sortAscending ? 'utility:arrowup' : 'utility:arrowdown';
    }

    /**
     * @getter priceSortIconAlt - Alt text for Price column sort icon
     * @returns {string} Descriptive text for screen readers
     */
    get priceSortIconAlt() {
        if (this.sortField !== 'price') return 'Not sorted';
        return this.sortAscending ? 'Sorted ascending' : 'Sorted descending';
    }

    /**
     * @getter priceSortAriaSort - ARIA sort attribute for Price column
     * @returns {string} ARIA sort value
     */
    get priceSortAriaSort() {
        if (this.sortField !== 'price') return 'none';
        return this.sortAscending ? 'ascending' : 'descending';
    }

    /**
     * @getter priceSortAriaLabel - ARIA label for Price column sort button
     * @returns {string} Accessible button label
     */
    get priceSortAriaLabel() {
        const action = this.sortField === 'price' && !this.sortAscending ? 'ascending' : 'descending';
        return `Sort Price ${action}`;
    }

    // Computed getters for Category column sort indicators

    /**
     * @getter categorySortIcon - Icon name for Category column sort indicator
     * @returns {string} Lightning icon name
     */
    get categorySortIcon() {
        if (this.sortField !== 'category') return 'utility:arrowup';
        return this.sortAscending ? 'utility:arrowup' : 'utility:arrowdown';
    }

    /**
     * @getter categorySortIconAlt - Alt text for Category column sort icon
     * @returns {string} Descriptive text for screen readers
     */
    get categorySortIconAlt() {
        if (this.sortField !== 'category') return 'Not sorted';
        return this.sortAscending ? 'Sorted ascending' : 'Sorted descending';
    }

    /**
     * @getter categorySortAriaSort - ARIA sort attribute for Category column
     * @returns {string} ARIA sort value
     */
    get categorySortAriaSort() {
        if (this.sortField !== 'category') return 'none';
        return this.sortAscending ? 'ascending' : 'descending';
    }

    /**
     * @getter categorySortAriaLabel - ARIA label for Category column sort button
     * @returns {string} Accessible button label
     */
    get categorySortAriaLabel() {
        const action = this.sortField === 'category' && !this.sortAscending ? 'ascending' : 'descending';
        return `Sort Category ${action}`;
    }

    // Computed getters for Stock Status column sort indicators

    /**
     * @getter stockSortIcon - Icon name for Stock Status column sort indicator
     * @returns {string} Lightning icon name
     */
    get stockSortIcon() {
        if (this.sortField !== 'stock') return 'utility:arrowup';
        return this.sortAscending ? 'utility:arrowup' : 'utility:arrowdown';
    }

    /**
     * @getter stockSortIconAlt - Alt text for Stock Status column sort icon
     * @returns {string} Descriptive text for screen readers
     */
    get stockSortIconAlt() {
        if (this.sortField !== 'stock') return 'Not sorted';
        return this.sortAscending ? 'Sorted ascending' : 'Sorted descending';
    }

    /**
     * @getter stockSortAriaSort - ARIA sort attribute for Stock Status column
     * @returns {string} ARIA sort value
     */
    get stockSortAriaSort() {
        if (this.sortField !== 'stock') return 'none';
        return this.sortAscending ? 'ascending' : 'descending';
    }

    /**
     * @getter stockSortAriaLabel - ARIA label for Stock Status column sort button
     * @returns {string} Accessible button label
     */
    get stockSortAriaLabel() {
        const action = this.sortField === 'stock' && !this.sortAscending ? 'ascending' : 'descending';
        return `Sort Stock Status ${action}`;
    }
}