import { LightningElement, api } from 'lwc';

export default class ComponentDetail extends LightningElement {
  @api componentName;

  metadata = null;
  loading = true;
  error = null;

  // Code viewer state
  activeCodeTab = 'html';
  sourceCode = {
    html: '',
    css: '',
    js: ''
  };
  loadingCode = false;
  codeError = null;

  /**
   * Strips the 8-character hex UUID suffix from component name for display
   * @param {string} componentName - Full component name with UUID
   * @returns {string} Display name without UUID
   */
  stripUuidFromName(componentName) {
    if (!componentName) return '';

    // Check if name ends with 8 hex characters (UUID pattern)
    const uuidPattern = /[a-f0-9]{8}$/i;

    if (uuidPattern.test(componentName)) {
      // Strip last 8 characters
      return componentName.slice(0, -8);
    }

    // Return as-is if no UUID found
    return componentName;
  }

  get displayName() {
    return this.stripUuidFromName(this.componentName);
  }

  async connectedCallback() {
    if (this.componentName) {
      await Promise.all([
        this.loadMetadata(),
        this.loadSourceCode()
      ]);
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

  get hasLangsmithUrl() {
    return !!this.metadata?.langsmithRunUrl;
  }

  get langsmithRunUrl() {
    return this.metadata?.langsmithRunUrl || null;
  }

  get hasUtteranceId() {
    return !!this.metadata?.utteranceId;
  }

  get utteranceId() {
    return this.metadata?.utteranceId || null;
  }

  get hasVariant() {
    return !!this.metadata?.variant;
  }

  get variant() {
    return this.metadata?.variant || null;
  }

  get hasErrorsByType() {
    return this.metadata?.errorsByType && Object.keys(this.metadata.errorsByType).length > 0;
  }

  get errorsByType() {
    if (!this.hasErrorsByType) return [];
    return Object.entries(this.metadata.errorsByType)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }

  get totalErrorsByType() {
    return this.errorsByType.reduce((sum, item) => sum + item.count, 0);
  }

  handleCopyUtteranceId() {
    if (this.utteranceId) {
      navigator.clipboard.writeText(this.utteranceId)
        .then(() => {
          console.log('Copied utteranceId to clipboard:', this.utteranceId);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  }

  async loadSourceCode() {
    if (!this.componentName) return;

    this.loadingCode = true;
    this.codeError = null;

    try {
      const basePath = `/generated/c/${this.componentName}`;
      const files = ['html', 'css', 'js'];

      const results = await Promise.all(
        files.map(ext =>
          fetch(`${basePath}/${this.componentName}.${ext}`)
            .then(res => res.ok ? res.text() : '')
            .catch(() => '')
        )
      );

      this.sourceCode = {
        html: results[0] || '// No HTML file found',
        css: results[1] || '/* No CSS file found */',
        js: results[2] || '// No JS file found'
      };

    } catch (err) {
      this.codeError = 'Failed to load source code';
      console.error('Error loading source code:', err);
    } finally {
      this.loadingCode = false;
    }
  }

  handleCodeTabChange(event) {
    this.activeCodeTab = event.target.dataset.tab;
  }

  get activeSourceCode() {
    return this.sourceCode[this.activeCodeTab] || '';
  }

  get isHtmlTabActive() {
    return this.activeCodeTab === 'html';
  }

  get isCssTabActive() {
    return this.activeCodeTab === 'css';
  }

  get isJsTabActive() {
    return this.activeCodeTab === 'js';
  }

  get htmlTabClass() {
    return this.activeCodeTab === 'html' ? 'slds-is-active' : '';
  }

  get cssTabClass() {
    return this.activeCodeTab === 'css' ? 'slds-is-active' : '';
  }

  get jsTabClass() {
    return this.activeCodeTab === 'js' ? 'slds-is-active' : '';
  }

  get codeLanguage() {
    const languageMap = {
      html: 'HTML',
      css: 'CSS',
      js: 'JavaScript'
    };
    return languageMap[this.activeCodeTab] || 'Code';
  }
}
