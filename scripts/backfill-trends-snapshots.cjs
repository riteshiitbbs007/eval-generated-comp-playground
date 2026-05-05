const fs = require('fs');
const path = require('path');

// Paths
const GENERATED_DIR = path.join(__dirname, '..', 'generated', 'c');
const TRENDS_FILE = path.join(__dirname, '..', 'generated', 'trends.json');
const CONFIG_FILE = path.join(__dirname, '..', 'trends.config.json');

// Load configuration
function loadConfig() {
  try {
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.warn('Config file not found, using defaults');
    return {
      collection: {
        granularity: 'both',
        includeComponentData: true,
        includeBatchAggregates: true
      },
      batching: {
        strategy: 'variant-chronological',
        rangeSize: 5,
        customRanges: []
      }
    };
  }
}

// Read all component metadata
function readComponentMetadata() {
  const components = [];

  if (!fs.existsSync(GENERATED_DIR)) {
    console.error('Generated components directory not found');
    return components;
  }

  const componentDirs = fs.readdirSync(GENERATED_DIR);

  for (const dir of componentDirs) {
    const metadataPath = path.join(GENERATED_DIR, dir, 'metadata.json');

    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        components.push(metadata);
      } catch (error) {
        console.error(`Error reading metadata for ${dir}:`, error.message);
      }
    }
  }

  return components;
}

// Group components by variant and chronological order
function groupByVariantChronological(components, rangeSize = 5) {
  const batches = {};

  // Group by variant first
  const variantGroups = {
    'Simple': [],
    'Moderate': [],
    'Complex': []
  };

  components.forEach(c => {
    const variant = c.variant || 'Simple';
    if (variantGroups[variant]) {
      variantGroups[variant].push(c);
    }
  });

  // For each variant, sort chronologically and create batches
  Object.entries(variantGroups).forEach(([variant, components]) => {
    if (components.length === 0) return;

    // Sort by timestamp (oldest to newest)
    const sorted = components.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });

    // Create batches of rangeSize
    for (let i = 0; i < sorted.length; i += rangeSize) {
      const batch = sorted.slice(i, i + rangeSize);

      if (batch.length === 0) continue;

      const batchNumber = Math.floor(i / rangeSize) + 1;
      const batchKey = `${variant}-Batch${batchNumber}`;

      // Calculate average timestamp
      const firstTimestamp = new Date(batch[0].timestamp).getTime();
      const lastTimestamp = new Date(batch[batch.length - 1].timestamp).getTime();
      const avgTimestamp = new Date((firstTimestamp + lastTimestamp) / 2).toISOString();

      batches[batchKey] = {
        variant,
        batchNumber,
        avgTimestamp,
        count: batch.length,
        components: batch,
        dateRange: {
          first: batch[0].timestamp,
          last: batch[batch.length - 1].timestamp
        }
      };
    }
  });

  return batches;
}

// Calculate batch metrics
function calculateBatchMetrics(batch) {
  const components = batch.components;

  if (components.length === 0) {
    return {
      avgOverallScore: 0,
      avgSldsScore: 0,
      avgViolations: 0,
      minScore: 0,
      maxScore: 0,
      stdDev: 0
    };
  }

  const scores = components.map(c => c.scores?.overall || 0);
  const sldsScores = components.map(c => c.scores?.slds_linter || 0);
  const violations = components.map(c =>
    (c.violations?.warnings || 0) + (c.violations?.errors || 0)
  );

  const avgOverallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgSldsScore = sldsScores.reduce((a, b) => a + b, 0) / sldsScores.length;
  const avgViolations = violations.reduce((a, b) => a + b, 0) / violations.length;

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  const variance = scores.reduce((sum, score) =>
    sum + Math.pow(score - avgOverallScore, 2), 0
  ) / scores.length;
  const stdDev = Math.sqrt(variance);

  const distribution = {
    production: components.filter(c => (c.scores?.overall || 0) >= 3.0).length,
    prototype: components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 3.0;
    }).length,
    draft: components.filter(c => (c.scores?.overall || 0) < 2.0).length
  };

  const models = {};
  components.forEach(c => {
    const model = c.model || 'unknown';
    models[model] = (models[model] || 0) + 1;
  });

  return {
    avgOverallScore: parseFloat(avgOverallScore.toFixed(2)),
    avgSldsScore: parseFloat(avgSldsScore.toFixed(2)),
    avgViolations: parseFloat(avgViolations.toFixed(1)),
    minScore: parseFloat(minScore.toFixed(2)),
    maxScore: parseFloat(maxScore.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    distribution,
    models
  };
}

// Get quality gate for a score
function getQualityGate(score) {
  if (score >= 3.0) return 'production';
  if (score >= 2.0) return 'prototype';
  return 'draft';
}

// Format component data for snapshot
function formatComponentData(component) {
  return {
    componentName: component.componentName,
    utteranceId: component.utteranceId,
    variant: component.variant,
    model: component.model,
    tier: component.tier,
    complexity: component.complexity,
    baseline_slds: component.baseline_slds || false,
    scores: {
      overall: component.scores?.overall || 0,
      slds_linter: component.scores?.slds_linter || 0,
      slds_quality: component.scores?.slds_quality || 0,
      prd_compliance: component.scores?.prd_compliance || 0,
      security: component.scores?.security || 0
    },
    violations: {
      warnings: component.violations?.warnings || 0,
      errors: component.violations?.errors || 0,
      total: (component.violations?.warnings || 0) + (component.violations?.errors || 0)
    },
    qualityGate: getQualityGate(component.scores?.overall || 0),
    timestamp: component.timestamp
  };
}

