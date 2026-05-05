import { LightningElement, api } from 'lwc';

export default class BatchTrendsChart extends LightningElement {
  _chartData;
  @api metric = 'overall';

  chartInstance = null;
  chartJsLoaded = false;
  Chart = null;

  @api
  get chartData() {
    return this._chartData;
  }

  set chartData(value) {
    console.log('📊 chartData setter called, value:', value ? 'exists' : 'null', 'datasets:', value?.datasets?.length);
    this._chartData = value;

    // Trigger re-render when data changes
    if (value && this.chartJsLoaded && this.Chart) {
      console.log('📊 Chart.js loaded, rendering chart...');
      setTimeout(() => this.renderChart(), 100);
    } else if (value) {
      console.log('⏳ Chart.js not ready yet, waiting...');
      // Wait for Chart.js to load if data comes in before it's ready
      this.waitForChartJs();
    }
  }

  async waitForChartJs() {
    // Poll for Chart.js to be ready
    const maxAttempts = 50; // 5 seconds max
    let attempts = 0;

    const checkReady = () => {
      attempts++;
      if (this.Chart && this.chartJsLoaded && this._chartData) {
        console.log('✅ Chart.js ready after waiting, rendering...');
        this.renderChart();
      } else if (attempts < maxAttempts) {
        setTimeout(checkReady, 100);
      } else {
        console.error('❌ Timeout waiting for Chart.js to load');
      }
    };

    checkReady();
  }

  async connectedCallback() {
    try {
      await this.loadChartJs();
    } catch (error) {
      console.error('❌ Error loading Chart.js:', error);
    }
  }

  renderedCallback() {
    console.log('📊 Chart component renderedCallback:', {
      hasData: !!this._chartData,
      hasChart: !!this.chartInstance,
      hasChartJs: !!this.Chart,
      datasetCount: this._chartData?.datasets?.length
    });

    // Only render if we have data, Chart.js is loaded, and no existing chart
    if (this._chartData && !this.chartInstance && this.Chart) {
      console.log('📊 Conditions met, rendering chart...');
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        this.renderChart();
      }, 100);
    }
  }

  disconnectedCallback() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  async loadChartJs() {
    if (this.chartJsLoaded) {
      return;
    }

    // Check if Chart.js is already loaded globally
    if (window.Chart) {
      console.log('✅ Chart.js already loaded globally');
      this.Chart = window.Chart;
      this.chartJsLoaded = true;
      return;
    }

    // Load from CDN (LWC may not support dynamic npm imports)
    console.log('📦 Loading Chart.js from CDN...');
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      script.onload = () => {
        this.Chart = window.Chart;
        this.chartJsLoaded = true;
        console.log('✅ Chart.js loaded from CDN');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Failed to load Chart.js from CDN');
        reject(new Error('Failed to load Chart.js'));
      };
      document.head.appendChild(script);
    });
  }

  renderChart() {
    console.log('📈 Attempting to render chart...', {
      hasChart: !!this.Chart,
      hasChartData: !!this._chartData,
      datasetCount: this._chartData?.datasets?.length || 0
    });

    if (!this.Chart) {
      console.error('❌ Chart.js not loaded');
      return;
    }

    if (!this._chartData) {
      console.error('❌ No chart data available');
      return;
    }

    const canvas = this.template.querySelector('canvas');
    if (!canvas) {
      console.error('❌ Canvas element not found');
      return;
    }

    // Destroy existing chart
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const ctx = canvas.getContext('2d');

    const yAxisLabel = this.metric === 'overall' ? 'Overall Score (0-3.0)' : 'SLDS Score (0-1.0)';
    const yAxisMax = this.metric === 'overall' ? 3.0 : 1.0;

    // Create a completely plain object to avoid LWC proxy issues
    const plainChartData = {
      labels: [...(this._chartData.labels || [])],
      datasets: (this._chartData.datasets || []).map(ds => ({
        label: String(ds.label),
        data: [...(ds.data || [])],
        metadata: ds.metadata ? [...ds.metadata] : null,
        borderColor: String(ds.borderColor),
        backgroundColor: String(ds.backgroundColor),
        borderWidth: Number(ds.borderWidth),
        tension: Number(ds.tension),
        fill: Boolean(ds.fill)
      }))
    };

    console.log('✅ Creating Chart.js instance with plain data...');
    this.chartInstance = new this.Chart(ctx, {
      type: 'line',
      data: plainChartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2);
                }
                return label;
              },
              afterLabel: function(context) {
                const dataset = context.dataset;
                const dataIndex = context.dataIndex;

                // Check if metadata exists for this data point
                if (dataset.metadata && dataset.metadata[dataIndex]) {
                  const meta = dataset.metadata[dataIndex];
                  const lines = [];

                  if (meta.model) {
                    lines.push(`Model: ${meta.model}`);
                  }

                  if (meta.count > 1) {
                    lines.push(`(avg of ${meta.count} instances)`);
                  }

                  return lines;
                }

                return [];
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
              font: {
                size: 13,
                weight: 600
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: yAxisLabel,
              font: {
                size: 13,
                weight: 600
              }
            },
            min: 0,
            max: yAxisMax,
            ticks: {
              stepSize: this.metric === 'overall' ? 0.5 : 0.2
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });

    console.log('🎉 Chart rendered successfully!', {
      type: this.chartInstance.config.type,
      datasets: this.chartInstance.data.datasets.length,
      labels: this.chartInstance.data.labels.length
    });
  }

  @api
  updateChart() {
    this.renderChart();
  }
}
