# Score Migration Guide: Complete Workflow

## 📋 Overview

This document provides the complete workflow for migrating component scores when linting rules or scoring formulas are updated. The migration preserves score history while updating all metadata and trends data consistently.

## 🎯 Objectives

1. **Version Score History**: Preserve old scores as `originalScoresV0`, `originalScoresV1`, etc. in component metadata
2. **Update Component Metadata**: Apply new scores to all `metadata.json` files
3. **Update Historical Trends**: Retroactively update all trend snapshots with new scores
4. **Maintain Audit Trail**: Track all changes with timestamps and change details
5. **Ensure Consistency**: Make trends charts reflect current scoring methodology

## 🔍 The Problem

**Scenario**: After updating linting rules or scoring formulas, new scores are calculated. However:

1. **Component metadata** still shows old scores (from git history)
2. **Historical trend snapshots** contain outdated scores
3. **Trend charts** show artificial jumps when new scores are applied only to new snapshots

**Impact**:
- ❌ Trends charts show misleading "progress" that's really just formula changes
- ❌ Inconsistency between current metadata and historical trends
- ❌ Loss of historical score context without audit trail
- ❌ Difficulty comparing component quality over time

## 💡 Solution: Two-Phase Migration

### Phase 1: Version Component Scores
**Goal**: Add versioned `originalScoresV{N}` to component metadata files

### Phase 2: Update Trend Snapshots
**Goal**: Retroactively update all historical snapshots with current scores

---

## 🛠️ Migration Workflow

### **STEP 1: Version Component Scores**

This adds `originalScoresV0` to component metadata by reading old scores from git.

#### Script: `migrate-component-scores-with-versioning.cjs`

**Features:**
- ✅ Reads old scores from **git HEAD** (committed files) or **staging area** (new files)
- ✅ Creates versioned score fields: `originalScoresV0`, `originalScoresV1`, etc.
- ✅ Adds `_scoreHistory` audit trail
- ✅ Dry-run mode for safe testing
- ✅ Works with both committed and staged files

**Usage:**
```bash
# Preview changes (recommended first)
npm run scores:migrate:dry-run

# Apply migration (adds originalScoresV0)
npm run scores:migrate

# Future migrations with incremented version
npm run scores:migrate -- --version=1  # Adds originalScoresV1
```

#### Component Data Structure

**Before:**
```json
{
  "componentName": "verticalNavMenuWith5Items887d3dcb",
  "scores": {
    "overall": 2.96,
    "slds_linter": 0.94
  }
}
```

**After:**
```json
{
  "componentName": "verticalNavMenuWith5Items887d3dcb",
  "scores": {
    "overall": 2.96,
    "slds_linter": 0.94,
    "slds_violation_density": 0.08
  },
  "originalScoresV0": {
    "overall": 2.82,
    "slds_linter": 0.76
  },
  "_scoreHistory": {
    "originalScoresV0": {
      "date": "2026-03-18T13:56:09.240Z",
      "reason": "Score recalculation/metadata update",
      "changedFields": [
        {"field": "overall", "old": 2.82, "new": 2.96},
        {"field": "slds_linter", "old": 0.76, "new": 0.94}
      ]
    }
  }
}
```

---

### **STEP 2: Update Trend Snapshots**

This updates ALL historical snapshots in `trends.json` to use current component scores.

#### Script: `migrate-trends-with-updated-scores.cjs`

**Features:**
- ✅ Automatic backup creation
- ✅ Reads current scores from component metadata
- ✅ Updates all historical snapshots
- ✅ Preserves original snapshot scores in `originalScores` field (within trends.json)
- ✅ Adds migration metadata (`_migration` field)
- ✅ Detailed migration report

**Usage:**
```bash
# Preview changes (recommended first)
npm run trends:migrate:dry-run

# Apply migration (updates trends.json)
npm run trends:migrate
```

#### Trends Data Structure

**Before Migration (trends.json):**
```json
{
  "snapshots": [
    {
      "date": "2026-03-12",
      "components": [
        {
          "componentName": "verticalNavMenuWith5Items887d3dcb",
          "scores": {
            "overall": 2.82,
            "slds_linter": 0.76
          }
        }
      ]
    }
  ]
}
```

