import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AddressStorageService, StoredAddress } from '../../services/address-storage.service';

@Component({
  selector: 'app-address-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './address-dropdown.component.html',
  styleUrls: ['./address-dropdown.component.scss']
})
export class AddressDropdownComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() addressPrefix!: string; // 'home', 'mailing', 'work', etc.
  @Input() label: string = 'Address';
  @Input() disabled: boolean = false;
  @Input() formData: any = {};
  @Output() addressSelected = new EventEmitter<StoredAddress | null>();

  addressOptions: Array<{label: string, value: StoredAddress | string}> = [];
  filteredAddresses: Array<{label: string, value: StoredAddress | string}> = [];
  selectedOption: StoredAddress | string | null = null;
  selectedAddress: any = null; // For AutoComplete
  showManualEntry: boolean = false;
  states: Array<{label: string, value: string}> = [];
  countries: Array<{label: string, value: string}> = [];
  filteredStates: Array<{label: string, value: string}> = [];
  filteredCountries: Array<{label: string, value: string}> = [];

  constructor(private addressStorageService: AddressStorageService) {
    this.initializeDropdownOptions();
  }

  ngOnInit() {
    console.log('AddressDropdown ngOnInit - addressPrefix:', this.addressPrefix, 'formData:', this.formData);
    this.initializeDropdownOptions();
    this.addTestAddresses(); // Add some test addresses for debugging
    this.loadAddressOptions();
    this.checkCurrentFormValues();
    // Initialize filtered arrays
    this.filteredStates = [...this.states];
    this.filteredCountries = [...this.countries];
    console.log('AddressDropdown initialized - selectedAddress:', this.selectedAddress, 'addressOptions:', this.addressOptions);
  }

  private addTestAddresses() {
    // Clear any corrupted data and add fresh test addresses
    console.log('Adding test addresses for', this.addressPrefix);
    
    // Clear existing addresses to prevent object corruption
    this.addressStorageService.clearAllAddresses();
    
    // Add fresh test addresses with proper labels
    this.addressStorageService.saveAddress({
      label: 'Home - 123 Main St',
      address: '123 Main Street',
      address2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'US'
    });
    
    this.addressStorageService.saveAddress({
      label: 'Work - 456 Business Ave',
      address: '456 Business Ave',
      address2: 'Suite 200',
      city: 'Business City',
      state: 'NY', 
      zipCode: '67890',
      country: 'US'
    });

    this.addressStorageService.saveAddress({
      label: 'Parent - 789 Family Lane',
      address: '789 Family Lane',
      address2: '',
      city: 'Family Town',
      state: 'TX', 
      zipCode: '54321',
      country: 'US'
    });
    
    console.log('Test addresses added');
  }

  ngOnDestroy() {
    // Save current address if form has values and no option is selected
    if (this.selectedOption === 'enter_new') {
      this.saveCurrentAddressIfNeeded();
    }
  }

  private initializeDropdownOptions() {
    this.states = [
      { label: 'Alabama', value: 'AL' },
      { label: 'Alaska', value: 'AK' },
      { label: 'Arizona', value: 'AZ' },
      { label: 'Arkansas', value: 'AR' },
      { label: 'California', value: 'CA' },
      { label: 'Colorado', value: 'CO' },
      { label: 'Connecticut', value: 'CT' },
      { label: 'Delaware', value: 'DE' },
      { label: 'Florida', value: 'FL' },
      { label: 'Georgia', value: 'GA' },
      { label: 'Hawaii', value: 'HI' },
      { label: 'Idaho', value: 'ID' },
      { label: 'Illinois', value: 'IL' },
      { label: 'Indiana', value: 'IN' },
      { label: 'Iowa', value: 'IA' },
      { label: 'Kansas', value: 'KS' },
      { label: 'Kentucky', value: 'KY' },
      { label: 'Louisiana', value: 'LA' },
      { label: 'Maine', value: 'ME' },
      { label: 'Maryland', value: 'MD' },
      { label: 'Massachusetts', value: 'MA' },
      { label: 'Michigan', value: 'MI' },
      { label: 'Minnesota', value: 'MN' },
      { label: 'Mississippi', value: 'MS' },
      { label: 'Missouri', value: 'MO' },
      { label: 'Montana', value: 'MT' },
      { label: 'Nebraska', value: 'NE' },
      { label: 'Nevada', value: 'NV' },
      { label: 'New Hampshire', value: 'NH' },
      { label: 'New Jersey', value: 'NJ' },
      { label: 'New Mexico', value: 'NM' },
      { label: 'New York', value: 'NY' },
      { label: 'North Carolina', value: 'NC' },
      { label: 'North Dakota', value: 'ND' },
      { label: 'Ohio', value: 'OH' },
      { label: 'Oklahoma', value: 'OK' },
      { label: 'Oregon', value: 'OR' },
      { label: 'Pennsylvania', value: 'PA' },
      { label: 'Rhode Island', value: 'RI' },
      { label: 'South Carolina', value: 'SC' },
      { label: 'South Dakota', value: 'SD' },
      { label: 'Tennessee', value: 'TN' },
      { label: 'Texas', value: 'TX' },
      { label: 'Utah', value: 'UT' },
      { label: 'Vermont', value: 'VT' },
      { label: 'Virginia', value: 'VA' },
      { label: 'Washington', value: 'WA' },
      { label: 'West Virginia', value: 'WV' },
      { label: 'Wisconsin', value: 'WI' },
      { label: 'Wyoming', value: 'WY' }
    ];

    this.countries = [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'United Kingdom', value: 'GB' },
      { label: 'Australia', value: 'AU' },
      { label: 'Germany', value: 'DE' },
      { label: 'France', value: 'FR' },
      { label: 'Japan', value: 'JP' },
      { label: 'Other', value: 'OTHER' }
    ];
  }

  private loadAddressOptions() {
    console.log('Loading address options with formData:', this.formData);
    this.addressOptions = this.addressStorageService.getAddressDropdownOptions(this.formData);
    this.filteredAddresses = [...this.addressOptions]; // Initialize filtered list
    console.log('Loaded address options:', this.addressOptions);
  }

  filterAddresses(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAddresses = this.addressOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterStates(event: any) {
    const query = event.query.toLowerCase();
    this.filteredStates = this.states.filter(state => 
      state.label.toLowerCase().includes(query)
    );
  }

  filterCountries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.countries.filter(country => 
      country.label.toLowerCase().includes(query)
    );
  }

  // Note: Removed onStateSelect and onCountrySelect handlers 
  // because optionValue property should handle value extraction automatically

  onAddressSelect(selectedItem: any) {
    console.log('Address selected from autocomplete:', selectedItem);
    
    // Handle AutoComplete selection - check both the value and label for "enter new"
    if (selectedItem && (
        selectedItem.value === 'enter_new' || 
        (selectedItem.label && selectedItem.label.toLowerCase().includes('enter new'))
    )) {
      console.log('Showing manual entry fields');
      this.showManualEntry = true;
      this.selectedAddress = selectedItem.label; // Set to label string only
      this.clearAddressFields();
      this.addressSelected.emit(null);
    } else if (selectedItem && typeof selectedItem === 'object' && selectedItem.value && typeof selectedItem.value === 'object') {
      // Handle proper option object with embedded address
      console.log('Populating with existing address from option object');
      this.showManualEntry = false;
      // CRITICAL FIX: Set selectedAddress to just the label string, not the full object
      this.selectedAddress = selectedItem.label;
      console.log('Setting selectedAddress to label:', selectedItem.label);
      this.populateAddressFields(selectedItem.value);
      this.addressSelected.emit(selectedItem.value);
    } else if (selectedItem && typeof selectedItem === 'object' && selectedItem.address) {
      // Handle case where the item itself is an address object (create proper option)
      console.log('Direct address object selected, creating display option');
      this.showManualEntry = false;
      const addressLabel = this.formatAddressLabel(selectedItem);
      // CRITICAL FIX: Set selectedAddress to just the label string
      this.selectedAddress = addressLabel;
      console.log('Setting selectedAddress to formatted label:', addressLabel);
      this.populateAddressFields(selectedItem);
      this.addressSelected.emit(selectedItem);
    } else {
      console.log('Unhandled selection type:', typeof selectedItem, selectedItem);
      this.showManualEntry = true;
      this.clearAddressFields();
    }
  }

  private formatAddressLabel(address: any): string {
    return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}`;
  }

  onAddressInputBlur() {
    // Check if the user typed something that should trigger manual entry
    if (this.selectedAddress && typeof this.selectedAddress === 'string') {
      console.log('User typed:', this.selectedAddress);
      if (this.selectedAddress.toLowerCase().includes('enter new') || 
          this.selectedAddress.toLowerCase().includes('new address')) {
        console.log('Triggering manual entry from typed input');
        this.showManualEntry = true;
        this.clearAddressFields();
        this.addressSelected.emit(null);
      }
    }
  }

  toggleManualEntry() {
    console.log('Toggling manual entry, current state:', this.showManualEntry);
    this.showManualEntry = !this.showManualEntry;
    if (this.showManualEntry) {
      this.clearAddressFields();
    }
  }

  private checkCurrentFormValues() {
    const addressField = `${this.addressPrefix}Address`;
    const cityField = `${this.addressPrefix}City`;
    const stateField = `${this.addressPrefix}State`;
    const zipField = `${this.addressPrefix}ZipCode`;
    const countryField = `${this.addressPrefix}Country`;
    
    // Check if we have existing form values
    const currentAddress = this.formGroup.get(addressField)?.value?.trim();
    const currentCity = this.formGroup.get(cityField)?.value?.trim();
    const currentState = this.formGroup.get(stateField)?.value?.trim();
    const currentZip = this.formGroup.get(zipField)?.value?.trim();
    const currentCountry = this.formGroup.get(countryField)?.value?.trim();
    
    if (currentAddress && currentCity && currentState) {
      // Try to match with existing stored addresses
      const matchingAddress = this.addressOptions.find(option => 
        typeof option.value === 'object' && 
        option.value.address === currentAddress &&
        option.value.city === currentCity &&
        option.value.state === currentState &&
        option.value.zipCode === currentZip &&
        option.value.country === currentCountry
      );
      
      if (matchingAddress) {
        // CRITICAL FIX: Set selectedAddress to just the label string
        this.selectedAddress = matchingAddress.label;
        this.showManualEntry = false;
        console.log('Matched existing address, setting to label:', matchingAddress.label);
      } else {
        // No match, show manual entry
        this.showManualEntry = true;
        // Create a temporary display label for current form values
        const tempAddress = {
          address: currentAddress,
          city: currentCity,
          state: currentState,
          zipCode: currentZip || '',
          country: currentCountry || 'US'
        };
        // CRITICAL FIX: Set selectedAddress to just the formatted label string
        this.selectedAddress = this.formatAddressLabel(tempAddress as any);
        console.log('No match found, setting display to formatted label:', this.selectedAddress);
      }
    } else {
      // No existing values, start with dropdown only
      this.showManualEntry = false;
      this.selectedAddress = null;
    }
  }

  onAddressOptionChange(option: StoredAddress | string | null) {
    this.selectedOption = option;

    if (!option) {
      this.clearAddressFields();
      this.showManualEntry = false;
      return;
    }

    if (typeof option === 'string' && option === 'enter_new') {
      this.showManualEntry = true;
      this.addressSelected.emit(null);
    } else if (typeof option === 'object' && option !== null) {
      this.showManualEntry = false;
      this.populateAddressFields(option as StoredAddress);
      this.addressSelected.emit(option as StoredAddress);
    }
  }

  private populateAddressFields(address: StoredAddress) {
    const fields = {
      [`${this.addressPrefix}Address`]: address.address,
      [`${this.addressPrefix}Address2`]: address.address2 || '',
      [`${this.addressPrefix}City`]: address.city,
      [`${this.addressPrefix}State`]: address.state,
      [`${this.addressPrefix}ZipCode`]: address.zipCode,
      [`${this.addressPrefix}Country`]: address.country
    };

    Object.entries(fields).forEach(([fieldName, value]) => {
      const control = this.formGroup.get(fieldName);
      if (control) {
        control.setValue(value);
      }
    });
  }

  private clearAddressFields() {
    const fieldNames = [
      `${this.addressPrefix}Address`,
      `${this.addressPrefix}Address2`,
      `${this.addressPrefix}City`,
      `${this.addressPrefix}State`,
      `${this.addressPrefix}ZipCode`,
      `${this.addressPrefix}Country`
    ];

    fieldNames.forEach(fieldName => {
      const control = this.formGroup.get(fieldName);
      if (control) {
        control.setValue('');
      }
    });
  }

  onSaveCurrentAddress() {
    const savedAddress = this.saveCurrentAddressIfNeeded();
    if (savedAddress) {
      console.log('Address saved successfully:', savedAddress);
      this.loadAddressOptions(); // Refresh the dropdown options
      
      // Find the saved address in the refreshed options
      const matchingOption = this.addressOptions.find(option => 
        typeof option.value === 'object' && 
        option.value.id === savedAddress.id
      );
      
      if (matchingOption) {
        // CRITICAL FIX: Set selectedAddress to just the label string
        this.selectedAddress = matchingOption.label;
        this.filteredAddresses = [...this.addressOptions]; // Refresh filtered list
        console.log('Selected saved address label in autocomplete:', this.selectedAddress);
      } else {
        // CRITICAL FIX: Set selectedAddress to just the label string
        this.selectedAddress = savedAddress.label;
        console.log('Using saved address label directly:', this.selectedAddress);
      }
      
      this.showManualEntry = false; // Hide manual entry fields
      this.addressSelected.emit(savedAddress);
    }
  }

  private saveCurrentAddressIfNeeded(): StoredAddress | null {
    const addressField = `${this.addressPrefix}Address`;
    const cityField = `${this.addressPrefix}City`;
    const stateField = `${this.addressPrefix}State`;
    const zipField = `${this.addressPrefix}ZipCode`;
    const countryField = `${this.addressPrefix}Country`;
    const address2Field = `${this.addressPrefix}Address2`;

    const address = this.formGroup.get(addressField)?.value?.trim();
    const city = this.formGroup.get(cityField)?.value?.trim();
    const rawState = this.formGroup.get(stateField)?.value;
    const zipCode = this.formGroup.get(zipField)?.value?.trim();
    const rawCountry = this.formGroup.get(countryField)?.value;

    // Handle AutoComplete values that might be objects
    const state = typeof rawState === 'object' ? rawState?.value : rawState?.trim();
    const country = typeof rawCountry === 'object' ? rawCountry?.value : rawCountry?.trim();

    console.log('Saving address with values:', {
      address, city, state, zipCode, country,
      rawState, rawCountry
    });

    if (address && city && state && zipCode && country) {
      const newAddress = {
        label: `${this.label} - ${address}, ${city}`,
        address: address,
        address2: this.formGroup.get(address2Field)?.value?.trim() || '',
        city: city,
        state: state,
        zipCode: zipCode,
        country: country
      };

      console.log('Saving address:', newAddress);
      return this.addressStorageService.saveAddress(newAddress);
    } else {
      console.log('Address validation failed - missing required fields');
      return null;
    }
  }

  isAddressValid(): boolean {
    if (!this.showManualEntry) {
      return true; // Not in manual entry mode, so validation doesn't apply
    }

    // First, let's log ALL available form controls to see what exists
    console.log('🔍 ALL FORM CONTROLS:', Object.keys(this.formGroup.controls));
    console.log('🔍 FORM GROUP VALUE:', this.formGroup.value);

    const addressControl = this.formGroup.get(this.addressFieldName);
    const cityControl = this.formGroup.get(this.cityFieldName);
    const stateControl = this.formGroup.get(this.stateFieldName);
    const zipControl = this.formGroup.get(this.zipCodeFieldName);
    const countryControl = this.formGroup.get(this.countryFieldName);

    const address = addressControl?.value?.trim?.() || addressControl?.value;
    const city = cityControl?.value?.trim?.() || cityControl?.value;
    const rawState = stateControl?.value;
    const zipCode = zipControl?.value?.trim?.() || zipControl?.value;
    const rawCountry = countryControl?.value;
    
    // Handle both string values and AutoComplete objects
    const state = typeof rawState === 'object' ? rawState?.value : rawState;
    const country = typeof rawCountry === 'object' ? rawCountry?.value : rawCountry;
    
    console.log('🔍 DETAILED VALIDATION CHECK:', {
      prefix: this.addressPrefix,
      showManualEntry: this.showManualEntry,
      disabled: this.disabled,
      formControls: {
        address: { exists: !!addressControl, value: addressControl?.value, processed: address },
        city: { exists: !!cityControl, value: cityControl?.value, processed: city },
        state: { exists: !!stateControl, value: stateControl?.value, rawState, processed: state },
        zip: { exists: !!zipControl, value: zipControl?.value, processed: zipCode },
        country: { exists: !!countryControl, value: countryControl?.value, rawCountry, processed: country }
      },
      fieldNames: {
        address: this.addressFieldName,
        city: this.cityFieldName,
        state: this.stateFieldName,
        zip: this.zipCodeFieldName,
        country: this.countryFieldName
      }
    });
    
    const isValid = !!(address && city && state && zipCode && country);
    console.log('✅ VALIDATION RESULT:', {
      isValid,
      buttonDisabled: this.disabled || !isValid,
      checks: {
        hasAddress: !!address,
        hasCity: !!city, 
        hasState: !!state,
        hasZip: !!zipCode,
        hasCountry: !!country
      }
    });
    
    return isValid;
  }

  // Getter for debugging in template
  get debugValidation() {
    const result = this.isAddressValid();
    return {
      isValid: result,
      disabled: this.disabled,
      buttonShouldBeEnabled: !this.disabled && result
    };
  }

  // Method to manually test validation (for debugging)
  testValidation() {
    console.log('🧪 MANUAL VALIDATION TEST:');
    console.log('showManualEntry:', this.showManualEntry);
    console.log('disabled:', this.disabled);
    
    const fields = {
      address: this.formGroup.get(this.addressFieldName)?.value,
      city: this.formGroup.get(this.cityFieldName)?.value,
      state: this.formGroup.get(this.stateFieldName)?.value,
      zip: this.formGroup.get(this.zipCodeFieldName)?.value,
      country: this.formGroup.get(this.countryFieldName)?.value
    };
    
    console.log('Raw field values:', fields);
    
    // Test the actual validation logic
    const result = this.isAddressValid();
    console.log('Validation result:', result);
    
    return result;
  }

  get addressFieldName() { return `${this.addressPrefix}Address`; }
  get address2FieldName() { return `${this.addressPrefix}Address2`; }
  get cityFieldName() { return `${this.addressPrefix}City`; }
  get stateFieldName() { return `${this.addressPrefix}State`; }
  get zipCodeFieldName() { return `${this.addressPrefix}ZipCode`; }
  get countryFieldName() { return `${this.addressPrefix}Country`; }

  // Make Object.keys available in template
  Object = Object;
}