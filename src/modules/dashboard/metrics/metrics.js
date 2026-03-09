import { LightningElement, api } from 'lwc';
import { QUALITY_GATE_CONFIG, getQualityGateDescription } from 'dashboard/qualityGateConfig';

export default class DashboardMetrics extends LightningElement {
  @api components = [];

  // Quality gate labels from config
  get productionLabel() {
    return QUALITY_GATE_CONFIG.production.label;
  }

  get productionCriteria() {
    return getQualityGateDescription('production');
  }

  get productionIcon() {
    return `utility:${QUALITY_GATE_CONFIG.production.icon}`;
  }

  get prototypeLabel() {
    return QUALITY_GATE_CONFIG.prototype.label;
  }

  get prototypeCriteria() {
    return getQualityGateDescription('prototype');
  }

  get prototypeIcon() {
    return `utility:${QUALITY_GATE_CONFIG.prototype.icon}`;
  }

  get draftLabel() {
    return QUALITY_GATE_CONFIG.draft.label;
  }

  get draftCriteria() {
    return getQualityGateDescription('draft');
  }

  get draftIcon() {
    return `utility:${QUALITY_GATE_CONFIG.draft.icon}`;
  }

  get totalComponents() {
    return this.components.length;
  }

  get productionReadyCount() {
    const minScore = QUALITY_GATE_CONFIG.production.minScore;
    return this.components.filter(c => c.scores?.overall >= minScore).length;
  }

  get productionReadyPercent() {
    return this.totalComponents > 0
      ? Math.round((this.productionReadyCount / this.totalComponents) * 100)
      : 0;
  }

  get prototypeCount() {
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 3.0;
    }).length;
  }

  get prototypePercent() {
    return this.totalComponents > 0
      ? Math.round((this.prototypeCount / this.totalComponents) * 100)
      : 0;
  }

  get draftCount() {
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score < 2.0;
    }).length;
  }

  get draftPercent() {
    return this.totalComponents > 0
      ? Math.round((this.draftCount / this.totalComponents) * 100)
      : 0;
  }

  get averageScore() {
    if (this.totalComponents === 0) return '0.00';
    const sum = this.components.reduce((acc, c) => acc + (c.scores?.overall || 0), 0);
    return (sum / this.totalComponents).toFixed(2);
  }

  get sldsCompliance() {
    if (this.totalComponents === 0) return '0';
    const sum = this.components.reduce((acc, c) => acc + ((c.scores?.slds_linter || 0) * 100), 0);
    return Math.round(sum / this.totalComponents);
  }

  get avgViolations() {
    if (this.totalComponents === 0) return '0';
    const sum = this.components.reduce((acc, c) => {
      const warnings = c.violations?.warnings || 0;
      const errors = c.violations?.errors || 0;
      return acc + warnings + errors;
    }, 0);
    return Math.round(sum / this.totalComponents);
  }

  filterProduction() {
    this.dispatchEvent(new CustomEvent('filterbyquality', {
      detail: { qualityGate: 'production' }
    }));
  }

  filterPrototype() {
    this.dispatchEvent(new CustomEvent('filterbyquality', {
      detail: { qualityGate: 'prototype' }
    }));
  }

  filterDraft() {
    this.dispatchEvent(new CustomEvent('filterbyquality', {
      detail: { qualityGate: 'draft' }
    }));
  }
}
