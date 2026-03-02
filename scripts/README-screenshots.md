# Screenshot Capture Script (Playwright)

Automatically capture screenshots for LWC components in the gallery using Playwright.

## Features

- 📸 Captures screenshots using Playwright (fast and reliable)
- 📱 Multi-viewport support: desktop, tablet, mobile
- 🔍 Automatically detects missing screenshots
- ⚡ Smart detection - only captures what's needed
- 🎯 Can target specific components
- 🔄 Can force re-capture of all screenshots
- 🧠 Handles LWC shadow DOM (native and synthetic)
- 💾 Saves screenshots in the correct format and location

## Prerequisites

1. **Playwright installed** ✅ (already done via `npm install`)
2. **Server running** - The app must be running locally before capturing screenshots

## Quick Start

### 1. Start the server (in one terminal)

```bash
npm start
```

Wait until you see "Application is available at http://localhost:3000/"

### 2. Capture missing screenshots (in another terminal)

```bash
npm run screenshots
```

That's it! The script will automatically:
- Detect which components are missing screenshots
- Capture desktop screenshots (1280x720) by default
- Save them to `generated/c/{componentName}/screenshots/desktop.png`

## Usage Examples

### Capture only missing screenshots (default)

```bash
npm run screenshots
```

Output:
```
🔍 Found 2 component(s) with missing screenshots:
  • faqAccordionWith3SectionsEach2efd09a1: missing desktop
  • userProfileFormNameTextEmailC8b10de5: missing desktop

📷 Capturing screenshots...
✅ 2 screenshots captured successfully
```

### Capture specific component

```bash
node scripts/capture-screenshots.js --component=componentName
```

Example:
```bash
node scripts/capture-screenshots.js --component=faqAccordionWith3SectionsEach2efd09a1
```

### Re-capture ALL screenshots

```bash
npm run screenshots:all
```

This will overwrite all existing screenshots with fresh captures.

### Capture multiple viewports

```bash
CAPTURE_VIEWPORTS="desktop,tablet,mobile" npm run screenshots
```

This will capture:
- `desktop.png` (1280x720)
- `tablet.png` (768x1024)
- `mobile.png` (375x667)

### Capture only mobile screenshots

```bash
CAPTURE_VIEWPORTS="mobile" npm run screenshots
```

## Viewport Sizes

| Viewport | Width | Height | Description |
|----------|-------|--------|-------------|
| desktop  | 1280  | 720    | Standard desktop (default) |
| tablet   | 768   | 1024   | iPad portrait |
| mobile   | 375   | 667    | iPhone SE |

## Output Structure

Screenshots are saved in:
```
generated/
└── c/
    └── {componentName}/
        ├── {componentName}.js
        ├── {componentName}.html
        ├── {componentName}.css
        ├── metadata.json
        └── screenshots/
            ├── desktop.png
            ├── tablet.png    (if captured)
            └── mobile.png    (if captured)
```

## Environment Variables

### SERVER_URL
Override the default server URL (default: `http://localhost:3000`)

```bash
SERVER_URL=http://localhost:3001 npm run screenshots
```

### CAPTURE_VIEWPORTS
Comma-separated list of viewports to capture (default: `desktop`)

Options: `desktop`, `tablet`, `mobile`

```bash
# Capture all viewports
CAPTURE_VIEWPORTS="desktop,tablet,mobile" npm run screenshots

# Capture only tablet
CAPTURE_VIEWPORTS="tablet" npm run screenshots

# Capture desktop and mobile
CAPTURE_VIEWPORTS="desktop,mobile" npm run screenshots
```

## Advanced Usage

### Custom script invocation

```bash
# Check what's missing without capturing
node scripts/capture-screenshots.js

# Capture with custom server URL
SERVER_URL=http://localhost:8080 node scripts/capture-screenshots.js

# Force re-capture specific component for all viewports
CAPTURE_VIEWPORTS="desktop,tablet,mobile" node scripts/capture-screenshots.js --component=myComponent

# Re-capture everything for all viewports
CAPTURE_VIEWPORTS="desktop,tablet,mobile" node scripts/capture-screenshots.js --all
```

## Workflow

Typical workflow when adding new components:

