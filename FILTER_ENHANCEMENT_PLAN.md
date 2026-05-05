# Filter Enhancement Plan: Baseline Filter

**Status:** Implemented (Trend Direction filter removed per user request)

## 📋 Critical Analysis

### Current State

**Existing Filters:**
- Quick filters: All, Production, Prototype, Draft
- Score range (min/max)
- SLDS compliance percentage
- Tier (1, 2, 3)
- Complexity (Simple, Intermediate, Advanced)
- Variant (Simple, Moderate, Complex)
- Model (claude-3-7-sonnet, claude-4-5-sonnet, etc.)
- Utterance ID (search text)

**Available Data:**
- `baseline_slds: true` exists in 14 components
- Trends data with 16 snapshots (dates: 2026-02-22 to 2026-03-20)
- Each component has score history across snapshots

### Requested Enhancements

#### 1. **Baseline Filter**
Filter components by baseline SLDS status.

#### 2. **Trend Filter**
Filter components by score trend direction over time.

#### 3. **Combined Filter Format: `component:variant:<baseline>`**
Display format showing component ID + variant + baseline status.

---

## 🎯 Proposed Implementation

### Feature 1: Baseline SLDS Filter

**UI Component:**
```
☑️ Baseline SLDS Only (14 components)
```

**Filter Logic:**
```javascript
// In filterComponents()
if (this.filters.baselineOnly && !comp.baseline_slds) return false;
```

**Placement:**
- New checkbox in filters panel
- Below "Quick Filters" section
- Show count of baseline components

**Benefits:**
- ✅ Simple boolean filter
- ✅ Easy to implement
- ✅ Clearly labeled
- ✅ Shows count for transparency

---

### Feature 2: Trend Direction Filter

**UI Component:**
```
Trend Direction:
○ All (default)
○ Improving (↑) - score increased over last 2-3 snapshots
○ Declining (↓) - score decreased over last 2-3 snapshots
○ Stable (→) - score unchanged (±0.05 tolerance)
```

**Calculation Logic:**
```javascript
// Calculate trend for a component
calculateTrend(componentName) {
  const snapshots = trendsData.snapshots.slice(-3); // Last 3 snapshots
  const scores = snapshots.map(s =>
    s.components.find(c => c.componentName === componentName)?.scores?.overall || 0
  );

  if (scores.length < 2) return 'stable';

  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const diff = lastScore - firstScore;

  if (diff > 0.05) return 'improving';
  if (diff < -0.05) return 'declining';
  return 'stable';
}
```

**Filter Logic:**
```javascript
// In filterComponents()
if (this.filters.trendDirection !== 'all') {
  const trend = this.calculateTrend(comp.componentName);
  if (trend !== this.filters.trendDirection) return false;
}
```

**Placement:**
- New radio button group in filters panel
- Below "Baseline SLDS" checkbox
- Show counts for each trend direction

**Challenges & Solutions:**

⚠️ **Challenge 1:** Trend calculation requires trends.json data
- **Solution:** Load trends.json in dashboard app component
- Pass trend data to filters component
- Calculate trends on-demand or cache results

⚠️ **Challenge 2:** Components may not exist in all snapshots
- **Solution:** Handle missing data gracefully
- Require at least 2 snapshots for trend calculation
- Mark as 'stable' if insufficient data

⚠️ **Challenge 3:** Performance with 79 components
- **Solution:** Calculate trends once on component load
- Cache trend direction in component metadata
- Only recalculate when trends.json changes

**Benefits:**
- ✅ Helps identify improving/declining components
- ✅ Useful for quality tracking
- ✅ Shows impact of code changes over time

---

### Feature 3: Display Format Enhancement

**Current Display:**
```
Component Name: "3stepWizardWithProgressIndicatorAnd6d616c77"
Variant: "Simple"
Utterance: "C14"
```

**Proposed Enhanced Display:**
```
C14:Simple [Baseline] ↑
└── "Create 3-step wizard with progress indicator..."
```

**Format Components:**
- `C14` = Utterance ID
- `Simple` = Variant
- `[Baseline]` = Badge if baseline_slds: true
- `↑` = Trend indicator (↑ improving, ↓ declining, → stable)

