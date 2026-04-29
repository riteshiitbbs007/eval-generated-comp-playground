import { LightningElement, track } from 'lwc';

export default class Trends extends LightningElement {
  @track trendsData = null;
  @track loading = true;
  @track error = null;
  @track selectedMetric = 'overall';
  @track selectedDateRange = '30days';
  @track viewMode = 'component'; // 'variant', 'component'
  @track selectedComponents = new Map(); // key: "mode:utteranceId:variant"
  @track componentHierarchy = null;
  @track searchTerm = '';
  @track activeModeFilter = 'all'; // 'all', 'baseline', 'skills'
  @track _chartData = null;
  initialLoadComplete = false;

  // Accordion state for execution modes
  @track executionModeState = {
    baseline: { expanded: true },
    skills: { expanded: true }
  };

  connectedCallback() {
    this.loadTrendsData();
  }

  renderedCallback() {
    // Update checkbox states in DOM (since LWC doesn't support checked={dynamic} binding)
    this.updateCheckboxStates();

    // Auto-select all components on first render after data loads
    if (!this.initialLoadComplete && this.hasData && this.componentHierarchy && this.selectedComponents.size === 0) {
      this.initialLoadComplete = true;
      console.log('📌 Initial render complete, auto-selecting all components...');

      // Use setTimeout to ensure DOM is ready and trigger proper reactivity
      setTimeout(() => {
        this.handleSelectAll();
        console.log('✅ Auto-selected all components:', this.selectedComponents.size);
      }, 150);
    }
  }

