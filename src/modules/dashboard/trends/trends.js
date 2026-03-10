import { LightningElement, track } from 'lwc';

export default class Trends extends LightningElement {
  @track trendsData = null;
  @track loading = true;
  @track error = null;
  @track selectedMetric = 'overall';
  @track selectedDateRange = '30days';
  @track viewMode = 'component'; // 'variant', 'component'
  @track selectedComponents = [];
  @track componentList = [];
  @track _chartData = null;
  initialLoadComplete = false;

  connectedCallback() {
    this.loadTrendsData();
  }

  renderedCallback() {
    // Auto-select all components on first render after data loads
    if (!this.initialLoadComplete && this.hasData && this.componentList.length > 0 && this.selectedComponents.length === 0) {
      this.initialLoadComplete = true;
      console.log('📌 Initial render complete, auto-selecting all components...');

      // Use setTimeout to ensure DOM is ready and trigger proper reactivity
      setTimeout(() => {
        // Create new array to trigger LWC reactivity
        const allComponents = this.componentList.map(c => c.value);
        this.selectedComponents = [...allComponents];
        this.updateComponentList();

        console.log('✅ Auto-selected all components:', this.selectedComponents.length);
        console.log('✅ Selected component values:', this.selectedComponents);

        // Log chart data to verify it's available
        const testChartData = this.chartData;
        console.log('✅ Chart data after selection:', {
          exists: !!testChartData,
          datasets: testChartData?.datasets?.length,
          labels: testChartData?.labels?.length
        });
      }, 150);
    }
  }

