const fs = require('fs');
const path = require('path');

const TRENDS_FILE = path.join(__dirname, '..', 'generated', 'trends.json');
const EXPORT_DIR = path.join(__dirname, '..', 'generated', 'trends-exports');

function loadTrendsData() {
  if (!fs.existsSync(TRENDS_FILE)) {
    console.error('Trends data file not found. Run `npm run trends:snapshot` first.');
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(TRENDS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading trends data:', error.message);
    process.exit(1);
  }
}

function ensureExportDir() {
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }
}

function exportToCSV(data) {
  const snapshots = data.snapshots;

  if (snapshots.length === 0) {
    console.log('No snapshots to export.');
    return null;
  }

  // Export overall summary CSV
  const summaryRows = [
    ['Date', 'Total Components', 'Avg Overall Score', 'Avg SLDS Score', 'Production', 'Prototype', 'Draft']
  ];

  snapshots.forEach(snapshot => {
    summaryRows.push([
      snapshot.date,
      snapshot.summary.totalComponents,
      snapshot.summary.avgOverallScore.toFixed(2),
      snapshot.summary.avgSldsScore.toFixed(2),
      snapshot.summary.qualityDistribution.production,
      snapshot.summary.qualityDistribution.prototype,
      snapshot.summary.qualityDistribution.draft
    ]);
  });

  const summaryCSV = summaryRows.map(row => row.join(',')).join('\n');

  // Export batch trends CSV
  const batchRows = [
    ['Date', 'Batch', 'Avg Overall Score', 'Avg SLDS Score', 'Count', 'Min Score', 'Max Score', 'Std Dev']
  ];

  snapshots.forEach(snapshot => {
    if (snapshot.batches) {
      Object.entries(snapshot.batches).forEach(([batchKey, batch]) => {
        batchRows.push([
          snapshot.date,
          batchKey,
          batch.metrics.avgOverallScore.toFixed(2),
          batch.metrics.avgSldsScore.toFixed(2),
          batch.count,
          batch.metrics.minScore.toFixed(2),
          batch.metrics.maxScore.toFixed(2),
          batch.metrics.stdDev.toFixed(2)
        ]);
      });
    }
  });

  const batchCSV = batchRows.map(row => row.join(',')).join('\n');

  return { summaryCSV, batchCSV };
}

function exportTrends() {
  console.log('=== Exporting Trends Data ===\n');

  const data = loadTrendsData();
  ensureExportDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Export full JSON
  const jsonExportPath = path.join(EXPORT_DIR, `trends-${timestamp}.json`);
  fs.writeFileSync(jsonExportPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ Exported full data to: ${jsonExportPath}`);

  // Export CSV files
  const csvData = exportToCSV(data);
  if (csvData) {
    const summaryCSVPath = path.join(EXPORT_DIR, `trends-summary-${timestamp}.csv`);
    fs.writeFileSync(summaryCSVPath, csvData.summaryCSV, 'utf-8');
    console.log(`✓ Exported summary CSV to: ${summaryCSVPath}`);

    const batchCSVPath = path.join(EXPORT_DIR, `trends-batches-${timestamp}.csv`);
    fs.writeFileSync(batchCSVPath, csvData.batchCSV, 'utf-8');
    console.log(`✓ Exported batch CSV to: ${batchCSVPath}`);
  }

  console.log('\n=== Export Complete ===');
  console.log(`Files saved to: ${EXPORT_DIR}`);
}

exportTrends();
