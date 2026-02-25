import { LightningElement, track, api } from 'lwc';

export default class CreateSortableTableProduct extends LightningElement {
  // Sample product data - can be replaced with actual data from an API or provided via properties
  @api
  get products() {
    return this._products || this.defaultProducts;
  }
  set products(value) {
    this._products = value;
  }

  // Default products to show if none are provided
  get defaultProducts() {
    return [
      { id: '1', productName: 'Laptop Pro', price: 1200.0, category: 'Electronics', stockStatus: 'In Stock' },
      { id: '2', productName: 'Office Chair', price: 199.99, category: 'Furniture', stockStatus: 'Low Stock' },
      { id: '3', productName: 'Wireless Mouse', price: 29.99, category: 'Accessories', stockStatus: 'In Stock' },
      { id: '4', productName: 'Standing Desk', price: 349.95, category: 'Furniture', stockStatus: 'Out of Stock' },
      { id: '5', productName: 'Monitor 4K', price: 299.99, category: 'Electronics', stockStatus: 'In Stock' },
      { id: '6', productName: 'Keyboard', price: 59.99, category: 'Accessories', stockStatus: 'In Stock' },
      { id: '7', productName: 'Headphones', price: 149.99, category: 'Audio', stockStatus: 'Low Stock' },
      { id: '8', productName: 'Desk Lamp', price: 39.95, category: 'Lighting', stockStatus: 'In Stock' },
    ];
  }

  // Sorting properties
  @track sortField = 'productName';
  @track sortDirection = 'asc';

  // Computed property to determine if there are products
  get hasProducts() {
    return this.products && this.products.length > 0;
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
      let stockStatusClass = 'slds-text-color_default';
      if (product.stockStatus === 'In Stock') {
        stockStatusClass = 'slds-text-color_success';
      } else if (product.stockStatus === 'Low Stock') {
        stockStatusClass = 'slds-text-color_warning';
      } else if (product.stockStatus === 'Out of Stock') {
        stockStatusClass = 'slds-text-color_error';
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
        // For string comparison (productName, category, stockStatus)
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

  // Handle sort action when column header is clicked
  handleSort(event) {
    // Get the field name from the clicked column
    const field = event.currentTarget.dataset.field || event.target.dataset.field;

    // If clicking the same field, toggle direction
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a new field, set as the sort field and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    // Update aria-sort attribute for accessibility
    this.updateAriaSort();
  }

  // Update aria-sort attributes for accessibility
  updateAriaSort() {
    // Get all sortable columns
    const tableHeaders = this.template.querySelectorAll('th[aria-sort]');

    // Reset all headers to "none"
    tableHeaders.forEach((header) => {
      const headerField = header.dataset.field;
      if (headerField === this.sortField) {
        // Set the active sort direction
        header.setAttribute('aria-sort', this.sortDirection === 'asc' ? 'ascending' : 'descending');

        // Update sort icon
        const icon = header.querySelector('lightning-icon');
        if (icon) {
          icon.iconName = this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
        }
      } else {
        // Reset other headers
        header.setAttribute('aria-sort', 'none');

        // Reset sort icon
        const icon = header.querySelector('lightning-icon');
        if (icon) {
          icon.iconName = 'utility:arrowup';
        }
      }
    });
  }

  // Initialize the component
  connectedCallback() {
    // Set initial sort when component is connected
    this.updateAriaSort();
  }

  // Re-render optimization
  renderedCallback() {
    // Ensure proper aria-sort attributes after render
    this.updateAriaSort();
  }
}
