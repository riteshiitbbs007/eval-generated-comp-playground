# LWC SLDS Component Evaluation System - Blueprint

**Version:** 2.1
**Last Updated:** 2026-03-09
**Architecture:** Dashboard-First Design with Real-Time Search & Reactive Updates

---

## 🎯 System Overview

This is an AI-powered Lightning Web Component (LWC) evaluation system that generates, evaluates, and visualizes SLDS-compliant components. The system features a comprehensive dashboard with advanced filtering, quality metrics, and detailed component analysis.

### ✨ What's New in v2.1

**Real-Time Search & Reactive Updates** - Major UX improvement!

1. **Fixed Header with Global Search**
   - Search box always visible at top of page
   - Searches across: componentName, utteranceId, tier, complexity, variant, model, utterance
   - Instant filtering as you type

2. **Automatic Reactive Updates**
   - Search updates **all components simultaneously**:
     - ✅ Quality metrics (Production Ready/Needs Work/Failed counts)
     - ✅ Filter panel counts
     - ✅ Component gallery display
   - No need to click anything - updates happen instantly
   - Uses @api property setters for automatic reactivity

3. **Improved Architecture**
   - Reactive setter pattern replaces event-based updates for search
   - New array references trigger LWC reactivity
   - Getters for computed values instead of stored properties
   - Better performance with fewer event listeners

**Key Difference from v2.0:**
- **Before**: Search → Update data → Need to click quality card to see gallery update
- **Now**: Search → Everything updates instantly and automatically! 🚀

---

## 🏗️ Architecture

### Core Philosophy
- **Dashboard-First**: Dashboard is the primary interface (landing page at `/`)
- **Quality-Driven**: All features revolve around component quality metrics
- **Auto-Generated**: Components and routing are dynamically generated
- **Metadata-Rich**: Complete evaluation data for all components

### Technology Stack
- **Framework**: Lightning Web Components (LWC) + LWR (Lightning Web Runtime)
- **Design System**: Salesforce Lightning Design System 2 (SLDS 2)
- **Backend**: Express.js (static file serving + optional API)
- **Build**: LWR build system with SSG (Static Site Generation)
- **Language**: JavaScript (ES Modules)

---

## 📂 Project Structure

```
lwc-slds-lbc-starter/
├── src/modules/
│   ├── main/
│   │   ├── app/                    # Root application component (AUTO-GENERATED)
│   │   ├── componentDetail/        # Individual component detail view
│   │   ├── gallery/                # Legacy gallery (DEPRECATED)
│   │   ├── utterances/             # Utterances management view
│   │   └── onboardingModal/        # First-time user modal
│   │
│   ├── dashboard/                  # DASHBOARD MODULE (PRIMARY)
│   │   ├── app/                    # Dashboard root component
│   │   ├── metrics/                # Quality metrics cards
│   │   ├── filters/                # Advanced filter panel
│   │   └── filteredGallery/        # Component grid with filtering/sorting
│   │
│   └── c/                          # Individual generated components
│
├── generated/
│   ├── c/                          # Generated component folders
│   │   └── [componentName]/
│   │       ├── [componentName].html
│   │       ├── [componentName].js
│   │       ├── [componentName].css
│   │       ├── metadata.json       # CRITICAL: Full evaluation metadata
│   │       └── screenshots/
│   │           └── desktop.png
│   │
│   └── components.json             # AUTO-GENERATED: Master manifest
│
├── scripts/
│   ├── generate-app-templates.js  # CRITICAL: Auto-generates routing
│   ├── capture-screenshots.js     # Captures component screenshots
│   └── [metadata-update-scripts]  # Various metadata enrichment scripts
│
├── server/
│   └── index.js                    # Express server
│
└── package.json                    # Contains prebuild/predev hooks
```

---

## 🚦 Routing Architecture

### Current Routing (Dashboard-First)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `dashboard-app` | **Primary interface** - Dashboard with all features |
| `/?detail=componentName` | `main-component-detail` | Component detail view |
| `?view=utterances` | `main-utterances` | Utterances management |
| `?component=componentName` | **Legacy** (deprecated) | Old individual component view |

### Routing Logic (src/modules/main/app/app.js)

