import { LightningElement } from 'lwc';

export default class DashboardApp extends LightningElement {
  components = [];
  allComponents = []; // Store all components for search
  currentFilters = null;
  isLoading = true;
  error = null;
  searchTerm = '';

  connectedCallback() {
    this.loadComponents();
  }

  async loadComponents() {
    try {
      this.isLoading = true;
      this.error = null;

      const response = await fetch('/generated/components.json');
      if (!response.ok) {
        throw new Error(`Failed to load components: ${response.statusText}`);
      }

      const data = await response.json();
      this.allComponents = data.components || [];
      this.components = this.allComponents;

      // Notify child components
      this.notifyFiltersComponent();
    } catch (err) {
      console.error('Error loading components:', err);
      this.error = err.message;
    } finally {
      this.isLoading = false;
    }
  }

  notifyFiltersComponent() {
    // Give the filters component time to render
    setTimeout(() => {
      const filtersComponent = this.template.querySelector('dashboard-filters');
      if (filtersComponent) {
        filtersComponent.componentsUpdated();
      }
    }, 100);
  }

  handleFilterChange(event) {
    this.currentFilters = event.detail;

    // Apply filters to gallery (setTimeout ensures component is rendered)
    setTimeout(() => {
      const galleryComponent = this.template.querySelector('dashboard-filtered-gallery');
      if (galleryComponent) {
        galleryComponent.applyFilters(this.currentFilters);
      }
    }, 0);
  }

  handleFilterByQuality(event) {
    const { qualityGate } = event.detail;

    // Map quality gate to quick filter
    let quickFilter = 'all';
    if (qualityGate === 'production') {
      quickFilter = 'production';
    } else if (qualityGate === 'needs-work') {
      quickFilter = 'needs-work';
    } else if (qualityGate === 'failed') {
      quickFilter = 'failed';
    }

    // Create filter criteria
    const filterCriteria = {
      quickFilter,
      scoreRange: { min: 0, max: 3 },
      sldsCompliance: 0,
      tiers: ['Tier 1', 'Tier 2', 'Tier 3'],
      complexities: ['Simple', 'Intermediate', 'Advanced'],
      variants: ['Simple', 'Moderate', 'Complex'],
      models: [...new Set(this.components.map(c => c.model).filter(m => m))],
      utteranceId: ''
    };

    this.currentFilters = filterCriteria;

    // Apply to gallery (setTimeout ensures component is rendered)
    setTimeout(() => {
      const galleryComponent = this.template.querySelector('dashboard-filtered-gallery');
      if (galleryComponent) {
        galleryComponent.applyFilters(this.currentFilters);
      }

      // Scroll to gallery
      const mainLayout = this.template.querySelector('.main-layout');
      if (mainLayout) {
        mainLayout.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  handleComponentSelect(event) {
    const { componentName } = event.detail;
    // Navigate to component detail view
    window.location.href = `/?detail=${componentName}`;
  }

  handleSearch(event) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applySearch();
  }

  applySearch() {
    if (!this.searchTerm) {
      this.components = [...this.allComponents];
    } else {
      this.components = this.allComponents.filter(comp => {
        const componentName = (comp.componentName || '').toLowerCase();
        const utteranceId = (comp.utteranceId || '').toLowerCase();
        const tier = (comp.tier || '').toLowerCase();
        const complexity = (comp.complexity || '').toLowerCase();
        const variant = (comp.variant || '').toLowerCase();
        const model = (comp.model || '').toLowerCase();
        const utterance = (comp.utterance || '').toLowerCase();

        return componentName.includes(this.searchTerm) ||
               utteranceId.includes(this.searchTerm) ||
               tier.includes(this.searchTerm) ||
               complexity.includes(this.searchTerm) ||
               variant.includes(this.searchTerm) ||
               model.includes(this.searchTerm) ||
               utterance.includes(this.searchTerm);
      });
    }

    // Force update of child components
    this.notifyChildComponents();
  }

  notifyChildComponents() {
    // Notify filters component
    this.notifyFiltersComponent();

    // Notify gallery component to update
    setTimeout(() => {
      const galleryComponent = this.template.querySelector('dashboard-filtered-gallery');
      if (galleryComponent) {
        galleryComponent.updateComponents();
      }
    }, 0);
  }
}
