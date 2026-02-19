import { LightningElement } from 'lwc';

export default class HelloWorldApp extends LightningElement {
  selectedComponent = null;

  connectedCallback() {
    // Parse query parameter: ?component=counter
    const params = new URLSearchParams(window.location.search);
    const componentName = params.get('component');

    if (componentName) {
      this.selectedComponent = componentName;
    }
  }

  get showGallery() {
    return !this.selectedComponent;
  }

  get showCounter() {
    return this.selectedComponent === 'counter';
  }
}
