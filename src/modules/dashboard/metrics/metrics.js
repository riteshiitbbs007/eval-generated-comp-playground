import { LightningElement, api } from 'lwc';

export default class DashboardMetrics extends LightningElement {
  @api components = [];

  get totalComponents() {
    return this.components.length;
  }

  get productionReadyCount() {
    return this.components.filter(c => c.scores?.overall >= 2.5).length;
  }

  get productionReadyPercent() {
    return this.totalComponents > 0
      ? Math.round((this.productionReadyCount / this.totalComponents) * 100)
      : 0;
  }

  get needsWorkCount() {
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 2.5;
    }).length;
  }

  get needsWorkPercent() {
    return this.totalComponents > 0
      ? Math.round((this.needsWorkCount / this.totalComponents) * 100)
      : 0;
  }

  get failedCount() {
    return this.components.filter(c => (c.scores?.overall || 0) < 2.0).length;
  }

  get failedPercent() {
    return this.totalComponents > 0
      ? Math.round((this.failedCount / this.totalComponents) * 100)
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

  filterNeedsWork() {
    this.dispatchEvent(new CustomEvent('filterbyquality', {
      detail: { qualityGate: 'needs-work' }
    }));
  }

  filterFailed() {
    this.dispatchEvent(new CustomEvent('filterbyquality', {
      detail: { qualityGate: 'failed' }
    }));
  }
}
