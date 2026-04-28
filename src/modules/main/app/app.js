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

  get show3stepWizardWithProgressIndicatorAnd6d616c77() {
    return this.selectedComponent === '3stepWizardWithProgressIndicatorAnd6d616c77';
  }

  get show3stepWizardWithProgressIndicatorAndDf82874b() {
    return this.selectedComponent === '3stepWizardWithProgressIndicatorAndDf82874b';
  }

  get show3stepWizardWithProgressIndicatorAndE642eb6c() {
    return this.selectedComponent === '3stepWizardWithProgressIndicatorAndE642eb6c';
  }

  get show3stepWizardWithProgressIndicatorAndEcf1468f() {
    return this.selectedComponent === '3stepWizardWithProgressIndicatorAndEcf1468f';
  }

  get show3stepWizardWithProgressIndicatorAndFdafd964() {
    return this.selectedComponent === '3stepWizardWithProgressIndicatorAndFdafd964';
  }

  get show4AlertsSuccessErrorWarningInfo17446ee8() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfo17446ee8';
  }

  get show4AlertsSuccessErrorWarningInfo25fe7452() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfo25fe7452';
  }

  get show4AlertsSuccessErrorWarningInfo49684baf() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfo49684baf';
  }

  get show4AlertsSuccessErrorWarningInfo5edbfc89() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfo5edbfc89';
  }

  get show4AlertsSuccessErrorWarningInfo669eb078() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfo669eb078';
  }

  get show4AlertsSuccessErrorWarningInfoDf286ed0() {
    return this.selectedComponent === '4AlertsSuccessErrorWarningInfoDf286ed0';
  }

  get show4AlertsSuccessGreenErrorRedFcf679ff() {
    return this.selectedComponent === '4AlertsSuccessGreenErrorRedFcf679ff';
  }

  get show4NotificationAlertsWithProperSlds078ff351() {
    return this.selectedComponent === '4NotificationAlertsWithProperSlds078ff351';
  }

  get show4NotificationAlertsWithProperSldsE39d2043() {
    return this.selectedComponent === '4NotificationAlertsWithProperSldsE39d2043';
  }

  get showCardGrid4ColumnsDesktop216c62dfd() {
    return this.selectedComponent === 'cardGrid4ColumnsDesktop216c62dfd';
  }

  get showCardGrid4ColumnsDesktop220ca80e3() {
    return this.selectedComponent === 'cardGrid4ColumnsDesktop220ca80e3';
  }

  get showCardGrid4ColumnsDesktop2A2d0be2b() {
    return this.selectedComponent === 'cardGrid4ColumnsDesktop2A2d0be2b';
  }

  get showCardGrid4ColumnsDesktop2Cb530bec() {
    return this.selectedComponent === 'cardGrid4ColumnsDesktop2Cb530bec';
  }

  get showComprehensiveContactFormWithNameField62170281() {
    return this.selectedComponent === 'comprehensiveContactFormWithNameField62170281';
  }

  get showComprehensiveContactFormWithNameFieldD7678868() {
    return this.selectedComponent === 'comprehensiveContactFormWithNameFieldD7678868';
  }

  get showConfirmationModalForDeletionUsingSlds3d1fd5f6() {
    return this.selectedComponent === 'confirmationModalForDeletionUsingSlds3d1fd5f6';
  }

  get showConfirmationModalForDeletionUsingSldsE9111a18() {
    return this.selectedComponent === 'confirmationModalForDeletionUsingSldsE9111a18';
  }

  get showContactCardWithAvatarNameTitle2622edc0() {
    return this.selectedComponent === 'contactCardWithAvatarNameTitle2622edc0';
  }

  get showContactCardWithAvatarNameTitle569326e5() {
    return this.selectedComponent === 'contactCardWithAvatarNameTitle569326e5';
  }

  get showContactCardWithAvatarNameTitleDc584ab4() {
    return this.selectedComponent === 'contactCardWithAvatarNameTitleDc584ab4';
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

  get showDeleteConfirmationModalWithCancelAnd27019baa() {
    return this.selectedComponent === 'deleteConfirmationModalWithCancelAnd27019baa';
  }

  get showDeleteConfirmationModalWithCancelAndC4abe23f() {
    return this.selectedComponent === 'deleteConfirmationModalWithCancelAndC4abe23f';
  }

  get showFaqAccordionWith3SectionsEach2efd09a1() {
    return this.selectedComponent === 'faqAccordionWith3SectionsEach2efd09a1';
  }

  get showFaqAccordionWith3SectionsFirst04be6c7c() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirst04be6c7c';
  }

  get showFaqAccordionWith3SectionsFirst0be93d5c() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirst0be93d5c';
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

  get showFaqAccordionWith3SectionsFirstC9585d16() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirstC9585d16';
  }

  get showFaqAccordionWith3SectionsFirstEbbf5b6c() {
    return this.selectedComponent === 'faqAccordionWith3SectionsFirstEbbf5b6c';
  }

  get showFormNameEmailMessageShowErrors22a50f96() {
    return this.selectedComponent === 'formNameEmailMessageShowErrors22a50f96';
  }

  get showFormNameEmailMessageShowErrorsC304cee9() {
    return this.selectedComponent === 'formNameEmailMessageShowErrorsC304cee9';
  }

  get showFormNameEmailMessageShowErrorsE31edea2() {
    return this.selectedComponent === 'formNameEmailMessageShowErrorsE31edea2';
  }

  get showFormNameEmailMessageShowErrorsE34f2b6d() {
    return this.selectedComponent === 'formNameEmailMessageShowErrorsE34f2b6d';
  }

  get showFormWithTextEmailPhoneDropdown0c7b1359() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown0c7b1359';
  }

  get showFormWithTextEmailPhoneDropdown23bcdd74() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown23bcdd74';
  }

  get showFormWithTextEmailPhoneDropdown3320faf7() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown3320faf7';
  }

  get showFormWithTextEmailPhoneDropdown3570017d() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown3570017d';
  }

  get showFormWithTextEmailPhoneDropdown51b9ac1e() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown51b9ac1e';
  }

  get showFormWithTextEmailPhoneDropdown687b32a6() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown687b32a6';
  }

  get showFormWithTextEmailPhoneDropdown6d40c4a5() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown6d40c4a5';
  }

  get showFormWithTextEmailPhoneDropdown6f93c590() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown6f93c590';
  }

  get showFormWithTextEmailPhoneDropdown73651893() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown73651893';
  }

  get showFormWithTextEmailPhoneDropdown78286eb8() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown78286eb8';
  }

  get showFormWithTextEmailPhoneDropdown7d24c98d() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown7d24c98d';
  }

  get showFormWithTextEmailPhoneDropdown8deb1ed7() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdown8deb1ed7';
  }

  get showFormWithTextEmailPhoneDropdownA57de512() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownA57de512';
  }

  get showFormWithTextEmailPhoneDropdownAcbb1168() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownAcbb1168';
  }

  get showFormWithTextEmailPhoneDropdownB627ae56() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownB627ae56';
  }

  get showFormWithTextEmailPhoneDropdownC0001f11() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownC0001f11';
  }

  get showFormWithTextEmailPhoneDropdownC7dd043e() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownC7dd043e';
  }

  get showFormWithTextEmailPhoneDropdownDbede369() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownDbede369';
  }

  get showFormWithTextEmailPhoneDropdownDecbbd5a() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownDecbbd5a';
  }

  get showFormWithTextEmailPhoneDropdownE48117d4() {
    return this.selectedComponent === 'formWithTextEmailPhoneDropdownE48117d4';
  }

  get showFullyResponsiveSortableDataTableWith04d610c6() {
    return this.selectedComponent === 'fullyResponsiveSortableDataTableWith04d610c6';
  }

  get showFullyResponsiveSortableDataTableWith19dc0622() {
    return this.selectedComponent === 'fullyResponsiveSortableDataTableWith19dc0622';
  }

  get showPageHeaderJohnSmithWithAccount3b74227d() {
    return this.selectedComponent === 'pageHeaderJohnSmithWithAccount3b74227d';
  }

  get showPageHeaderWithAccountIconAt4af92c6c() {
    return this.selectedComponent === 'pageHeaderWithAccountIconAt4af92c6c';
  }

  get showPageHeaderWithAccountIconAtE401ca11() {
    return this.selectedComponent === 'pageHeaderWithAccountIconAtE401ca11';
  }

  get showPageHeaderWithAccountIconAtEb418c9d() {
    return this.selectedComponent === 'pageHeaderWithAccountIconAtEb418c9d';
  }

  get showPageHeaderWithAccountIconAtEc3a4c6f() {
    return this.selectedComponent === 'pageHeaderWithAccountIconAtEc3a4c6f';
  }

  get showPageHeaderWithAccountIconAtFb064716() {
    return this.selectedComponent === 'pageHeaderWithAccountIconAtFb064716';
  }

  get showPageHeaderWithTitleAndAction35185f19() {
    return this.selectedComponent === 'pageHeaderWithTitleAndAction35185f19';
  }

  get showPageHeaderWithTitleAndAction68ca15bb() {
    return this.selectedComponent === 'pageHeaderWithTitleAndAction68ca15bb';
  }

  get showPageHeaderWithTitleAndAction8b50d63c() {
    return this.selectedComponent === 'pageHeaderWithTitleAndAction8b50d63c';
  }

  get showPageHeaderWithTitleAndAction8d363961() {
    return this.selectedComponent === 'pageHeaderWithTitleAndAction8d363961';
  }

  get showPageHeaderWithTitleAndActionC3b2e500() {
    return this.selectedComponent === 'pageHeaderWithTitleAndActionC3b2e500';
  }

  get showPageHeaderWithTitleAndActionFb7c8482() {
    return this.selectedComponent === 'pageHeaderWithTitleAndActionFb7c8482';
  }

  get showPrimaryActionButtonWithASave4addabb5() {
    return this.selectedComponent === 'primaryActionButtonWithASave4addabb5';
  }

  get showPrimaryActionButtonWithSaveIcon7194c020() {
    return this.selectedComponent === 'primaryActionButtonWithSaveIcon7194c020';
  }

  get showPrimaryActionButtonWithSaveIcon88c7b8d3() {
    return this.selectedComponent === 'primaryActionButtonWithSaveIcon88c7b8d3';
  }

  get showPrimaryButtonWithASaveIcon2a4b46ee() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon2a4b46ee';
  }

  get showPrimaryButtonWithASaveIcon38dac3a6() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon38dac3a6';
  }

  get showPrimaryButtonWithASaveIcon3c7169e7() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon3c7169e7';
  }

  get showPrimaryButtonWithASaveIcon3f0774ab() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon3f0774ab';
  }

  get showPrimaryButtonWithASaveIcon55f94f20() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon55f94f20';
  }

  get showPrimaryButtonWithASaveIcon60431c36() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon60431c36';
  }

  get showPrimaryButtonWithASaveIcon741469fc() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon741469fc';
  }

  get showPrimaryButtonWithASaveIcon918a2119() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon918a2119';
  }

  get showPrimaryButtonWithASaveIcon94b26f06() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon94b26f06';
  }

  get showPrimaryButtonWithASaveIcon9de0b8a7() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon9de0b8a7';
  }

  get showPrimaryButtonWithASaveIcon9de0e0b6() {
    return this.selectedComponent === 'primaryButtonWithASaveIcon9de0e0b6';
  }

  get showPrimaryButtonWithASaveIconA2de8ef3() {
    return this.selectedComponent === 'primaryButtonWithASaveIconA2de8ef3';
  }

  get showPrimaryButtonWithASaveIconB274ffeb() {
    return this.selectedComponent === 'primaryButtonWithASaveIconB274ffeb';
  }

  get showPrimaryButtonWithASaveIconC0e76cf4() {
    return this.selectedComponent === 'primaryButtonWithASaveIconC0e76cf4';
  }

  get showPrimaryButtonWithASaveIconD3210ed9() {
    return this.selectedComponent === 'primaryButtonWithASaveIconD3210ed9';
  }

  get showPrimaryButtonWithASaveIconD35144bc() {
    return this.selectedComponent === 'primaryButtonWithASaveIconD35144bc';
  }

  get showResponsiveProductCardGridUsingSlds4991e3f6() {
    return this.selectedComponent === 'responsiveProductCardGridUsingSlds4991e3f6';
  }

  get showResponsiveProductCardGridUsingSldsFdf13664() {
    return this.selectedComponent === 'responsiveProductCardGridUsingSldsFdf13664';
  }

  get showResponsiveProductCardGridWith611d4397d() {
    return this.selectedComponent === 'responsiveProductCardGridWith611d4397d';
  }

  get showSortableTableProductNamePriceCategory5f50fe64() {
    return this.selectedComponent === 'sortableTableProductNamePriceCategory5f50fe64';
  }

  get showSortableTableProductNamePriceCategoryA2ca861d() {
    return this.selectedComponent === 'sortableTableProductNamePriceCategoryA2ca861d';
  }

  get showUserProfileFormNameTextEmailC8b10de5() {
    return this.selectedComponent === 'userProfileFormNameTextEmailC8b10de5';
  }

  get showVerticalNavMenuWith5Items423ecf65() {
    return this.selectedComponent === 'verticalNavMenuWith5Items423ecf65';
  }

  get showVerticalNavMenuWith5Items47126c35() {
    return this.selectedComponent === 'verticalNavMenuWith5Items47126c35';
  }

  get showVerticalNavMenuWith5Items5d1eaf1e() {
    return this.selectedComponent === 'verticalNavMenuWith5Items5d1eaf1e';
  }

  get showVerticalNavMenuWith5Items887d3dcb() {
    return this.selectedComponent === 'verticalNavMenuWith5Items887d3dcb';
  }

  get showVerticalNavMenuWith5Items97833370() {
    return this.selectedComponent === 'verticalNavMenuWith5Items97833370';
  }
}
