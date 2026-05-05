/**
 * Quality Gate Configuration
 *
 * Configure the score thresholds and labels for component quality classification.
 * This configuration is used across the dashboard to determine quality gates.
 *
 * Quality Gates:
 * - production: score ≥ 3.0 → "Production-Ready"
 * - prototype: score ≥ 2.0 and < 3.0 → "Prototype"
 * - draft: score ≥ 0 and < 2.0 → "Draft"
 */

export const QUALITY_GATE_CONFIG = {
  production: {
    label: 'Production-Ready',
    minScore: 3.0,
    maxScore: 3.0,
    color: '#4bca81', // Success green
    badgeClass: 'quality-gate-production',
    icon: 'success'
  },
  prototype: {
    label: 'Prototype',
    minScore: 2.0,
    maxScore: 3.0,
    color: '#0176d3', // Blue
    badgeClass: 'quality-gate-prototype',
    icon: 'custom_custom95' // flask icon
  },
  draft: {
    label: 'Draft',
    minScore: 0,
    maxScore: 2.0,
    color: '#fe9339', // Warning orange
    badgeClass: 'quality-gate-draft',
    icon: 'edit'
  }
};

/**
 * Determine quality gate for a given score
 * @param {number} score - The overall component score
 * @returns {string} - Quality gate key ('production', 'prototype', or 'draft')
 */
export function getQualityGate(score) {
  if (score >= 3.0) {
    return 'production';
  } else if (score >= 2.0) {
    return 'prototype';
  } else {
    return 'draft';
  }
}

/**
 * Get quality gate configuration for a given score
 * @param {number} score - The overall component score
 * @returns {object} - Quality gate configuration object
 */
export function getQualityGateConfig(score) {
  const gate = getQualityGate(score);
  return QUALITY_GATE_CONFIG[gate];
}

/**
 * Get description text for a quality gate
 * @param {string} gate - Quality gate key
 * @returns {string} - Description text
 */
export function getQualityGateDescription(gate) {
  const config = QUALITY_GATE_CONFIG[gate];
  if (!config) return '';

  if (gate === 'production') {
    return `Score ≥ ${config.minScore}`;
  } else if (gate === 'prototype') {
    return `Score 2.0-3.0`;
  } else if (gate === 'draft') {
    return `Score < 2.0`;
  }
  return '';
}
