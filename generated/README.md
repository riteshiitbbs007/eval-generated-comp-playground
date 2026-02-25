# Generated Components

This directory contains LWC components generated during evaluation tests with local playground deployment enabled.

## Structure

Each component has its own directory:

```
generated/
├── counter/
│   ├── counter.html
│   ├── counter.js
│   ├── counter.css
│   ├── counter.js-meta.xml
│   ├── counter.md (PRD)
│   ├── metadata.json (scores, violations, timestamp)
│   └── screenshots/
│       ├── desktop.png
│       ├── mobile.png
│       └── tablet.png
├── contactForm/
└── ... (more components)
```

## Viewing Components

Start the gallery web server to browse all generated components:

```bash
node scripts/startGallery.mjs
```

Then open: http://localhost:3002

## Configuration

Enable local playground and screenshots in `.env`:

```bash
ENABLE_LOCAL_PLAYGROUND=true
ENABLE_SCREENSHOT_CAPTURE=true
PLAYGROUND_PATH=../lwc-slds-lbc-starter
```