```javascript
showDashboard() {
  // Dashboard is default - show when no specific route
  return !this.selectedComponent && !this.detailComponent && this.viewName !== 'utterances';
}

showDetail() {
  return this.detailComponent !== null;
}

showUtterances() {
  return this.viewName === 'utterances';
}

showGallery() {
  // Gallery is deprecated
  return false;
}
```

---

## 🔄 Auto-Generation System

### The Generator Script (`scripts/generate-app-templates.js`)

**⚠️ CRITICAL: This script runs automatically on every build/dev start**

#### What It Does:
1. Scans `generated/c/` directory for component folders
2. Reads `metadata.json` from each component
3. Generates `src/modules/main/app/app.js` (routing logic)
4. Generates `src/modules/main/app/app.html` (route templates)
5. Generates `generated/components.json` (master manifest with full metadata)

#### When It Runs:
- **Automatically**: `prebuild` hook in package.json
- **Automatically**: `predev` hook in package.json
- **Manually**: `npm run generate:templates`

#### ⚠️ Files That Get Overwritten:
- `src/modules/main/app/app.js` → **NEVER EDIT MANUALLY**
- `src/modules/main/app/app.html` → **NEVER EDIT MANUALLY**
- `generated/components.json` → **NEVER EDIT MANUALLY**

#### Making Changes to Generated Files:

**❌ WRONG:**
```javascript
// Editing src/modules/main/app/app.js directly
get showDashboard() {
  return true; // This will be overwritten!
}
```

**✅ CORRECT:**
```javascript
// Edit scripts/generate-app-templates.js instead
function generateAppJs(components) {
  return `
    get showDashboard() {
      return !this.selectedComponent && !this.detailComponent && this.viewName !== 'utterances';
    }
  `;
}
```

---

## 📊 Metadata Structure

### Component Metadata (`generated/c/[componentName]/metadata.json`)

```json
{
  "componentName": "sortableTableProductNamePriceCategory5f50fe64",
  "folderName": "component-sortableTable-C03-Simple-20260306",
  "utteranceId": "C03",
  "variant": "Simple",
  "timestamp": "2026-03-06T12:00:00.000Z",
  "tier": "Tier 1",
  "complexity": "Simple",
  "scores": {
    "slds_linter": 0.95,        // 0-1 scale (convert to % by * 100)
    "slds_quality": 1.0,
    "prd_compliance": 1.0,
    "security": 1.0,
    "overall": 3.95             // 0-4 scale in metadata (UI shows as Readiness Score 0-3)
  },
  "violations": {
    "errors": 0,
    "warnings": 3,
    "notes": 0
  },
  "model": "claude-4-5-sonnet",
  "modelProvider": "anthropic",
  "langsmithRunUrl": "https://smith.langchain.com/...",
  "screenshotUrls": {
    "desktop": "generated/c/[componentName]/screenshots/desktop.png"
  }
}
```

### Master Manifest (`generated/components.json`)

```json
{
  "components": [
    {
      "componentName": "...",
      // ... full metadata from each component
    }
  ],
  "count": 38,
  "lastUpdated": "2026-03-09T..."
}
```

---

## 🎨 Dashboard Module Architecture

### Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│  Component Evaluation Dashboard          [Search Box]  │ ← FIXED HEADER
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌─────────────────┐│
│  │  38   │  │   0   │  │   0   │  │  Summary Stats  ││ ← METRICS
│  │ Prod  │  │ Needs │  │Failed │  └─────────────────┘│
│  └───────┘  └───────┘  └───────┘                      │
│                                                         │
│  ┌──────────┐  ┌────────────────────────────────────┐ │
│  │ Filters  │  │   Component Gallery                │ │ ← SCROLLABLE
│  │          │  │   [Component Cards...]             │ │
│  │          │  │                                    │ │
│  └──────────┘  └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
dashboard-app (dashboard/app)
├── FIXED HEADER (new in v2.1)
│   ├── Title & Description
│   └── Real-Time Search Input
│       └── Searches: componentName, utteranceId, tier, complexity, variant, model, utterance
│
├── dashboard-metrics (dashboard/metrics)
│   ├── Quality gate cards (Production/Needs Work/Failed) - CLICKABLE
│   └── Summary statistics (Avg Score, SLDS Compliance, Violations, Total)
│
├── dashboard-filters (dashboard/filters)
│   ├── Quick filters
│   ├── Score range sliders
│   ├── SLDS compliance slider
│   ├── Multi-select checkboxes (Tier, Complexity, Variant, Model)
│   └── Utterance ID search
│
└── dashboard-filtered-gallery (dashboard/filteredGallery)
    ├── Sort controls (8 options)
    ├── Component cards with:
    │   ├── Quality gate badges
    │   ├── Metadata badges (ID, Variant, Model)
    │   ├── Screenshots
    │   ├── Scores & violations
    │   └── View Details button
    └── No results state
