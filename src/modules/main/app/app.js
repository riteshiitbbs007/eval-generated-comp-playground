import { LightningElement } from 'lwc';

export default class HelloWorldApp extends LightningElement {
  selectedComponent = null;
  detailComponent = null;
  viewName = null;

  connectedCallback() {
    // Parse query parameters: ?component=componentName or ?detail=componentName or ?view=viewName
    const params = new URLSearchParams(window.location.search);
    const componentName = params.get('component');
    const detailName = params.get('detail');
    const view = params.get('view');

    if (componentName) {
      this.selectedComponent = componentName;
    } else if (detailName) {
      this.detailComponent = detailName;
    } else if (view) {
      this.viewName = view;
    }
  }

  handleComponentSelect(event) {
    const componentName = event.detail.componentName;
    // Navigate to detail view
    window.location.href = `/?detail=${componentName}`;
  }

  get showGallery() {
    // Gallery is deprecated - dashboard is now the default
    return false;
  }

  get showDetail() {
    return this.detailComponent !== null;
  }

  get showUtterances() {
    return this.viewName === 'utterances';
  }

  get showDashboard() {
    // Dashboard is the default view - show when no specific route is selected
    return !this.selectedComponent && !this.detailComponent && this.viewName !== 'utterances';
  }

  get show4AlertsSuccessErrorWarningInfo49684baf() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfo49684baf';
  }

  get show4AlertsSuccessErrorWarningInfoDf286ed0() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfoDf286ed0';
  }

  get show4AlertsSuccessGreenErrorRedFcf679ff() {
    return this.selectedComponent === '4AlertsSuccessGreenErrorRedFcf679ff';
  }

  get showContactCardWithAvatarNameTitle569326e5() {
    return this.selectedComponent === 'contactCardWithAvatarNameTitle569326e5';
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

  get showFaqAccordionWith3SectionsFirst3f2bda67() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirst3f2bda67';
  }

  get showFaqAccordionWith3SectionsFirst827fabec() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirst827fabec';
  }

  get showFaqAccordionWith3SectionsFirst9b5a8af1() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirst9b5a8af1';
  }

  get showFaqAccordionWith3SectionsFirstBe7ac560() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirstBe7ac560';
  }

  get showFormNameEmailMessageShowErrors22a50f96() {
    return this.selectedComponent === 'formNameEmailMessageShowErrors22a50f96';
  }

  get showFormNameEmailMessageShowErrorsE34f2b6d() {
    return this.selectedComponent === 'formNameEmailMessageShowErrorsE34f2b6d';
  }

  get showFormWithTextEmailPhoneDropdownE48117d4() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownE48117d4';
  }

  get showPageHeaderJohnSmithWithAccount3b74227d() {
    return this.selectedComponent === 'pageHeaderJohnSmithWithAccount3b74227d';
  }

  get showPageHeaderWithTitleAndAction35185f19() {
    return this.selectedComponent === 'pageHeaderWithTitleAndAction35185f19';
  }

  get showPageHeaderWithTitleAndActionFb7c8482() {
    return this.selectedComponent === 'pageHeaderWithTitleAndActionFb7c8482';
  }

  get showPrimaryActionButtonWithASave4addabb5() {
    return this.selectedComponent === 'primaryActionButtonWithASave4addabb5';
  }

  get showPrimaryButtonWithASaveIcon2a4b46ee() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon2a4b46ee';
  }

  get showPrimaryButtonWithASaveIcon38dac3a6() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon38dac3a6';
  }

  get showPrimaryButtonWithASaveIcon3f0774ab() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon3f0774ab';
  }

  get showPrimaryButtonWithASaveIcon55f94f20() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon55f94f20';
  }

  get showPrimaryButtonWithASaveIconC0e76cf4() {
    return this.selectedComponent === 'primaryButtonWithASaveIconC0e76cf4';
  }

  get showResponsiveProductCardGridWith611d4397d() {
    return this.selectedComponent === 'responsiveProductCardGridWith611d4397d';
  }

  get showSortableTableProductNamePriceCategory5f50fe64() {
    return this.selectedComponent === 'sortableTableProductNamePriceCategory5f50fe64';
  }

  get showUserProfileFormNameTextEmailC8b10de5() {
    return this.selectedComponent === 'userProfileFormNameTextEmailC8b10de5';
  }
}
