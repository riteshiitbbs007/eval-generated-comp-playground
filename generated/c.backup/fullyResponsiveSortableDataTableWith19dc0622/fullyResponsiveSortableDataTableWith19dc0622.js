import { LightningElement, track } from 'lwc';

export default class FullyResponsiveSortableDataTableWithC03Detailed20260312 extends LightningElement {
    // Track the products array for reactive updates
    @track products = [
        {
            id: '1',
            name: 'Wireless Bluetooth Headphones',
            price: 89.99,
            category: 'Electronics',
            status: 'In Stock'
        },
        {
            id: '2',
            name: 'Organic Cotton T-Shirt',
            price: 24.99,
            category: 'Clothing',
            status: 'Low Stock'
        },
        {
            id: '3',
            name: 'Stainless Steel Water Bottle',
            price: 19.99,
            category: 'Home',
            status: 'In Stock'
        },
        {
            id: '4',
            name: 'The Art of Programming',
            price: 45.00,
            category: 'Books',
            status: 'Out of Stock'
        },
        {
            id: '5',
            name: 'Smart Watch Series 5',
            price: 299.99,
            category: 'Electronics',
            status: 'In Stock'
        },
        {
            id: '6',
            name: 'Yoga Mat Premium',
            price: 34.99,
            category: 'Sports',
            status: 'In Stock'
        },
        {
            id: '7',
            name: 'Ceramic Coffee Mug Set',
            price: 29.99,
            category: 'Home',
            status: 'Low Stock'
        },
        {
            id: '8',
            name: 'Denim Jacket Classic',
            price: 79.99,
            category: 'Clothing',
            status: 'In Stock'
        },
        {
            id: '9',
            name: 'Wireless Gaming Mouse',
            price: 59.99,
            category: 'Electronics',
            status: 'Out of Stock'
        },
        {
            id: '10',
            name: 'Cooking Mastery Cookbook',
            price: 32.50,
            category: 'Books',
            status: 'In Stock'
        }
    ];

    // Sorting state
    sortField = null;
    sortDirection = 'asc'; // 'asc' or 'desc'

    /**
     * Get sorted products with computed properties for display
     */
    get sortedProducts() {
        // Create a shallow copy to avoid mutating original array
        let products = [...this.products];

        // Apply sorting if a field is selected
        if (this.sortField) {
            products.sort((a, b) => {
                let aValue = a[this.sortField];
                let bValue = b[this.sortField];

                // Handle numeric sorting for price
                if (this.sortField === 'price') {
                    aValue = Number(aValue);
                    bValue = Number(bValue);
                }

                // Handle string sorting (case-insensitive)
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return this.sortDirection === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return this.sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        // Add computed properties to each product
        return products.map(product => ({
            ...product,
            formattedPrice: this.formatCurrency(product.price),
            statusBadgeClass: this.getStatusBadgeClass(product.status)
        }));
    }

    /**
     * Format price as USD currency
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
     * Get badge class based on stock status
     * In Stock → success (green)
     * Low Stock → warning (yellow/orange)
     * Out of Stock → error (red)
     */
    getStatusBadgeClass(status) {
        const baseClass = 'slds-badge';

        switch (status) {
            case 'In Stock':
                return `${baseClass} slds-theme_success`;
            case 'Low Stock':
                return `${baseClass} slds-theme_warning`;
            case 'Out of Stock':
                return `${baseClass} slds-theme_error`;
            default:
                return baseClass;
        }
    }

    /**
     * Check if name column is currently sorted
     */
    get isNameSorted() {
        return this.sortField === 'name';
    }

    /**
     * Check if price column is currently sorted
     */
    get isPriceSorted() {
        return this.sortField === 'price';
    }

    /**
     * Get sort icon for name column
     * CRITICAL: Use getter to avoid template literals in HTML
     */
    get nameSortIcon() {
        if (!this.isNameSorted) return '';
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    /**
     * Get sort icon for price column
     * CRITICAL: Use getter to avoid template literals in HTML
     */
    get priceSortIcon() {
        if (!this.isPriceSorted) return '';
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    /**
     * Get sort direction label for name column
     * CRITICAL: Use getter to avoid template literals in HTML
     */
    get nameSortDirection() {
        if (!this.isNameSorted) return '';
        return this.sortDirection === 'asc' ? 'Ascending' : 'Descending';
    }

    /**
     * Get sort direction label for price column
     * CRITICAL: Use getter to avoid template literals in HTML
     */
    get priceSortDirection() {
        if (!this.isPriceSorted) return '';
        return this.sortDirection === 'asc' ? 'Ascending' : 'Descending';
    }

    /**
     * Get ARIA label for name sort button
     * CRITICAL: Use getter to avoid template literals in HTML
     */
    get nameSortAriaLabel() {
        if (!this.isNameSorted) {
            return 'Sort by Product Name';
        }
        const direction = this.sortDirection === 'asc' ? 'ascending' : 'descending';
        return 'Product Name sorted ' + direction + ', click to sort ' + (this.sortDirection === 'asc' ? 'descending' : 'ascending');
    }

    /**
     * Get ARIA label for price sort button
     * CRITICAL: Use getter to avoid template literals in HTML
     */
    get priceSortAriaLabel() {
        if (!this.isPriceSorted) {
            return 'Sort by Price';
        }
        const direction = this.sortDirection === 'asc' ? 'ascending' : 'descending';
        return 'Price sorted ' + direction + ', click to sort ' + (this.sortDirection === 'asc' ? 'descending' : 'ascending');
    }

    /**
     * Handle sorting by Product Name
     */
    handleSortByName(event) {
        event.preventDefault();
        this.handleSort('name');
    }

    /**
     * Handle sorting by Price
     */
    handleSortByPrice(event) {
        event.preventDefault();
        this.handleSort('price');
    }

    /**
     * Generic sort handler
     * Toggles sort direction if same field, otherwise sorts ascending
     */
    handleSort(field) {
        if (this.sortField === field) {
            // Toggle direction if clicking same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            this.sortField = field;
            this.sortDirection = 'asc';
        }
    }
}