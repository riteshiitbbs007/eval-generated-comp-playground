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

  get show4AlertsSuccessGreenErrorRedFcf679ff() {
    return this.selectedComponent === '4AlertsSuccessGreenErrorRedFcf679ff';
  }

  get showContactFormNameTextEmailFormat0878e030() {
    return this.selectedComponent === 'contactFormNameTextEmailFormat0878e030';
  }

  get showCreate3stepWizardWith() {
    return this.selectedComponent === 'create3stepWizardWith';
  }

  get showCreateAlertsSuccessError() {
    return this.selectedComponent === 'createAlertsSuccessError';
  }

  get showCreateContactCardWith() {
    return this.selectedComponent === 'createContactCardWith';
  }

  get showCreateDeleteConfirmationModal() {
    return this.selectedComponent === 'createDeleteConfirmationModal';
  }

  get showCreateFaqAccordionWith() {
    return this.selectedComponent === 'createFaqAccordionWith';
  }

  get showCreateFormNameEmail() {
    return this.selectedComponent === 'createFormNameEmail';
  }

  get showCreateFormWithText() {
    return this.selectedComponent === 'createFormWithText';
  }

  get showCreatePageHeaderWith() {
    return this.selectedComponent === 'createPageHeaderWith';
  }

  get showCreatePrimaryActionButton() {
    return this.selectedComponent === 'createPrimaryActionButton';
  }

  get showCreatePrimaryButtonWith() {
    return this.selectedComponent === 'createPrimaryButtonWith';
  }

  get showCreateSortableTableProduct() {
    return this.selectedComponent === 'createSortableTableProduct';
  }

  get showCreateTabsOverviewDetails() {
    return this.selectedComponent === 'createTabsOverviewDetails';
  }

  get showCreateVerticalNavMenu() {
    return this.selectedComponent === 'createVerticalNavMenu';
  }

  get showFaqAccordionWith3SectionsEach2efd09a1() {
    return this.selectedComponent === 'faqAccordionWith3SectionsEach2efd09a1';
  }

  get showPageHeaderJohnSmithWithAccount3b74227d() {
    return this.selectedComponent === 'pageHeaderJohnSmithWithAccount3b74227d';
  }

  get showPrimaryActionButtonWithASave4addabb5() {
    return this.selectedComponent === 'primaryActionButtonWithASave4addabb5';
  }

  get showPrimaryButtonWithASaveIcon2a4b46ee() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon2a4b46ee';
  }

  get showPrimaryButtonWithASaveIcon3f0774ab() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon3f0774ab';
  }

  get showPrimaryButtonWithASaveIcon55f94f20() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon55f94f20';
  }

  get showResponsiveProductCardGridWith611d4397d() {
    return this.selectedComponent === 'responsiveProductCardGridWith611d4397d';
  }

  get showUserProfileFormNameTextEmailC8b10de5() {
    return this.selectedComponent === 'userProfileFormNameTextEmailC8b10de5';
  }
}
