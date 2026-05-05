# Baseline SLDS Label Feature

## Overview

Components with `baseline_slds: true` in their metadata will display a special "Baseline SLDS" badge on their cards in both the dashboard and gallery views.

## Usage

To mark a component as using baseline SLDS, add the `baseline_slds` field to its metadata.json file:

```json
{
  "componentName": "verticalNavMenuWith5Items887d3dcb",
  "timestamp": "2026-03-11T10:43:57.489Z",
  "scores": {
    "overall": 2.82,
    "overall_readiness_label": "Prototype"
  },
  "baseline_slds": true
}
```

## Visual Appearance

The baseline SLDS badge appears as a purple/blue badge in the top-right corner of component cards:
- **Position**: Top-right corner of the card (below the quality gate badge if present in dashboard view)
- **Color**: Purple/blue (#7f8de1)
- **Label**: "BASELINE SLDS" (uppercase)

## Implementation Details

### Files Modified

1. **Dashboard View:**
   - `src/modules/dashboard/filteredGallery/filteredGallery.js` - Added baseline_slds detection
   - `src/modules/dashboard/filteredGallery/filteredGallery.html` - Added badge display
   - `src/modules/dashboard/filteredGallery/filteredGallery.css` - Added badge styling

2. **Gallery View:**
   - `src/modules/main/gallery/gallery.js` - Added baseline_slds detection
   - `src/modules/main/gallery/gallery.html` - Added badge display
   - `src/modules/main/gallery/gallery.css` - Added badge styling

### Build Script Safety

All build scripts preserve the `baseline_slds` field:

- **`generate-app-templates.js`**: Only reads metadata, doesn't modify it
- **`fix-missing-screenshot-urls.cjs`**: Reads metadata, adds screenshotUrls if missing, writes back the entire metadata object (preserves all existing fields)
- **`generate-trends-snapshot.cjs`**: Only writes to trends.json, doesn't touch component metadata

The `baseline_slds` field is safe from being overwritten by any build process.

## Testing

To test this feature:

1. Add `"baseline_slds": true` to any component's metadata.json file
2. Run `npm run generate:templates` to rebuild the component manifest
3. Refresh the dashboard or gallery view
4. The component should now display the "BASELINE SLDS" badge

## Example

```json
{
  "folderName": "verticalNavMenuWith5Items-C11-Simple-20260311",
  "componentName": "verticalNavMenuWith5Items887d3dcb",
  "csvId": "C11",
  "variant": "Simple",
  "timestamp": "2026-03-11T10:43:57.489Z",
  "utterance": "Create vertical nav menu with 5 items, Dashboard active",
  "tier": "Tier 2",
  "complexity": "Intermediate",
  "scores": {
    "slds_linter": 0.76,
    "slds_quality": 1,
    "prd_compliance": 1,
    "security": 1,
    "overall": 2.82,
    "overall_readiness_label": "Prototype"
  },
  "violations": {
    "errors": 0,
    "warnings": 4,
    "notes": 0
  },
  "baseline_slds": true
}
```

## CSS Classes

The baseline SLDS badge uses the following CSS class:

```css
.baseline-slds-badge {
  position: absolute;
  top: 0.75rem;      /* Top-right in gallery view */
  top: 2.75rem;      /* Below quality gate in dashboard view */
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background: #7f8de1;
  color: white;
}
```