  updateCheckboxStates() {
    // Update utterance master checkboxes
    const utteranceCheckboxes = this.template.querySelectorAll('.utterance-checkbox');
    utteranceCheckboxes.forEach(checkbox => {
      const state = checkbox.dataset.selectionState;
      if (state === 'checked') {
        checkbox.checked = true;
        checkbox.indeterminate = false;
      } else if (state === 'indeterminate') {
        checkbox.checked = false;
        checkbox.indeterminate = true;
      } else {
        checkbox.checked = false;
        checkbox.indeterminate = false;
      }
    });
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

      // Build component hierarchy
      this.buildComponentHierarchy();
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

  // Determine execution mode from component metadata
  getExecutionMode(component) {
    // Check for baseline mode first (explicit)
    if (component.testMode === 'baseline') return 'baseline';
    if (component.baseline_slds === true) return 'baseline';

    // Check for explicit Skills mode indicators
    if (component.testMode === 'skills') return 'skills';
    if (component.executionMode === 'skills') return 'skills';
    if (component.skillsModeEnabled === true) return 'skills';

    // Check for MCP mode (treat as skills for UI organization)
    if (component.testMode === 'mcp') return 'skills';
    if (component.executionMode === 'mcp') return 'skills';

    // Default: Components without explicit mode metadata
    // These are legacy/pre-mode components - group with skills for UI but mark separately
    return 'skills'; // Group with skills in UI, but we'll handle filtering differently
  }

  // Check if component has EXPLICIT skills mode metadata (for filtering)
  // Fallback: Since trends.json doesn't capture testMode/executionMode yet,
  // we use baseline_slds as the discriminator
  hasExplicitSkillsMode(component) {
    // Check for explicit Skills mode metadata first
    if (component.testMode === 'skills' ||
        component.executionMode === 'skills' ||
        component.skillsModeEnabled === true ||
        component.testMode === 'mcp' ||
        component.executionMode === 'mcp') {
      return true;
    }

    // FALLBACK: If no explicit mode metadata, use baseline_slds
    // baseline_slds: false means it's a non-baseline (skills/default) component
    if (component.baseline_slds === false) {
      return true;
    }

    return false;
  }

  // Check if component has EXPLICIT baseline mode metadata
  hasExplicitBaselineMode(component) {
    return (
      component.testMode === 'baseline' ||
      component.baseline_slds === true
    );
  }

  // Build hierarchical structure: mode -> utteranceId -> variants
  buildComponentHierarchy() {
    if (!this.hasData) {
      this.componentHierarchy = null;
      return;
    }

    const latestSnapshot = this.trendsData.snapshots[this.trendsData.snapshots.length - 1];
    if (!latestSnapshot.components) {
      this.componentHierarchy = null;
      return;
    }

    const hierarchy = {
      baseline: {},
      skills: {}
    };

    // Build hierarchy from latest snapshot
    latestSnapshot.components.forEach(component => {
      if (!component.utteranceId || !component.variant) return;

      const mode = this.getExecutionMode(component);
      const utteranceId = component.utteranceId;
      const variant = component.variant;

      // Initialize utterance group if doesn't exist
      if (!hierarchy[mode][utteranceId]) {
        hierarchy[mode][utteranceId] = {
          utteranceId,
          utteranceName: this.getUtteranceName(component),
          variants: {}
        };
      }

      // Add variant (may have multiple instances, we'll track all)
      if (!hierarchy[mode][utteranceId].variants[variant]) {
        hierarchy[mode][utteranceId].variants[variant] = [];
      }

      hierarchy[mode][utteranceId].variants[variant].push(component);
    });

    this.componentHierarchy = hierarchy;
    console.log('📊 Built component hierarchy:', hierarchy);
  }

  // Extract utterance name from component metadata or use utteranceId as fallback
  getUtteranceName(component) {
    if (component.utterance) {
      // Truncate long utterances
      return component.utterance.length > 50
        ? component.utterance.substring(0, 50) + '...'
        : component.utterance;
    }
    return component.utteranceId;
  }

  // Get filtered hierarchy based on search and mode filter
  get filteredHierarchy() {
    if (!this.componentHierarchy) return null;

    let filtered = JSON.parse(JSON.stringify(this.componentHierarchy));

    // Apply mode filter
    if (this.activeModeFilter !== 'all') {
      filtered = {
        [this.activeModeFilter]: filtered[this.activeModeFilter] || {}
      };
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      Object.keys(filtered).forEach(mode => {
        Object.keys(filtered[mode]).forEach(utteranceId => {
          const utterance = filtered[mode][utteranceId];
          const matches =
            utteranceId.toLowerCase().includes(term) ||
            utterance.utteranceName.toLowerCase().includes(term);

          if (!matches) {
            delete filtered[mode][utteranceId];
          }
        });
      });
    }

    return filtered;
  }

  // Get execution mode sections for display
  get executionModeSections() {
    if (!this.filteredHierarchy) return [];

    const sections = [];

    if (this.filteredHierarchy.baseline && Object.keys(this.filteredHierarchy.baseline).length > 0) {
      sections.push({
        name: 'baseline',
        label: 'Baseline Mode',
        badge: '2 Tools',
        icon: 'utility:database',
        color: '#7f8de1',
        utterances: this.buildUtteranceGroups('baseline', this.filteredHierarchy.baseline)
      });
    }

    if (this.filteredHierarchy.skills && Object.keys(this.filteredHierarchy.skills).length > 0) {
      sections.push({
        name: 'skills',
        label: 'Skills Mode',
        badge: '3 Tools + Skills',
        icon: 'utility:light_bulb',
        color: '#2e844a',
        utterances: this.buildUtteranceGroups('skills', this.filteredHierarchy.skills)
      });
    }

    return sections;
  }

  // Build utterance groups with selection state
  buildUtteranceGroups(mode, utterances) {
    return Object.keys(utterances)
      .sort((a, b) => {
        const aNum = parseInt(a.replace('C', ''), 10);
        const bNum = parseInt(b.replace('C', ''), 10);
        return aNum - bNum;
      })
      .map(utteranceId => {
        const utterance = utterances[utteranceId];
        const variants = Object.keys(utterance.variants).sort();

        return {
          utteranceId,
          utteranceName: utterance.utteranceName,
          mode,
          variants: variants.map(variant => ({
            name: variant,
            key: `${mode}:${utteranceId}:${variant}`,
            checked: this.selectedComponents.has(`${mode}:${utteranceId}:${variant}`)
          })),
          selectionState: this.getUtteranceSelectionState(mode, utteranceId, variants)
        };
      });
  }

  // Get utterance checkbox state (checked, unchecked, indeterminate)
  getUtteranceSelectionState(mode, utteranceId, variants) {
    const selectedCount = variants.filter(variant =>
      this.selectedComponents.has(`${mode}:${utteranceId}:${variant}`)
    ).length;

    if (selectedCount === 0) return 'unchecked';
    if (selectedCount === variants.length) return 'checked';
    return 'indeterminate';
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

    const variants = ['Simple', 'Moderate', 'Detailed'];
    const variantColors = {
      'Simple': '#2e844a',
      'Moderate': '#f59331',
      'Detailed': '#e74c3c'
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

    if (this.selectedComponents.size === 0) {
      console.log('⚠️  No components selected');
      return null;
    }

    // Filter selections by active mode filter
    const filteredKeys = this.getFilteredSelectionKeys();

    if (filteredKeys.length === 0) {
      console.log(`⚠️  No components match active mode filter: ${this.activeModeFilter}`);
      return null;
    }

    console.log('📊 Building component chart data:', {
      snapshotCount: snapshots.length,
      totalSelections: this.selectedComponents.size,
      filteredSelections: filteredKeys.length,
      activeFilter: this.activeModeFilter
    });

    const colors = {
      baseline: ['#7f8de1', '#a5b1f0', '#5f6dc9', '#4c5ab5'],
      skills: ['#2e844a', '#4bca81', '#1f5a32', '#27a55f']
    };

    const chartData = JSON.parse(JSON.stringify({
      labels: snapshots.map(s => s.date),
      datasets: filteredKeys.map((key, index) => {
        const [mode, utteranceId, variant] = key.split(':');

        // Collect metadata for each snapshot point
        const dataPoints = snapshots.map(snapshot => {
          if (!snapshot.components) return null;

          // Find all components matching this mode:utteranceId:variant combination
          // Use STRICT mode checking to avoid including legacy components
          const matchingComponents = snapshot.components.filter(c => {
            if (c.utteranceId !== utteranceId || c.variant !== variant) {
              return false;
            }

            // Strict mode matching
            if (mode === 'baseline') {
              return this.hasExplicitBaselineMode(c);
            } else if (mode === 'skills') {
              return this.hasExplicitSkillsMode(c);
            }

            return false;
          });

          if (matchingComponents.length === 0) return null;

          // Average scores if multiple instances exist
          const scores = matchingComponents.map(c =>
            metric === 'overall' ? c.scores.overall : c.scores.slds_linter
          );
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

          // Get model info
          const models = [...new Set(matchingComponents.map(c => c.model))];
          const modelInfo = models.join(', ');

          return {
            score: avg,
            model: modelInfo,
            count: matchingComponents.length
          };
        });

        const modeLabels = {
          baseline: '[Baseline]',
          skills: '[Skills]'
        };

        const colorPalette = colors[mode] || colors.skills;
        const colorIndex = filteredKeys.filter((k, i) => i < index && k.startsWith(mode + ':')).length;

        return {
          label: `${utteranceId} - ${variant} ${modeLabels[mode]}`,
          data: dataPoints.map(dp => dp?.score || null),
          metadata: dataPoints.map(dp => dp ? { model: dp.model, count: dp.count } : null),
          borderColor: colorPalette[colorIndex % colorPalette.length],
          backgroundColor: colorPalette[colorIndex % colorPalette.length] + '20',
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

  get showComponentSelector() {
    return this.viewMode === 'component';
  }

  get selectedComponentCount() {
    return this.selectedComponents.size;
  }

  get componentSelectionLabel() {
    const totalCount = this.selectedComponentCount;
    if (totalCount === 0) return 'Select components to track';

    if (this.activeModeFilter === 'all') {
      return `${totalCount} selected`;
    }

    // Show filtered count vs total when mode filter is active
    const filteredCount = this.getFilteredSelectionKeys().length;
    return `${filteredCount} of ${totalCount} selected`;
  }

  get chartTitle() {
    if (this.viewMode === 'variant') {
      return 'Variant Trends Over Time';
    }
    return 'Component Trends Over Time';
  }

  get chartDescription() {
    if (this.viewMode === 'variant') {
      return 'Average scores for each variant type (Simple, Moderate, Detailed)';
    }
    return 'Track specific utterance:variant combinations over time (averages multiple instances if regenerated)';
  }

  // Filter selected component keys by active mode filter
  getFilteredSelectionKeys() {
    const selectedKeys = Array.from(this.selectedComponents.keys());

    if (this.activeModeFilter === 'all') {
      return selectedKeys;
    }

    return selectedKeys.filter(key => {
      const [mode] = key.split(':');
      return mode === this.activeModeFilter;
    });
  }

  // Check if selections exist but are filtered out by mode filter
  get hasFilteredSelections() {
    if (this.selectedComponents.size === 0) return false;
    return this.getFilteredSelectionKeys().length === 0;
  }

  // Get appropriate empty state message based on selection and filter state
  get chartEmptyMessage() {
    if (this.selectedComponents.size === 0) {
      return 'Select components to track';
    }

    if (this.hasFilteredSelections) {
      const modeName = this.activeModeFilter === 'baseline' ? 'Baseline' : 'Skills';
      return `No ${modeName} mode components selected. Switch to "All Modes" or select ${modeName} components.`;
    }

    return 'No chart data available';
  }

  // Computed CSS classes for filter chips
  get allModesChipClass() {
    return this.activeModeFilter === 'all'
      ? 'chip-button chip-button-active'
      : 'chip-button';
  }

  get baselineChipClass() {
    return this.activeModeFilter === 'baseline'
      ? 'chip-button chip-baseline chip-button-active'
      : 'chip-button chip-baseline';
  }

  get skillsChipClass() {
    return this.activeModeFilter === 'skills'
      ? 'chip-button chip-skills chip-button-active'
      : 'chip-button chip-skills';
  }

  // Event handlers
  handleMetricChange(event) {
    this.selectedMetric = event.target.value;
  }

  handleDateRangeChange(event) {
    this.selectedDateRange = event.target.value;
  }

  handleViewModeChange(event) {
    this.viewMode = event.target.value;

    if (this.viewMode === 'component') {
      this.buildComponentHierarchy();

      // Initialize selections if none exist
      if (this.selectedComponents.size === 0) {
        this.handleSelectAll();
      }
    }
  }

  handleSearchInput(event) {
    this.searchTerm = event.target.value;
  }

  handleFilterAllModes() {
    const prevFilter = this.activeModeFilter;
    this.activeModeFilter = 'all';
    console.log(`🎯 Mode filter changed: ${prevFilter} → all`);
  }

  handleFilterBaseline() {
    const prevFilter = this.activeModeFilter;
    this.activeModeFilter = this.activeModeFilter === 'baseline' ? 'all' : 'baseline';
    console.log(`🎯 Mode filter changed: ${prevFilter} → ${this.activeModeFilter}`);
  }

  handleFilterSkills() {
    const prevFilter = this.activeModeFilter;
    this.activeModeFilter = this.activeModeFilter === 'skills' ? 'all' : 'skills';
    console.log(`🎯 Mode filter changed: ${prevFilter} → ${this.activeModeFilter}`);
  }

  handleVariantCheckboxChange(event) {
    const key = event.target.dataset.key;
    const checked = event.target.checked;

    if (checked) {
      this.selectedComponents.set(key, true);
    } else {
      this.selectedComponents.delete(key);
    }

    // Trigger reactivity
    this.selectedComponents = new Map(this.selectedComponents);
  }

  handleUtteranceCheckboxChange(event) {
    const mode = event.target.dataset.mode;
    const utteranceId = event.target.dataset.utteranceId;
    const checked = event.target.checked;

    // Get all variants for this utterance
    const utterance = this.filteredHierarchy[mode][utteranceId];
    const variants = Object.keys(utterance.variants);

    variants.forEach(variant => {
      const key = `${mode}:${utteranceId}:${variant}`;
      if (checked) {
        this.selectedComponents.set(key, true);
      } else {
        this.selectedComponents.delete(key);
      }
    });

    // Trigger reactivity
    this.selectedComponents = new Map(this.selectedComponents);
  }

  handleSelectAll() {
    if (!this.componentHierarchy) return;

    // Select all components from all modes
    Object.keys(this.componentHierarchy).forEach(mode => {
      Object.keys(this.componentHierarchy[mode]).forEach(utteranceId => {
        const variants = Object.keys(this.componentHierarchy[mode][utteranceId].variants);
        variants.forEach(variant => {
          const key = `${mode}:${utteranceId}:${variant}`;
          this.selectedComponents.set(key, true);
        });
      });
    });

    this.selectedComponents = new Map(this.selectedComponents);
    console.log('✅ Selected all components:', this.selectedComponents.size);
  }

  handleClearAll() {
    this.selectedComponents = new Map();
    console.log('✅ Cleared all selections');
  }

  handleRefresh() {
    this.loadTrendsData();
  }
}