**After Migration (trends.json):**
```json
{
  "snapshots": [
    {
      "date": "2026-03-12",
      "components": [
        {
          "componentName": "verticalNavMenuWith5Items887d3dcb",
          "originalScores": {
            "overall": 2.82,
            "slds_linter": 0.76
          },
          "scores": {
            "overall": 2.96,
            "slds_linter": 0.94,
            "slds_violation_density": 0.08
          },
          "_migrated": {
            "date": "2026-03-18T13:17:29.598Z",
            "reason": "Score recalculation/metadata update",
            "changedFields": [
              {"field": "overall", "old": 2.82, "new": 2.96}
            ]
          }
        }
      ],
      "_migration": {
        "migratedAt": "2026-03-18T13:17:29.598Z",
        "componentsUpdated": 63,
        "scoresRecalculated": true
      }
    }
  ]
}

---

## 🤖 Automated Migration Workflow (Claude-Triggered)

For a fully guided migration experience, Claude can automatically detect, analyze, and execute the migration with user confirmation at each step.

### **Step 1: Detection & Analysis**

Claude will:
1. ✅ Check if component metadata files exist
2. ✅ Analyze git history to detect score changes
3. ✅ Identify which components need migration
4. ✅ Determine the appropriate version number (V0, V1, V2, etc.)
5. ✅ Show a summary of expected changes

### **Step 2: Interactive Migration Plan**

Claude presents:
```
📊 Migration Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found: 63 components with score changes
Target: originalScoresV0 (first version)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top Score Changes:
  userProfileFormNameTextEmailC8b10de5:   2.79 → 2.45 (-0.34)
  faqAccordionWith3SectionsEach2efd09a1:  2.84 → 2.54 (-0.30)
  contactCardWithAvatarNameTitleDc584ab4: 2.79 → 2.54 (-0.25)
  ...and 60 more

Would you like to proceed with migration? (yes/no)
```

### **Step 3: Automatic Execution**

Upon user confirmation, Claude will:

1. **Detect existing versions:**
   ```bash
   # Check what versions already exist
   jq '.originalScoresV0, .originalScoresV1, .originalScoresV2' \
     generated/c/*/metadata.json
   ```

2. **Determine next version:**
   - If no `originalScoresV0` exists → Use V0
   - If `originalScoresV0` exists but no V1 → Use V1
   - If `originalScoresV1` exists but no V2 → Use V2
   - And so on...

3. **Execute Phase 1: Component Metadata**
   ```bash
   npm run scores:migrate -- --version={detected_version}
   ```

4. **Verify Phase 1 completion:**
   ```bash
   # Check migration success
   grep -l "originalScoresV{N}" generated/c/*/metadata.json | wc -l
   ```

5. **Execute Phase 2: Trends Snapshots**
   ```bash
   npm run trends:migrate
   ```

6. **Verify Phase 2 completion:**
   ```bash
   # Verify trends consistency
   jq '.snapshots[-1].components[0].scores' generated/trends.json
   ```

7. **Generate summary report:**
   ```
   ✅ Migration Complete
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Version: originalScoresV0
   Components Migrated: 63
   Trends Snapshots Updated: 14
   Backup: generated/backups/trends-backup-{timestamp}.json
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### **Step 4: Preservation Check**

Claude verifies old scores are preserved:
```bash
# Check specific component preservation
jq '{componentName, scores, originalScoresV0, _scoreHistory}' \
  generated/c/userProfileFormNameTextEmailC8b10de5/metadata.json
```

**Expected output:**
```json
{
  "componentName": "userProfileFormNameTextEmailC8b10de5",
  "scores": {
    "overall": 2.45,
    "slds_linter": 0.26
  },
  "originalScoresV0": {
    "overall": 2.79,
    "slds_linter": 0.574
  },
  "_scoreHistory": {
    "originalScoresV0": {
      "date": "2026-03-19T...",
      "reason": "Score recalculation/metadata update",
      "changedFields": [...]
    }
  }
}
```

### **Automatic Version Detection Logic**

```javascript
// Pseudocode for version detection
function detectMigrationVersion(componentMetadata) {
  let version = 0;

  while (componentMetadata[`originalScoresV${version}`]) {
    version++;
  }

  return version; // Next available version
}

// Example:
// Component has originalScoresV0 → Next migration uses V1
// Component has originalScoresV0, V1 → Next migration uses V2
// Component has no versions → First migration uses V0
```

