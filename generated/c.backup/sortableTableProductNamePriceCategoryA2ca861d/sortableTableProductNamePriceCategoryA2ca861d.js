import { LightningElement } from 'lwc';

/**
 * Sortable Product Table Component
 * Displays a table of products with sortable columns: Product Name, Price, Category, Stock Status
 * Implements SLDS 2 design system with accessibility features and keyboard navigation
 */
export default class SortableTableProductNamePriceCategory extends LightningElement {
    // Private properties for sorting state
    sortedBy = 'name'; // Current column being sorted
    sortDirection = 'asc'; // Current sort direction: 'asc' or 'desc'

    // Sample product data for demonstration
    products = [
        {
            id: '1',
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            category: 'Electronics',
            stockStatus: 'In Stock'
        },
        {
            id: '2',
            name: 'Ergonomic Office Chair',
            price: 299.99,
            category: 'Furniture',
            stockStatus: 'In Stock'
        },
        {
            id: '3',
            name: 'Stainless Steel Water Bottle',
            price: 24.99,
            category: 'Home & Kitchen',
            stockStatus: 'Low Stock'
        },
        {
            id: '4',
            name: 'USB-C Fast Charger',
            price: 34.99,
            category: 'Electronics',
            stockStatus: 'Out of Stock'
        },
        {
            id: '5',
            name: 'Yoga Mat Premium',
            price: 45.99,
            category: 'Sports & Fitness',
            stockStatus: 'In Stock'
        },
        {
            id: '6',
            name: 'LED Desk Lamp',
            price: 52.99,
            category: 'Furniture',
            stockStatus: 'In Stock'
        },
        {
            id: '7',
            name: 'Portable Power Bank',
            price: 39.99,
            category: 'Electronics',
            stockStatus: 'Low Stock'
        },
        {
            id: '8',
            name: 'Coffee Maker Deluxe',
            price: 129.99,
            category: 'Home & Kitchen',
            stockStatus: 'In Stock'
        }
    ];

    /**
     * Get sorted products with formatted data
     * Applies current sorting and formats price and stock badge
     */
    get sortedProducts() {
        const productsToSort = [...this.products];
        const sortedData = productsToSort.sort((a, b) => {
            let aValue = a[this.sortedBy];
            let bValue = b[this.sortedBy];

            // Handle case-insensitive string comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            // Compare values
            if (aValue < bValue) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        // Add formatted data for display
        return sortedData.map(product => ({
            ...product,
            formattedPrice: this.formatPrice(product.price),
            stockBadgeClass: this.getStockBadgeClass(product.stockStatus)
        }));
    }

    /**
     * Format price as USD currency
     * @param {number} price - Raw price value
     * @returns {string} Formatted price string
     */
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    /**
     * Get CSS class for stock status badge
     * @param {string} status - Stock status value
     * @returns {string} CSS class for badge styling
     */
    getStockBadgeClass(status) {
        if (status === 'In Stock') {
            return 'slds-badge slds-theme_success';
        } else if (status === 'Low Stock') {
            return 'slds-badge slds-theme_warning';
        } else if (status === 'Out of Stock') {
            return 'slds-badge slds-theme_error';
        }
        return 'slds-badge';
    }

    /**
     * Sort handler for Product Name column
     */
    handleSortByName() {
        this.handleSort('name');
    }

    /**
     * Sort handler for Price column
     */
    handleSortByPrice() {
        this.handleSort('price');
    }

    /**
     * Sort handler for Category column
     */
    handleSortByCategory() {
        this.handleSort('category');
    }

    /**
     * Sort handler for Stock Status column
     */
    handleSortByStock() {
        this.handleSort('stockStatus');
    }

    /**
     * Generic sort handler - toggles direction if same column, resets to asc if different
     * @param {string} fieldName - Field name to sort by
     */
    handleSort(fieldName) {
        if (this.sortedBy === fieldName) {
            // Toggle sort direction if clicking the same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Reset to ascending when sorting by a new column
            this.sortedBy = fieldName;
            this.sortDirection = 'asc';
        }
    }

    // Computed properties for Product Name column sort indicators
    get showNameSortIcon() {
        return this.sortedBy === 'name';
    }

    get nameSortIcon() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    get nameSortIconAltText() {
        return this.sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending';
    }

    get nameSortAriaLabel() {
        const direction = this.sortedBy === 'name' 
            ? (this.sortDirection === 'asc' ? 'ascending' : 'descending')
            : 'not sorted';
        return 'Product Name, ' + direction;
    }

    // Computed properties for Price column sort indicators
    get showPriceSortIcon() {
        return this.sortedBy === 'price';
    }

    get priceSortIcon() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    get priceSortIconAltText() {
        return this.sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending';
    }

    get priceSortAriaLabel() {
        const direction = this.sortedBy === 'price' 
            ? (this.sortDirection === 'asc' ? 'ascending' : 'descending')
            : 'not sorted';
        return 'Price, ' + direction;
    }

    // Computed properties for Category column sort indicators
    get showCategorySortIcon() {
        return this.sortedBy === 'category';
    }

    get categorySortIcon() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    get categorySortIconAltText() {
        return this.sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending';
    }

    get categorySortAriaLabel() {
        const direction = this.sortedBy === 'category' 
            ? (this.sortDirection === 'asc' ? 'ascending' : 'descending')
            : 'not sorted';
        return 'Category, ' + direction;
    }

    // Computed properties for Stock Status column sort indicators
    get showStockSortIcon() {
        return this.sortedBy === 'stockStatus';
    }

    get stockSortIcon() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    get stockSortIconAltText() {
        return this.sortDirection === 'asc' ? 'Sorted ascending' : 'Sorted descending';
    }

    get stockSortAriaLabel() {
        const direction = this.sortedBy === 'stockStatus' 
            ? (this.sortDirection === 'asc' ? 'ascending' : 'descending')
            : 'not sorted';
        return 'Stock Status, ' + direction;
    }
}