# Trends Strict Mode Filtering Fix

**Date:** 2026-04-29
**Issue:** Skills filter incorrectly showed legacy/pre-mode component data
**Status:** ✅ Fixed

## Problem Description

### User Report

User selected "C08:Simple [Skills]" which was only generated on Apr 28, 2026 with Skills mode enabled. The chart showed a trend line going back to March 30, 2026 - pulling data from C08:Simple components that were NOT generated with Skills mode.

### Root Cause Analysis

**The Bug:**
The `getExecutionMode()` method had an overly permissive default case:

```javascript
// OLD CODE (WRONG)
getExecutionMode(component) {
  // ... check for explicit modes ...
  
  // Default: if not baseline, treat as skills (non-baseline components)
  return 'skills'; // ❌ This was the problem!
}
```

**What This Caused:**
- ALL non-baseline components were classified as 'skills'
- Components from Feb-Mar 2026 (before Skills mode existed) were incorrectly grouped as 'skills'
- When filtering to "Skills Only", the chart included historical data from legacy components
- Result: Trend lines extended far beyond when the component was actually generated with Skills mode

**Example:**
```
Component: C08:Simple
- March 30: generated WITHOUT Skills mode (baseline_slds: false only)
- March 31: generated WITHOUT Skills mode
- ...
- April 28: generated WITH Skills mode (testMode: 'skills')

User selects "C08:Simple [Skills]" and clicks "Skills Only" filter

Expected: Chart shows ONLY April 28 data point
Actual (WRONG): Chart showed ALL dates from March 30 onward
```

### Why This Happened

**Historical Context:**
1. **Feb-Mar 2026:** Components generated with basic metadata (only `baseline_slds: true/false`)
2. **April 28, 2026:** Skills mode introduced with explicit metadata (`testMode: 'skills'`, `skillsModeEnabled: true`)
3. **Current State:** Trends.json has mixed data - some components have explicit mode metadata, others don't

**The Classification Problem:**
The code needed to handle two different use cases:

1. **UI Organization:** Where should components appear in the selector?
   - Baseline components → Baseline section
   - Non-baseline components → Skills section (reasonable default)

2. **Chart Filtering:** Which data points match a mode filter?
   - Baseline filter → ONLY components with explicit baseline metadata
   - Skills filter → ONLY components with explicit skills metadata
   - Legacy components → Should NOT match either filter (no explicit mode)

The old code conflated these two concerns by using the same `getExecutionMode()` method for both purposes.

## Solution Implemented

### Approach: Separate UI Organization from Strict Filtering

**Key Insight:**
We need **lenient classification** for UI (where to show the component) but **strict matching** for filtering (which data to include in charts).

### Code Changes

#### 1. Enhanced Mode Detection Methods

**Updated `getExecutionMode()` - UI Organization (Lenient):**
```javascript
getExecutionMode(component) {
  // Baseline mode (explicit)
  if (component.testMode === 'baseline') return 'baseline';
  if (component.baseline_slds === true) return 'baseline';

  // Skills mode (explicit)
  if (component.testMode === 'skills') return 'skills';
  if (component.executionMode === 'skills') return 'skills';
  if (component.skillsModeEnabled === true) return 'skills';

  // MCP mode (treat as skills for UI)
  if (component.testMode === 'mcp') return 'skills';
  if (component.executionMode === 'mcp') return 'skills';

  // Default: Group with skills in UI
  // Note: This is for UI organization only
  return 'skills';
}
```

**Added `hasExplicitSkillsMode()` - Strict Filtering:**
```javascript
hasExplicitSkillsMode(component) {
  return (
    component.testMode === 'skills' ||
    component.executionMode === 'skills' ||
    component.skillsModeEnabled === true ||
    component.testMode === 'mcp' ||
    component.executionMode === 'mcp'
  );
}
```

**Added `hasExplicitBaselineMode()` - Strict Filtering:**
```javascript
hasExplicitBaselineMode(component) {
  return (
    component.testMode === 'baseline' ||
    component.baseline_slds === true
  );
}
```

#### 2. Updated Chart Data Generation with Strict Filtering

**Location:** `getComponentChartData()` method

**Before (WRONG):**
```javascript
const matchingComponents = snapshot.components.filter(c => {
  const compMode = this.getExecutionMode(c);
  return compMode === mode &&
         c.utteranceId === utteranceId &&
         c.variant === variant;
});
```

**After (CORRECT):**
```javascript
const matchingComponents = snapshot.components.filter(c => {
  if (c.utteranceId !== utteranceId || c.variant !== variant) {
    return false;
  }

  // Strict mode matching - require explicit metadata
  if (mode === 'baseline') {
    return this.hasExplicitBaselineMode(c);
  } else if (mode === 'skills') {
    return this.hasExplicitSkillsMode(c);
  }

  return false;
});
```

### How It Works Now

#### UI Organization (Lenient)

**Component appears in:**
- Baseline section IF: `testMode === 'baseline'` OR `baseline_slds === true`
- Skills section IF: Any explicit skills metadata OR default (non-baseline)

**This means:**
- Legacy C08:Simple (baseline_slds: false) → Shows in Skills section ✅
- New C08:Simple (testMode: 'skills') → Shows in Skills section ✅
- Both appear in the same utterance group ✅

#### Chart Filtering (Strict)

**"Baseline Only" filter includes data points where:**
- `testMode === 'baseline'` OR
- `baseline_slds === true`