### **Interactive Prompts**

Claude will ask before proceeding:

**1. Confirmation before execution:**
```
🔍 Detected 63 components needing migration to V0

Proceed with:
1. ✓ Component metadata migration (originalScoresV0)
2. ✓ Trends snapshot migration (update historical data)
3. ✓ Automatic backup creation

Continue? (yes/no/dry-run)
```

**2. Version conflict resolution:**
```
⚠️  Some components already have originalScoresV0

Options:
a) Skip components with existing V0 (safe)
b) Increment to V1 for all components (new migration)
c) Overwrite existing V0 (not recommended)

Choose: (a/b/c)
```

**3. Post-migration verification:**
```
✅ Migration completed successfully

Verify in dashboard?
- Open http://localhost:3000
- Navigate to Trends tab
- Check C01-Detailed for consistent scores

Press Enter to continue...
```

### **Error Handling**

Claude will detect and handle:

**Missing git history:**
```
⚠️  Component not in git: verticalNavMenuWith5Items97833370

Action: Skip this component (no old scores to preserve)
Status: This is expected for brand new components
```

**Corrupted metadata:**
```
❌ Invalid JSON in: generated/c/componentName/metadata.json

Action: Skip and report error
Fix: Manually correct JSON syntax
```

**Interrupted migration:**
```
⚠️  Migration interrupted at Phase 1

Recovery options:
a) Resume from Phase 2 (trends migration)
b) Restart entire migration
c) Rollback using backup

Choose: (a/b/c)
```

### **Advantages of Automated Workflow**

✅ **Smart version detection** - Automatically increments V0 → V1 → V2
✅ **No manual commands** - Claude executes everything
✅ **Interactive confirmations** - User stays in control
✅ **Error recovery** - Automatic detection and guidance
✅ **Verification built-in** - Checks at each step
✅ **Rollback support** - Can undo if issues arise

### **Triggering Automated Migration**

Simply say to Claude:
```
"Run score migration workflow"
"Migrate component scores with version detection"
"Update trends with current scores and preserve history"
```

Claude will then:
1. Analyze your codebase
2. Present migration plan
3. Ask for confirmation
4. Execute both phases
5. Verify completion
6. Provide summary report

### **Complete Automated Example**

**User:** "Migrate component scores and update trends"

**Claude Response:**
```
🔍 Analyzing component metadata...

Found 79 components in generated/c/
Checking git history for score changes...
Detecting existing migration versions...

📊 Migration Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Components Status:
  ✓ 63 components with score changes (need migration)
  ✓ 16 components unchanged (skip)
  ✓ 0 components already migrated to V0

Target Version: originalScoresV0 (first migration)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top 5 Score Changes:
  1. userProfileFormNameTextEmailC8b10de5:   2.79 → 2.45 (-0.34 ↓)
  2. confirmationModalForDeletionUsingSlds:  2.82 → 2.52 (-0.30 ↓)
  3. faqAccordionWith3SectionsEach2efd09a1:  2.84 → 2.54 (-0.30 ↓)
  4. contactCardWithAvatarNameTitleDc584ab4: 2.79 → 2.54 (-0.25 ↓)
  5. responsiveProductCardGridWith611d4397: 2.55 → 2.30 (-0.25 ↓)

Trends Snapshots: 14 snapshots will be updated

Proceed with migration? (yes/no/dry-run)
```

**User:** "yes"

**Claude Executes:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: Component Metadata Migration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ npm run scores:migrate -- --version=0

🔄 Component Score Migration: Add originalScoresV0
📖 Reading component metadata...
✅ Found 79 components
🔄 Processing components...
✅ Processing complete

📊 MIGRATION REPORT
   Total processed:       79
   Migrated (updated):    63
   Unchanged:             16
   Version key:           originalScoresV0

✨ Migration complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: Trends Snapshot Migration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ npm run trends:migrate

🔄 Trends Migration: Update Historical Scores
📖 Reading current component metadata...
✅ Found 79 components
📊 Loading trends.json...
✅ Found 14 snapshots
✅ Backup created: trends-backup-2026-03-19T09-48-51-841Z.json
🔄 Migrating snapshots...
✅ Migration complete
💾 Writing updated trends.json...