  async loadTrendsData() {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch('/generated/trends.json');
      if (!response.ok) {
        throw new Error('Failed to load trends data');
      }

      const data = await response.json();
      this.trendsData = data;

      console.log('📊 Trends data loaded:', {
        totalSnapshots: data.snapshots?.length || 0,
        latestDate: data.snapshots?.[data.snapshots.length - 1]?.date
      });

      // Build component list
      this.buildComponentList();
    } catch (err) {
      this.error = err.message;
      console.error('❌ Error loading trends:', err);
    } finally {
      this.loading = false;
    }
  }

  get hasData() {
    return this.trendsData && this.trendsData.snapshots && this.trendsData.snapshots.length > 0;
  }

  get hasMultipleSnapshots() {
    return this.trendsData && this.trendsData.snapshots && this.trendsData.snapshots.length >= 2;
  }

  get snapshotCount() {
    return this.trendsData?.snapshots?.length || 0;
  }

  get filteredSnapshots() {
    if (!this.hasData) return [];

    const now = new Date();
    let cutoffDate = new Date();

    switch (this.selectedDateRange) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        return this.trendsData.snapshots;
      default:
        cutoffDate.setDate(now.getDate() - 30);
    }

    return this.trendsData.snapshots.filter(snapshot => {
      const snapshotDate = new Date(snapshot.timestamp);
      return snapshotDate >= cutoffDate;
    });
  }

  get chartData() {
    if (!this.hasData) {
      console.log('⚠️  No data available for chart');
      return null;
    }

    const snapshots = this.filteredSnapshots;

    if (snapshots.length === 0) {
      console.log('⚠️  No snapshots in filtered range');
      return null;
    }

    let data;
    if (this.viewMode === 'variant') {
      data = this.getVariantChartData(snapshots);
    } else {
      data = this.getComponentChartData(snapshots);
    }

    console.log('📊 chartData getter called, returning:', data ? 'data available' : 'null', 'datasets:', data?.datasets?.length);
    return data;
  }

  getVariantChartData(snapshots) {
    const metric = this.selectedMetric;

    console.log('📊 Building variant chart data:', { snapshotCount: snapshots.length });

    const variants = ['Simple', 'Moderate', 'Complex'];
    const variantColors = {
      'Simple': '#2e844a',
      'Moderate': '#f59331',
      'Complex': '#e74c3c'
    };

    const chartData = JSON.parse(JSON.stringify({
      labels: snapshots.map(s => s.date),
      datasets: variants.map(variant => {
        const dataPoints = snapshots.map(snapshot => {
          if (!snapshot.components) return null;

          const variantComponents = snapshot.components.filter(c => c.variant === variant);
          if (variantComponents.length === 0) return null;

          const scores = variantComponents.map(c =>
            metric === 'overall' ? c.scores.overall : c.scores.slds_linter
          );
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

          // Get unique models used
          const models = [...new Set(variantComponents.map(c => c.model))];
          const modelInfo = models.join(', ');

          return {
            score: avg,
            model: modelInfo,
            count: variantComponents.length
          };
        });

        return {
          label: variant,
          data: dataPoints.map(dp => dp?.score || null),
          metadata: dataPoints.map(dp => dp ? { model: dp.model, count: dp.count } : null),
          borderColor: variantColors[variant],
          backgroundColor: variantColors[variant] + '20',
          borderWidth: 3,
          tension: 0.3,
          fill: false
        };
      })
    }));

    return chartData;
  }

  getComponentChartData(snapshots) {
    const metric = this.selectedMetric;

    if (this.selectedComponents.length === 0) {
      console.log('⚠️  No components selected');
      return null;
    }

    console.log('📊 Building component chart data:', {
      snapshotCount: snapshots.length,
      componentCount: this.selectedComponents.length
    });

    const colors = [
      '#0176d3', '#2e844a', '#f59331', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
      '#3498db', '#e67e22', '#9b59b6', '#1abc9c'
    ];

    const chartData = JSON.parse(JSON.stringify({
      labels: snapshots.map(s => s.date),
      datasets: this.selectedComponents.map((combination, index) => {
        // Parse utteranceId:variant
        const [utteranceId, variant] = combination.split(':');

        // Collect metadata for each snapshot point
        const dataPoints = snapshots.map(snapshot => {
          if (!snapshot.components) return null;

          // Find all components matching this utteranceId:variant combination
          const matchingComponents = snapshot.components.filter(c =>
            c.utteranceId === utteranceId && c.variant === variant
          );

          if (matchingComponents.length === 0) return null;

          // Average scores if multiple instances exist (e.g., regenerated multiple times)
          const scores = matchingComponents.map(c =>
            metric === 'overall' ? c.scores.overall : c.scores.slds_linter
          );
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

          // Get model info (use first component's model if multiple)
          const models = [...new Set(matchingComponents.map(c => c.model))];
          const modelInfo = models.join(', ');

          return {
            score: avg,
            model: modelInfo,
            count: matchingComponents.length
          };
        });

        return {
          label: `${utteranceId} - ${variant}`,
          data: dataPoints.map(dp => dp?.score || null),
          metadata: dataPoints.map(dp => dp ? { model: dp.model, count: dp.count } : null),
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          borderWidth: 2,
          tension: 0.3,
          fill: false
        };
      })
    }));

    return chartData;
  }

  get summaryStats() {
    if (!this.hasData || this.filteredSnapshots.length === 0) return null;

    const latestSnapshot = this.filteredSnapshots[this.filteredSnapshots.length - 1];
    const summary = latestSnapshot.summary;

    return {
      totalComponents: summary.totalComponents,
      avgOverallScore: summary.avgOverallScore.toFixed(2),
      avgSldsScore: summary.avgSldsScore.toFixed(2),
      productionReady: summary.qualityDistribution.production,
      prototype: summary.qualityDistribution.prototype,
      draft: summary.qualityDistribution.draft,
      productionPercent: ((summary.qualityDistribution.production / summary.totalComponents) * 100).toFixed(0),
      prototypePercent: ((summary.qualityDistribution.prototype / summary.totalComponents) * 100).toFixed(0),
      draftPercent: ((summary.qualityDistribution.draft / summary.totalComponents) * 100).toFixed(0)
    };
  }

  get trendDirection() {
    if (!this.hasData || this.filteredSnapshots.length < 2) return 'stable';

    const snapshots = this.filteredSnapshots;
    const latest = snapshots[snapshots.length - 1].summary.avgOverallScore;
    const previous = snapshots[snapshots.length - 2].summary.avgOverallScore;

    const diff = latest - previous;

    if (diff > 0.05) return 'improving';
    if (diff < -0.05) return 'declining';
    return 'stable';
  }

  get trendIcon() {
    const direction = this.trendDirection;
    if (direction === 'improving') return '↑';
    if (direction === 'declining') return '↓';
    return '→';
  }

  get trendLabel() {
    const direction = this.trendDirection;
    if (direction === 'improving') return 'Improving';
    if (direction === 'declining') return 'Declining';
    return 'Stable';
  }

  get dateRangeOptions() {
    return [
      { label: 'Last 7 Days', value: '7days' },
      { label: 'Last 30 Days', value: '30days' },
      { label: 'Last 90 Days', value: '90days' },
      { label: 'All Time', value: 'all' }
    ];
  }

  get metricOptions() {
    return [
      { label: 'Overall Score', value: 'overall' },
      { label: 'SLDS Score', value: 'slds' }
    ];
  }

  get viewModeOptions() {
    return [
      { label: 'Component Trends', value: 'component' },
      { label: 'Variant Trends', value: 'variant' }
    ];
  }

  buildComponentList() {
    if (!this.hasData) {
      this.componentList = [];
      return;
    }

    const latestSnapshot = this.trendsData.snapshots[this.trendsData.snapshots.length - 1];
    if (!latestSnapshot.components) {
      this.componentList = [];
      return;
    }

    // Get unique utteranceId:variant combinations
    const combinationMap = new Map();
    latestSnapshot.components.forEach(c => {
      if (c.utteranceId && c.variant) {
        const key = `${c.utteranceId}:${c.variant}`;
        if (!combinationMap.has(key)) {
          combinationMap.set(key, {
            label: `${c.utteranceId} - ${c.variant}`,
            value: key,
            utteranceId: c.utteranceId,
            variant: c.variant,
            checked: this.selectedComponents.includes(key)
          });
        }
      }
    });

    // Sort by utteranceId first, then variant
    this.componentList = Array.from(combinationMap.values()).sort((a, b) => {
      const aNum = parseInt(a.utteranceId.replace('C', ''), 10);
      const bNum = parseInt(b.utteranceId.replace('C', ''), 10);
      if (aNum !== bNum) return aNum - bNum;
      return a.variant.localeCompare(b.variant);
    });
  }

  get availableComponents() {
    return this.componentList;
  }

  get showComponentSelector() {
    return this.viewMode === 'component';
  }

  get selectedComponentCount() {
    return this.selectedComponents.length;
  }

  get componentSelectionLabel() {
    const count = this.selectedComponentCount;
    if (count === 0) return 'Select Utterance:Variant Combinations to Track';
    return `${count} Combination${count !== 1 ? 's' : ''} Selected`;
  }

  get chartTitle() {
    if (this.viewMode === 'variant') {
      return 'Variant Trends Over Time';
    }
    return 'Component Trends Over Time';
  }

  get chartDescription() {
    if (this.viewMode === 'variant') {
      return 'Average scores for each variant type (Simple, Moderate, Complex)';
    }
    return 'Track specific utterance:variant combinations over time (averages multiple instances if regenerated)';
  }

  handleMetricChange(event) {
    this.selectedMetric = event.target.value;
  }

  handleDateRangeChange(event) {
    this.selectedDateRange = event.target.value;
  }

  handleViewModeChange(event) {
    this.viewMode = event.target.value;

    // Rebuild component list when switching back to component view
    if (this.viewMode === 'component') {
      this.buildComponentList();

      // Initialize selections if none exist - select all by default
      if (this.selectedComponents.length === 0) {
        this.selectedComponents = this.componentList.map(c => c.value);
        this.updateComponentList();
        console.log('📌 Auto-selected all components:', this.selectedComponents.length);
      }
    }
  }

  handleComponentSelection(event) {
    const value = event.target.value;
    const checked = event.target.checked;

    console.log('Component selection changed:', { value, checked });

    // Create new array to trigger reactivity
    if (checked) {
      if (!this.selectedComponents.includes(value)) {
        this.selectedComponents = [...this.selectedComponents, value];
      }
    } else {
      this.selectedComponents = [...this.selectedComponents.filter(c => c !== value)];
    }

    console.log('Selected components:', this.selectedComponents);

    // Force re-render by updating component list
    this.updateComponentList();
  }

  updateComponentList() {
    // Update checked property for each component
    this.componentList = this.componentList.map(c => ({
      ...c,
      checked: this.selectedComponents.includes(c.value)
    }));

    console.log('✅ Updated component list, checked count:',
      this.componentList.filter(c => c.checked).length
    );
  }

  handleSelectAll() {
    // Create new array to trigger reactivity
    this.selectedComponents = [...this.componentList.map(c => c.value)];
    this.updateComponentList();
    console.log('✅ Selected all components:', this.selectedComponents.length);
  }

  handleClearAll() {
    // Create new empty array to trigger reactivity
    this.selectedComponents = [];
    this.updateComponentList();
    console.log('✅ Cleared all selections');
  }

  handleRefresh() {
    this.loadTrendsData();
  }
}
