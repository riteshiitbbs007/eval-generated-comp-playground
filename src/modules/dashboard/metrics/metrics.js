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

  get needsWorkLabel() {
    return QUALITY_GATE_CONFIG.needsWork.label;
  }

  get needsWorkCriteria() {
    return getQualityGateDescription('needsWork');
  }

  get needsWorkIcon() {
    return `utility:${QUALITY_GATE_CONFIG.needsWork.icon}`;
  }

  get failedLabel() {
    return QUALITY_GATE_CONFIG.failed.label;
  }

  get failedCriteria() {
    return getQualityGateDescription('failed');
  }

  get failedIcon() {
    return `utility:${QUALITY_GATE_CONFIG.failed.icon}`;
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

  get needsWorkCount() {
    const minScore = QUALITY_GATE_CONFIG.needsWork.minScore;
    const maxScore = QUALITY_GATE_CONFIG.needsWork.maxScore;
    return this.components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= minScore && score < maxScore;
    }).length;
  }

  get needsWorkPercent() {
    return this.totalComponents > 0
      ? Math.round((this.needsWorkCount / this.totalComponents) * 100)
      : 0;
  }

  get failedCount() {
    const maxScore = QUALITY_GATE_CONFIG.failed.maxScore;
    return this.components.filter(c => (c.scores?.overall || 0) < maxScore).length;
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
