import { LightningElement, api } from 'lwc';

export default class ReviewNotes extends LightningElement {
  @api componentName;

  notes = [];
  noteText = '';
  authorName = '';
  loading = false;
  error = null;
  saving = false;
  openSections = ['today']; // Default: today section open

  async connectedCallback() {
    await this.loadNotes();
  }

  async loadNotes() {
    if (!this.componentName) {
      this.error = 'Component name is required';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(`/api/notes/${encodeURIComponent(this.componentName)}`);

      if (!response.ok) {
        throw new Error(`Failed to load notes: ${response.statusText}`);
      }

      const data = await response.json();
      this.notes = data.notes.map(note => ({
        ...note,
        formattedDate: this.formatDate(note.created_at)
      }));
    } catch (err) {
      console.error('Error loading notes:', err);
      this.error = err.message || 'Failed to load notes';
    } finally {
      this.loading = false;
    }
  }

  async handleSaveNote() {
    if (!this.noteText.trim()) {
      return;
    }

    this.saving = true;
    this.error = null;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          componentName: this.componentName,
          noteText: this.noteText.trim(),
          authorName: this.authorName.trim() || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save note');
      }

      // Clear form
      this.noteText = '';
      this.authorName = '';

      // Reload notes
      await this.loadNotes();
    } catch (err) {
      console.error('Error saving note:', err);
      this.error = err.message || 'Failed to save note';
    } finally {
      this.saving = false;
    }
  }

  async handleDeleteNote(event) {
    const noteId = event.currentTarget.dataset.noteId;

    if (!noteId) {
      return;
    }

    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    this.error = null;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }

      // Reload notes
      await this.loadNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      this.error = err.message || 'Failed to delete note';
    }
  }

  handleNoteTextChange(event) {
    this.noteText = event.target.value;
  }

  handleAuthorNameChange(event) {
    this.authorName = event.target.value;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  getDateGroup(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffMs = today - noteDate;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return { id: 'today', label: 'Today', order: 1 };
    } else if (diffDays === 1) {
      return { id: 'yesterday', label: 'Yesterday', order: 2 };
    } else if (diffDays < 7) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      return { id: `day-${diffDays}`, label: dayName, order: 3 + diffDays };
    } else {
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      return { id: monthKey, label: monthYear, order: 100 + (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth()) };
    }
  }

  handleToggleSection(event) {
    const sectionId = event.currentTarget.dataset.sectionId;
    if (this.openSections.includes(sectionId)) {
      this.openSections = this.openSections.filter(id => id !== sectionId);
    } else {
      this.openSections = [...this.openSections, sectionId];
    }
  }

  get groupedNotes() {
    if (!this.notes || this.notes.length === 0) {
      return [];
    }

    // Group notes by date
    const groups = {};
    this.notes.forEach(note => {
      const dateGroup = this.getDateGroup(note.created_at);
      if (!groups[dateGroup.id]) {
        groups[dateGroup.id] = {
          id: dateGroup.id,
          label: dateGroup.label,
          order: dateGroup.order,
          notes: [],
          count: 0
        };
      }
      groups[dateGroup.id].notes.push(note);
      groups[dateGroup.id].count++;
    });

    // Convert to array and sort by order
    const groupArray = Object.values(groups).sort((a, b) => a.order - b.order);

    // Add isOpen property
    return groupArray.map(group => ({
      ...group,
      isOpen: this.openSections.includes(group.id),
      countLabel: group.count === 1 ? '1 note' : `${group.count} notes`
    }));
  }

  get hasNotes() {
    return !this.loading && this.notes.length > 0;
  }

  get showEmptyState() {
    return !this.loading && this.notes.length === 0 && !this.error;
  }

  get notesCount() {
    return this.notes.length;
  }

  get notesLabel() {
    return this.notes.length === 1 ? 'note' : 'notes';
  }

  get isSaveDisabled() {
    return !this.noteText.trim() || this.saving;
  }
}
