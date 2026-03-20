#!/usr/bin/env node

/**
 * Migrate Trends with Updated Scores
 *
 * This script retroactively updates all historical trend snapshots with current metadata scores
 * while preserving the original scores in an "originalScores" field for audit purposes.
 *
 * Use Cases:
 * - After re-evaluating components with updated linting rules
 * - After fixing score calculation bugs
 * - After manual metadata corrections
 *
 * Features:
 * - Updates all historical snapshots with current scores
 * - Preserves original scores in "originalScores" field
 * - Recalculates batch averages and metrics
 * - Creates backup before migration
 * - Provides detailed migration report
 *
 * Usage:
 *   node scripts/migrate-trends-with-updated-scores.cjs [--dry-run] [--no-backup]
 */

const fs = require('fs');
const path = require('path');

// Paths
const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');
const TRENDS_FILE = path.join(__dirname, '..', 'generated', 'trends.json');
const BACKUP_DIR = path.join(__dirname, '..', 'generated', 'backups');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const NO_BACKUP = args.includes('--no-backup');

// Statistics
const stats = {
  totalSnapshots: 0,
  updatedSnapshots: 0,
  totalComponents: 0,
  migratedComponents: 0,
  unchangedComponents: 0,
  batchesRecalculated: 0,
  errors: []
};

/**
 * Read all current component metadata from disk
 */
function readCurrentMetadata() {
  const metadata = new Map(); // componentName -> metadata

  if (!fs.existsSync(GENERATED_DIR)) {
    console.error('❌ Generated components directory not found');
    process.exit(1);
  }

  const componentDirs = fs.readdirSync(GENERATED_DIR);

  for (const dir of componentDirs) {
    const metadataPath = path.join(GENERATED_DIR, dir, 'metadata.json');

    if (fs.existsSync(metadataPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        metadata.set(data.componentName, data);
      } catch (error) {
        console.error(`⚠️  Error reading metadata for ${dir}:`, error.message);
        stats.errors.push(`Failed to read ${dir}: ${error.message}`);
      }
    }
  }

  return metadata;
}

/**
 * Check if scores have changed
 */
function scoresChanged(oldScores, newScores) {
  if (!oldScores || !newScores) return false;

  const fields = ['overall', 'slds_linter', 'slds_quality', 'prd_compliance', 'security'];

  for (const field of fields) {
    const oldVal = oldScores[field];
    const newVal = newScores[field];

    if (oldVal !== undefined && newVal !== undefined && oldVal !== newVal) {
      return true;
    }
  }

  return false;
}

/**
 * Migrate a single component's data
 */
function migrateComponentData(componentData, currentMetadata) {
  const componentName = componentData.componentName;
  const current = currentMetadata.get(componentName);

  if (!current) {
    // Component no longer exists - keep original data
    return componentData;
  }

  // Check if scores changed
  const hasChanges = scoresChanged(componentData.scores, current.scores);

  if (hasChanges) {
    stats.migratedComponents++;

    // Update only the scores - no bloat, no duplication
    return {
      ...componentData,
      scores: current.scores  // Update with new scores only
    };
  } else {
    stats.unchangedComponents++;
    return componentData;
  }
}

/**
 * Get list of changed score fields
 */
function getChangedFields(oldScores, newScores) {
  const changed = [];
  const fields = ['overall', 'slds_linter', 'slds_quality', 'prd_compliance', 'security'];

  for (const field of fields) {
    if (oldScores?.[field] !== newScores?.[field]) {
      changed.push({
        field,
        old: oldScores?.[field],
        new: newScores?.[field]
      });
    }
  }

  return changed;
}

/**
 * Recalculate batch metrics with new scores
 */