📊 MIGRATION REPORT
   Total snapshots:       14
   Updated snapshots:     14
   Components updated:    396

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Component metadata: 63 files with originalScoresV0
✅ Trends consistency: C01-Detailed scores flat across all dates
✅ Backup created: generated/backups/trends-backup-2026-03-19...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ MIGRATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
1. Review changes in dashboard (http://localhost:3000)
2. Stage and commit changes when ready
3. Backup saved locally for rollback if needed

Ready to stage changes? (yes/no)
```

**User:** "yes"

**Claude Stages:**
```
📦 Staging migration changes...

$ git add scripts/migrate-component-scores-with-versioning.cjs
$ git add scripts/migrate-trends-with-updated-scores.cjs
$ git add scripts/restore-scores-from-trends.cjs
$ git add docs/TRENDS_MIGRATION_PLAN.md
$ git add package.json
$ git add generated/trends.json
$ git add generated/c/*/metadata.json

✅ Staged 70 files for commit

Suggested commit message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
feat: implement versioned score migration (V0)

Phase 1: Component metadata migration
- Add originalScoresV0 to 63 components
- Preserve git history with _scoreHistory audit trail

Phase 2: Trends snapshot migration
- Update 14 historical snapshots with current scores
- Fix false progress indicators in trend charts

Migration Stats:
- 63 components migrated to V0
- 396 component-snapshot pairs updated
- Trends now consistent across all dates

Scripts: migrate-component-scores-with-versioning.cjs,
        migrate-trends-with-updated-scores.cjs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like me to create this commit? (yes/no)
```

### **What Makes This Workflow Powerful**

1. **Zero Manual Commands** - Just tell Claude what you want
2. **Smart Detection** - Automatically finds what needs migrating
3. **Version Awareness** - Knows when to use V0, V1, V2, etc.
4. **Safety First** - Shows dry-run by default, asks for confirmation
5. **Complete Verification** - Checks every step succeeded
6. **Guided Staging** - Offers to stage and commit with good message
7. **Rollback Ready** - Creates backups automatically

### **Future Migrations**

When you need to migrate again (e.g., after another scoring update):

**User:** "Migrate scores again"

**Claude:**
```
🔍 Analyzing...

Found existing migrations:
  ✓ originalScoresV0 exists in 63 components

Next migration will use: originalScoresV1

This will preserve current scores as V1 before applying new scores.

Proceed? (yes/no)
```

This creates a complete historical chain:
- `originalScoresV0` = First scoring methodology
- `originalScoresV1` = Second scoring methodology
- `originalScoresV2` = Third scoring methodology
- `scores` = Current (always latest)

---

## 📝 Manual Migration Procedure

For advanced users who prefer manual control:

### **Phase 1: Component Metadata Migration**

**Step 1: Dry Run**
```bash
npm run scores:migrate:dry-run
```

**Expected Output:**
- Total components processed
- Components with changed scores
- Top 10 score changes
- No files modified

**Step 2: Review Changes**
Check the output for:
- Number of components being migrated
- Score changes (old → new)
- Any errors or warnings

**Step 3: Apply Migration**
```bash
npm run scores:migrate
```

**What Happens:**
- Reads old scores from git (HEAD or staging area)
- Adds `originalScoresV0` to metadata files
- Creates `_scoreHistory` with change details
- Updates 60+ component metadata.json files

**Step 4: Verify Component Metadata**
```bash
# Check a specific component
jq '{componentName, scores, originalScoresV0, _scoreHistory}' \
  generated/c/verticalNavMenuWith5Items887d3dcb/metadata.json

# Count migrated components
grep -l "originalScoresV0" generated/c/*/metadata.json | wc -l
```

---

### **Phase 2: Trends Snapshot Migration**

**Step 1: Dry Run**
```bash
npm run trends:migrate:dry-run
```

**Expected Output:**
- Total snapshots to update
- Components changed in each snapshot
- Backup location (if not dry-run)
- Detailed change report

**Step 2: Review Changes**
Verify:
- All historical snapshots will be updated
- Score changes look correct
- Batch metrics will be recalculated

**Step 3: Apply Migration**
```bash
npm run trends:migrate
```

**What Happens:**
- Creates backup in `generated/backups/trends-backup-[timestamp].json`
- Updates all historical snapshots with current scores
- Adds `originalScores` to each component in snapshots
- Adds `_migrated` metadata to each component
- Adds `_migration` summary to each snapshot

**Step 4: Verify Trends Data**
```bash
# Check backup was created
ls -la generated/backups/

# View a specific component's migration in trends
jq '.snapshots[-1].components[] |
    select(.componentName == "verticalNavMenuWith5Items887d3dcb") |
    {componentName, originalScores, scores, _migrated}' \
  generated/trends.json

# Check snapshot migration metadata
jq '.snapshots[-1]._migration' generated/trends.json

# Count migrated components across all snapshots
jq '[.snapshots[].components[] | select(._migrated)] | length' \
  generated/trends.json
```

**Step 5: Update Trends (Optional)**
If you want to add a new snapshot with today's date:
```bash
npm run trends:snapshot
```

---

## 📊 Expected Changes

### Real Example from 2026-03-18 Migration

**63 components** migrated with score changes:

#### Biggest Score Changes

| Component | Old Score | New Score | Change | Impact |
|-----------|-----------|-----------|--------|--------|
| userProfileFormNameTextEmailC8b10de5 | 2.79 | 2.45 | -0.34 ↓ | More accurate violation weighting |
| confirmationModalForDeletionUsingSlds3d1fd5f6 | 2.82 | 2.52 | -0.30 ↓ | Fixed baseline denominator |
| faqAccordionWith3SectionsEach2efd09a1 | 2.84 | 2.54 | -0.30 ↓ | Better SLDS rule coverage |
| verticalNavMenuWith5Items887d3dcb | 2.82 | 2.96 | +0.14 ↑ | Fixed false positives |
| pageHeaderWithAccountIconAt4af92c6c | 2.84 | 2.90 | +0.06 ↑ | Improved calculation |

### Trends Chart Impact

**Before Migration:**
```
C01-Detailed Trend:
2026-03-12: 2.82 (avg of 2.64, 2.99)  ← OLD scores
2026-03-13: 2.82 (avg of 2.64, 2.99)  ← OLD scores
2026-03-17: 2.82 (avg of 2.64, 2.99)  ← OLD scores
2026-03-18: 2.89 (avg of 2.81, 2.96)  ← NEW scores ⚠️ JUMP!
```

**After Migration:**
```
C01-Detailed Trend:
2026-03-12: 2.89 (avg of 2.81, 2.96)  ← Updated to NEW
2026-03-13: 2.89 (avg of 2.81, 2.96)  ← Updated to NEW
2026-03-17: 2.89 (avg of 2.81, 2.96)  ← Updated to NEW
2026-03-18: 2.89 (avg of 2.81, 2.96)  ← Already NEW ✓ FLAT
```

### Why This Matters

✅ **Consistent trends**: No artificial jumps from methodology changes
✅ **Accurate comparison**: All historical data uses same scoring methodology
✅ **Preserved history**: Original scores stored in `originalScoresV0`
✅ **Audit trail**: Every change documented with timestamp and reason

## 🔒 Safety Measures

### 1. Automatic Backup
- Every run creates a timestamped backup
- Stored in `generated/backups/`
- Can restore by copying back to `generated/trends.json`

### 2. Dry Run Mode
- Test before applying changes
- See exactly what will change
- No risk of data loss

### 3. Audit Trail
- Original scores preserved in `originalScores`
- Migration metadata in `_migrated` field
- Original batch metrics in `originalMetrics`

### 4. Validation
- Checks for missing components
- Handles errors gracefully
- Reports all issues

## 📈 Impact on Trends Charts

### Before Migration
- Charts show historical scores (outdated)
- Inconsistent with current metadata
- C10-Simple average: 2.67

### After Migration
- Charts show current assessment (accurate)
- Consistent with current metadata
- C10-Simple average: 2.73 (updated)
- Historical data updated retroactively

---

## 🔄 Rollback Procedure

### Rollback Component Metadata (Phase 1)

**Option 1: Git Restore**
```bash
# Restore specific components
git restore generated/c/verticalNavMenuWith5Items887d3dcb/metadata.json

# Restore ALL metadata files
git restore generated/c/*/metadata.json
```

**Option 2: Remove Versioned Fields**
```bash
# Remove originalScoresV0 and _scoreHistory from all metadata files
# This requires a script - contact maintainer if needed
```

### Rollback Trends Data (Phase 2)

**Option 1: Restore from Backup**
```bash
# Find the backup file
ls -la generated/backups/

# Restore (replace [timestamp] with actual timestamp)
cp generated/backups/trends-backup-[timestamp].json generated/trends.json

# Verify restoration
jq '.metadata.lastUpdated, .snapshots[-1]._migration' generated/trends.json
```

**Option 2: Rebuild from Current Metadata**
```bash
# Remove trends.json
rm generated/trends.json

# Regenerate fresh snapshot (creates only today's snapshot)
npm run trends:snapshot

# Note: This loses ALL historical data! Only use if backups are unavailable.
```

### Restore Scores from Trends

If you accidentally restored metadata but need to reapply new scores:

```bash
# Run the restore script
node scripts/restore-scores-from-trends.cjs

# Then re-run component migration
npm run scores:migrate
```

## 📝 Post-Migration Tasks

### 1. Verify Trends Charts
- Refresh dashboard
- Check C10-Simple trend line
- Verify scores match current metadata

### 2. Update Documentation
- Document that scores have been updated
- Explain originalScores field
- Update any reports or exports

### 3. Commit Changes (Optional)
```bash
git add generated/trends.json
git commit -m "chore: migrate trends with updated component scores

- Retroactively updated all historical snapshots with current scores
- Preserved original scores in originalScores field
- Recalculated batch metrics
- Created backup before migration"
```

### 4. Prevent Future Issues

Add to package.json:
```json
{
  "scripts": {
    "prebuild": "npm run generate:templates"
    // Removed automatic trends:snapshot to prevent overwriting
  }
}
```

Run trends snapshot manually when needed:
```bash
npm run trends:snapshot
```

---

## 🎓 Best Practices

### When to Run Migration

✅ **Run complete migration when:**
- Linting rules have been updated (new rules, changed severity)
- Score calculation formula changed (weighting, normalization)
- Scoring methodology improved (fixed bugs, better algorithms)
- New scoring fields added (e.g., `slds_violation_density`)
- Batch recalculation of all historical scores needed

✅ **Run only Phase 1 (component metadata) when:**
- Want to preserve current scores before making changes
- Creating a checkpoint before experimenting with new formulas
- Need versioned score history without updating trends

✅ **Run only Phase 2 (trends) when:**
- Component metadata already has correct scores
- Need to fix inconsistent trend snapshots
- Restoring trends after accidental changes

❌ **Don't run migration when:**
- No scores have actually changed
- Just testing new components (use regular snapshot instead)
- Making temporary/experimental changes

### Migration Sequence

**Correct Order:**
```bash
1. npm run scores:migrate       # Phase 1: Version component scores
2. npm run trends:migrate       # Phase 2: Update trend snapshots
3. npm run trends:snapshot      # Optional: Add new snapshot for today
```

**Why This Order:**
- Phase 1 ensures component metadata has current scores
- Phase 2 reads from component metadata to update trends
- Phase 3 creates a fresh snapshot with current state

### Maintaining Data Integrity

**Before Migration:**
1. ✅ Commit any pending changes to git
2. ✅ Run dry-run for both phases
3. ✅ Review expected changes carefully
4. ✅ Ensure no builds are running
5. ✅ Document reason for migration

**During Migration:**
1. ✅ Keep backups (trends migration creates automatic backups)
2. ✅ Monitor output for errors
3. ✅ Don't interrupt the process

**After Migration:**
1. ✅ Verify component metadata has `originalScoresV0`
2. ✅ Verify trends.json has updated scores
3. ✅ Check trends chart in dashboard
4. ✅ Commit changes with descriptive message
5. ✅ Keep backup files until verified

### Version Management

**Score Version Increments:**
```bash
# First migration
npm run scores:migrate --version=0  # Creates originalScoresV0

# Second migration (future)
npm run scores:migrate --version=1  # Creates originalScoresV1

# Third migration (future)
npm run scores:migrate --version=2  # Creates originalScoresV2
```

**Each component will have:**
```json
{
  "scores": { /* current */ },
  "originalScoresV0": { /* first version */ },
  "originalScoresV1": { /* second version */ },
  "originalScoresV2": { /* third version */ },
  "_scoreHistory": {
    "originalScoresV0": { /* change log */ },
    "originalScoresV1": { /* change log */ },
    "originalScoresV2": { /* change log */ }
  }
}
```

### Preventing Future Issues

**1. Immutable Daily Snapshots**

The trends snapshot script already prevents overwriting existing snapshots for the same date:
```javascript
// In generate-trends-snapshot.cjs
if (hasTodaySnapshot(trendsData)) {
  console.log('✅ Snapshot already exists for today.');
  return; // Don't overwrite!
}
```

**2. Component Metadata as Source of Truth**

Component `metadata.json` files are the authoritative source:
- Trends snapshots **read from** component metadata
- Never manually edit trends.json scores
- Always update component metadata first, then regenerate trends

**3. Git-Based Score Tracking**

The migration script uses git to track score history:
- Reads from `HEAD` for committed files
- Reads from staging area for new files
- Preserves complete audit trail

## 📞 Support

If issues arise during migration:

1. Check backup exists: `ls -la generated/backups/`
2. Review error logs in migration output
3. Restore from backup if needed
4. Run dry-run to diagnose issues
5. Check metadata files are valid JSON

---

## ✅ Complete Migration Checklist

### Pre-Migration Checklist

**Preparation:**
- [ ] Read this entire document
- [ ] Understand why migration is needed
- [ ] Identify which phase(s) to run
- [ ] Commit pending changes to git
- [ ] Ensure dev server is stopped

**Validation:**
- [ ] Run `npm run scores:migrate:dry-run`
- [ ] Run `npm run trends:migrate:dry-run`
- [ ] Review expected score changes
- [ ] Verify backup directory exists (`generated/backups/`)
- [ ] Check disk space (backups can be large)

### Migration Execution Checklist

**Phase 1: Component Metadata**
- [ ] Run `npm run scores:migrate`
- [ ] Verify: `grep -l "originalScoresV0" generated/c/*/metadata.json | wc -l`
- [ ] Check a sample component metadata file
- [ ] No errors in output

**Phase 2: Trends Snapshots**
- [ ] Run `npm run trends:migrate`
- [ ] Verify backup created in `generated/backups/`
- [ ] Check migration report for warnings
- [ ] Verify trends.json updated

**Optional: New Snapshot**
- [ ] Run `npm run trends:snapshot` (if needed)
- [ ] Verify new snapshot added

### Post-Migration Checklist

**Verification:**
- [ ] Component metadata has `originalScoresV0` field
- [ ] Component metadata has `_scoreHistory` field
- [ ] Trends.json has `originalScores` in snapshot components
- [ ] Trends.json has `_migrated` field in components
- [ ] Trends.json has `_migration` field in snapshots
- [ ] Backup file exists and is valid JSON

**Dashboard Verification:**
- [ ] Open dashboard in browser
- [ ] Navigate to Trends tab
- [ ] Select C01-Detailed (or any component batch)
- [ ] Verify trend line is consistent (no artificial jumps)
- [ ] Check tooltip shows correct scores

**Git Commit:**
- [ ] Stage modified metadata files
- [ ] Stage updated trends.json
- [ ] Stage updated migration scripts (if changed)
- [ ] Commit with descriptive message
- [ ] Push to remote (if applicable)

**Documentation:**
- [ ] Update CHANGELOG with migration details
- [ ] Notify team of migration
- [ ] Document reason for score changes

---

## 🔧 Troubleshooting

### Issue: "originalScoresV0 already exists"

**Cause**: Component already has version 0, trying to re-run migration

**Solution**: Increment version number:
```bash
npm run scores:migrate -- --version=1  # Use V1 instead
```

### Issue: Trends chart still shows jump

**Cause**: Trends migration not run after component migration

**Solution**: Run Phase 2:
```bash
npm run trends:migrate
```

### Issue: Some components missing originalScoresV0

**Cause**: Components not in git (completely new, not staged)

**Expected**: Only components with git history get versioned scores

**Solution**: This is normal for brand new components

### Issue: Score changes look wrong

**Cause**: Check if you restored files accidentally

**Solution**: Use restore script:
```bash
node scripts/restore-scores-from-trends.cjs
npm run scores:migrate
```

### Issue: Migration script errors

**Cause**: Corrupted metadata.json or trends.json

**Solution**:
1. Check JSON syntax: `jq . generated/trends.json > /dev/null`
2. Restore from backup if needed
3. Fix invalid JSON files

---

## 📞 Support & Resources

### Migration Scripts

- **Component Migration**: `scripts/migrate-component-scores-with-versioning.cjs`
- **Trends Migration**: `scripts/migrate-trends-with-updated-scores.cjs`
- **Score Restoration**: `scripts/restore-scores-from-trends.cjs`

### npm Scripts

```json
{
  "scores:migrate": "node scripts/migrate-component-scores-with-versioning.cjs",
  "scores:migrate:dry-run": "node scripts/migrate-component-scores-with-versioning.cjs --dry-run",
  "trends:migrate": "node scripts/migrate-trends-with-updated-scores.cjs",
  "trends:migrate:dry-run": "node scripts/migrate-trends-with-updated-scores.cjs --dry-run",
  "trends:snapshot": "node scripts/generate-trends-snapshot.cjs",
  "trends:snapshot:quiet": "node scripts/generate-trends-snapshot-quiet.cjs"
}
```

### Claude Commands for Automated Migration

**Quick Migration (with automatic detection):**
```
"Migrate component scores"
"Run score migration workflow"
"Update trends with new scores"
```

**With specific version:**
```
"Migrate scores to version 1"
"Run component migration with V2"
```

**Dry-run first (recommended):**
```
"Show me what migration would change"
"Preview score migration impact"
"Analyze components for migration"
```

### Data Locations

- **Component Metadata**: `generated/c/*/metadata.json`
- **Trends Data**: `generated/trends.json`
- **Backups**: `generated/backups/trends-backup-*.json`
- **Documentation**: `docs/TRENDS_MIGRATION_PLAN.md`

### Quick Reference Commands

```bash
# Full migration workflow
npm run scores:migrate:dry-run    # Preview Phase 1
npm run scores:migrate             # Apply Phase 1
npm run trends:migrate:dry-run    # Preview Phase 2
npm run trends:migrate             # Apply Phase 2

