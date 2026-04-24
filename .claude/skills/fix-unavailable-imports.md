# Fix Unavailable Imports in Generated Components

## Purpose
This skill helps fix generated LWC components that import modules not available in the local development environment (like `lightning/platformShowToastEvent`). It comments out the unavailable code and documents the changes in component metadata.

## When to Use
Use this skill when:
- A generated component fails to load with a 404 error for an unavailable module
- Components import Salesforce platform-specific modules (like `lightning/platformShowToastEvent`, `lightning/navigation`, etc.)
- You need to make generated components work in the local playground environment

## Steps

### 1. Find Components with Unavailable Imports
```bash
# Search for the problematic import across all generated components
grep -r "lightning/platformShowToastEvent" generated/c/*/*.js
# Or search for any lightning platform import
grep -r "from 'lightning/" generated/c/*/*.js
```

### 2. Comment Out the Import and Usage

For each component found:

**a) Comment out the import statement:**
```javascript
// Before:
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// After:
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev
```

**b) Comment out all usages:**
```javascript
// Before:
this.dispatchEvent(
    new ShowToastEvent({
        title: 'Success',
        message: 'Form submitted successfully!',
        variant: 'success'
    })
);

// After:
// Show toast notification (commented out - not available in local dev)
// this.dispatchEvent(
//     new ShowToastEvent({
//         title: 'Success',
//         message: 'Form submitted successfully!',
//         variant: 'success'
//     })
// );
```

### 3. Add Notes to Component Metadata

Add a `notes` array to the component's `metadata.json` file explaining the changes:

```json
{
  "componentName": "yourComponent123abc",
  "scores": { ... },
  "testConfig": { ... },
  "notes": [
    "⚠️ COMMENTED CODE: The 'lightning/platformShowToastEvent' import and ShowToastEvent usage have been commented out for playground testing. This module is not available in the local development environment. Uncomment these codes if you want to deploy this component to a Salesforce org."
  ]
}
```

**Important:** The notes array:
- Contains warning messages that will be displayed in the component detail page
- Each note should start with ⚠️ emoji for visual warning indication
- Should clearly explain what was changed and why
- Should provide instructions for reverting changes (uncommenting for Salesforce deployment)

### 4. Verify the Fix

```bash
# Check that all imports are commented
grep "import.*ShowToastEvent" generated/c/componentName/componentName.js

# Should show lines starting with //
```

### 5. Rebuild and Test

After making changes, rebuild the application and generate screenshots:

```bash
# Rebuild the application
npm run build && npm start

# In a separate terminal tab, generate screenshots for the fixed components
npm run screenshots
```

**Important**: Always rebuild after making changes to ensure:
- Bundle updates include the fixed code
- Application loads without errors
- Screenshots capture the working component state

### 6. Test the Component

Navigate to the component in the playground:
```
http://localhost:3001/?component=componentName
```

The component should now load without errors.

### 7. Stage the Changes

```bash
# Stage the fixed component and screenshots
git add generated/c/componentName/componentName.js
git add generated/c/componentName/metadata.json
git add generated/c/componentName/screenshots/
```

## Common Unavailable Modules

Modules that typically need to be commented out in local dev:
- `lightning/platformShowToastEvent` - Toast notifications
- `lightning/navigation` - Navigation service
- `lightning/uiRecordApi` - Record operations
- `lightning/messageService` - Lightning Message Service
- `@salesforce/apex/*` - Apex method calls
- `@salesforce/user/*` - User context
- `@salesforce/label/*` - Custom labels

## Notes Display

After adding notes to metadata:
- A warning card will appear in the component detail page
- The card includes a warning icon
- Each note is displayed as a list item
- Notes are prominently displayed below the component information card

## File Locations

- **Component JS files**: `generated/c/{componentName}/{componentName}.js`
- **Component metadata**: `generated/c/{componentName}/metadata.json`
- **Detail page JS**: `src/modules/main/componentDetail/componentDetail.js`
- **Detail page HTML**: `src/modules/main/componentDetail/componentDetail.html`

## Example Complete Workflow

```bash
# 1. Find problematic components
grep -r "lightning/platformShowToastEvent" generated/c/*/*.js

# 2. Edit the component JS file (comment out import and usages)
# Use your editor to comment out the import and all ShowToastEvent usages

# 3. Add notes to metadata.json
# Add the notes array with warning message

# 4. Rebuild the application
npm run build && npm start

# 5. In a separate terminal, generate screenshots
npm run screenshots

# 6. Stage changes
git add generated/c/componentName/
git add src/modules/main/componentDetail/

# 7. Test in playground
# Visit http://localhost:3001/?component=componentName
```

## Tips

- Always comment out code rather than deleting it - this makes it easy to restore for Salesforce deployment
- Add clear comments explaining why code was commented out
- Use the notes field in metadata to document all changes
- The notes will automatically appear in the component detail page with a warning icon
- **Always run `npm run build && npm start` after making code changes** - this ensures the bundle is updated
- **Run `npm run screenshots` in a separate terminal** after the build to capture updated component screenshots
- Test the component in the playground after making changes
- Keep the original functionality intact in comments so it can be easily restored

## Automation Potential

This workflow could be automated with a script:
1. Scan all generated components for unavailable imports
2. Comment out the imports and usages automatically
3. Add notes to metadata
4. Generate a report of fixed components

## Related Files

- Skill documentation: `.claude/skills/fix-unavailable-imports.md`
- Component detail display: `src/modules/main/componentDetail/componentDetail.js` & `.html`
- Baseline SLDS documentation: `docs/BASELINE_SLDS_LABEL.md`
