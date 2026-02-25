import { LightningElement, track, api } from 'lwc';

export default class CreateSortableTableProduct extends LightningElement {
  // Private properties
  _products;

  // Sample product data - can be replaced with actual data from an API or provided via properties
  @api
  get products() {
    return this._products || this.defaultProducts;
  }
  set products(value) {
    this._products = value;
  }

  // Public API properties - All boolean properties default to false as required by LWC1099
  @api hideHeader = false;
  @api showRowHover = false;
  @api showStripedRows = false;

  // Computed property for header visibility
  get showHeader() {
    return !this.hideHeader;
  }

  // Default products to show if none are provided
  get defaultProducts() {
    return [
      { id: '1', name: 'Laptop Pro', price: 1200.0, category: 'Electronics', stockStatus: 'In Stock' },
      { id: '2', name: 'Office Chair', price: 199.99, category: 'Furniture', stockStatus: 'Low Stock' },
      { id: '3', name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stockStatus: 'In Stock' },
      { id: '4', name: 'Standing Desk', price: 349.95, category: 'Furniture', stockStatus: 'Out of Stock' },
      { id: '5', name: 'Monitor 4K', price: 299.99, category: 'Electronics', stockStatus: 'In Stock' }
    ];
  }

  // Sorting properties
  @track sortField = 'name';
  @track sortDirection = 'asc';

  // Computed property to determine if there are products
  get noProducts() {
    return !this.products || this.products.length === 0;
  }

  // Computed getters for sort icons
  get productNameSortIcon() {
    return this.sortField === 'name'
      ? `utility:${this.sortDirection === 'asc' ? 'arrowup' : 'arrowdown'}`
      : 'utility:arrowup';
  }

  get priceSortIcon() {
    return this.sortField === 'price'
      ? `utility:${this.sortDirection === 'asc' ? 'arrowup' : 'arrowdown'}`
      : 'utility:arrowup';
  }

  // Classes for sort icons
  get productNameSortDirection() {
    return this.sortField === 'name' ? 'slds-is-sorted' : '';
  }

  get priceSortDirection() {
    return this.sortField === 'price' ? 'slds-is-sorted' : '';
  }

  // Computed property to get sorted products with formatted price and status class
  get sortedProducts() {
    // Clone the products array to avoid mutating the original
    const products = [...this.products];

    // Add formatted price and CSS classes for stock status
    const productsWithFormatting = products.map((product) => {
      // Format price with currency
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price);

      // Determine CSS class for stock status
      let stockStatusClass = 'slds-badge';
      if (product.stockStatus === 'In Stock') {
        stockStatusClass = 'slds-badge slds-badge_success';
      } else if (product.stockStatus === 'Low Stock') {
        stockStatusClass = 'slds-badge slds-badge_warning';
      } else if (product.stockStatus === 'Out of Stock') {
        stockStatusClass = 'slds-badge slds-badge_error';
      }

      // Return product with additional formatting
      return { ...product, formattedPrice, stockStatusClass };
    });

    // Sort the products by the selected field
    return productsWithFormatting.sort((a, b) => {
      // Determine comparison values based on field type
      let valueA = a[this.sortField];
      let valueB = b[this.sortField];

      // Handle specific field comparisons
      if (this.sortField === 'price') {
        // Compare numbers directly
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        // For string comparison (name, category, stockStatus)
        valueA = valueA ? valueA.toLowerCase() : '';
        valueB = valueB ? valueB.toLowerCase() : '';

        // String comparison
        if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        return 0; // values are equal
      }
    });
  }

  // Handle sort action when Product Name column header is clicked
  handleSortProductName() {
    this.updateSort('name');
  }

  // Handle sort action when Price column header is clicked
  handleSortPrice() {
    this.updateSort('price');
  }

  // Update sort field and direction
  updateSort(field) {
    // If clicking the same field, toggle direction
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a new field, set as the sort field and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
}