# Verification
jq '{componentName, scores, originalScoresV0}' \
  generated/c/verticalNavMenuWith5Items887d3dcb/metadata.json

jq '.snapshots[-1].components[0] |
    {componentName, originalScores, scores, _migrated}' \
  generated/trends.json

# Rollback
cp generated/backups/trends-backup-*.json generated/trends.json
git restore generated/c/*/metadata.json
```

---

## 📝 Summary

### Two-Phase Approach

1. **Phase 1: Component Metadata** - Version scores in `metadata.json` files
2. **Phase 2: Trends Snapshots** - Update historical snapshots in `trends.json`

### Key Benefits

✅ Complete score version history
✅ Consistent trend charts (no artificial jumps)
✅ Full audit trail with timestamps
✅ Automatic backups
✅ Rollback capability
✅ Git-based change tracking

### When You're Done

After successful migration:
- Component metadata files have `originalScoresV0` and `_scoreHistory`
- Trends.json snapshots have updated scores with `originalScores` preserved
- Trend charts show consistent scoring across all dates
- Full backup exists in `generated/backups/`
- Changes are committed to git with clear message

---

## 🎯 Quick Reference Card

### **For Automated Migration (Recommended)**
```
Simply say: "Migrate component scores and update trends"

Claude will:
1. ✓ Detect version automatically
2. ✓ Show migration plan
3. ✓ Execute both phases
4. ✓ Verify completion
5. ✓ Offer to stage/commit
```

### **For Manual Migration (Advanced)**
```bash
# Phase 1: Component metadata
npm run scores:migrate:dry-run  # Preview
npm run scores:migrate          # Execute

# Phase 2: Trends snapshots
npm run trends:migrate:dry-run  # Preview
npm run trends:migrate          # Execute
```

### **For Rollback**
```bash
# Restore trends from backup
cp generated/backups/trends-backup-*.json generated/trends.json

# Restore component metadata
git restore generated/c/*/metadata.json
```

### **For Verification**
```bash
# Check component metadata
jq '{scores, originalScoresV0, _scoreHistory}' \
  generated/c/userProfileFormNameTextEmailC8b10de5/metadata.json

# Check trends consistency
jq '.snapshots[-1].components[0].scores' generated/trends.json
```

---

**Last Updated**: 2026-03-19
**Migration Version**: V0 (First automated workflow)
**Components Migrated**: 63
**Snapshots Updated**: 14
**Workflow**: Automated + Manual (both supported)
