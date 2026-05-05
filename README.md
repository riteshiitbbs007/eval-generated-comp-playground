# Eval Generated Component Playground

> Lightning Web Component evaluation playground for AI-generated custom components with comprehensive error analysis and quality metrics.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![LWC](https://img.shields.io/badge/LWC-8.20.1-blue)](https://lwc.dev/)
[![SLDS](https://img.shields.io/badge/SLDS-2.26.2-orange)](https://www.lightningdesignsystem.com/)

## 🎯 Overview

This playground serves as a comprehensive evaluation environment for AI-generated Lightning Web Components (LWC). It's designed for analyzing component quality, SLDS compliance, accessibility, and identifying common generation errors across different AI models and complexity tiers.

**Key Use Cases:**
- **Error Analysis**: Identify and categorize common issues in AI-generated components
- **Quality Metrics**: Track production readiness, violations, and compliance scores
- **Model Comparison**: Compare component quality across different AI models (Claude, GPT, etc.)
- **SLDS Compliance**: Validate Lightning Design System implementation
- **Visual Testing**: Automated screenshot capture across desktop, tablet, and mobile viewports

## ✨ Features

### 📊 Interactive Dashboard
- **Real-time Search**: Instant filtering across component names, tiers, complexity, models, and utterances
- **Quality Metrics**: Production Ready / Needs Work / Failed classification with counts
- **Advanced Filters**: Filter by tier (Bronze/Silver/Gold), complexity, variant, model, and quality status
- **Trends Analysis**: Historical tracking of component quality over time with version snapshots

### 🔍 Component Analysis
- **Multi-viewport Screenshots**: Automated capture for desktop (1280x800), tablet (768x1024), mobile (375x667)
- **SLDS Scoring**: Accessibility, design consistency, and compliance metrics
- **Violation Tracking**: Detailed error categorization with severity levels
- **Metadata Storage**: Complete evaluation data including timestamps, model info, and PRD

### 🎨 Component Gallery
- **Dynamic Routing**: Auto-generated routes for all components in `generated/c/`
- **Component Preview**: Live rendering with SLDS and Lightning Base Components
- **Responsive Design**: Preview across multiple device sizes
- **Quality Indicators**: Visual badges for production readiness status

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0 (recommended: 20.19.4)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/riteshiitbbs007/eval-generated-comp-playground.git
cd eval-generated-comp-playground

# Install dependencies (takes a couple of minutes)
npm install
```

If you encounter "command not found" for npm:
```bash
# Install Homebrew (macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

### Running the Playground

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The dashboard (`/`) is your primary interface for browsing and analyzing components.

## 📁 Project Structure

```
eval-generated-comp-playground/
├── generated/              # AI-generated components
│   ├── c/                 # Component namespace directory
│   │   ├── componentName/
│   │   │   ├── componentName.html
│   │   │   ├── componentName.js
│   │   │   ├── componentName.css
│   │   │   ├── componentName.js-meta.xml
│   │   │   ├── componentName.md           # PRD/specification
│   │   │   ├── metadata.json              # Scores, violations, timestamps
│   │   │   └── screenshots/
│   │   │       ├── desktop.png
│   │   │       ├── tablet.png
│   │   │       └── mobile.png
│   ├── components.json    # Component registry with metadata
│   └── trends.json        # Historical quality metrics
├── site/                  # Dashboard and UI components
│   └── modules/
│       └── ui/
│           ├── app/       # Main application container
│           ├── dashboard/ # Quality metrics dashboard
│           ├── gallery/   # Component preview gallery
│           └── filters/   # Advanced filtering panel
├── scripts/               # Automation scripts
│   ├── generate-app-templates.js      # Dynamic routing generation
│   ├── capture-screenshots.js         # Screenshot automation
│   ├── generate-trends-snapshot.cjs   # Trends data generation
│   └── migrate-*.cjs                  # Score migration utilities
├── server/                # Express API server
│   └── index.js          # Server with CORS and rate limiting
└── docs/                  # Documentation
    ├── BLUEPRINT.md       # Architecture overview
    ├── DEPLOYMENT.md      # Deployment guide
    └── TRENDS_*.md        # Trends feature documentation
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Start dev server with hot reload
npm run dev:compat       # Start dev server with AMD format compatibility
npm run dev:api          # Start API server with nodemon
```

### Build
```bash
npm run build            # Production build (ESM)
npm run build:prod-compat # Production build (AMD format)
```

### Screenshots
```bash
npm run screenshots      # Capture screenshots for components without them
npm run screenshots:all  # Recapture all screenshots (force update)
```

### Trends & Metrics
```bash
npm run trends:snapshot         # Generate trends snapshot with prompts
npm run trends:snapshot:quiet   # Generate trends snapshot silently
npm run trends:backfill        # Backfill historical trends data
npm run trends:analyze         # Analyze trends patterns
npm run trends:export          # Export trends to CSV/JSON
```

### Score Migration
```bash
npm run scores:migrate          # Migrate component scores with versioning
npm run scores:migrate:dry-run  # Preview migration without changes
npm run trends:migrate          # Update trends with new score calculations
npm run trends:migrate:dry-run  # Preview trends migration
```

### Utilities
```bash
npm run clean            # Remove build artifacts and caches
npm run generate:templates # Generate routing templates
```

## 📊 Component Metadata Structure

Each component includes rich metadata for analysis:

```json
{
  "componentName": "dataTable",
  "utteranceId": "tier2_complex_variant1",
  "tier": "Silver",
  "complexity": "complex",
  "variant": 1,
  "model": "claude-sonnet-4.6",
  "timestamp": "2026-05-01T10:30:00Z",
  "sldsScore": {
    "accessibility": 95,
    "designConsistency": 88,
    "total": 91
  },
  "violations": [
    {
      "type": "accessibility",
      "severity": "warning",
      "message": "Missing aria-label on button",
      "location": "dataTable.html:42"
    }
  ],
  "screenshots": {
    "desktop": "/assets/screenshots/dataTable/desktop.png",
    "tablet": "/assets/screenshots/dataTable/tablet.png",
    "mobile": "/assets/screenshots/dataTable/mobile.png"
  },
  "status": "production_ready" // or "needs_work" or "failed"
}
```

## 🔬 Error Analysis Workflow

1. **Generate Components**: Components are created by AI evaluation system and placed in `generated/c/`
2. **Automatic Processing**:
   - Routing templates auto-generated via `generate-app-templates.js`
   - Screenshots captured via `capture-screenshots.js`
   - Metadata extracted and stored in `components.json`
3. **Dashboard Analysis**:
   - Browse components by quality metrics
   - Filter by tier, complexity, model
   - Search across all attributes
   - View trends over time
4. **Deep Dive**:
   - Click components to view live preview
   - Review violations and scores
   - Compare screenshots across viewports
   - Export data for further analysis

## 📈 Trends Analysis

The playground tracks component quality over time with version snapshots:

```bash
# Generate new snapshot
npm run trends:snapshot

# View trends on dashboard
# Navigate to: http://localhost:3000/trends
```

**Trends Configuration** (`trends.config.json`):
```json
{
  "enabled": true,
  "retentionDays": 90,
  "snapshotFrequency": "daily",
  "metrics": ["sldsScore", "violations", "status"]
}
```

## 🎨 Dashboard Features

### Quality Metrics Cards
- **Production Ready**: Components with score >= 80 and no critical violations
- **Needs Work**: Components with score 60-79 or minor violations
- **Failed**: Components with score < 60 or critical violations

### Search & Filter
- **Global Search**: Real-time filtering across all component attributes
- **Reactive Updates**: All metrics and galleries update instantly
- **Filter Panel**: Multi-select filters for tier, complexity, variant, model, quality
- **Filter Persistence**: Selections maintained across navigation

### Component Gallery
- **Card View**: Visual component cards with screenshots
- **Quick Info**: Tier, complexity, model, score at a glance
- **Status Badges**: Color-coded quality indicators
- **Click-through**: Navigate to full component preview

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

The `heroku-postbuild` script automatically runs build steps.

## 🤝 Contributing

This is a playground/research project for the UX Foundations Tooling team at Salesforce. For internal collaboration:

1. Clone and create a feature branch
2. Make changes with descriptive commits
3. Test thoroughly with `npm run dev`
4. Submit PR with error analysis findings
5. Tag @riteshiitbbs007 for review

## 📚 Documentation

- **[BLUEPRINT.md](./BLUEPRINT.md)**: Detailed architecture and design decisions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Deployment guide for various platforms
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**: Feature implementation details
- **[TRENDS_COMPLETE_IMPLEMENTATION.md](./TRENDS_COMPLETE_IMPLEMENTATION.md)**: Trends analysis system

## 🔧 Troubleshooting

**Component not showing in dashboard:**
- Ensure component is in `generated/c/` with proper structure
- Run `npm run generate:templates` to regenerate routing
- Check `generated/components.json` for component entry
- Verify metadata.json exists in component directory

**Screenshots not generating:**
- Install Playwright browsers: `npx playwright install`
- Check component renders without errors in browser
- Review screenshot script logs for failures
- Try `npm run screenshots:all` to force regeneration

**Build failures:**
- Clear cache: `npm run clean && npm install`
- Check Node.js version: `node --version` (should be >= 18)
- Verify LWC compiler version in package-lock.json
- Review platform-specific imports (comment out Salesforce platform modules for local dev)

**Dashboard filters not working:**
- Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
- Check browser console for JavaScript errors
- Verify `components.json` has valid JSON structure
- Test with a single filter first, then combine

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

## 👤 Maintainer

**Ritesh Kumar** - Senior MTS, UX Foundations Tooling Team, Salesforce  
GitHub: [@riteshiitbbs007](https://github.com/riteshiitbbs007)

---

**Built with**: LWC 8.20.1 | SLDS 2.26.2 | Lightning Base Components 1.28.13 | LWR 0.18.1 | Playwright 1.58.2
