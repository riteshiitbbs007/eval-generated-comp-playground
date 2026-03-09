# Quality Gate Configuration

This module contains the centralized configuration for component quality gates used throughout the dashboard.

## Configuration

Edit `qualityGateConfig.js` to modify the score thresholds and labels for quality classification.

### Current Settings

```javascript
production: {
  label: 'Production Ready',
  minScore: 2.5,
  maxScore: 3.0,
  color: '#4bca81',
  icon: 'success'
}

needsWork: {
  label: 'Needs Work',
  minScore: 2.0,
  maxScore: 2.5,
  color: '#fe9339',
  icon: 'warning'
}

failed: {
  label: 'Failed',
  minScore: 0,
  maxScore: 2.0,
  color: '#ea001e',
  icon: 'error'
}
```

## Usage

Import the configuration in any dashboard component:

```javascript
import { QUALITY_GATE_CONFIG, getQualityGate, getQualityGateConfig } from 'dashboard/qualityGateConfig';

// Get quality gate for a score
const gate = getQualityGate(2.8); // returns 'production'

// Get full configuration for a score
const config = getQualityGateConfig(2.8); // returns production config object

// Access specific threshold
const minProductionScore = QUALITY_GATE_CONFIG.production.minScore; // 2.5
```

## Components Using This Config

- `dashboard/metrics` - Quality gate cards and counts
- `dashboard/filters` - Filter logic for quality gates
- `dashboard/filteredGallery` - Component classification and display
- `dashboard/app` - Filter criteria defaults

## Customization

To adjust quality standards for your organization:

1. Open `qualityGateConfig.js`
2. Modify the `minScore` and `maxScore` values
3. Optionally update labels, colors, and icons
4. Run `npm run build` to apply changes

Example - stricter production standards:

```javascript
production: {
  label: 'Production Ready',
  minScore: 2.8,  // Raised from 2.5
  maxScore: 3.0,
  // ...
}
```

This change will automatically update:
- Metric cards showing counts
- Filter logic
- Component quality badges
- Quick filter behavior
