import { LightningElement, track } from 'lwc';

/**
 * Fully Responsive Sortable Data Table Component
 *
 * This component displays a sortable data table with the following features:
 * - Desktop view: Traditional table layout with sortable columns
 * - Mobile view: Stacked card layout with field labels
 * - Semantic badges for Category (neutral) and Stock Status (success/warning/error)
 * - Sorting functionality on Product Name and Price columns
 * - SLDS 2 compliant styling with design tokens
 */
export default class FullyResponsiveSortableDataTableWithC03Detailed20260312 extends LightningElement {
    // Track sorting state for reactive updates
    @track sortColumn = ''; // Current column being sorted ('name' or 'price')
    @track sortDirection = ''; // Current sort direction ('asc' or 'desc')

    // Original product data (10 sample products as per PRD)
    products = [
        {
            id: '1',
            name: 'Wireless Headphones',
            price: 79.99,
            category: 'Electronics',
            stockStatus: 'In Stock'
        },
        {
            id: '2',
            name: 'Ergonomic Chair',
            price: 349.99,
            category: 'Furniture',
            stockStatus: 'Low Stock'
        },
        {
            id: '3',
            name: 'Laptop Stand',
            price: 45.50,
            category: 'Accessories',
            stockStatus: 'In Stock'
        },
        {
            id: '4',
            name: 'USB-C Cable',
            price: 12.99,
            category: 'Electronics',
            stockStatus: 'Out of Stock'
        },
        {
            id: '5',
            name: 'Desk Lamp',
            price: 34.99,
            category: 'Furniture',
            stockStatus: 'In Stock'
        },
        {
            id: '6',
            name: 'Wireless Mouse',
            price: 29.99,
            category: 'Electronics',
            stockStatus: 'In Stock'
        },
        {
            id: '7',
            name: 'Monitor Arm',
            price: 89.99,
            category: 'Accessories',
            stockStatus: 'Low Stock'
        },
        {
            id: '8',
            name: 'Keyboard',
            price: 119.99,
            category: 'Electronics',
            stockStatus: 'In Stock'
        },
        {
            id: '9',
            name: 'Office Desk',
            price: 599.99,
            category: 'Furniture',
            stockStatus: 'Out of Stock'
        },
        {
            id: '10',
            name: 'Cable Organizer',
            price: 15.99,
            category: 'Accessories',
            stockStatus: 'In Stock'
        }
    ];

