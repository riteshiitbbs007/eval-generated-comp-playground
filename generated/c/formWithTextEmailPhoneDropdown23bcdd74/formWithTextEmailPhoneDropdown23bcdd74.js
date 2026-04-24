import { LightningElement, track } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Commented out - not available in local dev

export default class FormWithTextEmailPhoneDropdown extends LightningElement {
  @track formData = {
    name: '',
    email: '',
    phone: '',
    country: '',
    interests: [],
    comments: ''
  };

  @track showSuccessMessage = false;

  countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
    { label: 'Japan', value: 'JP' },
    { label: 'India', value: 'IN' },
    { label: 'Brazil', value: 'BR' },
    { label: 'Mexico', value: 'MX' }
  ];

  interestOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Sales', value: 'sales' },
    { label: 'Customer Service', value: 'service' }
  ];

  handleInputChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.formData = { ...this.formData, [field]: value };
  }

  handleCheckboxChange(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
      this.formData.interests = [...this.formData.interests, value];
    } else {
      this.formData.interests = this.formData.interests.filter(interest => interest !== value);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const allValid = [...this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea')]
      .reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      }, true);

    if (allValid) {
      this.showSuccessMessage = true;

      // Show toast notification (commented out - not available in local dev)
      // this.dispatchEvent(
      //   new ShowToastEvent({
      //     title: 'Success',
      //     message: 'Form submitted successfully!',
      //     variant: 'success'
      //   })
      // );

      console.log('Form Data Submitted:', JSON.stringify(this.formData, null, 2));

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } else {
      // Show error toast (commented out - not available in local dev)
      // this.dispatchEvent(
      //   new ShowToastEvent({
      //     title: 'Error',
      //     message: 'Please complete all required fields correctly.',
      //     variant: 'error'
      //   })
      // );
    }
  }

  handleCancel() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      country: '',
      interests: [],
      comments: ''
    };

    this.template.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });

    this.showSuccessMessage = false;

    // Show reset toast (commented out - not available in local dev)
    // this.dispatchEvent(
    //   new ShowToastEvent({
    //     title: 'Cancelled',
    //     message: 'Form has been reset.',
    //     variant: 'info'
    //   })
    // );
  }
}