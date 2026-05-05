# SLDS Score Migration Script

The migration script has been moved to the main project to use adk-score for consistency with production code.

## Location

**New Location**: `../lgpt-experts-lwc/scripts/migrate-slds-scores.ts`

## Usage

```bash
# From this directory (playground)
npx tsx ../lgpt-experts-lwc/scripts/migrate-slds-scores.ts

# Or from main project
cd ../lgpt-experts-lwc
npx tsx scripts/migrate-slds-scores.ts --playground-path=../lwc-slds-lbc-starter
```

## Options

- `--dry-run` - Show what would change without writing files
- `--verbose` - Show detailed scoring for each component
- `--playground-path=<path>` - Specify playground location (default: ../lwc-slds-lbc-starter)

## Why TypeScript + adk-score?

The new script uses the exact same logic as `scoreComponentSlds.ts`:
- ✅ Uses adk-score's `readinessScore()` function
- ✅ Creates SARIF reports from errorsByType
- ✅ Applies same normalization and penalty multipliers
- ✅ Calculates readiness labels consistently
- ✅ Ensures production and migration scores match exactly

## Old Script

The old Node.js version (`migrate-slds-scores.cjs.old`) used manual calculations that had slight floating point differences from adk-score. The new TypeScript version ensures perfect consistency with production scoring.
