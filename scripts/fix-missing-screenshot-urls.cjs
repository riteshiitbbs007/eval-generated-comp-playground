#!/usr/bin/env node

/**
 * Fixes missing screenshotUrls in metadata.json files
 * Adds screenshotUrls field for components that have screenshots but missing the field
 */

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');

function fixMissingScreenshotUrls() {
  console.log('\n🔧 Updating metadata files with screenshot URLs...\n');

  const componentDirs = fs.readdirSync(GENERATED_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  let fixed = 0;
  let skipped = 0;

  for (const componentName of componentDirs) {
    const metadataPath = path.join(GENERATED_DIR, componentName, 'metadata.json');
    const screenshotPath = path.join(GENERATED_DIR, componentName, 'screenshots', 'desktop.png');

    if (!fs.existsSync(metadataPath)) {
      console.log(`⚠️  No metadata.json for ${componentName}`);
      continue;
    }

    // Check if screenshot exists
    const hasScreenshot = fs.existsSync(screenshotPath);

    if (!hasScreenshot) {
      skipped++;
      continue;
    }

    // Read metadata
    let metadata;
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    } catch (error) {
      console.log(`⚠️  Failed to parse metadata for ${componentName}: ${error.message}`);
      continue;
    }

    // Validate metadata has essential fields (detect corruption early)
    const hasEssentialFields = metadata.componentName && (
      metadata.timestamp || metadata.folderName
    );

    if (!hasEssentialFields) {
      console.log(`⚠️  Metadata appears incomplete for ${componentName} - skipping to prevent corruption`);
      console.log(`    Present fields: ${Object.keys(metadata).join(', ')}`);
      skipped++;
      continue;
    }

    // Check if screenshotUrls already exists and points to correct location
    const expectedUrl = `generated/c/${componentName}/screenshots/desktop.png`;
    if (metadata.screenshotUrls?.desktop === expectedUrl) {
      skipped++;
      continue;
    }

    // Add or update screenshotUrls (preserve all other fields)
    metadata.screenshotUrls = {
      ...metadata.screenshotUrls, // Preserve any existing screenshot URLs
      desktop: expectedUrl
    };

    // Write back with proper formatting
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n', 'utf8');
    console.log(`✅ Fixed ${componentName}`);
    fixed++;
  }

  if (fixed > 0) {
    console.log(`\n✅ Updated ${fixed} metadata file${fixed === 1 ? '' : 's'} with screenshot URLs`);
  } else {
    console.log(`\n✅ All metadata files already have screenshot URLs (checked ${componentDirs.length} components)`);
  }
}

// Run the script
fixMissingScreenshotUrls();