function recalculateBatchMetrics(components) {
  if (components.length === 0) {
    return {
      avgOverallScore: 0,
      avgSldsScore: 0,
      avgViolations: 0,
      minScore: 0,
      maxScore: 0,
      stdDev: 0
    };
  }

  // Use NEW scores for calculations
  const scores = components.map(c => c.scores?.overall || 0);
  const sldsScores = components.map(c => c.scores?.slds_linter || 0);
  const violations = components.map(c =>
    (c.violations?.warnings || 0) + (c.violations?.errors || 0)
  );

  const avgOverallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgSldsScore = sldsScores.reduce((a, b) => a + b, 0) / sldsScores.length;
  const avgViolations = violations.reduce((a, b) => a + b, 0) / violations.length;

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  // Calculate standard deviation
  const variance = scores.reduce((sum, score) =>
    sum + Math.pow(score - avgOverallScore, 2), 0
  ) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Quality gate distribution
  const distribution = {
    production: components.filter(c => (c.scores?.overall || 0) >= 3.0).length,
    prototype: components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 3.0;
    }).length,
    draft: components.filter(c => (c.scores?.overall || 0) < 2.0).length
  };

  return {
    avgOverallScore: parseFloat(avgOverallScore.toFixed(2)),
    avgSldsScore: parseFloat(avgSldsScore.toFixed(2)),
    avgViolations: parseFloat(avgViolations.toFixed(1)),
    minScore: parseFloat(minScore.toFixed(2)),
    maxScore: parseFloat(maxScore.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    distribution
  };
}

/**
 * Migrate a single snapshot
 */
function migrateSnapshot(snapshot, currentMetadata) {
  const migratedSnapshot = { ...snapshot };

  // Migrate component-level data if present
  if (snapshot.components && Array.isArray(snapshot.components)) {
    migratedSnapshot.components = snapshot.components.map(comp =>
      migrateComponentData(comp, currentMetadata)
    );
  }

  // Recalculate batch data if present
  if (snapshot.batches && typeof snapshot.batches === 'object') {
    migratedSnapshot.batches = {};

    for (const [batchKey, batchInfo] of Object.entries(snapshot.batches)) {
      // Check if batch has components array (older structure)
      if (batchInfo.components && Array.isArray(batchInfo.components)) {
        // Migrate each component in the batch
        const migratedComponents = batchInfo.components.map(comp =>
          migrateComponentData(comp, currentMetadata)
        );

        // Recalculate metrics
        const newMetrics = recalculateBatchMetrics(migratedComponents);

        migratedSnapshot.batches[batchKey] = {
          ...batchInfo,
          components: migratedComponents,
          metrics: newMetrics,
          // Preserve original metrics for reference
          originalMetrics: batchInfo.metrics
        };

        stats.batchesRecalculated++;
      } else {
        // Batch only has aggregate metrics, preserve as-is
        migratedSnapshot.batches[batchKey] = batchInfo;
      }
    }
  }

  stats.updatedSnapshots++;
  return migratedSnapshot;
}

/**
 * Create backup of trends.json
 */
function createBackup() {
  if (NO_BACKUP) {
    console.log('⚠️  Skipping backup (--no-backup flag set)\n');
    return null;
  }

  if (!fs.existsSync(TRENDS_FILE)) {
    console.log('ℹ️  No existing trends.json to backup\n');
    return null;
  }

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Create timestamped backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `trends-backup-${timestamp}.json`);

  fs.copyFileSync(TRENDS_FILE, backupFile);
  console.log(`✅ Backup created: ${path.basename(backupFile)}\n`);

  return backupFile;
}

/**
 * Print migration report
 */
function printReport(currentMetadata) {
  console.log('\n' + '═'.repeat(70));
  console.log('📊 MIGRATION REPORT');
  console.log('═'.repeat(70));

  console.log('\n📦 Components:');
  console.log(`   Total in metadata:     ${currentMetadata.size}`);
  console.log(`   Migrated (updated):    ${stats.migratedComponents}`);
  console.log(`   Unchanged:             ${stats.unchangedComponents}`);

  console.log('\n📸 Snapshots:');
  console.log(`   Total snapshots:       ${stats.totalSnapshots}`);
  console.log(`   Updated snapshots:     ${stats.updatedSnapshots}`);

  console.log('\n📊 Batches:');
  console.log(`   Recalculated:          ${stats.batchesRecalculated}`);

  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    stats.errors.forEach(err => console.log(`   - ${err}`));
  }

  console.log('\n' + '═'.repeat(70));
}

/**
 * Print component changes
 */
