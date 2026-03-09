#!/usr/bin/env node

/**
 * Fixes missing screenshotUrls in metadata.json files
 * Adds screenshotUrls field for components that have screenshots but missing the field
 */

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');

function fixMissingScreenshotUrls() {
  console.log('🔍 Checking for missing screenshotUrls in metadata...\n');

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
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    // Check if screenshotUrls already exists
    if (metadata.screenshotUrls) {
      skipped++;
      continue;
    }

    // Add screenshotUrls
    metadata.screenshotUrls = {
      desktop: `generated/c/${componentName}/screenshots/desktop.png`
    };

    // Write back
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`✅ Fixed ${componentName}`);
    fixed++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${componentDirs.length}`);

  if (fixed > 0) {
    console.log('\n💡 Run "npm run generate:templates" to update components.json');
  }
}

// Run the script
fixMissingScreenshotUrls();