```

### Data Flow

#### Initial Load Flow

```
1. dashboard-app.connectedCallback()
   ↓
2. Loads /generated/components.json
   ↓
3. Stores in allComponents (full dataset)
   ↓
4. Sets this.components = allComponents
   ↓
5. Child components receive data via @api
   ↓
6. ├─> dashboard-metrics: calculates quality stats
   │   └─> Updates counts & percentages
   │
   ├─> dashboard-filters: initializes filter options
   │   └─> Populates model checkboxes dynamically
   │
   └─> dashboard-filtered-gallery: displays all components
       └─> Triggers updateDisplayComponents() via setter
```

#### Real-Time Search Flow (NEW in v2.1)

```
User types in search box
   ↓
handleSearch(event)
   ↓
searchTerm = event.target.value.toLowerCase()
   ↓
applySearch()
   ↓
Filter allComponents by search term
   ↓
this.components = [...filteredResults]  ← Creates NEW array reference
   ↓
AUTOMATIC REACTIVE UPDATES (no events needed!)
   ↓
   ├─> dashboard-metrics
   │   └─> Counts recalculate based on new components array
   │
   ├─> dashboard-filters
   │   └─> Filter counts update automatically
   │
   └─> dashboard-filtered-gallery
       └─> Setter triggered: set components(value)
           └─> updateDisplayComponents()
               └─> Gallery re-renders with filtered components

Result: INSTANT updates across all components!
```

#### Filter Change Flow

```
User changes filter (slider, checkbox, etc.)
   ↓
dashboard-filters dispatches 'filterchange' event
   ↓
dashboard-app.handleFilterChange(event)
   ↓
Stores event.detail in this.currentFilters
   ↓
setTimeout(() => {  ← Ensures DOM is ready
  galleryComponent.applyFilters(this.currentFilters)
}, 0)
   ↓
dashboard-filtered-gallery.applyFilters()
   ↓
Applies filter logic to this.components
   ↓
Updates displayComponents with filtered results
   ↓
Gallery re-renders
```

#### Quality Gate Click Flow

```
User clicks "Production Ready" card
   ↓
dashboard-metrics dispatches 'filterbyquality' event
   ↓
dashboard-app.handleFilterByQuality(event)
   ↓
Creates filter criteria for that quality gate
   ↓
Applies to gallery + smooth scrolls to results
```

### Reactive Updates Pattern (NEW in v2.1)

**Key Innovation**: Using @api property setters for automatic reactivity

#### filteredGallery Component (dashboard/filteredGallery/filteredGallery.js)

```javascript
export default class FilteredGallery extends LightningElement {
  _components = [];  // Private backing field

  @api
  get components() {
    return this._components;
  }

  set components(value) {
    this._components = value;
    // AUTOMATIC: Triggers update whenever components array changes
    this.updateDisplayComponents();
  }
}
```

**Why This Works:**
- When `dashboard-app` updates `this.components = [...]`
- LWC automatically calls the setter on child components
- Setter triggers `updateDisplayComponents()`
- Gallery re-renders immediately
- **No events needed for search updates!**

#### dashboard-app Component (dashboard/app/app.js)

```javascript
export default class DashboardApp extends LightningElement {
  allComponents = [];      // Full dataset (never filtered)
  components = [];         // Current filtered dataset
  searchTerm = '';

