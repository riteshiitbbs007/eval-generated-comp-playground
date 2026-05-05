const fs = require('fs');
const path = require('path');

const TRENDS_FILE = path.join(__dirname, '..', 'generated', 'trends.json');

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

function analyzeTrends() {
  console.log('=== Trends Analysis ===\n');

  const data = loadTrendsData();

  if (!data.snapshots || data.snapshots.length === 0) {
    console.log('No snapshots available for analysis.');
    return;
  }

  const snapshots = data.snapshots;
  const latest = snapshots[snapshots.length - 1];
  const oldest = snapshots[0];

  console.log(`Total Snapshots: ${snapshots.length}`);
  console.log(`Date Range: ${oldest.date} to ${latest.date}\n`);

  // Overall metrics
  console.log('=== Latest Snapshot ===');
  console.log(`Date: ${latest.date}`);
  console.log(`Total Components: ${latest.summary.totalComponents}`);
  console.log(`Avg Overall Score: ${latest.summary.avgOverallScore.toFixed(2)}`);
  console.log(`Avg SLDS Score: ${latest.summary.avgSldsScore.toFixed(2)}`);
  console.log('\nQuality Distribution:');
  console.log(`  Production: ${latest.summary.qualityDistribution.production}`);
  console.log(`  Prototype: ${latest.summary.qualityDistribution.prototype}`);
  console.log(`  Draft: ${latest.summary.qualityDistribution.draft}\n`);

  // Trend analysis
  if (snapshots.length >= 2) {
    const previous = snapshots[snapshots.length - 2];
    const scoreDiff = latest.summary.avgOverallScore - previous.summary.avgOverallScore;
    const sldsDiff = latest.summary.avgSldsScore - previous.summary.avgSldsScore;

    console.log('=== Trend Analysis ===');
    console.log(`Overall Score Change: ${scoreDiff > 0 ? '+' : ''}${scoreDiff.toFixed(3)} (${scoreDiff > 0 ? '↑' : scoreDiff < 0 ? '↓' : '→'})`);
    console.log(`SLDS Score Change: ${sldsDiff > 0 ? '+' : ''}${sldsDiff.toFixed(3)} (${sldsDiff > 0 ? '↑' : sldsDiff < 0 ? '↓' : '→'})\n`);
  }

  // Batch analysis
  if (latest.batches) {
    console.log('=== Batch Performance ===');
    const batchEntries = Object.entries(latest.batches).sort((a, b) =>
      b[1].metrics.avgOverallScore - a[1].metrics.avgOverallScore
    );

    batchEntries.forEach(([batchKey, batch], index) => {
      const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(`${rank} ${batchKey.padEnd(15)} | Score: ${batch.metrics.avgOverallScore.toFixed(2)} | SLDS: ${batch.metrics.avgSldsScore.toFixed(2)} | Components: ${batch.count}`);
    });
    console.log();
  }

  // Historical comparison
  if (snapshots.length >= 2) {
    console.log('=== Historical Progress ===');
    const firstScore = oldest.summary.avgOverallScore;
    const lastScore = latest.summary.avgOverallScore;
    const totalChange = lastScore - firstScore;
    const percentChange = ((totalChange / firstScore) * 100).toFixed(1);

    console.log(`Initial Score (${oldest.date}): ${firstScore.toFixed(2)}`);
    console.log(`Latest Score (${latest.date}): ${lastScore.toFixed(2)}`);
    console.log(`Total Change: ${totalChange > 0 ? '+' : ''}${totalChange.toFixed(3)} (${percentChange}%)\n`);
  }

  console.log('=== Next Steps ===');
  console.log('- Run `npm run trends:snapshot` to capture a new snapshot');
  console.log('- View trends in the dashboard: navigate to the Trends tab');
  console.log('- Export data: `npm run trends:export`\n');
}

analyzeTrends();
