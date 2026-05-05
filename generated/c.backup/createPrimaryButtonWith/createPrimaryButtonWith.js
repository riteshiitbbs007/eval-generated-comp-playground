import { LightningElement, api } from 'lwc';

/**
 * @description A primary button component with a save icon that follows SLDS 2 guidelines
 * @class CreatePrimaryButtonWith
 * @extends LightningElement
 */
export default class CreatePrimaryButtonWith extends LightningElement {
  /**
   * @description The label for the button
   * @type {string}
   * @default 'Save'
   */
  @api label = 'Save';

  /**
   * @description Whether the button is disabled
   * @type {boolean}
   * @default false
   */
  @api disabled = false;

  /**
   * @description The variant of the button
   * @type {string}
   * @default 'brand'
   */
  @api variant = 'brand';

  /**
   * @description The aria-label for the button for accessibility
   * @type {string}
   * @return {string} The aria-label that includes the button label
   */
  get ariaLabel() {
    return this.label || 'Save';
  }

  /**
   * @description Computes the button variant to ensure it defaults to brand if not specified
   * @type {string}
   * @return {string} The button variant (brand, neutral, etc.)
   */
  get variantComputed() {
    return this.variant || 'brand';
  }

  /**
   * @description Computes the button label to ensure it defaults to Save if not specified
   * @type {string}
   * @return {string} The button label
   */
  get labelComputed() {
    return this.label || 'Save';
  }

  /**
   * @description Event handler for button click
   * @fires CustomEvent#click
   */
  handleClick(event) {
    this.dispatchEvent(
      new CustomEvent('click', {
        bubbles: true,
        composed: true,
        detail: {
          originalEvent: event,
        },
      }),
    );
  }
}
