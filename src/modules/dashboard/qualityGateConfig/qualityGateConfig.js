/**
 * Quality Gate Configuration
 *
 * Configure the score thresholds and labels for component quality classification.
 * This configuration is used across the dashboard to determine quality gates.
 *
 * Adjust these values to match your quality standards:
 * - production: Components ready for production use
 * - needsWork: Components that need improvements
 * - failed: Components that don't meet minimum standards
 */

export const QUALITY_GATE_CONFIG = {
  production: {
    label: 'Production Ready',
    minScore: 2.5,
    maxScore: 3.0,
    color: '#4bca81', // Success green
    badgeClass: 'quality-gate-production',
    icon: 'success'
  },
  needsWork: {
    label: 'Needs Work',
    minScore: 2.0,
    maxScore: 2.5,
    color: '#fe9339', // Warning orange
    badgeClass: 'quality-gate-needs-work',
    icon: 'warning'
  },
  failed: {
    label: 'Failed',
    minScore: 0,
    maxScore: 2.0,
    color: '#ea001e', // Error red
    badgeClass: 'quality-gate-failed',
    icon: 'error'
  }
};

/**
 * Determine quality gate for a given score
 * @param {number} score - The overall component score
 * @returns {string} - Quality gate key ('production', 'needsWork', or 'failed')
 */
export function getQualityGate(score) {
  if (score >= QUALITY_GATE_CONFIG.production.minScore) {
    return 'production';
  } else if (score >= QUALITY_GATE_CONFIG.needsWork.minScore) {
    return 'needsWork';
  } else {
    return 'failed';
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
  } else if (gate === 'needsWork') {
    return `Score ${config.minScore}-${config.maxScore}`;
  } else {
    return `Score < ${config.maxScore}`;
  }
}