    /**
     * Computed getter for displayed products
     * Returns sorted data with formatted price and status badge classes
     * CRITICAL: Using getter to avoid template literals in HTML
     */
    get displayedProducts() {
        // Create a copy to avoid mutating original data
        let productsToDisplay = [...this.products];

        // Apply sorting if a sort column is set
        if (this.sortColumn === 'name') {
            productsToDisplay.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();

                if (this.sortDirection === 'asc') {
                    return nameA.localeCompare(nameB);
                } else if (this.sortDirection === 'desc') {
                    return nameB.localeCompare(nameA);
                }
                return 0;
            });
        } else if (this.sortColumn === 'price') {
            productsToDisplay.sort((a, b) => {
                if (this.sortDirection === 'asc') {
                    return a.price - b.price;
                } else if (this.sortDirection === 'desc') {
                    return b.price - a.price;
                }
                return 0;
            });
        }

        // Format data for display with computed properties
        return productsToDisplay.map(product => ({
            ...product,
            priceFormatted: this.formatCurrency(product.price),
            statusBadgeClass: this.getStatusBadgeClass(product.stockStatus)
        }));
    }

    /**
     * Check if there is no data to display
     */
    get hasNoData() {
        return !this.products || this.products.length === 0;
    }

    /**
     * Check if Product Name column is currently sorted
     */
    get isNameSorted() {
        return this.sortColumn === 'name';
    }

    /**
     * Check if Price column is currently sorted
     */
    get isPriceSorted() {
        return this.sortColumn === 'price';
    }

    /**
     * Get sort icon href for SLDS icons
     * CRITICAL: Using getter to avoid template literals in HTML
     */
    get sortIconHref() {
        if (this.sortDirection === 'asc') {
            return '/_slds/icons/utility-sprite/svg/symbols.svg#arrowup';
        } else if (this.sortDirection === 'desc') {
            return '/_slds/icons/utility-sprite/svg/symbols.svg#arrowdown';
        }
        return '';
    }

    /**
     * Aria-label for Product Name sort button
     * CRITICAL: Using getter to avoid template literals in HTML
     */
    get productNameSortAriaLabel() {
        if (this.sortColumn === 'name') {
            return `Sort by Product Name ${this.sortDirection === 'asc' ? 'ascending' : 'descending'}`;
        }
        return 'Sort by Product Name';
    }

    /**
     * Aria-label for Price sort button
     * CRITICAL: Using getter to avoid template literals in HTML
     */
    get priceSortAriaLabel() {
        if (this.sortColumn === 'price') {
            return `Sort by Price ${this.sortDirection === 'asc' ? 'ascending' : 'descending'}`;
        }
        return 'Sort by Price';
    }

    /**
     * Aria-sort value for Product Name column
     */
    get productNameAriaSortValue() {
        if (this.sortColumn === 'name') {
            return this.sortDirection === 'asc' ? 'ascending' : 'descending';
        }
        return 'none';
    }

    /**
     * Aria-sort value for Price column
     */
    get priceAriaSortValue() {
        if (this.sortColumn === 'price') {
            return this.sortDirection === 'asc' ? 'ascending' : 'descending';
        }
        return 'none';
    }

    /**
     * Format price as USD currency
     * @param {number} price - Price value to format
     * @returns {string} Formatted currency string (e.g., "$79.99")
     */
    formatCurrency(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Get CSS class for stock status badge based on semantic meaning
     * CRITICAL: Returns class string to avoid template literals in HTML
     * @param {string} status - Stock status value
     * @returns {string} CSS class string for badge styling
     */
    getStatusBadgeClass(status) {
        const baseClass = 'slds-badge';

        switch (status) {
            case 'In Stock':
                return `${baseClass} badge-success`;
            case 'Low Stock':
                return `${baseClass} badge-warning`;
            case 'Out of Stock':
                return `${baseClass} badge-error`;
            default:
                return `${baseClass} badge-neutral`;
        }
    }

    /**
     * Handle sort by Product Name column
     * Implements three-state sorting: none → asc → desc → none
     * @param {Event} event - Click event
     */
    handleSortByName(event) {
        event.preventDefault(); // Prevent default anchor behavior

        if (this.sortColumn === 'name') {
            // Cycle through: asc → desc → none
            if (this.sortDirection === 'asc') {
                this.sortDirection = 'desc';
            } else if (this.sortDirection === 'desc') {
                // Reset to no sort
                this.sortColumn = '';
                this.sortDirection = '';
            }
        } else {
            // Start new sort on this column (ascending)
            this.sortColumn = 'name';
            this.sortDirection = 'asc';
        }
    }

    /**
     * Handle sort by Price column
     * Implements three-state sorting: none → asc → desc → none
     * @param {Event} event - Click event
     */
    handleSortByPrice(event) {
        event.preventDefault(); // Prevent default anchor behavior

        if (this.sortColumn === 'price') {
            // Cycle through: asc → desc → none
            if (this.sortDirection === 'asc') {
                this.sortDirection = 'desc';
            } else if (this.sortDirection === 'desc') {
                // Reset to no sort
                this.sortColumn = '';
                this.sortDirection = '';
            }
        } else {
            // Start new sort on this column (ascending)
            this.sortColumn = 'price';
            this.sortDirection = 'asc';
        }
    }

    /**
     * Handle keyboard events for accessibility
     * Allow Enter and Space keys to trigger sort
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // The onclick handler will be triggered by the event delegation
        }
    }
}