  handleSearch(event) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applySearch();
  }

  applySearch() {
    // Create NEW array reference (triggers LWC reactivity)
    if (!this.searchTerm) {
      this.components = [...this.allComponents];
    } else {
      this.components = this.allComponents.filter(comp => {
        // Search across multiple fields
        return componentName.includes(this.searchTerm) ||
               utteranceId.includes(this.searchTerm) ||
               // ... more fields
      });
    }

    // Force child component updates
    this.notifyChildComponents();
  }

  notifyChildComponents() {
    // Notify filters to recalculate counts
    const filtersComponent = this.template.querySelector('dashboard-filters');
    if (filtersComponent) {
      filtersComponent.componentsUpdated();
    }

    // Notify gallery (also happens automatically via setter)
    const galleryComponent = this.template.querySelector('dashboard-filtered-gallery');
    if (galleryComponent) {
      galleryComponent.updateComponents();
    }
  }
}
```

### Event Communication

```javascript
// Metrics → Dashboard App
this.dispatchEvent(new CustomEvent('filterbyquality', {
  detail: { qualityGate: 'production' }
}));

// Filters → Dashboard App
this.dispatchEvent(new CustomEvent('filterchange', {
  detail: {
    quickFilter: 'all',
    scoreRange: { min: 0, max: 3 },  // Readiness Score: 0-3 scale
    sldsCompliance: 0,
    tiers: ['Tier 1', 'Tier 2', 'Tier 3'],
    // ... more filter criteria
  }
}));

// Gallery → Dashboard App
this.dispatchEvent(new CustomEvent('componentselect', {
  detail: { componentName: 'componentName' }
}));
```

### CSS Architecture (NEW in v2.1)

#### Fixed Header Pattern

```css
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: white;
  border-bottom: 1px solid #c9c7c5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  margin-top: 120px;  /* Height of fixed header */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

---

## 🎯 Quality Gates

### Scoring System

**Readiness Score Range: 0-3**

| Quality Gate | Score Range | Badge Color | Meaning |
|--------------|-------------|-------------|---------|
| **Production Ready** | ≥ 2.5 | Green | Ready for production use |
| **Needs Work** | 2.0 - 2.5 | Yellow | Requires improvements |
| **Failed** | < 2.0 | Red | Not suitable for use |

**Note**: While the underlying metadata may store scores on different scales, the UI presents a normalized "Readiness Score" on a 0-3 scale for consistency and user understanding.

### Score Calculation

```javascript
// Overall score: 0-4 scale (weighted average) in metadata
overall = (slds_linter * weight1) + (slds_quality * weight2) +
          (prd_compliance * weight3) + (security * weight4)

// UI presents as Readiness Score: 0-3 scale
// Filter range: 0-3
// Display range: 0-3

// SLDS Linter: 0-1 scale (percentage of rules passed)
slds_linter = passed_rules / total_rules

// Display as percentage
displayed_percentage = slds_linter * 100
```

---

## 🔧 Common Tasks & How-Tos

### Adding a New Search Field (NEW in v2.1)

To search by a new metadata field:

1. **Update `dashboard-app.js` in `applySearch()` method**:
   ```javascript
   applySearch() {
     // ... existing code ...
     this.components = this.allComponents.filter(comp => {
       const componentName = (comp.componentName || '').toLowerCase();
       const yourNewField = (comp.yourNewField || '').toLowerCase(); // ADD THIS

       return componentName.includes(this.searchTerm) ||
              yourNewField.includes(this.searchTerm) ||  // ADD THIS
              // ... other fields
     });
   }
   ```

2. **That's it!** Reactivity handles the rest automatically.

### Making a Component Reactive to Data Changes (NEW in v2.1)

Use the @api property setter pattern:

```javascript
export default class YourComponent extends LightningElement {
  _data = [];

  @api
  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
    // Automatically update when data changes
    this.processData();
  }

  processData() {
    // Your logic here - runs every time data changes!
  }
}
```

**Key Points:**
- Use underscore prefix for private backing field (`_data`)
- Setter triggers automatically when parent updates the property
- No events needed - LWC handles reactivity
- **IMPORTANT**: Parent must create NEW array reference: `this.data = [...]` not `this.data.push()`

### Adding a New Dashboard Feature

1. **Create new component** in `src/modules/dashboard/[featureName]/`
2. **Add to dashboard-app.html**:
   ```html
   <dashboard-feature-name
     components={components}
     onfeatureevent={handleFeatureEvent}>
   </dashboard-feature-name>
   ```
