import { LightningElement } from 'lwc';

export default class HelloWorldApp extends LightningElement {
  selectedComponent = null;
  detailComponent = null;

  connectedCallback() {
    // Parse query parameters: ?component=componentName or ?detail=componentName
    const params = new URLSearchParams(window.location.search);
    const componentName = params.get('component');
    const detailName = params.get('detail');

    if (componentName) {
      this.selectedComponent = componentName;
    } else if (detailName) {
      this.detailComponent = detailName;
    }
  }

  handleComponentSelect(event) {
    const componentName = event.detail.componentName;
    // Navigate to detail view
    window.location.href = `/?detail=${componentName}`;
  }

  get showGallery() {
    return !this.selectedComponent && !this.detailComponent;
  }

  get showDetail() {
    return this.detailComponent !== null;
  }

  get showCounter() {
    return this.selectedComponent === 'counter';
  }

  get showPrimaryActionButton() {
    return this.selectedComponent === 'primaryActionButtonWithSaveIcon';
  }

  get showPrimaryButtonWithASaveIcon() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon';
  }

  get showPrimaryActionButtonWithASave() {
    return this.selectedComponent === 'primaryActionButtonWithASave';
  }

  get showSortableTableProductNamePriceCategory() {
    return this.selectedComponent === 'sortableTableProductNamePriceCategory';
  }

  get showCardGrid4ColumnsDesktop2() {
    return this.selectedComponent === 'cardGrid4ColumnsDesktop2';
  }

  get showCreatePrimaryButtonWith() {
    return this.selectedComponent === 'createPrimaryButtonWith';
  }

  get showCreateFormNameEmail() {
    return this.selectedComponent === 'createFormNameEmail';
  }

  get showCreateSortableTableProduct() {
    return this.selectedComponent === 'createSortableTableProduct';
  }

  get showCreateDeleteConfirmationModal() {
    return this.selectedComponent === 'createDeleteConfirmationModal';
  }

  get showCreatePageHeaderWith() {
    return this.selectedComponent === 'createPageHeaderWith';
  }

  get showCreateAlertsSuccessError() {
    return this.selectedComponent === 'createAlertsSuccessError';
  }

  get showCreateFaqAccordionWith() {
    return this.selectedComponent === 'createFaqAccordionWith';
  }

  get showCreateFormWithText() {
    return this.selectedComponent === 'createFormWithText';
  }

  get showCreateContactCardWith() {
    return this.selectedComponent === 'createContactCardWith';
  }

  get showCreateVerticalNavMenu() {
    return this.selectedComponent === 'createVerticalNavMenu';
  }

  get showCreatePrimaryActionButton() {
    return this.selectedComponent === 'createPrimaryActionButton';
  }

  get showCreateContactFormName() {
    return this.selectedComponent === 'createContactFormName';
  }
}
