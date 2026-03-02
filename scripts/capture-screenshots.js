#!/usr/bin/env node

/**
 * Screenshot Capture Script with Playwright
 *
 * Captures screenshots for components with missing screenshots.
 * Supports multiple viewports (desktop, tablet, mobile).
 *
 * Usage:
 *   node scripts/capture-screenshots.js
 *   CAPTURE_VIEWPORTS="desktop,tablet,mobile" node scripts/capture-screenshots.js
 *   node scripts/capture-screenshots.js --component=componentName
 *   node scripts/capture-screenshots.js --all
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Viewport configurations
const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

// Configure which viewports to capture via environment variable
// Default: desktop only
// Options: "desktop", "desktop,tablet", "desktop,tablet,mobile"
const CAPTURE_VIEWPORTS = (process.env.CAPTURE_VIEWPORTS || 'desktop')
  .split(',')
  .map((v) => v.trim())
  .filter((v) => VIEWPORTS[v]);

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const COMPONENTS_JSON = path.join(__dirname, '../generated/components.json');
const GENERATED_DIR = path.join(__dirname, '../generated/c');

// Parse command line arguments
const args = process.argv.slice(2);
const forceAll = args.includes('--all');
const specificComponent = args.find(arg => arg.startsWith('--component='))?.split('=')[1];

/**
 * Check if a component has a specific screenshot
 */
function hasScreenshot(componentName, viewport) {
  const screenshotPath = path.join(GENERATED_DIR, componentName, 'screenshots', `${viewport}.png`);
  return fs.existsSync(screenshotPath);
}

/**
 * Find components missing screenshots
 */
function findComponentsMissingScreenshots(componentsList) {
  const components = [];

  for (const componentName of componentsList) {
    const componentPath = path.join(GENERATED_DIR, componentName);
    const screenshotsDir = path.join(componentPath, 'screenshots');

    if (!fs.existsSync(componentPath)) {
      console.warn(`⚠️  Component directory not found: ${componentName}`);
      continue;
    }

    const missingScreenshots = [];

    // Check if screenshots directory exists
    if (!fs.existsSync(screenshotsDir)) {
      missingScreenshots.push(...CAPTURE_VIEWPORTS);
    } else {
      // Check which specific screenshots are missing (only for configured viewports)
      for (const viewport of CAPTURE_VIEWPORTS) {
        if (!hasScreenshot(componentName, viewport)) {
          missingScreenshots.push(viewport);
        }
      }
    }

    if (missingScreenshots.length > 0) {
      components.push({
        name: componentName,
        path: componentPath,
        screenshotsDir,
        missingScreenshots,
      });
    }
  }

  return components;
}

/**
 * Ensure screenshots directory exists
 */
function ensureScreenshotsDir(componentName) {
  const screenshotsDir = path.join(GENERATED_DIR, componentName, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  return screenshotsDir;
}

/**
 * Capture screenshot for a specific viewport
 */
async function captureScreenshot(page, componentName, viewport, outputPath) {
  const { width, height } = VIEWPORTS[viewport];

  await page.setViewportSize({ width, height });

  const url = `${SERVER_URL}/?component=${componentName}`;
  console.log(`    📸 Capturing ${viewport} (${width}x${height})...`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Convert camelCase to kebab-case for component selector
    const kebabCaseName = componentName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');

    const selector = `c-${kebabCaseName}`;

    // Wait for component to be attached
    await page.waitForSelector(selector, {
      timeout: 10000,
      state: 'attached',
    });

    // Check if shadow DOM exists and has content
    const hasShadowContent = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;

      // Check for native shadow root
      if (el.shadowRoot && el.shadowRoot.childElementCount > 0) {
        return true;
      }

      // Check for synthetic shadow (LWC in compat mode)
      if (el.childElementCount > 0) {
        return true;
      }

      return false;
    }, selector);

    if (!hasShadowContent) {
      console.log(`    ⏳ Waiting for component to render...`);
      await page.waitForTimeout(3000);
    } else {
      // Wait for animations and fonts to load
      await page.waitForTimeout(2000);
    }

    // Capture screenshot
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
    });

    console.log(`    ✅ ${viewport} screenshot saved`);
    return true;

  } catch (error) {
    console.error(`    ❌ ${viewport} screenshot failed:`, error.message);
    return false;
  }
}

/**
 * Capture all missing screenshots for a component
 */