3. **Handle events** in dashboard-app.js
4. **Use reactive pattern** if component needs to update with search
5. **No generator changes needed** (dashboard components are not auto-generated)

### Adding a New Route

1. **Edit `scripts/generate-app-templates.js`**:
   ```javascript
   // Add getter in generateAppJs()
   get showNewRoute() {
     return this.viewName === 'newroute';
   }

   // Add template in generateAppHtml()
   <template if:true={showNewRoute}>
     <your-component></your-component>
   </template>
   ```
2. **Run generator**: `npm run generate:templates`
3. **Test route**: `http://localhost:3000/?view=newroute`

### Updating Metadata Fields

1. **Update component's** `generated/c/[componentName]/metadata.json`
2. **Run generator** to update master manifest:
   ```bash
   npm run generate:templates
   ```
3. **Restart server** to see changes

### Changing Default Landing Page

Currently, dashboard is the default. To change:

1. **Edit `scripts/generate-app-templates.js`**:
   ```javascript
   get showDashboard() {
     return this.viewName === 'dashboard'; // Explicit route only
   }

   get showNewDefault() {
     return !this.selectedComponent && !this.detailComponent && !this.viewName;
   }
   ```
2. **Run generator**: `npm run generate:templates`

---

## 🛠️ Development Workflow

### Starting Development

```bash
npm run dev          # Runs generator, then starts dev server
# OR
npm start            # Starts server with built files
```

### Building for Production

```bash
npm run build        # Runs generator, then builds static site
```

### Pre-Build/Pre-Dev Hooks

```json
{
  "scripts": {
    "predev": "npm run generate:templates",
    "prebuild": "npm run generate:templates"
  }
}
```

**⚠️ IMPORTANT**: Generator runs automatically before every build/dev!

---

## 🐛 Common Issues & Solutions

### Issue: Dashboard shows 0 components

**Cause**: `components.json` not loaded or incorrect format

**Solution**:
1. Check `generated/components.json` exists
2. Verify it has `components` array with full metadata
3. Run: `npm run generate:templates`
4. Check browser console for fetch errors

### Issue: Filters not working

**Cause**: Field name mismatch (e.g., `createdAt` vs `timestamp`)

**Solution**:
1. Check metadata field names in `generated/c/*/metadata.json`
2. Update component code to match actual field names:
   - ❌ `scores.sldsLinterCompliance`
   - ✅ `scores.slds_linter`
   - ❌ `createdAt`
   - ✅ `timestamp`

### Issue: Changes to app.js/app.html get overwritten

**Cause**: These files are auto-generated

**Solution**:
1. **NEVER edit** `src/modules/main/app/app.js` or `app.html` directly
2. Edit `scripts/generate-app-templates.js` instead
3. Run: `npm run generate:templates`

### Issue: Search updates overview but not gallery (NEW in v2.1)

**Cause**: Gallery not using reactive setter pattern or parent not creating new array reference

**Solution**:
1. **In child component**, use setter pattern:
   ```javascript
   @api
   get components() { return this._components; }
   set components(value) {
     this._components = value;
     this.updateDisplayComponents(); // MUST trigger update
   }
   ```

2. **In parent component**, create NEW array reference:
   ```javascript
   // ❌ WRONG - mutates existing array (no reactivity)
   this.components.push(newItem);

   // ✅ CORRECT - creates new array (triggers reactivity)
   this.components = [...this.components, newItem];
   this.components = [...filteredResults];
   ```

### Issue: Child component not updating when parent data changes

**Cause**: Not using reactive @api properties correctly

**Solution**:
1. Use `@api` decorator on property
2. If you need to run logic on change, use getter/setter:
   ```javascript
   _myData = [];

   @api
   get myData() { return this._myData; }
   set myData(value) {
     this._myData = value;
     this.processData(); // Runs on every change!
   }
   ```
3. Parent must assign new reference: `this.data = [...]`

### Issue: Components array updates but counts don't

**Cause**: Child component not recalculating when components change

**Solution**:
```javascript
// In child component, use getters for computed values
get totalCount() {
  return this.components.length; // Recalculates automatically!
}

// NOT a property assigned once in connectedCallback:
// ❌ this.totalCount = this.components.length; // Won't update!
```

