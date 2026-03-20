#!/usr/bin/env node

/**
 * Restore Scores from Trends
 *
 * This script restores the latest scores from trends.json back to component metadata files.
 * Useful after accidentally reverting metadata files.
 */

const fs = require('fs');
const path = require('path');

const TRENDS_FILE = path.join(__dirname, '..', 'generated', 'trends.json');
const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');

function main() {
  console.log('🔄 Restoring scores from trends.json to metadata files...\n');

  // Read trends.json
  const trendsData = JSON.parse(fs.readFileSync(TRENDS_FILE, 'utf-8'));
  const latestSnapshot = trendsData.snapshots[trendsData.snapshots.length - 1];

  if (!latestSnapshot || !latestSnapshot.components) {
    console.error('❌ No snapshot data found in trends.json');
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  // Update each component
  for (const component of latestSnapshot.components) {
    const componentDir = fs.readdirSync(GENERATED_DIR).find(dir =>
      dir.includes(component.componentName)
    );

    if (!componentDir) {
      console.log(`⚠️  Component directory not found: ${component.componentName}`);
      skipped++;
      continue;
    }

    const metadataPath = path.join(GENERATED_DIR, componentDir, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      console.log(`⚠️  Metadata file not found: ${componentDir}`);
      skipped++;
      continue;
    }

    // Read current metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    // Update scores from trends
    metadata.scores = {
      ...metadata.scores,
      ...component.scores
    };

    // Write back
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    updated++;
  }

  console.log(`✅ Updated ${updated} metadata files`);
  if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} components`);
  }
  console.log('\n💡 Now run: npm run scores:migrate\n');
}

try {
  main();
} catch (error) {
  console.error('💥 Error:', error.message);
  process.exit(1);
}