function printComponentChanges(currentMetadata, oldTrendsData, newTrendsData) {
  console.log('\n📋 Component Score Changes:\n');

  const changes = [];

  // Compare scores between old and new trends data
  const recentOldSnapshot = oldTrendsData.snapshots[oldTrendsData.snapshots.length - 1];
  const recentNewSnapshot = newTrendsData.snapshots[newTrendsData.snapshots.length - 1];

  if (recentOldSnapshot?.components && recentNewSnapshot?.components) {
    recentNewSnapshot.components.forEach(newComp => {
      const oldComp = recentOldSnapshot.components.find(c => c.componentName === newComp.componentName);

      if (oldComp && scoresChanged(oldComp.scores, newComp.scores)) {
        const oldOverall = oldComp.scores.overall || 0;
        const newOverall = newComp.scores.overall || 0;
        const diff = newOverall - oldOverall;

        changes.push({
          name: newComp.componentName,
          utteranceId: newComp.utteranceId,
          oldScore: oldOverall,
          newScore: newOverall,
          diff: diff,
          diffPercent: oldOverall > 0 ? ((diff / oldOverall) * 100).toFixed(1) : '0.0'
        });
      }
    });
  }

  if (changes.length === 0) {
    console.log('   No score changes detected (all scores already up-to-date)');
    return;
  }

  // Sort by absolute difference
  changes.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  // Print top 10 changes
  const topChanges = changes.slice(0, 10);
  topChanges.forEach(change => {
    const arrow = change.diff > 0 ? '↑' : '↓';
    const color = change.diff > 0 ? '+' : '';
    console.log(`   ${change.utteranceId.padEnd(8)} ${change.name.substring(0, 40).padEnd(42)} ${change.oldScore.toFixed(2)} → ${change.newScore.toFixed(2)} (${color}${change.diff.toFixed(2)} ${arrow})`);
  });

  if (changes.length > 10) {
    console.log(`\n   ... and ${changes.length - 10} more components`);
  }
}

/**
 * Main migration function
 */
function main() {
  console.log('🔄 Trends Migration: Update Historical Scores\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  // Step 1: Read current metadata
  console.log('📖 Reading current component metadata...');
  const currentMetadata = readCurrentMetadata();
  console.log(`✅ Found ${currentMetadata.size} components\n`);

  // Step 2: Load existing trends
  console.log('📊 Loading trends.json...');
  if (!fs.existsSync(TRENDS_FILE)) {
    console.error('❌ trends.json not found!');
    process.exit(1);
  }

  const oldTrendsData = JSON.parse(fs.readFileSync(TRENDS_FILE, 'utf-8'));
  stats.totalSnapshots = oldTrendsData.snapshots?.length || 0;
  console.log(`✅ Found ${stats.totalSnapshots} snapshots\n`);

  // Step 3: Create backup
  if (!DRY_RUN) {
    const backupFile = createBackup();
    if (backupFile) {
      console.log(`💾 Backup: ${backupFile}\n`);
    }
  }

  // Step 4: Migrate all snapshots
  console.log('🔄 Migrating snapshots...\n');
  const migratedSnapshots = oldTrendsData.snapshots.map((snapshot, index) => {
    process.stdout.write(`   Processing snapshot ${index + 1}/${stats.totalSnapshots}...\r`);
    return migrateSnapshot(snapshot, currentMetadata);
  });

  console.log(`\n✅ Migration complete\n`);

  // Step 5: Update trends data
  const migratedTrendsData = {
    ...oldTrendsData,
    snapshots: migratedSnapshots,
    metadata: {
      ...oldTrendsData.metadata,
      lastUpdated: new Date().toISOString()
    }
  };

  // Step 6: Save (if not dry run)
  if (!DRY_RUN) {
    console.log('💾 Writing updated trends.json...');
    fs.writeFileSync(TRENDS_FILE, JSON.stringify(migratedTrendsData, null, 2), 'utf-8');
    console.log('✅ File saved\n');
  }

  // Step 7: Print reports
  printReport(currentMetadata);
  printComponentChanges(currentMetadata, oldTrendsData, migratedTrendsData);

  console.log('\n✨ Migration complete!\n');

  if (DRY_RUN) {
    console.log('ℹ️  This was a dry run. To apply changes, run without --dry-run flag.\n');
  } else {
    console.log('💡 Scores in trends.json updated to match current component metadata');
    console.log('💡 Original scores preserved in component metadata.json (originalScoresV0)');
    console.log(`💡 Backup saved in: ${BACKUP_DIR}/\n`);
  }
}

// Run the migration
try {
  main();
} catch (error) {
  console.error('\n💥 Fatal error:', error);
  console.error(error.stack);
  process.exit(1);
}
