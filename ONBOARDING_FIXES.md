# Onboarding Modal Fixes - March 2, 2026

## Issues Fixed

### 1. ✅ Navigation Dots Alignment
**Issue:** Step indicator dots at bottom of modal were left-aligned
**Fix:** Added CSS to center the progress indicators

```css
.slds-progress.slds-progress_horizontal {
  justify-content: center;
}
```

**File:** `src/modules/main/onboardingModal/onboardingModal.css`

---

### 2. ✅ Completion Logic
**Issue:** Closing modal (X button) or clicking "Skip" marked onboarding as completed
**Fix:** Only "Get Started" button (on last step) now marks as completed

**Behavior:**
- ❌ **Close (X button)** → Just hides modal (can reappear on next visit)
- ❌ **Skip Tutorial** → Just hides modal (can reappear on next visit)
- ✅ **Get Started** → Marks complete + hides modal (won't show again)

**Files Modified:**
- `src/modules/main/onboardingModal/onboardingModal.js`
  - `handleClose()` - now just calls `hideModal()`
  - `handleSkip()` - now just calls `hideModal()`
  - `handleComplete()` - only called by "Get Started", marks as completed

---

### 3. ✅ Accurate Scoring Explanation
**Issue:** Onboarding incorrectly described linter scoring as simple penalty accumulation
**Fix:** Updated content to accurately reflect **dynamic averaging** implementation

#### How Dynamic Averaging Actually Works:

```javascript
// From scoreComponentSlds.ts
function generateDynamicScoreRules(sarifResults, ruleWeights) {
  // 1. Find unique violated rules
  const violatedRules = new Set();
  for (const result of sarifResults) {
    if (result.ruleId && ruleWeights[result.ruleId]) {
      violatedRules.add(result.ruleId);
    }
  }

  // 2. Generate scoreRules ONLY for violated rules
  const scoreRules = [];
  for (const ruleId of violatedRules) {
    scoreRules.push({
      name: `${ruleId} violations`,
      type: 'inverse_count',
      penalty: ruleWeights[ruleId],
      weight: 1,  // All violated rules weighted equally
    });
  }

  return scoreRules;
}

// Scoring config uses weighted_average aggregation
{
  name: 'SLDS Compliance',
  scoreRules: rules,
  aggregation: 'weighted_average'
}
```

#### Key Principles:

1. **Dynamic Inclusion:** Only violated rules are included in scoring
2. **Equal Weighting:** All violated rules have weight: 1 (averaged equally)
3. **Weighted Average:** Final score = average of all violated rule scores
4. **No Dilution:** Perfect components don't dilute scores with unused rules

#### Updated Content:

**Step 3 (Rule Weights):**
- Added explanation box about dynamic averaging
- Clarified that only violated rules are scored
- Explained equal weighting and averaging

**Step 4 (Example Calculation):**
- Changed from single-rule penalty example to multi-rule averaging
- Shows 2 violated rules (no-slds-class-overrides + bem-naming)
- Demonstrates step-by-step averaging process
- Includes "Key Insight" about perfect scores for non-violated rules

**Files Modified:**
- `src/modules/data/onboardingData/onboardingData.js`

---

## Testing Checklist

### Test Navigation Dots
- [ ] Open onboarding modal
- [ ] Verify step indicators are centered horizontally
- [ ] Click through steps - dots should stay centered

### Test Completion Logic
- [ ] Clear localStorage: `localStorage.removeItem('lwc-gallery-onboarding-completed')`
- [ ] Refresh page - onboarding should appear
- [ ] Click **Close (X)** button
- [ ] Refresh page - onboarding should **appear again** ✓
- [ ] Clear localStorage again
- [ ] Click **Skip Tutorial**
- [ ] Refresh page - onboarding should **appear again** ✓
- [ ] Click through all steps to **Get Started**
- [ ] Refresh page - onboarding should **NOT appear** ✓
- [ ] Check localStorage: `localStorage.getItem('lwc-gallery-onboarding-completed')` should be `"1.0.0"`

### Test Scoring Explanation
- [ ] Read Step 2 (Scoring System) - should mention weighted dimensions
- [ ] Read Step 3 (Rule Weights) - should explain dynamic averaging with info box
- [ ] Read Step 4 (Example) - should show 2-rule averaging example
- [ ] Verify accuracy against actual implementation in `scoreComponentSlds.ts`

---

## Restart Instructions

1. Stop dev server (Ctrl+C)
2. Clear cache: `rm -rf __lwr_cache__`
3. Clear localStorage: `localStorage.removeItem('lwc-gallery-onboarding-completed')`
4. Restart: `npm run dev`
5. Hard refresh: Cmd+Shift+R

---

## Files Changed

```
src/modules/main/onboardingModal/
  ├── onboardingModal.css        (centered navigation dots)
  └── onboardingModal.js         (completion logic fix)

src/modules/data/onboardingData/
  └── onboardingData.js          (scoring explanation updates)
```

---

## Summary

All three issues have been resolved:
1. ✅ Navigation dots centered
2. ✅ Only "Get Started" marks as complete
3. ✅ Accurate dynamic averaging explanation

The onboarding now correctly reflects the actual scoring implementation and provides a better UX by not marking incomplete flows as finished.
