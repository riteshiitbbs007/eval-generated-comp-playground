import { LightningElement, api } from 'lwc';
import { QUALITY_GATE_CONFIG } from 'dashboard/qualityGateConfig';

export default class DashboardFilters extends LightningElement {
  @api components = [];

  // Filter state - using config for defaults
  activeQuickFilter = 'all';
  minScore = 0;
  maxScore = QUALITY_GATE_CONFIG.production.maxScore;
  minSldsCompliance = 0;
  utteranceIdFilter = '';
  baselineOnly = false;

  selectedVariants = new Set(['Simple', 'Moderate', 'Detailed']);
  selectedModels = new Set();

  connectedCallback() {
    // Initialize model set from components
    this.updateModelOptions();
  }

  @api
  componentsUpdated() {
    this.updateModelOptions();
  }

  updateModelOptions() {
    const models = new Set(this.components.map(c => c.model).filter(m => m));
    this.selectedModels = models;
  }

  // Computed properties for counts
  get totalCount() {
    return this.components.length;
  }

  get productionCount() {
    const minScore = QUALITY_GATE_CONFIG.production.minScore;
    return this.components.filter(c => c.scores?.overall >= minScore).length;
  }

  get prototypeCount() {
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 3.0;
    }).length;
  }

  get draftCount() {
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score < 2.0;
    }).length;
  }

  get baselineCount() {
    return this.components.filter(c => c.baseline_slds === true).length;
  }

  // Button classes
  get allButtonClass() {
    return this.activeQuickFilter === 'all'
      ? 'filter-button filter-button-active'
      : 'filter-button';
  }

  get productionButtonClass() {
    return this.activeQuickFilter === 'production'
      ? 'filter-button filter-button-active filter-button-success'
      : 'filter-button';
  }

  get prototypeButtonClass() {
    return this.activeQuickFilter === 'prototype'
      ? 'filter-button filter-button-active filter-button-info'
      : 'filter-button';
  }

  get draftButtonClass() {
    return this.activeQuickFilter === 'draft'
      ? 'filter-button filter-button-active filter-button-warning'
      : 'filter-button';
  }

  // Options for checkboxes
  get variantOptions() {
    return [
      { id: 'variant-simple', value: 'Simple', label: 'Simple', checked: this.selectedVariants.has('Simple') },
      { id: 'variant-moderate', value: 'Moderate', label: 'Moderate', checked: this.selectedVariants.has('Moderate') },
      { id: 'variant-detailed', value: 'Detailed', label: 'Detailed', checked: this.selectedVariants.has('Detailed') }
    ];
  }

  get modelOptions() {
    const uniqueModels = [...new Set(this.components.map(c => c.model).filter(m => m))].sort();
    return uniqueModels.map(model => ({
      id: `model-${model.replace(/[^a-z0-9]/gi, '-')}`,
      value: model,
      label: model,
      checked: this.selectedModels.has(model)
    }));
  }

  // Event handlers
  handleShowAll() {
    this.activeQuickFilter = 'all';
    this.emitFilterChange();
  }

  handleShowProduction() {
    this.activeQuickFilter = 'production';
    this.emitFilterChange();
  }

  handleShowPrototype() {
    this.activeQuickFilter = 'prototype';
    this.emitFilterChange();
  }

  handleShowDraft() {
    this.activeQuickFilter = 'draft';
    this.emitFilterChange();
  }

  handleMinScoreChange(event) {
    this.minScore = parseFloat(event.target.value);
    this.emitFilterChange();
  }

  handleMaxScoreChange(event) {
    this.maxScore = parseFloat(event.target.value);
    this.emitFilterChange();
  }

  handleMinSldsChange(event) {
    this.minSldsCompliance = parseInt(event.target.value, 10);
    this.emitFilterChange();
  }

  handleVariantChange(event) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedVariants.add(value);
    } else {
      this.selectedVariants.delete(value);
    }
    this.emitFilterChange();
  }

  handleModelChange(event) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedModels.add(value);
    } else {
      this.selectedModels.delete(value);
    }
    this.emitFilterChange();
  }

  handleUtteranceIdChange(event) {
    this.utteranceIdFilter = event.target.value;
    this.emitFilterChange();
  }

  handleBaselineChange(event) {
    this.baselineOnly = event.target.checked;
    this.emitFilterChange();
  }

  handleReset() {
    this.activeQuickFilter = 'all';
    this.minScore = 0;
    this.maxScore = QUALITY_GATE_CONFIG.production.maxScore;
    this.minSldsCompliance = 0;
    this.utteranceIdFilter = '';
    this.baselineOnly = false;
    this.selectedVariants = new Set(['Simple', 'Moderate', 'Detailed']);
    this.updateModelOptions();
    this.emitFilterChange();
  }

  emitFilterChange() {
    this.dispatchEvent(new CustomEvent('filterchange', {
      detail: {
        quickFilter: this.activeQuickFilter,
        scoreRange: { min: this.minScore, max: this.maxScore },
        sldsCompliance: this.minSldsCompliance,
        tiers: [], // Empty - tier filter removed
        complexities: [], // Empty - complexity filter removed
        variants: Array.from(this.selectedVariants),
        models: Array.from(this.selectedModels),
        utteranceId: this.utteranceIdFilter,
        baselineOnly: this.baselineOnly
      }
    }));
  }
}