**Implementation:**
```javascript
formatComponent(comp) {
  const trend = this.getTrendIndicator(comp.componentName);
  const baselineLabel = comp.baseline_slds ? '[Baseline]' : '';

  return {
    ...comp,
    displayTitle: `${comp.utteranceId}:${comp.variant} ${baselineLabel} ${trend}`,
    originalTitle: comp.componentName
  };
}

getTrendIndicator(componentName) {
  const trend = this.trendCache.get(componentName);
  switch(trend) {
    case 'improving': return '↑';
    case 'declining': return '↓';
    case 'stable': return '→';
    default: return '';
  }
}
```

**Benefits:**
- ✅ Compact display format
- ✅ Shows key information at a glance
- ✅ Easy to scan visually
- ✅ Consistent with user's requested format

---

## 📊 UI Mockup

```
┌─ Filters ──────────────────────────────────────────────┐
│                                                         │
│ Quick Filters:                                          │
│ [All: 79] [Production: 1] [Prototype: 78] [Draft: 0]   │
│                                                         │
│ ☑️ Baseline SLDS Only (14 components)                  │
│                                                         │
│ Trend Direction:                                        │
│ ● All (79)                                              │
│ ○ Improving ↑ (23)                                      │
│ ○ Declining ↓ (15)                                      │
│ ○ Stable → (41)                                         │
│                                                         │
│ Score Range: [0.0 ════════════════════ 4.0]             │
│                                                         │
│ SLDS Compliance: [0% ════════════════ 100%]             │
│                                                         │
│ Tiers: ☑️ Tier 1  ☑️ Tier 2  ☑️ Tier 3                │
│                                                         │
│ Complexity: ☑️ Simple  ☑️ Intermediate  ☑️ Advanced    │
│                                                         │
│ Variant: ☑️ Simple  ☑️ Moderate  ☑️ Complex            │
│                                                         │
│ Utterance ID: [Search C01, C02, etc.]                  │
│                                                         │
│                                  [Reset Filters]        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Plan

### Phase 1: Data Preparation (15 min)
1. ✅ Load trends.json in dashboard app component
2. ✅ Calculate trend direction for all components
3. ✅ Cache trends in memory (Map<componentName, trendDirection>)
4. ✅ Pass trend data to filters and gallery components

### Phase 2: Baseline Filter (10 min)
1. ✅ Add baselineOnly state to filters component
2. ✅ Add checkbox UI with count
3. ✅ Add filter logic in filterComponents()
4. ✅ Emit baselineOnly in filter change event
5. ✅ Test with 14 baseline components

### Phase 3: Trend Filter (20 min)
1. ✅ Add trendDirection state to filters component
2. ✅ Add radio button group UI with counts
3. ✅ Implement calculateTrend() method
4. ✅ Add filter logic in filterComponents()
5. ✅ Emit trendDirection in filter change event
6. ✅ Handle edge cases (missing data, insufficient snapshots)

### Phase 4: Display Format (10 min)
1. ✅ Update formatComponent() to include trend indicator
2. ✅ Add displayTitle with format: `utteranceId:variant [baseline] trend`
3. ✅ Update card HTML to show enhanced format
4. ✅ Add CSS for trend indicators (colors/icons)

### Phase 5: Testing & Polish (15 min)
1. ✅ Test all filter combinations
2. ✅ Verify counts update correctly
3. ✅ Check performance with all filters active
4. ✅ Verify reset filters works correctly
5. ✅ Test edge cases (no trends data, new components)

**Total Estimated Time:** ~70 minutes

---

## 🎨 Visual Design

### Trend Indicators
```
↑ Improving  - Color: Green (#2E844A)
↓ Declining  - Color: Red (#C23934)
→ Stable     - Color: Gray (#706E6B)
```

### Baseline Badge
```
[Baseline] - Purple background (#7F8DE1), White text
```

### Combined Display Example
```
C14:Simple [Baseline] ↑
C01:Detailed ↓
C06:Moderate →
```

---

## ⚠️ Potential Issues & Mitigations

### Issue 1: Trends.json Size
**Problem:** Large file (~543KB) loaded on every dashboard view
**Mitigation:**
- Load asynchronously
- Cache in browser localStorage
- Only load when trends tab is active or trends filter is used

### Issue 2: Trend Calculation Performance
**Problem:** Calculating trends for 79 components on every filter change
**Mitigation:**
- Calculate once on component mount
- Cache results in memory
- Only recalculate if trends.json changes (check lastUpdated timestamp)

### Issue 3: Missing Trend Data
**Problem:** New components won't have trend history
**Mitigation:**
- Default to 'stable' for components with < 2 snapshots
- Show "New" badge instead of trend indicator
- Gracefully handle missing data

### Issue 4: Trend Sensitivity
**Problem:** Small fluctuations might cause misleading trends
**Mitigation:**
- Use tolerance threshold (±0.05)
- Look at 3 snapshots (not just 2) for more stable trend
- Consider weighted average instead of simple first/last comparison

### Issue 5: Baseline Filter Interaction
**Problem:** Combining baseline filter with trends might show 0 results
**Mitigation:**
- Show counts for each filter before applying
- Warn user if combination results in 0 components
- Provide "clear filters" quick action

---

## 🚀 Alternative Approaches

### Alternative 1: Trend Score (Numerical)
Instead of direction (improving/declining/stable), show trend score:
```
Trend Score: -0.5 to +0.5
- Positive = Improving
- Negative = Declining
- Zero = Stable
```

**Pros:** More granular, shows magnitude of change
**Cons:** Harder to interpret, requires more UI space

### Alternative 2: Time Range for Trends
Let user select time range for trend calculation:
```
Trend Period:
○ Last week
○ Last 2 weeks
○ Last month
○ All time
```

**Pros:** Flexible, user controls sensitivity
**Cons:** More complex UI, more calculations

### Alternative 3: Multi-Criteria Trend
Calculate trend based on multiple factors:
```
Trend = (overall_score_change * 0.4) +
        (slds_score_change * 0.4) +
        (violation_change * 0.2)
```

**Pros:** More comprehensive quality assessment
**Cons:** Complex to explain, harder to debug

---

## 📝 Recommendation

**Proceed with Primary Implementation:**

1. ✅ **Baseline Filter** - Simple, clear value, easy to implement
2. ✅ **Trend Direction Filter** - Useful for quality tracking, manageable complexity
3. ✅ **Enhanced Display Format** - Improves scannability without cluttering UI

**Defer for V2:**
- Trend score (numerical)
- Configurable time range
- Multi-criteria trends

**Rationale:**
- Primary implementation delivers core value quickly
- Keeps UI simple and intuitive
- Performance remains good with caching
- Can iterate based on user feedback

---

## 🎯 Expected Outcomes

### User Benefits
- ✅ Quickly find baseline SLDS components
- ✅ Identify components needing attention (declining trends)
- ✅ Track quality improvement over time
- ✅ Better component discovery with enhanced display

### Developer Benefits
- ✅ Clean architecture with trend caching
- ✅ Maintainable filter logic
- ✅ Reusable trend calculation
- ✅ Extensible for future enhancements

### Quality Metrics
- ✅ Filter response time < 100ms
- ✅ Trend calculation time < 50ms per component
- ✅ Memory usage < 2MB for trend cache
- ✅ UI remains responsive with all filters active

---

## ❓ Questions for Clarification

1. **Trend Time Window:** Should we use last 3 snapshots, or a specific date range?
2. **Trend Threshold:** Is ±0.05 acceptable, or different sensitivity needed?
3. **Display Format:** Is `C14:Simple [Baseline] ↑` acceptable, or prefer different format?
4. **Performance:** Should trends be calculated on-demand or pre-calculated?
5. **New Components:** How to handle components with < 2 snapshots (show "New" badge)?

---

## ✅ Implementation Checklist

**Before Starting:**
- [ ] Review this plan with team/user
- [ ] Get confirmation on trend calculation approach
- [ ] Confirm UI mockup is acceptable
- [ ] Verify trends.json structure hasn't changed

**Implementation:**
- [ ] Phase 1: Data preparation
- [ ] Phase 2: Baseline filter
- [ ] Phase 3: Trend filter
- [ ] Phase 4: Display format
- [ ] Phase 5: Testing & polish

**After Completion:**
- [ ] Update documentation
- [ ] Add to CHANGELOG
- [ ] Test in production environment
- [ ] Gather user feedback

---

**Created:** 2026-03-20
**Status:** Awaiting Approval
**Estimated Effort:** ~70 minutes
**Risk Level:** Low (incremental enhancement to existing system)