### Issue: Build fails with "Invalid HTML syntax"

**Cause**: Unescaped HTML characters (like `<` in text)

**Solution**:
```html
<!-- ❌ WRONG -->
<div>Score < 2.0</div>

<!-- ✅ CORRECT -->
<div>Score &lt; 2.0</div>
```

---

## 📋 Checklist for New Features

- [ ] Does it need a new route? → Edit generator script
- [ ] Does it use metadata? → Ensure field names match metadata.json
- [ ] Does it need to be auto-generated? → Add to generator script
- [ ] Does it affect the dashboard? → Add to dashboard module
- [ ] Does it need server-side data? → Add Express route in `server/index.js`
- [ ] Will it persist after rebuild? → If editing app.js/app.html, use generator instead
- [ ] Did you test after running `npm run build`? → Ensure generator doesn't break it
- [ ] **NEW (v2.1)**: Does it need to react to data changes? → Use @api setter pattern
- [ ] **NEW (v2.1)**: Does it need to be searchable? → Add field to `applySearch()` in dashboard-app.js
- [ ] **NEW (v2.1)**: Does it compute values from data? → Use getters, not properties

---

## 🎓 Key Principles

1. **Dashboard is Primary**: All main functionality lives in the dashboard
2. **Metadata is Truth**: All component data comes from metadata.json files
3. **Generator is King**: Routing and manifests are auto-generated
4. **Don't Fight the Generator**: Work with it, not against it
5. **Quality First**: Everything revolves around component quality metrics
6. **Field Names Matter**: Use exact field names from metadata (timestamp, slds_linter, etc.)
7. **Reactivity Over Events (v2.1)**: Use @api setters for automatic updates, not custom events
8. **New References Trigger Updates (v2.1)**: Always create new array references: `this.data = [...]`
9. **Getters for Computed Values (v2.1)**: Use getters that recalculate, not stored properties
10. **Fixed Header UX (v2.1)**: Search is always accessible via fixed header

---

## 📚 Additional Resources

- **LWC Documentation**: https://lwc.dev/
- **SLDS 2 Documentation**: https://www.lightningdesignsystem.com/
- **LWR Documentation**: https://developer.salesforce.com/docs/platform/lwr/overview
- **Component Detail View**: See `src/modules/main/componentDetail/` for reference implementation

---

## 🔮 Future Enhancements

Potential improvements (documented for future reference):

1. **Component Comparison**: Side-by-side comparison of variants
2. **Trend Analysis**: Score trends over time
3. **Export Functionality**: Export filtered results as CSV/JSON
4. **Advanced Search**: Full-text search across component code
5. **Model Performance**: Aggregate metrics by AI model
6. **Quality Insights**: AI-generated improvement suggestions

---

## ⚠️ Critical Warnings

1. **NEVER manually edit** `src/modules/main/app/app.js` or `app.html`
2. **ALWAYS use correct field names** from metadata.json
3. **ALWAYS run generator** after metadata changes
4. **NEVER skip the prebuild hook** - it's essential
5. **ALWAYS test after build** - dev mode may hide issues
6. **NEW (v2.1)**: **ALWAYS create new array references** for reactivity: `this.data = [...]` not `this.data.push()`
7. **NEW (v2.1)**: **NEVER store computed values** as properties - use getters instead
8. **NEW (v2.1)**: **ALWAYS use @api setters** when child components need to react to data changes

---

## 📝 Version History

- **v2.1** (2026-03-09): Real-time search with fixed header, reactive component updates via @api setters
  - Added fixed header with global search
  - Implemented reactive setter pattern for automatic updates
  - Search updates metrics, filters, and gallery in real-time
  - Fixed header stays accessible while scrolling
  - Searches across: componentName, utteranceId, tier, complexity, variant, model, utterance

- **v2.0** (2026-03-09): Dashboard-first architecture, deprecated gallery
  - Dashboard is default landing page
  - Quality metrics cards
  - Advanced filtering system
  - Component gallery with 8 sort options

- **v1.0** (2026-03-06): Initial gallery-based implementation
  - Legacy gallery view
  - Basic component listing
  - Individual component views

---

**End of Blueprint**
