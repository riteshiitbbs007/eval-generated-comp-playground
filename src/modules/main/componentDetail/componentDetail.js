import { LightningElement, api } from 'lwc';

export default class ComponentDetail extends LightningElement {
  @api componentName;

  metadata = null;
  loading = true;
  error = null;

  async connectedCallback() {
    if (this.componentName) {
      await this.loadMetadata();
    }
  }

  async loadMetadata() {
    try {
      // Load from generated/c/{componentName}/metadata.json
      const response = await fetch(`/generated/c/${this.componentName}/metadata.json`);
      if (!response.ok) {
        throw new Error(`Failed to load metadata: ${response.statusText}`);
      }
      this.metadata = await response.json();

      // Auto-detect screenshots if missing
      if (!this.metadata.screenshotUrls) {
        this.metadata.screenshotUrls = {
          desktop: `/generated/c/${this.componentName}/screenshots/desktop.png`
        };
      }
    } catch (err) {
      this.error = err.message;
      console.error('Error loading metadata:', err);
    } finally {
      this.loading = false;
    }
  }

  get hasMetadata() {
    return this.metadata !== null && !this.loading;
  }

  get formattedCost() {
    if (!this.metadata?.cost) return 'N/A';
    return `$${this.metadata.cost.totalCost.toFixed(4)}`;
  }

  get tokensSummary() {
    if (!this.metadata?.tokenUsage) return 'N/A';
    const { inputTokens, outputTokens, totalTokens } = this.metadata.tokenUsage;
    return `${totalTokens.toLocaleString()} total (${inputTokens.toLocaleString()} in / ${outputTokens.toLocaleString()} out)`;
  }

  get formattedTimestamp() {
    return this.metadata ? new Date(this.metadata.timestamp).toLocaleString() : '';
  }

  get overallScoreClass() {
    if (!this.metadata?.scores) return '';
    const score = this.metadata.scores.overall;
    if (score >= 2.5) return 'score-production';
    if (score >= 2.0) return 'score-prototype';
    return 'score-draft';
  }

  get livePreviewUrl() {
    return `/?component=${this.componentName}`;
  }
}
