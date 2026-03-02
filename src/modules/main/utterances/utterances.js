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

      // Fetch CSV file
      const response = await fetch('/public/assets/utterances.csv');
      if (!response.ok) {
        throw new Error('Could not load utterances CSV file');
      }

      const csvText = await response.text();
      const parsedData = this.parseCSV(csvText);

      // Transform CSV rows into component objects
      const loadedComponents = parsedData.map((row, index) => ({
        componentName: `utterance-${row.ID || index}`,
        displayName: `${row.ID || ''} - ${row.Variant || 'Standard'}`,
        utterance: row.Utterance || 'No utterance available',
        utteranceId: null,
        tier: row.Tier || 'N/A',
        complexity: row.Complexity || 'N/A',
        variant: row.Variant || null,
        timestamp: new Date().toISOString(),
        csvId: row.ID || null,
      }));

      this.components = loadedComponents;

    } catch (error) {
      console.error('Error loading utterances:', error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = this.parseCSVLine(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length > 0) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    return rows;
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());
    return result;
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
    // CSV utterances don't have corresponding components, navigate to gallery
    window.location.href = '/';
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
