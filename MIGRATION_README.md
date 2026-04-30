# SLDS Score Migration Script

## Purpose

This script recalculates SLDS linter scores for all generated components using the **fixed baseline formula** (all 16 rules included). This ensures:

1. ✅ **Monotonic scoring** - More violations → Lower score
2. ✅ **Comparable scores** - All components scored with same baseline
3. ✅ **Weighted severity** - Critical violations (0.4) have 16× impact of low (0.025)

## Background

Previously, some components may have been scored with:
- Dynamic denominators (only violated rules included)
- Different scoring implementations
- Inconsistent precision

This migration ensures all components use the **current production formula**:

```
For each rule i (16 total):
   rule_score_i = 3 - (violation_count_i × penalty_i)

SLDS_score = Σ(rule_score_i × weight_i) / Σ(weight_i)
             where weight_i = penalty_i
             and Σ(weight_i) = 3.075
```

## Installation

No installation required if you have the main project dependencies.

## Usage

### 1. Dry Run (Preview Changes)

```bash
cd /Users/ritesh.kumar2/Documents/projects/lwc-slds-lbc-starter
npx tsx migrate-slds-scores.ts --dry-run
```

**Output:**
- Shows which components would be changed
- Lists old vs new scores
- Displays summary statistics
- **Does NOT modify any files**

### 2. Verbose Dry Run (Detailed)

```bash
npx tsx migrate-slds-scores.ts --dry-run --verbose
```

**Output:**
- Shows each component being processed
- Displays old → new scores for every component
- Shows delta for changed components

### 3. Apply Migration (Write Files)

```bash
npx tsx migrate-slds-scores.ts
```

**⚠️ This will modify all `metadata.json` files!**

**Recommendation:** Run `--dry-run` first to preview changes.

### 4. Apply with Verbose Output

```bash
npx tsx migrate-slds-scores.ts --verbose
```

## What Gets Updated

For each component in `generated/c/*/metadata.json`:

### 1. SLDS Linter Score
```json
{
  "scores": {
    "slds_linter": 2.79  // ← RECALCULATED using fixed baseline
  }
}
```

### 2. Overall Score & Readiness
```json
{
  "scores": {
    "overall": 2.85,  // ← RECALCULATED based on new slds_linter
    "overall_readiness_label": "Prototype"  // ← UPDATED
  }
}
```

**Weighting formula:**
```
overall = (slds_linter × 3 + slds_quality × 2 + prd_compliance × 2 + security × 1) / 8
```

### Fields NOT Changed
- `errorsByType` - Preserved as-is (source of truth)
- `slds_quality`, `prd_compliance`, `security` - Unchanged
- All other metadata fields - Unchanged

## Example Output

```
🔄 SLDS Score Migration

Using fixed baseline formula with all 16 SLDS rules
Formula: SLDS_score = Σ(rule_score_i × weight_i) / 3.075

Found 79 components

..........

═══════════════════════════════════════════════════════════════
📊 MIGRATION SUMMARY
═══════════════════════════════════════════════════════════════

Total components processed: 79
  ✓ Changed: 42
  − Unchanged: 37

🔄 SCORE CHANGES:

Top 10 biggest changes:
1. formWithTextEmailPhoneDropdownC0001f11  🔴 ↓ 0.123 (0.64 → 0.52) [26 violations]
2. comprehensiveContactFormWithNameField   🟢 ↑ 0.098 (2.70 → 2.80) [8 violations]
3. 3stepWizardWithProgressIndicatorAnd     🔴 ↓ 0.087 (2.85 → 2.76) [12 violations]
...

Score distribution:
  3.0 (Perfect)              5 components
  2.5-2.99 (Excellent)       28 components
  2.0-2.49 (Good)            35 components
  1.5-1.99 (Fair)            9 components
  1.0-1.49 (Poor)            2 components

═══════════════════════════════════════════════════════════════

✅ Migration complete - All metadata files updated
```

## Verification

After migration, verify scores are correct:

```bash
# Check a specific component
cat generated/c/primaryButtonWithASaveIcon60431c36/metadata.json | jq '.scores'

# Count components by readiness
jq -r '.scores.overall_readiness_label' generated/c/*/metadata.json | sort | uniq -c

# Find components with low scores
jq -r 'select(.scores.slds_linter < 2.0) | .componentName' generated/c/*/metadata.json
```

## Rollback

If you need to rollback:

1. **Git restore** (if committed before migration):
   ```bash
   git checkout HEAD -- generated/c/*/metadata.json
   ```

