# Trends Mode Filter Fix - Implementation Summary

**Date:** 2026-04-29
**Issue:** Mode filter chips didn't actually filter chart data
**Status:** ✅ Fixed

## Problem Description

### What Was Wrong

When users clicked mode filter chips (Baseline Only, Skills Only), the UI correctly filtered the visible component selector sections, but the **chart continued to show data from ALL modes**, not just the selected mode.

**Example of the bug:**
1. User has both `C01:Simple [Baseline]` and `C01:Simple [Skills]` selected
2. User clicks "Baseline Only" filter chip
3. ❌ Expected: Chart shows ONLY the baseline trend line
4. ❌ Actual: Chart showed BOTH baseline AND skills trend lines

**Root Cause:**
The `getComponentChartData()` method was using ALL selected components to build datasets, without filtering by the active mode filter (`activeModeFilter` state variable).

## Solution Implemented

### Design Decision: Filter-as-View (Non-Destructive)

**Chosen Approach:**
- Mode filter acts as a "view filter" not a "selection filter"
- Changing mode filter does NOT clear selections
- Chart shows only trend lines matching the active mode filter
- Selections persist when switching between filters
- Users can quickly toggle views without losing work

**Why this approach:**
- ✅ Non-destructive: User doesn't lose selection state
- ✅ Flexible: Can compare modes by switching filters
- ✅ Intuitive: Filter chips work like view toggles
- ✅ Consistent with filteredGallery component behavior

### Changes Made

#### 1. Added Helper Method: `getFilteredSelectionKeys()`

**Location:** `src/modules/dashboard/trends/trends.js` (after line 540)

**Purpose:** Centralized logic to filter selected component keys by active mode filter

```javascript
getFilteredSelectionKeys() {
  const selectedKeys = Array.from(this.selectedComponents.keys());

  if (this.activeModeFilter === 'all') {
    return selectedKeys;
  }

  return selectedKeys.filter(key => {
    const [mode] = key.split(':');
    return mode === this.activeModeFilter;
  });
}
```

**How it works:**
- Extracts mode from selection key format: `mode:utteranceId:variant`
- Returns all keys when filter is 'all'
- Filters to only matching mode when filter is 'baseline' or 'skills'

#### 2. Updated Chart Data Generation

**Location:** `src/modules/dashboard/trends/trends.js` - `getComponentChartData()` method

**Changes:**

**Before:**
```javascript
const selectedKeys = Array.from(this.selectedComponents.keys());
// Used ALL selected keys regardless of active filter

datasets: selectedKeys.map((key, index) => {
  // Generated datasets from all selections
})
```

**After:**
```javascript
const filteredKeys = this.getFilteredSelectionKeys();

if (filteredKeys.length === 0) {
  console.log(`⚠️  No components match active mode filter: ${this.activeModeFilter}`);
  return null;
}

datasets: filteredKeys.map((key, index) => {
  // Now only generates datasets matching active filter
})
```

**Impact:**
- Chart only shows trend lines for components matching the active mode filter
- Returns `null` (empty chart) when no selections match current filter
- Maintains color consistency across filter changes

#### 3. Enhanced Selection Count Label

**Location:** `src/modules/dashboard/trends/trends.js` - `componentSelectionLabel` getter

**Before:**
```javascript
return `${count} selected`;
```

**After:**
```javascript
if (this.activeModeFilter === 'all') {
  return `${totalCount} selected`;
}

// Show filtered vs total when mode filter is active
const filteredCount = this.getFilteredSelectionKeys().length;
return `${filteredCount} of ${totalCount} selected`;
```

**User Experience:**
- "All Modes": Shows "5 selected"
- "Baseline Only": Shows "3 of 5 selected" (3 baseline out of 5 total)
- "Skills Only": Shows "2 of 5 selected" (2 skills out of 5 total)

#### 4. Improved Empty State Messages

**Added two new getters:**

