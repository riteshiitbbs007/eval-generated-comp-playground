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
        strategy: 'utterance-range',
        rangeSize: 5,
        customRanges: []
      },
      storage: {
        maxSnapshots: 100,
        autoCleanup: true
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

  // Calculate averages
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

  // Calculate standard deviation
  const variance = scores.reduce((sum, score) =>
    sum + Math.pow(score - avgOverallScore, 2), 0
  ) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Quality gate distribution
  const distribution = {
    production: components.filter(c => (c.scores?.overall || 0) >= 3.0).length,
    prototype: components.filter(c => {
      const score = c.scores?.overall || 0;
      return score >= 2.0 && score < 3.0;
    }).length,
    draft: components.filter(c => (c.scores?.overall || 0) < 2.0).length
  };

  // Model distribution
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
  const snapshotData = {
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

  // Include execution mode metadata if present (for future mode filtering)
  // These fields enable accurate mode-based trend filtering
  if (component.testMode !== undefined) {
    snapshotData.testMode = component.testMode;
  }
  if (component.executionMode !== undefined) {
    snapshotData.executionMode = component.executionMode;
  }
  if (component.skillsModeEnabled !== undefined) {
    snapshotData.skillsModeEnabled = component.skillsModeEnabled;
  }
  if (component.sldsToolsEnabled !== undefined) {
    snapshotData.sldsToolsEnabled = component.sldsToolsEnabled;
  }

  return snapshotData;
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

// Load existing trends data
function loadTrendsData() {
  if (!fs.existsSync(TRENDS_FILE)) {
    return {
      version: '1.0',
      config: {},
      snapshots: [],
      metadata: {
        lastUpdated: null,
        totalSnapshots: 0,
        dateRange: {
          first: null,
          last: null
        }
      }
    };
  }

  try {
    const content = fs.readFileSync(TRENDS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading trends data:', error.message);
    return {
      version: '1.0',
      config: {},
      snapshots: [],
      metadata: {
        lastUpdated: null,
        totalSnapshots: 0,
        dateRange: {
          first: null,
          last: null
        }
      }
    };
  }
}

// Save trends data
function saveTrendsData(data) {
  const dir = path.dirname(TRENDS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(TRENDS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Check if snapshot exists for today
function hasTodaySnapshot(trendsData) {
  const today = new Date().toISOString().split('T')[0];
  return trendsData.snapshots.some(s => s.date === today);
}

// Generate snapshot
function generateSnapshot(config) {
  const components = readComponentMetadata();

  if (components.length === 0) {
    console.error('No components found to snapshot');
    return null;
  }

  console.log(`Found ${components.length} components`);

  const now = new Date();
  const snapshot = {
    id: `snapshot-${now.toISOString().replace(/[:.]/g, '-')}`,
    timestamp: now.toISOString(),
    date: now.toISOString().split('T')[0]
  };

  // Add component-level data
  if (config.collection.includeComponentData) {
    snapshot.components = components.map(formatComponentData);
    console.log(`Included ${snapshot.components.length} component records`);
  }

  // Add batch aggregates
  if (config.collection.includeBatchAggregates) {
    const batches = groupByVariantChronological(components, config.batching.rangeSize);
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

    console.log(`Calculated metrics for ${Object.keys(snapshot.batches).length} batches`);
  }

  // Add overall summary
  snapshot.summary = calculateOverallSummary(components);

  return snapshot;
}

// Main execution
function main() {
  console.log('=== Generating Trends Snapshot ===\n');

  // Load config
  const config = loadConfig();
  console.log(`Batch strategy: ${config.batching.strategy}`);
  console.log(`Batch size: ${config.batching.rangeSize} components per batch`);
  console.log(`Grouping: By variant (Simple/Moderate/Complex) chronologically`);
  console.log(`Granularity: ${config.collection.granularity}\n`);

  // Generate snapshot
  const snapshot = generateSnapshot(config);

  if (!snapshot) {
    console.error('Failed to generate snapshot');
    process.exit(1);
  }

  // Load existing trends
  const trendsData = loadTrendsData();

  // Check for duplicate
  if (hasTodaySnapshot(trendsData)) {
    console.log('\n⚠️  A snapshot already exists for today.');
    console.log('   The existing snapshot will be replaced.\n');

    // Remove today's snapshot
    trendsData.snapshots = trendsData.snapshots.filter(s => s.date !== snapshot.date);
  }

  // Add new snapshot
  trendsData.snapshots.push(snapshot);
  trendsData.config = config;

  // Apply cleanup if enabled
  if (config.storage.autoCleanup && config.storage.maxSnapshots) {
    if (trendsData.snapshots.length > config.storage.maxSnapshots) {
      const removed = trendsData.snapshots.length - config.storage.maxSnapshots;
      trendsData.snapshots = trendsData.snapshots.slice(-config.storage.maxSnapshots);
      console.log(`Cleaned up ${removed} old snapshots (max: ${config.storage.maxSnapshots})`);
    }
  }

  // Update metadata
  const dates = trendsData.snapshots.map(s => s.date).sort();
  trendsData.metadata = {
    lastUpdated: snapshot.timestamp,
    totalSnapshots: trendsData.snapshots.length,
    dateRange: {
      first: dates[0] || null,
      last: dates[dates.length - 1] || null
    }
  };

  // Save
  saveTrendsData(trendsData);

  console.log('\n=== Snapshot Created Successfully ===');
  console.log(`Date: ${snapshot.date}`);
  console.log(`Components: ${snapshot.summary.totalComponents}`);
  console.log(`Avg Overall Score: ${snapshot.summary.avgOverallScore}`);
  console.log(`Avg SLDS Score: ${snapshot.summary.avgSldsScore}`);
  console.log(`Total Snapshots: ${trendsData.metadata.totalSnapshots}`);
  console.log(`\nTrends data saved to: ${TRENDS_FILE}`);
}

// Run
main();