```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Generate components (your eval script)
# ... components are generated ...

# Terminal 2: Capture screenshots for new components
npm run screenshots

# All missing screenshots are now captured!
```

## Troubleshooting

### "Server is not running"

**Error:**
```
❌ Server is not running at http://localhost:3000
   Please start the server first:
   npm start
```

**Solution:**
Start the server in another terminal:
```bash
npm start
```

### "Component not rendering"

If screenshots are blank or incomplete:

1. **Check the component manually:**
   - Open `http://localhost:3000/?component={componentName}` in your browser
   - Verify the component renders correctly

2. **Increase wait time:**
   - Edit `scripts/capture-screenshots.js`
   - Increase `waitForTimeout` values (currently 2000-3000ms)

3. **Check for errors:**
   - Look at the browser console when testing manually
   - Component may have JavaScript errors

### "waitForSelector timeout"

This means the component's selector wasn't found. Possible causes:

1. **Component not deployed:**
   - Verify files exist in `generated/c/{componentName}/`
   - Check component is listed in `generated/components.json`

2. **Component name mismatch:**
   - The script converts camelCase to kebab-case
   - Example: `myComponent` → `my-component`
   - Check the component uses correct naming convention

3. **Server not serving the component:**
   - Restart the server: `npm start`
   - Regenerate templates: `npm run generate:templates`

### Screenshots are too dark/light

This is usually a timing issue with CSS loading:

1. Increase the `waitForTimeout` after checking shadow content
2. Add explicit wait for stylesheets to load
3. Check SLDS styles are properly included

### Playwright browser fails to launch

**On Linux:** You may need system dependencies:
```bash
# Install Playwright browsers
npx playwright install chromium

# Install system dependencies (Ubuntu/Debian)
npx playwright install-deps chromium
```

**On macOS:** Usually works out of the box, but if not:
```bash
npx playwright install chromium
```

## Comparison to Puppeteer

Why Playwright over Puppeteer?

✅ **Better LWC support** - Handles shadow DOM better
✅ **More reliable** - Better wait mechanisms
✅ **Faster** - More efficient browser control
✅ **Multi-browser** - Can use Chrome, Firefox, Safari (Webkit)
✅ **Better error messages** - Easier debugging
✅ **Auto-waits** - Smart waiting for elements

## Performance Tips

1. **Capture in batches:**
   - If you have many components, the script processes them sequentially
   - Each component takes ~3-5 seconds (including render time)

2. **Use specific component flag:**
   - When testing a single component, use `--component=name`
   - Much faster than scanning all components

3. **Start with desktop only:**
   - Capture `desktop` viewport first (default)
   - Add tablet/mobile later if needed

4. **Keep server running:**
   - Don't restart the server between captures
   - Warm server is faster

## Integration with CI/CD

Example GitHub Actions workflow:

```yaml
- name: Generate screenshots
  run: |
    npm start &
    sleep 10  # Wait for server to start
    npm run screenshots
    pkill -f "node server"  # Stop server

- name: Commit screenshots
  run: |
    git config user.name "Screenshot Bot"
    git config user.email "bot@example.com"
    git add generated/c/*/screenshots/*.png
    git commit -m "chore: update component screenshots" || echo "No changes"
    git push
```

## Notes

- Default viewport is **desktop only** (1280x720)
- Use `CAPTURE_VIEWPORTS` env var for multiple viewports
- Screenshots are saved as **PNG** format
- The script waits for **networkidle** state before capturing
- Handles both **native and synthetic shadow DOM** (LWC)
- Creates `screenshots/` directory automatically if missing
- Skips components already having screenshots (unless using `--all`)

## npm Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run screenshots` | Capture missing desktop screenshots |
| `npm run screenshots:all` | Re-capture all desktop screenshots |
| `CAPTURE_VIEWPORTS="desktop,tablet,mobile" npm run screenshots` | Capture all viewports |

## Support

If you encounter issues:

1. ✅ Ensure server is running: `npm start`
2. 🌐 Test component in browser: `http://localhost:3000/?component={name}`
3. 📋 Check `generated/components.json` includes the component
4. 📁 Verify component files exist in `generated/c/{componentName}/`
5. 🐛 Look for JavaScript errors in browser console
6. ⏱️ Try increasing wait times in the script
7. 🔍 Run with specific component to isolate issues