// Calculate overall summary
function calculateOverallSummary(components) {
  if (components.length === 0) {
    return {
      totalComponents: 0,
      avgOverallScore: 0,
      avgSldsScore: 0,
      qualityDistribution: {
        production: 0,
        prototype: 0,
        draft: 0
      }
    };
  }

  const scores = components.map(c => c.scores?.overall || 0);
  const sldsScores = components.map(c => c.scores?.slds_linter || 0);

  const avgOverallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgSldsScore = sldsScores.reduce((a, b) => a + b, 0) / sldsScores.length;

  const qualityDistribution = {
    production: components.filter(c => (c.scores?.overall || 0) >= 3.0).length,
    prototype: components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 3.0;
    }).length,
    draft: components.filter(c => (c.scores?.overall || 0) < 2.0).length
  };

  return {
    totalComponents: components.length,
    avgOverallScore: parseFloat(avgOverallScore.toFixed(2)),
    avgSldsScore: parseFloat(avgSldsScore.toFixed(2)),
    qualityDistribution
  };
}

// Generate snapshot for a specific date
function generateSnapshotForDate(date, componentsUpToDate, config) {
  const snapshot = {
    id: `snapshot-${date.toISOString().replace(/[:.]/g, '-')}`,
    timestamp: date.toISOString(),
    date: date.toISOString().split('T')[0]
  };

  // Add component-level data
  if (config.collection.includeComponentData) {
    snapshot.components = componentsUpToDate.map(formatComponentData);
  }

  // Add batch aggregates
  if (config.collection.includeBatchAggregates) {
    const batches = groupByVariantChronological(componentsUpToDate, config.batching.rangeSize);
    snapshot.batches = {};

    Object.entries(batches).forEach(([key, batch]) => {
      snapshot.batches[key] = {
        variant: batch.variant,
        batchNumber: batch.batchNumber,
        avgTimestamp: batch.avgTimestamp,
        dateRange: batch.dateRange,
        count: batch.count,
        metrics: calculateBatchMetrics(batch)
      };
    });
  }

  // Add overall summary
  snapshot.summary = calculateOverallSummary(componentsUpToDate);

  return snapshot;
}

// Main execution
function main() {
  console.log('=== Backfilling Historical Trends Snapshots ===\n');

  // Load config
  const config = loadConfig();
  console.log(`Config loaded:`);
  console.log(`  Strategy: ${config.batching.strategy}`);
  console.log(`  Batch size: ${config.batching.rangeSize}\n`);

  // Read all components
  const allComponents = readComponentMetadata();
  console.log(`Found ${allComponents.length} components\n`);

  if (allComponents.length === 0) {
    console.error('No components found to create snapshots from');
    process.exit(1);
  }

  // Group components by date
  const componentsByDate = new Map();

  allComponents.forEach(component => {
    if (!component.timestamp) return;

    const date = new Date(component.timestamp);
    const dateStr = date.toISOString().split('T')[0];

    if (!componentsByDate.has(dateStr)) {
      componentsByDate.set(dateStr, []);
    }

    componentsByDate.get(dateStr).push(component);
  });

  // Sort dates
  const sortedDates = Array.from(componentsByDate.keys()).sort();

  console.log(`Found ${sortedDates.length} unique generation dates:\n`);
  sortedDates.forEach(date => {
    const count = componentsByDate.get(date).length;
    console.log(`  ${date}: ${count} components`);
  });
  console.log();

  // Generate cumulative snapshots (each snapshot includes all components up to that date)
  const snapshots = [];
  let cumulativeComponents = [];

  sortedDates.forEach((dateStr, index) => {
    // Add components from this date to cumulative list
    const componentsOnThisDate = componentsByDate.get(dateStr);
    cumulativeComponents = [...cumulativeComponents, ...componentsOnThisDate];

    // Use end of day for the snapshot timestamp
    const snapshotDate = new Date(dateStr + 'T23:59:59.000Z');

    const snapshot = generateSnapshotForDate(snapshotDate, cumulativeComponents, config);

    console.log(`✓ Generated snapshot ${index + 1}/${sortedDates.length}: ${dateStr} (${cumulativeComponents.length} components total)`);

    snapshots.push(snapshot);
  });

  console.log();

  // Create trends data structure
  const trendsData = {
    version: '1.0',
    config: config,
    snapshots: snapshots,
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalSnapshots: snapshots.length,
      dateRange: {
        first: sortedDates[0],
        last: sortedDates[sortedDates.length - 1]
      }
    }
  };

  // Save to file
  const dir = path.dirname(TRENDS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(TRENDS_FILE, JSON.stringify(trendsData, null, 2), 'utf-8');

  console.log('=== Backfill Complete ===');
  console.log(`Total snapshots created: ${snapshots.length}`);
  console.log(`Date range: ${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`);
  console.log(`File: ${TRENDS_FILE}`);
  console.log();
  console.log('View trends in the dashboard: http://localhost:3000 → Trends tab');
}

// Run
main();