```javascript
// Check if selections exist but are filtered out
get hasFilteredSelections() {
  if (this.selectedComponents.size === 0) return false;
  return this.getFilteredSelectionKeys().length === 0;
}

// Context-aware empty state message
get chartEmptyMessage() {
  if (this.selectedComponents.size === 0) {
    return 'Select components to track';
  }

  if (this.hasFilteredSelections) {
    const modeName = this.activeModeFilter === 'baseline' ? 'Baseline' : 'Skills';
    return `No ${modeName} mode components selected. Switch to "All Modes" or select ${modeName} components.`;
  }

  return 'No chart data available';
}
```

**Updated HTML template:**
```html
<p class="slds-text-heading_small slds-m-bottom_small">
  📌 {chartEmptyMessage}
</p>
<template if:true={hasFilteredSelections}>
  <p class="slds-text-body_regular">
    You have selections from other modes. Switch to "All Modes" to see them...
  </p>
</template>
```

**User Experience:**
- No selections: "Select components to track"
- Has selections but wrong mode: "No Baseline mode components selected. Switch to 'All Modes'..."
- Helpful guidance instead of generic message

#### 5. Added Debug Logging

**Location:** Mode filter handler methods

```javascript
handleFilterBaseline() {
  const prevFilter = this.activeModeFilter;
  this.activeModeFilter = this.activeModeFilter === 'baseline' ? 'all' : 'baseline';
  console.log(`🎯 Mode filter changed: ${prevFilter} → ${this.activeModeFilter}`);
}
```

**Benefits:**
- Easier debugging during development
- Tracks filter state changes in console
- Helps identify issues with reactivity

## Testing Scenarios

### ✅ Test 1: All Modes Filter (Default)
**Steps:**
1. Select C01:Simple from both Baseline and Skills sections
2. Verify "All Modes" chip is active
3. Check chart

**Expected Result:**
- Chart shows 2 separate trend lines
- One labeled "C01 - Simple [Baseline]" in purple-blue
- One labeled "C01 - Simple [Skills]" in green
- Selection count shows "2 selected"

### ✅ Test 2: Baseline Only Filter
**Steps:**
1. Have mixed selections (baseline + skills components)
2. Click "Baseline Only" chip
3. Observe UI and chart changes

**Expected Result:**
- Only Baseline section visible in selector
- Chart shows ONLY baseline trend lines (skills lines hidden)
- Selection count shows "X of Y selected" (e.g., "3 of 5 selected")
- Purple-blue chip highlighted as active

### ✅ Test 3: Skills Only Filter
**Steps:**
1. Have mixed selections (baseline + skills components)
2. Click "Skills Only" chip
3. Observe UI and chart changes

**Expected Result:**
- Only Skills section visible in selector
- Chart shows ONLY skills trend lines (baseline lines hidden)
- Selection count shows filtered count (e.g., "2 of 5 selected")
- Green chip highlighted as active

### ✅ Test 4: Filter Switching (Selection Persistence)
**Steps:**
1. Select 3 baseline + 2 skills components in "All Modes"
2. Switch to "Baseline Only"
3. Verify chart shows 3 lines
4. Switch to "Skills Only"
5. Verify chart shows 2 lines
6. Switch back to "All Modes"
7. Verify chart shows all 5 lines again

**Expected Result:**
- Selections persist across filter changes
- Chart updates immediately when switching
- No selections lost
- Color consistency maintained

### ✅ Test 5: Empty State - No Matching Selections
**Steps:**
1. Select only baseline components (no skills selected)
2. Switch to "Skills Only" filter
3. Check empty state message

**Expected Result:**
- Chart shows empty state
- Message: "No Skills mode components selected. Switch to 'All Modes' or select Skills components."
- Helpful hint about selections from other modes
- No JavaScript errors

### ✅ Test 6: Color Consistency
**Steps:**
1. Select C01:Simple Baseline in "All Modes"
2. Note the purple-blue color used
3. Switch to "Baseline Only"
4. Verify same purple-blue color
5. Switch back to "All Modes"
6. Verify color didn't change

**Expected Result:**
- Colors remain consistent across filter changes
- Baseline components always use purple-blue palette
- Skills components always use green palette
- No color shifts or mismatches

### ✅ Test 7: Cross-Snapshot Data Integrity
**Steps:**
1. Select C01:Simple in Baseline mode only
2. Verify trend line across multiple snapshots
3. Check that no Skills mode data is mixed in

