import { LightningElement, api } from 'lwc';
import { QUALITY_GATE_CONFIG, getQualityGate } from 'dashboard/qualityGateConfig';

export default class FilteredGallery extends LightningElement {
  _components = [];
  @api filters = null;

  sortBy = 'date-desc';
  displayComponents = [];

  @api
  get components() {
    return this._components;
  }

  set components(value) {
    this._components = value;
    // Automatically update display when components change
    this.updateDisplayComponents();
  }

  get filteredCount() {
    return this.displayComponents.length;
  }

  get totalCount() {
    return this.components.length;
  }

  get hasComponents() {
    return this.displayComponents.length > 0;
  }

  @api
  applyFilters(filterCriteria) {
    this.filters = filterCriteria;
    this.updateDisplayComponents();
  }

  connectedCallback() {
    this.updateDisplayComponents();
  }

  @api
  updateComponents() {
    this.updateDisplayComponents();
  }

  updateDisplayComponents() {
    let filtered = [...this.components];

    // Apply filters if present
    if (this.filters) {
      filtered = this.filterComponents(filtered);
    }

    // Apply sorting
    filtered = this.sortComponents(filtered);

    // Format for display
    this.displayComponents = filtered.map(comp => this.formatComponent(comp));
  }

  filterComponents(components) {
    return components.filter(comp => {
      const score = comp.scores?.overall || 0;
      const sldsScore = (comp.scores?.slds_linter || 0) * 100;

      // Quick filter using config
      if (this.filters.quickFilter === 'production' && score < 3.0) return false;
      if (this.filters.quickFilter === 'prototype' && (score < 2.0 || score >= 3.0)) return false;
      if (this.filters.quickFilter === 'draft' && score >= 2.0) return false;

      // Score range
      if (score < this.filters.scoreRange.min || score > this.filters.scoreRange.max) return false;

      // SLDS compliance
      if (sldsScore < this.filters.sldsCompliance) return false;

      // Tier filter
      if (this.filters.tiers.length > 0 && !this.filters.tiers.includes(comp.tier)) return false;

      // Complexity filter
      if (this.filters.complexities.length > 0 && !this.filters.complexities.includes(comp.complexity)) return false;

      // Variant filter
      if (this.filters.variants.length > 0 && comp.variant && !this.filters.variants.includes(comp.variant)) return false;

      // Model filter
      if (this.filters.models.length > 0 && comp.model && !this.filters.models.includes(comp.model)) return false;

      // Utterance ID filter
      if (this.filters.utteranceId && comp.utteranceId) {
        const searchTerm = this.filters.utteranceId.toLowerCase();
        const utteranceId = comp.utteranceId.toLowerCase();
        if (!utteranceId.includes(searchTerm)) return false;
      }

      return true;
    });
  }

  sortComponents(components) {
    const sorted = [...components];

    switch (this.sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'score-desc':
        sorted.sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0));
        break;
      case 'score-asc':
        sorted.sort((a, b) => (a.scores?.overall || 0) - (b.scores?.overall || 0));
        break;
      case 'slds-desc':
        sorted.sort((a, b) => (b.scores?.slds_linter || 0) - (a.scores?.slds_linter || 0));
        break;
      case 'violations-asc':
        sorted.sort((a, b) => {
          const aTotal = (a.violations?.warnings || 0) + (a.violations?.errors || 0);
          const bTotal = (b.violations?.warnings || 0) + (b.violations?.errors || 0);
          return aTotal - bTotal;
        });
        break;
      case 'model':
        sorted.sort((a, b) => {
          const modelA = a.model || 'Unknown';
          const modelB = b.model || 'Unknown';
          return modelA.localeCompare(modelB);
        });
        break;
      case 'tier':
        sorted.sort((a, b) => {
          const tierOrder = { 'Tier 1': 1, 'Tier 2': 2, 'Tier 3': 3 };
          return (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999);
        });
        break;
      default:
        break;
    }

    return sorted;
  }

  formatComponent(comp) {
    const score = comp.scores?.overall || 0;
    const sldsScore = Math.round((comp.scores?.slds_linter || 0) * 100);
    const createdDate = new Date(comp.timestamp);

    // Determine quality gate using config
    const qualityGate = getQualityGate(score);
    const qualityGateConfig = QUALITY_GATE_CONFIG[qualityGate];
    const qualityGateLabel = qualityGateConfig.label;

    return {
      ...comp,
      displayName: this.formatDisplayName(comp.componentName),
      formattedScore: score.toFixed(2),
      formattedSldsScore: `${sldsScore}%`,
      formattedDate: this.formatDate(createdDate),
      qualityGate,
      qualityGateLabel,
      qualityGateBadgeClass: `quality-gate-badge ${qualityGateConfig.badgeClass}`,
      hasMetadataBadges: !!comp.utteranceId || !!comp.variant || !!comp.model,
      screenshotUrls: comp.screenshotUrls || {}
    };
  }

  formatDisplayName(componentName) {
    return componentName
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  handleSortChange(event) {
    this.sortBy = event.target.value;
    this.updateDisplayComponents();
  }

  handleComponentSelect(event) {
    const componentName = event.currentTarget.dataset.name;
    this.dispatchEvent(new CustomEvent('componentselect', {
      detail: { componentName }
    }));
  }
}
