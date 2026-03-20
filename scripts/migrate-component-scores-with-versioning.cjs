#!/usr/bin/env node

/**
 * Migrate Component Scores with Versioning
 *
 * This script adds versioned originalScores to component metadata files.
 * It reads the OLD scores from git-staged versions and stores them as originalScoresV0, V1, etc.
 *
 * Usage:
 *   node scripts/migrate-component-scores-with-versioning.cjs [--dry-run] [--version=0]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERSION_ARG = args.find(arg => arg.startsWith('--version='));
const VERSION = VERSION_ARG ? parseInt(VERSION_ARG.split('=')[1]) : 0;

// Statistics
const stats = {
  totalComponents: 0,
  migratedComponents: 0,
  unchangedComponents: 0,
  errors: []
};

/**
 * Get old scores from git for a component
 */
function getOldScoresFromGit(metadataPath) {
  const relativePath = metadataPath.replace(process.cwd() + '/', '');

  try {
    // Try to get from HEAD first (committed version)
    const gitCommand = `git show HEAD:${relativePath}`;
    const oldContent = execSync(gitCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const oldMetadata = JSON.parse(oldContent);
    return oldMetadata.scores || null;
  } catch (headError) {
    // File not in HEAD, try staging area (index)
    try {
      const gitCommand = `git show :${relativePath}`;
      const oldContent = execSync(gitCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
      const oldMetadata = JSON.parse(oldContent);
      return oldMetadata.scores || null;
    } catch (indexError) {
      // File might be completely new or not in git
      return null;
    }
  }
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
 * Get changed fields
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
 * Migrate a single component metadata file
 */
function migrateComponentMetadata(metadataPath) {
  try {
    // Read current metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const currentScores = metadata.scores;

    if (!currentScores) {
      return false; // No scores to migrate
    }

    // Get old scores from git
    const oldScores = getOldScoresFromGit(metadataPath);

    if (!oldScores) {
      // No old version in git, skip
      stats.unchangedComponents++;
      return false;
    }

    // Check if scores changed
    if (!scoresChanged(oldScores, currentScores)) {
      stats.unchangedComponents++;
      return false;
    }

    // Add versioned original scores
    const versionKey = `originalScoresV${VERSION}`;

    // Check if this version already exists
    if (metadata[versionKey]) {
      console.log(`⚠️  ${metadata.componentName} already has ${versionKey}, skipping`);
      stats.unchangedComponents++;
      return false;
    }

    // Create migration metadata
    const migratedMetadata = {
      ...metadata,
      [versionKey]: oldScores,
      _scoreHistory: {
        ...(metadata._scoreHistory || {}),
        [versionKey]: {
          date: new Date().toISOString(),
          reason: 'Score recalculation/metadata update',
          changedFields: getChangedFields(oldScores, currentScores)
        }
      }
    };

    // Write back (if not dry run)
    if (!DRY_RUN) {
      fs.writeFileSync(metadataPath, JSON.stringify(migratedMetadata, null, 2), 'utf-8');
    }

    stats.migratedComponents++;
    return {
      componentName: metadata.componentName,
      oldScores,
      newScores: currentScores,
      changedFields: getChangedFields(oldScores, currentScores)
    };

  } catch (error) {
    stats.errors.push(`Failed to migrate ${metadataPath}: ${error.message}`);
    return false;
  }
}

/**
 * Print migration report
 */
function printReport(changes) {
  console.log('\n' + '═'.repeat(70));
  console.log('📊 MIGRATION REPORT');
  console.log('═'.repeat(70));

  console.log('\n📦 Components:');
  console.log(`   Total processed:       ${stats.totalComponents}`);
  console.log(`   Migrated (updated):    ${stats.migratedComponents}`);
  console.log(`   Unchanged:             ${stats.unchangedComponents}`);
  console.log(`   Version key:           originalScoresV${VERSION}`);

  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    stats.errors.forEach(err => console.log(`   - ${err}`));
  }

  if (changes.length > 0) {
    console.log('\n📋 Component Score Changes:\n');

    // Sort by absolute difference in overall score
    changes.sort((a, b) => {
      const diffA = Math.abs((a.newScores.overall || 0) - (a.oldScores.overall || 0));
      const diffB = Math.abs((b.newScores.overall || 0) - (b.oldScores.overall || 0));
      return diffB - diffA;
    });

    // Print top 10 changes
    const topChanges = changes.slice(0, 10);
    topChanges.forEach(change => {
      const oldOverall = change.oldScores.overall || 0;
      const newOverall = change.newScores.overall || 0;
      const diff = newOverall - oldOverall;
      const arrow = diff > 0 ? '↑' : '↓';
      const sign = diff > 0 ? '+' : '';

      console.log(`   ${change.componentName.substring(0, 45).padEnd(47)} ${oldOverall.toFixed(2)} → ${newOverall.toFixed(2)} (${sign}${diff.toFixed(2)} ${arrow})`);
    });

    if (changes.length > 10) {
      console.log(`\n   ... and ${changes.length - 10} more components`);
    }
  }

  console.log('\n' + '═'.repeat(70));
}

/**
 * Main migration function
 */
function main() {
  console.log(`🔄 Component Score Migration: Add originalScoresV${VERSION}\n`);

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  // Step 1: Find all component metadata files
  console.log('📖 Reading component metadata files...');

  if (!fs.existsSync(GENERATED_DIR)) {
    console.error('❌ Generated components directory not found');
    process.exit(1);
  }

  const componentDirs = fs.readdirSync(GENERATED_DIR);
  const changes = [];

  // Step 2: Process each component
  console.log('🔄 Processing components...\n');

  for (const dir of componentDirs) {
    const metadataPath = path.join(GENERATED_DIR, dir, 'metadata.json');

    if (fs.existsSync(metadataPath)) {
      stats.totalComponents++;
      const result = migrateComponentMetadata(metadataPath);

      if (result) {
        changes.push(result);
      }
    }
  }

  console.log(`\n✅ Processing complete\n`);

  // Step 3: Print report
  printReport(changes);

  console.log('\n✨ Migration complete!\n');

  if (DRY_RUN) {
    console.log('ℹ️  This was a dry run. To apply changes, run without --dry-run flag.\n');
  } else {
    console.log(`💡 Original scores are preserved in "originalScoresV${VERSION}" field`);
    console.log('💡 Score history is tracked in "_scoreHistory" field');
    console.log('💡 Run "npm run trends:snapshot" to update trends.json\n');
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
