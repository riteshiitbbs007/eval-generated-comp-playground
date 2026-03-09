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

  selectedTiers = new Set(['Tier 1', 'Tier 2', 'Tier 3']);
  selectedComplexities = new Set(['Simple', 'Intermediate', 'Advanced']);
  selectedVariants = new Set(['Simple', 'Moderate', 'Complex']);
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

  get needsWorkCount() {
    const minScore = QUALITY_GATE_CONFIG.needsWork.minScore;
    const maxScore = QUALITY_GATE_CONFIG.needsWork.maxScore;
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= minScore && score < maxScore;
    }).length;
  }

  get failedCount() {
    const maxScore = QUALITY_GATE_CONFIG.failed.maxScore;
    return this.components.filter(c => (c.scores?.overall || 0) < maxScore).length;
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

  get needsWorkButtonClass() {
    return this.activeQuickFilter === 'needs-work'
      ? 'filter-button filter-button-active filter-button-warning'
      : 'filter-button';
  }

  get failedButtonClass() {
    return this.activeQuickFilter === 'failed'
      ? 'filter-button filter-button-active filter-button-error'
      : 'filter-button';
  }

  // Options for checkboxes
  get tierOptions() {
    return [
      { id: 'tier-1', value: 'Tier 1', label: 'Tier 1', checked: this.selectedTiers.has('Tier 1') },
      { id: 'tier-2', value: 'Tier 2', label: 'Tier 2', checked: this.selectedTiers.has('Tier 2') },
      { id: 'tier-3', value: 'Tier 3', label: 'Tier 3', checked: this.selectedTiers.has('Tier 3') }
    ];
  }

  get complexityOptions() {
    return [
      { id: 'complexity-simple', value: 'Simple', label: 'Simple', checked: this.selectedComplexities.has('Simple') },
      { id: 'complexity-intermediate', value: 'Intermediate', label: 'Intermediate', checked: this.selectedComplexities.has('Intermediate') },
      { id: 'complexity-advanced', value: 'Advanced', label: 'Advanced', checked: this.selectedComplexities.has('Advanced') }
    ];
  }

  get variantOptions() {
    return [
      { id: 'variant-simple', value: 'Simple', label: 'Simple', checked: this.selectedVariants.has('Simple') },
      { id: 'variant-moderate', value: 'Moderate', label: 'Moderate', checked: this.selectedVariants.has('Moderate') },
      { id: 'variant-complex', value: 'Complex', label: 'Complex', checked: this.selectedVariants.has('Complex') }
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

  handleShowNeedsWork() {
    this.activeQuickFilter = 'needs-work';
    this.emitFilterChange();
  }

  handleShowFailed() {
    this.activeQuickFilter = 'failed';
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

  handleTierChange(event) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedTiers.add(value);
    } else {
      this.selectedTiers.delete(value);
    }
    this.emitFilterChange();
  }

  handleComplexityChange(event) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedComplexities.add(value);
    } else {
      this.selectedComplexities.delete(value);
    }
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

  handleReset() {
    this.activeQuickFilter = 'all';
    this.minScore = 0;
    this.maxScore = QUALITY_GATE_CONFIG.production.maxScore;
    this.minSldsCompliance = 0;
    this.utteranceIdFilter = '';
    this.selectedTiers = new Set(['Tier 1', 'Tier 2', 'Tier 3']);
    this.selectedComplexities = new Set(['Simple', 'Intermediate', 'Advanced']);
    this.selectedVariants = new Set(['Simple', 'Moderate', 'Complex']);
    this.updateModelOptions();
    this.emitFilterChange();
  }

  emitFilterChange() {
    this.dispatchEvent(new CustomEvent('filterchange', {
      detail: {
        quickFilter: this.activeQuickFilter,
        scoreRange: { min: this.minScore, max: this.maxScore },
        sldsCompliance: this.minSldsCompliance,
        tiers: Array.from(this.selectedTiers),
        complexities: Array.from(this.selectedComplexities),
        variants: Array.from(this.selectedVariants),
        models: Array.from(this.selectedModels),
        utteranceId: this.utteranceIdFilter
      }
    }));
  }
}
