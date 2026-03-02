import { LightningElement } from 'lwc';

export default class Utterances extends LightningElement {
  components = [];
  loading = true;
  error = null;
  searchTerm = '';

  async connectedCallback() {
    await this.loadUtterances();
  }

  async loadUtterances() {
    try {
      this.loading = true;
      this.error = '';

      // Fetch component manifest
      const manifestResponse = await fetch('/generated/components.json');
      if (!manifestResponse.ok) {
        throw new Error('Could not load components manifest');
      }

      const manifest = await manifestResponse.json();
      const componentsToLoad = manifest.components || [];

      const loadedComponents = [];

      // Load each component's metadata to get utterance
      for (const componentName of componentsToLoad) {
        try {
          const response = await fetch(`/generated/c/${componentName}/metadata.json`);
          if (response.ok) {
            const metadata = await response.json();

            loadedComponents.push({
              componentName: metadata.componentName,
              displayName: this.stripUuidFromName(metadata.componentName),
              utterance: metadata.utterance || 'No utterance available',
              utteranceId: metadata.utteranceId || null,
              tier: metadata.tier || 'N/A',
              complexity: metadata.complexity || 'N/A',
              variant: metadata.variant || null,
              timestamp: metadata.timestamp,
              csvId: metadata.csvId || null,
            });
          }
        } catch (err) {
          console.warn(`Could not load ${componentName}:`, err.message);
        }
      }

      // Sort by timestamp (newest first)
      this.components = loadedComponents.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

    } catch (error) {
      console.error('Error loading utterances:', error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  stripUuidFromName(componentName) {
    if (!componentName) return '';
    const uuidPattern = /[a-f0-9]{8}$/i;
    if (uuidPattern.test(componentName)) {
      return componentName.slice(0, -8);
    }
    return componentName;
  }

  handleSearch(event) {
    this.searchTerm = event.target.value;
  }

  handleViewComponent(event) {
    const componentName = event.target.dataset.component;
    window.location.href = `/?component=${componentName}`;
  }

  handleCopyUtterance(event) {
    const utterance = event.target.dataset.utterance;
    if (utterance) {
      navigator.clipboard.writeText(utterance)
        .then(() => {
          console.log('Copied utterance to clipboard');
          // Could show a toast notification here
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  }

  get hasComponents() {
    return this.components.length > 0;
  }

  get filteredComponents() {
    if (!this.searchTerm) {
      return this.components;
    }
    const searchLower = this.searchTerm.toLowerCase();
    return this.components.filter(comp =>
      comp.displayName.toLowerCase().includes(searchLower) ||
      comp.utterance.toLowerCase().includes(searchLower) ||
      (comp.utteranceId && comp.utteranceId.toLowerCase().includes(searchLower))
    );
  }

  get componentCount() {
    return this.filteredComponents.length;
  }

  get formattedComponents() {
    return this.filteredComponents.map(comp => {
      const utteranceIdShort = comp.utteranceId ? comp.utteranceId.substring(0, 8) : null;
      return {
        ...comp,
        utteranceIdShort,
        hasUtteranceId: !!comp.utteranceId,
        hasVariant: !!comp.variant,
      };
    });
  }
}