2. **Backup restore** (if you created a backup):
   ```bash
   cp -r generated/c.backup/* generated/c/
   ```

## Creating a Backup (Recommended)

Before running the migration:

```bash
# Backup entire generated directory
cp -r generated/c generated/c.backup

# Or backup just metadata files
find generated/c -name "metadata.json" -exec cp {} {}.backup \;
```

## Technical Details

### Scoring Implementation

The script uses the same approach as `scoreComponentSlds.ts`:

1. **Creates fixed baseline config** with all 16 SLDS rules
2. **Generates mock SARIF** from `errorsByType` in metadata
3. **Calls `adk-score`** with `readinessScore()` function
4. **Updates metadata** with new scores

### Rules Included (All 16)

| Rule ID | Penalty | Severity |
|---------|---------|----------|
| `slds/lwc-token-to-slds-hook` | 0.4 | Critical |
| `slds/no-deprecated-tokens-slds1` | 0.4 | Critical |
| `slds/no-unsupported-hooks-slds2` | 0.4 | Critical |
| `slds/enforce-component-hook-naming-convention` | 0.35 | Critical |
| `slds/modal-close-button-issue` | 0.35 | Critical |
| `slds/enforce-bem-usage` | 0.25 | High |
| `slds/no-deprecated-classes-slds2` | 0.25 | High |
| `slds/no-slds-namespace-for-custom-hooks` | 0.15 | Medium |
| `slds/no-slds-class-overrides` | 0.1 | Medium |
| `slds/no-slds-private-var` | 0.1 | Medium |
| `slds/no-hardcoded-values-slds2` | 0.1 | Medium |
| `slds/bem-naming` | 0.05 | Low |
| `slds/enforce-sds-to-slds-hooks` | 0.05 | Low |
| `slds/no-sldshook-fallback-for-lwctoken` | 0.05 | Low |
| `slds/reduce-annotations` | 0.05 | Low |
| `slds/no-slds-var-without-fallback` | 0.025 | Low |

**Total Weight Sum:** 3.075

### Readiness Thresholds

```
Production-Ready: score ≥ 3.0
Prototype:        score ≥ 2.0
Draft:            score ≥ 1.0
```

## Troubleshooting

### Error: "No components found"

- **Check**: Are you in the correct directory?
  ```bash
  pwd
  # Should be: /Users/ritesh.kumar2/Documents/projects/lwc-slds-lbc-starter
  ```

- **Check**: Does `generated/c/` exist?
  ```bash
  ls -la generated/c/
  ```

### Error: "Cannot find module @sfdc-internal/adk-score"

- **Solution**: Install dependencies from the main project
  ```bash
  cd ../lgpt-experts-lwc
  npm install
  cd ../lwc-slds-lbc-starter
  ```

### Components Skipped

Components are skipped if:
- No `metadata.json` file exists
- `errorsByType` field is empty or missing
- Metadata JSON is malformed

**Check skipped components:**
```bash
npx tsx migrate-slds-scores.ts --verbose --dry-run | grep "Skipping"
```

## Expected Changes

### Typical Score Changes

- **Small changes** (±0.01-0.05): Precision adjustments, minor formula differences
- **Medium changes** (±0.05-0.15): Different weighting or normalization
- **Large changes** (±0.15+): Previously used dynamic denominator

### Components with Zero Violations

Should have score = **3.0** (perfect) after migration.

### Components with Many Violations

Scores should be **lower** than components with fewer violations (monotonic property).

## When to Run This

Run this migration script when:

1. ✅ Updating from old scoring implementation to fixed baseline
2. ✅ Ensuring all components use consistent formula
3. ✅ After fixing scoring bugs (non-stationary denominator)
4. ✅ Periodically to ensure data consistency

**Do NOT run if:**
- ❌ You've manually adjusted scores for specific reasons
- ❌ Scores are part of a published dataset (breaks reproducibility)
- ❌ You're in the middle of an experiment comparing scoring methods

## Related Files

- `test-monotonicity.js` - Manual formula verification
- `test-adk-score-monotonicity.ts` - Real adk-score verification
- `monotonicity-analysis.md` - Mathematical analysis
- `../lgpt-experts-lwc/src/mcp/tools/score/scoreComponentSlds.ts` - Production implementation

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `monotonicity-analysis.md` for formula details
3. Verify with test scripts first
4. Create backup before running on production data

---

**Version:** 1.0
**Last Updated:** 2026-03-17
**Compatibility:** adk-score@2.57.0+, Node.js 18+