**"Skills Only" filter includes data points where:**
- `testMode === 'skills'` OR
- `executionMode === 'skills'` OR
- `skillsModeEnabled === true` OR
- `testMode === 'mcp'` OR
- `executionMode === 'mcp'`

**Legacy components (baseline_slds: false, no other mode fields):**
- ❌ NOT included in "Baseline Only" filter
- ❌ NOT included in "Skills Only" filter
- ✅ Only included in "All Modes" view

## Example Scenario

### Data in trends.json:

```javascript
{
  snapshots: [
    {
      date: "2026-03-30",
      components: [
        {
          utteranceId: "C08",
          variant: "Simple",
          baseline_slds: false,
          // No testMode, executionMode, or skillsModeEnabled
        }
      ]
    },
    {
      date: "2026-04-28",
      components: [
        {
          utteranceId: "C08",
          variant: "Simple",
          testMode: "skills",
          skillsModeEnabled: true,
          baseline_slds: false
        }
      ]
    }
  ]
}
```

### User Actions & Results:

**1. UI Display:**
```
Skills Mode Section:
  └─ C08
     └─ ☑ Simple  (shows as available)
```
Both the legacy (Mar 30) and new (Apr 28) C08:Simple components cause it to appear in the Skills section.

**2. User selects C08:Simple, clicks "Skills Only":**

**Chart Data Generation:**
```javascript
// March 30 snapshot
hasExplicitSkillsMode({ baseline_slds: false })
  → testMode: undefined
  → executionMode: undefined  
  → skillsModeEnabled: undefined
  → Returns: false ❌ (excluded from chart)

// April 28 snapshot
hasExplicitSkillsMode({ testMode: 'skills', skillsModeEnabled: true })
  → testMode === 'skills': true ✅
  → Returns: true ✅ (included in chart)
```

**Result:**
- Chart shows ONLY the April 28 data point ✅
- No historical data from March 30 ✅
- Trend line starts on April 28 when Skills mode was actually used ✅

**3. User clicks "All Modes":**
- Chart shows BOTH March 30 and April 28 data points
- Full historical view available

## Testing Verification

### Test Case 1: C08:Simple Skills Filter

**Setup:**
- Historical C08:Simple data exists from March (no Skills metadata)
- New C08:Simple generated April 28 (testMode: 'skills')

**Steps:**
1. Select C08:Simple from Skills section
2. Click "Skills Only" filter
3. Verify chart

**Expected Result:**
- ✅ Chart shows ONLY April 28 data point
- ✅ No data points from March-April
- ✅ Trend line is short (single point or recent dates only)

### Test Case 2: Baseline Filter Unchanged

**Setup:**
- Component with baseline_slds: true exists

**Steps:**
1. Select baseline component
2. Click "Baseline Only" filter
3. Verify chart

**Expected Result:**
- ✅ Chart shows all historical baseline data
- ✅ No change in behavior (baseline was already strict)

### Test Case 3: All Modes Shows Everything

**Setup:**
- Mixed selections (baseline + skills + legacy)

**Steps:**
1. Select components from different modes
2. Keep "All Modes" filter active
3. Verify chart

**Expected Result:**
- ✅ Chart shows all data points regardless of mode metadata
- ✅ Legacy components visible
- ✅ Full historical data available

### Test Case 4: Empty State for New Components

**Setup:**
- Component only generated recently with Skills mode
- No historical data exists

**Steps:**
1. Select new Skills component
2. Click "Skills Only" filter
3. Verify chart

**Expected Result:**
- ✅ Chart shows recent data only
- ✅ No misleading historical trends
- ✅ Accurate representation of when component was generated

## Impact on Existing Data

### For Legacy Components (Feb-Mar 2026)

**Components with only `baseline_slds: false`:**
- **UI:** Still appear in Skills section (UI organization unchanged)
- **Filtering:** NOT included when "Skills Only" filter is active
- **All Modes:** Still visible and chartable
- **Impact:** More accurate filtering, no misleading trend lines

### For Baseline Components

**Components with `baseline_slds: true`:**
- **UI:** Appear in Baseline section (unchanged)
- **Filtering:** Included in "Baseline Only" filter (unchanged)
- **Impact:** No change - baseline was already correctly handled

### For New Skills Components (Apr 28+ 2026)

**Components with `testMode: 'skills'`:**
- **UI:** Appear in Skills section (correct)
- **Filtering:** Included in "Skills Only" filter (correct)
- **Impact:** Now correctly filtered and isolated

## Files Modified

1. **src/modules/dashboard/trends/trends.js**
   - Updated `getExecutionMode()` with clearer logic
   - Added `hasExplicitSkillsMode()` method
   - Added `hasExplicitBaselineMode()` method
   - Updated `getComponentChartData()` to use strict filtering

2. **docs/TRENDS_STRICT_MODE_FILTERING.md** (this file)
   - Comprehensive documentation of the fix

## Backward Compatibility

✅ **Fully backward compatible:**
- Legacy components still appear in UI (grouped with Skills)
- All Modes view shows all data (unchanged)
- Baseline filtering unchanged
- No data loss or corruption

## Performance Impact

✅ **Minimal performance impact:**
- Added two helper methods with O(1) checks
- No additional loops or complex operations
- Chart generation performance unchanged

## Related Issues & Fixes

This fix builds on:
1. [Trends Mode Filter Fix](./TRENDS_MODE_FILTER_FIX.md) - Basic mode filtering
2. [Trends UX Improvement](./TRENDS_UX_IMPROVEMENT_SUMMARY.md) - UI redesign

This fix completes the mode filtering system by ensuring chart data accurately reflects component generation mode.