async function captureComponentScreenshots(browser, component) {
  console.log(`\n📷 Capturing screenshots for: ${component.name}`);

  // Ensure screenshots directory exists
  ensureScreenshotsDir(component.name);

  const page = await browser.newPage();
  const results = { success: [], failed: [] };

  for (const viewport of component.missingScreenshots) {
    const screenshotPath = path.join(component.screenshotsDir, `${viewport}.png`);
    const success = await captureScreenshot(page, component.name, viewport, screenshotPath);

    if (success) {
      results.success.push(viewport);
    } else {
      results.failed.push(viewport);
    }
  }

  await page.close();

  console.log(`  ✅ Success: ${results.success.join(', ') || 'none'}`);
  if (results.failed.length > 0) {
    console.log(`  ❌ Failed: ${results.failed.join(', ')}`);
  }

  return results;
}

/**
 * Test if server is running
 */
async function testServerConnection() {
  try {
    const response = await fetch(SERVER_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Screenshot Capture Script with Playwright\n');
  console.log(`📸 Configured viewports: ${CAPTURE_VIEWPORTS.join(', ')}`);
  console.log(`🌐 Server URL: ${SERVER_URL}`);
  console.log(`   (Set CAPTURE_VIEWPORTS="desktop,tablet,mobile" to capture all viewports)\n`);

  // Test server connection
  console.log('🔌 Testing server connection...');
  const serverRunning = await testServerConnection();

  if (!serverRunning) {
    console.error(`\n❌ Server is not running at ${SERVER_URL}`);
    console.error('   Please start the server first:');
    console.error('   npm start\n');
    process.exit(1);
  }
  console.log('✅ Server is running\n');

  // Read components manifest
  if (!fs.existsSync(COMPONENTS_JSON)) {
    console.error(`❌ Components manifest not found: ${COMPONENTS_JSON}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(COMPONENTS_JSON, 'utf8'));
  const allComponents = manifest.components || [];

  console.log(`📦 Found ${allComponents.length} components in manifest\n`);

  // Determine which components need screenshots
  let componentsToProcess = [];

  if (specificComponent) {
    if (allComponents.includes(specificComponent)) {
      // Force capture for specific component
      const componentPath = path.join(GENERATED_DIR, specificComponent);
      const screenshotsDir = path.join(componentPath, 'screenshots');
      componentsToProcess = [{
        name: specificComponent,
        path: componentPath,
        screenshotsDir,
        missingScreenshots: CAPTURE_VIEWPORTS, // Capture all configured viewports
      }];
      console.log(`🎯 Capturing screenshots for specific component: ${specificComponent}\n`);
    } else {
      console.error(`❌ Component not found in manifest: ${specificComponent}`);
      process.exit(1);
    }
  } else if (forceAll) {
    // Force re-capture all components
    componentsToProcess = allComponents.map(name => {
      const componentPath = path.join(GENERATED_DIR, name);
      const screenshotsDir = path.join(componentPath, 'screenshots');
      return {
        name,
        path: componentPath,
        screenshotsDir,
        missingScreenshots: CAPTURE_VIEWPORTS,
      };
    });
    console.log(`🔄 Re-capturing screenshots for all ${componentsToProcess.length} components\n`);
  } else {
    // Only capture missing screenshots
    componentsToProcess = findComponentsMissingScreenshots(allComponents);

    if (componentsToProcess.length === 0) {
      console.log('✅ All components already have screenshots!');
      console.log('💡 Use --all flag to re-capture all screenshots');
      console.log('💡 Use --component=name to capture a specific component');
      console.log('💡 Set CAPTURE_VIEWPORTS="desktop,tablet,mobile" for multiple viewports');
      return;
    }

    console.log(`Found ${componentsToProcess.length} component(s) with missing screenshots:\n`);
    componentsToProcess.forEach((comp) => {
      console.log(`  • ${comp.name}: missing ${comp.missingScreenshots.join(', ')}`);
    });
  }

  console.log('\n' + '═'.repeat(60) + '\n');

  // Launch browser
  console.log('🌐 Launching browser...\n');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const summary = {
    total: componentsToProcess.length,
    completed: 0,
    partial: 0,
    failed: 0,
  };

  // Capture screenshots
  for (const component of componentsToProcess) {
    const results = await captureComponentScreenshots(browser, component);

    if (results.failed.length === 0) {
      summary.completed++;
    } else if (results.success.length > 0) {
      summary.partial++;
    } else {
      summary.failed++;
    }
  }

  await browser.close();

  // Print summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total components: ${summary.total}`);
  console.log(`✅ Fully completed: ${summary.completed}`);
  console.log(`⚠️  Partially completed: ${summary.partial}`);
  console.log(`❌ Failed: ${summary.failed}`);
  console.log('═'.repeat(60) + '\n');

  console.log('✨ Screenshot capture complete!');
}

// Run the script
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
