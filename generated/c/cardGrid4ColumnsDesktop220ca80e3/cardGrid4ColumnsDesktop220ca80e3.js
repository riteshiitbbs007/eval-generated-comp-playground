import { LightningElement } from 'lwc';

/**
 * CardGrid4ColumnsDesktop2
 * 
 * A responsive card grid component that displays cards in a grid layout:
 * - 4 columns on desktop (large screens)
 * - 2 columns on tablet (medium screens)
 * - 1 column on mobile (small screens)
 * 
 * Uses SLDS grid system and Lightning Base Components for SLDS 2 compliance.
 * Implements proper accessibility with ARIA attributes and keyboard navigation.
 */
export default class CardGrid4ColumnsDesktop2 extends LightningElement {
  /**
   * Sample card data for demonstration
   * In a real implementation, this would come from Apex or other data source
   */
  cards = [
    {
      id: '1',
      title: 'Card 1',
      description: 'This is the first card in the responsive grid layout.',
      iconName: 'standard:account',
      metadata: 'Updated 2 hours ago'
    },
    {
      id: '2',
      title: 'Card 2',
      description: 'This is the second card demonstrating responsive behavior.',
      iconName: 'standard:contact',
      metadata: 'Updated 5 hours ago'
    },
    {
      id: '3',
      title: 'Card 3',
      description: 'This is the third card showing grid flexibility.',
      iconName: 'standard:opportunity',
      metadata: 'Updated 1 day ago'
    },
    {
      id: '4',
      title: 'Card 4',
      description: 'This is the fourth card in the first row on desktop.',
      iconName: 'standard:case',
      metadata: 'Updated 2 days ago'
    },
    {
      id: '5',
      title: 'Card 5',
      description: 'This is the fifth card demonstrating multi-row layout.',
      iconName: 'standard:lead',
      metadata: 'Updated 3 days ago'
    },
    {
      id: '6',
      title: 'Card 6',
      description: 'This is the sixth card showing grid wrapping behavior.',
      iconName: 'standard:task',
      metadata: 'Updated 4 days ago'
    },
    {
      id: '7',
      title: 'Card 7',
      description: 'This is the seventh card in the responsive grid.',
      iconName: 'standard:event',
      metadata: 'Updated 5 days ago'
    },
    {
      id: '8',
      title: 'Card 8',
      description: 'This is the eighth card completing the second row on desktop.',
      iconName: 'standard:campaign',
      metadata: 'Updated 1 week ago'
    }
  ];

  /**
   * Computed property to check if there are no cards to display
   * Used to show empty state message
   */
  get isEmptyState() {
    return !this.cards || this.cards.length === 0;
  }

  /**
   * Handle view details button click
   * Dispatches a custom event with the card ID
   * 
   * @param {Event} event - Click event from the button
   */
  handleViewDetails(event) {
    const cardId = event.currentTarget.dataset.id;
    
    // Dispatch custom event for parent components to handle
    this.dispatchEvent(
      new CustomEvent('cardselected', {
        detail: { cardId },
        bubbles: true,
        composed: true
      })
    );

    // TODO: Add additional navigation or action logic as needed
    // For example: Navigate to record page, open modal, etc.
  }
}