**Expected Result:**
- Trend line shows ONLY baseline mode data points
- Each snapshot correctly identifies mode via `getExecutionMode()`
- No mixing of skills data into baseline trend
- Accurate historical representation

## Technical Details

### Selection Key Format

```
mode:utteranceId:variant
```

**Examples:**
- `baseline:C01:Simple`
- `skills:C05:Detailed`
- `baseline:C14:Moderate`

### Mode Detection Priority

Components are classified using this order:

1. `testMode` field → 'skills', 'mcp', 'baseline'
2. `executionMode` field → 'skills', 'mcp'
3. `skillsModeEnabled` flag → boolean
4. `baseline_slds` flag → boolean (legacy)
5. Default → 'skills'

### Chart Dataset Generation Flow

```
1. User has selections: Map([
     ['baseline:C01:Simple', true],
     ['skills:C01:Simple', true],
     ['baseline:C05:Detailed', true]
   ])

2. activeModeFilter = 'baseline'

3. getFilteredSelectionKeys() returns:
   ['baseline:C01:Simple', 'baseline:C05:Detailed']

4. Chart generates 2 datasets (only baseline components)

5. Each dataset pulls data from snapshots:
   - Filters components by mode + utteranceId + variant
   - Uses getExecutionMode() to identify component mode
   - Averages scores if multiple instances exist
```

### Performance Characteristics

- **Filtering:** O(n) where n = number of selections (typically < 50)
- **Chart Generation:** O(m × s) where m = filtered selections, s = snapshots
- **Reactivity:** LWC automatically re-computes `chartData` getter when `activeModeFilter` changes
- **DOM Updates:** Minimal - only chart re-renders, selection state unchanged

## Files Modified

1. **src/modules/dashboard/trends/trends.js** (~50 lines changed)
   - Added `getFilteredSelectionKeys()` method
   - Added `hasFilteredSelections` getter
   - Added `chartEmptyMessage` getter
   - Updated `getComponentChartData()` to use filtered keys
   - Updated `componentSelectionLabel` to show filtered count
   - Added console logging to filter handlers

2. **src/modules/dashboard/trends/trends.html** (~10 lines changed)
   - Updated empty state to use `chartEmptyMessage`
   - Added conditional help text for filtered selections

3. **docs/TRENDS_MODE_FILTER_FIX.md** (this file)
   - Comprehensive documentation of the fix

## Backward Compatibility

✅ **Fully backward compatible:**

- Works with existing `baseline_slds` field in trends.json
- No changes to selection state structure
- No changes to URL format or data schema
- Existing snapshots work without modification
- Falls back gracefully for components without mode metadata

## Known Limitations

1. **MCP Mode Merged with Skills** - MCP mode components are grouped under Skills mode. Can be separated in future if needed.

2. **No Persistent Filter State** - Filter resets to "All Modes" on page refresh. Could be saved to localStorage if needed.

3. **No Animated Transitions** - Chart updates immediately without animation. Could add smooth transitions if desired.

## Future Enhancements

1. **Persistent Filter State** - Save `activeModeFilter` to localStorage
2. **Filter Indicators in Legend** - Show "(filtered)" next to legend items
3. **Keyboard Shortcuts** - Alt+1/2/3 for filter chips
4. **Filter Presets** - Save/load filter + selection combinations
5. **Compare Mode** - Show filtered vs unfiltered in split view

## Validation

All 7 test scenarios passed:
- ✅ All Modes shows all selected trend lines
- ✅ Baseline Only shows only baseline trends
- ✅ Skills Only shows only skills trends
- ✅ Selections persist across filter changes
- ✅ Empty state messages are helpful
- ✅ Colors remain consistent
- ✅ No data mixing across modes

## Related Documentation

- [Trends UX Improvement Summary](./TRENDS_UX_IMPROVEMENT_SUMMARY.md)
- [Tooling Modes Guide](./TOOLING_MODES_GUIDE.md)
- [Baseline SLDS Label Feature](./BASELINE_SLDS_LABEL.md)
