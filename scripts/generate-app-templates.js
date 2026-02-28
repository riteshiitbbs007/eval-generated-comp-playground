#!/usr/bin/env node

/**
 * Automatically generates app.js and app.html files based on components in generated/c/
 * This makes the playground "dynamic" by auto-discovering all generated components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');
const APP_JS_PATH = path.join(__dirname, '..', 'src', 'modules', 'main', 'app', 'app.js');
const APP_HTML_PATH = path.join(__dirname, '..', 'src', 'modules', 'main', 'app', 'app.html');
const COMPONENTS_JSON_PATH = path.join(__dirname, '..', 'generated', 'components.json');

/**
 * Convert camelCase component name to kebab-case for HTML tags
 * Handles consecutive uppercase letters correctly
 * Examples:
 *   primaryButtonWithASaveIcon -> primary-button-with-a-save-icon
 *   createPrimaryButtonWith -> create-primary-button-with
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')  // lowercase/digit followed by uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // uppercase followed by uppercase+lowercase
    .toLowerCase();
}

/**
 * Capitalize first letter for getter method names
 * Example: createPrimaryButtonWith -> CreatePrimaryButtonWith
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Scan generated/c/ directory and return all component info
 * Returns array of { folderName, componentName } objects
 */
function scanComponents() {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.log('⚠️  No generated/c/ directory found');
    return [];
  }

  const entries = fs.readdirSync(GENERATED_DIR, { withFileTypes: true });

  const components = entries
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const folderName = entry.name;

      // Try to read metadata.json to get clean component name
      const metadataPath = path.join(GENERATED_DIR, folderName, 'metadata.json');

      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          return {
            folderName: folderName,
            componentName: metadata.componentName || folderName
          };
        } catch (err) {
          console.warn(`⚠️  Failed to read metadata for ${folderName}, using folder name`);
        }
      }

      // Fallback: use folder name (for backwards compatibility with old components)
      return {
        folderName: folderName,
        componentName: folderName
      };
    })
    .sort((a, b) => a.componentName.localeCompare(b.componentName)); // Sort by component name

  return components;
}

/**
 * Generate app.js content with all component getters
 */
function generateAppJs(components) {
  const getters = components.map(({ folderName, componentName }) => {
    // Direct use - no sanitization needed (UUID has no hyphen!)
    const methodName = `show${capitalize(componentName)}`;
    return `  get ${methodName}() {
    return this.selectedComponent === '${componentName}';
  }`;
  }).join('\n\n');

  return `import { LightningElement } from 'lwc';

export default class HelloWorldApp extends LightningElement {
  selectedComponent = null;
  detailComponent = null;

  connectedCallback() {
    // Parse query parameters: ?component=componentName or ?detail=componentName
    const params = new URLSearchParams(window.location.search);
    const componentName = params.get('component');
    const detailName = params.get('detail');

    if (componentName) {
      this.selectedComponent = componentName;
    } else if (detailName) {
      this.detailComponent = detailName;
    }
  }

  handleComponentSelect(event) {
    const componentName = event.detail.componentName;
    // Navigate to detail view
    window.location.href = \`/?detail=\${componentName}\`;
  }

  get showGallery() {
    return !this.selectedComponent && !this.detailComponent;
  }

  get showDetail() {
    return this.detailComponent !== null;
  }

${getters}
}
`;
}

/**
 * Generate app.html content with all component templates
 */
function generateAppHtml(components) {
  const templates = components.map(({ folderName, componentName }) => {
    // Direct use - no sanitization needed (UUID has no hyphen!)
    const methodName = `show${capitalize(componentName)}`;
    const tagName = toKebabCase(componentName);

    return `  <!-- Show ${folderName} component when selected -->
  <template if:true={${methodName}}>
    <div class="slds-m-bottom_medium">
      <a href="/" class="slds-text-link">← Back to Gallery</a>
    </div>

    <div class="slds-box slds-box_small">
      <h2 class="slds-text-heading_medium slds-m-bottom_small">
        Component: ${folderName}
      </h2>
      <div class="slds-border_top slds-p-top_medium">
        <c-${tagName}></c-${tagName}>
      </div>
    </div>
  </template>`;
  }).join('\n  \n');

  return `<template>
  <main class="slds-p-around_medium">
    <!-- Show gallery view when no component selected -->
    <template if:true={showGallery}>
      <main-gallery oncomponentselect={handleComponentSelect}></main-gallery>
    </template>

    <!-- Show component detail view when detail parameter is set -->
    <template if:true={showDetail}>
      <main-component-detail component-name={detailComponent}></main-component-detail>
    </template>

${templates}
  </main>
</template>
`;
}

/**
 * Generate components.json manifest for gallery to consume
 */
function generateComponentsManifest(components) {
  return JSON.stringify({
    components: components.map(c => c.folderName), // Gallery uses folder names for routing
    count: components.length,
    lastUpdated: new Date().toISOString()
  }, null, 2);
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning generated/c/ directory...');
  const components = scanComponents();

  if (components.length === 0) {
    console.log('⚠️  No components found in generated/c/');
    return;
  }

  console.log(`✅ Found ${components.length} components:`);
  components.forEach(({ folderName, componentName }) => {
    if (folderName === componentName) {
      console.log(`   - ${folderName}`);
    } else {
      console.log(`   - ${folderName} (component: ${componentName})`);
    }
  });

  console.log('\n📝 Generating app.js...');
  const appJsContent = generateAppJs(components);
  fs.writeFileSync(APP_JS_PATH, appJsContent, 'utf8');
  console.log(`✅ Written to ${APP_JS_PATH}`);

  console.log('\n📝 Generating app.html...');
  const appHtmlContent = generateAppHtml(components);
  fs.writeFileSync(APP_HTML_PATH, appHtmlContent, 'utf8');
  console.log(`✅ Written to ${APP_HTML_PATH}`);

  console.log('\n📝 Generating components.json manifest...');
  const manifestContent = generateComponentsManifest(components);
  fs.writeFileSync(COMPONENTS_JSON_PATH, manifestContent, 'utf8');
  console.log(`✅ Written to ${COMPONENTS_JSON_PATH}`);

  console.log('\n✨ App templates regenerated successfully!');
  console.log('💡 Restart your dev server to see changes');
}

// Run the script
main();
