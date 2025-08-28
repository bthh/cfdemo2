import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { BeneficiaryStorageService, StoredBeneficiary } from '../../services/beneficiary-storage.service';

@Component({
  selector: 'app-beneficiary-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule
  ],
  template: `
    <div class="beneficiary-dropdown-container">
      <!-- Beneficiary Selection AutoComplete -->
      <div class="field">
        <label class="field-label small-label">Select Existing Beneficiary</label>
        <p-autoComplete
          [(ngModel)]="selectedBeneficiary"
          [suggestions]="filteredBeneficiaries"
          (completeMethod)="filterBeneficiaries($event)"
          (onSelect)="onBeneficiarySelect($event)"
          (onDropdownClick)="onDropdownClick()"
          field="label"
          [placeholder]="'Type to search existing beneficiaries'"
          [dropdown]="true"
          [forceSelection]="false"
          [disabled]="disabled"
          styleClass="w-full compact-autocomplete">
        </p-autoComplete>
        
        <!-- Add Selected Beneficiary Button -->
        <div class="mt-2">
          <p-button 
            label="+ Add Selected Beneficiary" 
            icon="fa-solid fa-plus"
            size="small"
            severity="success"
            [disabled]="!selectedBeneficiary || disabled"
            (onClick)="addSelectedBeneficiary()"
            styleClass="p-button-sm">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .beneficiary-dropdown-container {
      margin-bottom: 1rem;
    }
    
    .field-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-color);
    }
    
    .small-label {
      font-size: 0.875rem;
    }
    
    ::ng-deep .compact-autocomplete .p-autocomplete {
      width: 100%;
    }
    
    ::ng-deep .compact-autocomplete .p-inputtext {
      padding: 0.5rem 2.5rem 0.5rem 0.75rem;
      font-size: 0.875rem;
    }
  `]
})
export class BeneficiaryDropdownComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() formData: any = {};
  @Output() beneficiarySelected = new EventEmitter<StoredBeneficiary>();

  beneficiaryOptions: Array<{label: string, value: StoredBeneficiary | string}> = [];
  filteredBeneficiaries: Array<{label: string, value: StoredBeneficiary | string}> = [];
  selectedBeneficiary: any = null;

  constructor(private beneficiaryStorageService: BeneficiaryStorageService) {}

  ngOnInit() {
    this.loadBeneficiaryOptions();
    this.addDemoDataIfNeeded();
  }

  private addDemoDataIfNeeded() {
    // Add demo beneficiaries if none exist
    const existingBeneficiaries = this.beneficiaryStorageService.getStoredBeneficiaries();
    if (existingBeneficiaries.length === 0) {
      console.log('No existing beneficiaries found, adding demo data...');
      this.beneficiaryStorageService.saveBeneficiary({
        label: 'Michael Smith - Spouse (50%)',
        name: 'Michael Smith',
        relationship: 'Spouse',
        percentage: 50,
        dateOfBirth: '1980-05-15',
        ssn: '123-45-6789',
        address: '123 Main St, Anytown, CA 90210'
      });

      this.beneficiaryStorageService.saveBeneficiary({
        label: 'Emma Smith - Child (25%)',
        name: 'Emma Smith',
        relationship: 'Child',
        percentage: 25,
        dateOfBirth: '2005-03-22',
        ssn: '987-65-4321',
        address: '123 Main St, Anytown, CA 90210'
      });

      this.beneficiaryStorageService.saveBeneficiary({
        label: 'Robert Johnson - Parent (25%)',
        name: 'Robert Johnson',
        relationship: 'Parent',
        percentage: 25,
        dateOfBirth: '1955-11-08',
        ssn: '456-78-9012',
        address: '789 Pine St, Somewhere, TX 75001'
      });
      
      // Reload options after adding demo data
      this.loadBeneficiaryOptions();
    }
  }

  private loadBeneficiaryOptions() {
    console.log('Loading beneficiary options with formData:', this.formData);
    this.beneficiaryOptions = this.beneficiaryStorageService.getBeneficiaryDropdownOptions(this.formData);
    this.filteredBeneficiaries = [...this.beneficiaryOptions];
    console.log('Loaded beneficiary options:', this.beneficiaryOptions);
  }

  filterBeneficiaries(event: any) {
    const query = event.query.toLowerCase();
    console.log('Filtering beneficiaries with query:', query, 'from options:', this.beneficiaryOptions);
    this.filteredBeneficiaries = this.beneficiaryOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
    console.log('Filtered beneficiaries:', this.filteredBeneficiaries);
  }

  refreshOptions() {
    this.loadBeneficiaryOptions();
  }

  onDropdownClick() {
    console.log('Dropdown clicked, showing all options');
    this.filteredBeneficiaries = [...this.beneficiaryOptions];
  }

  onBeneficiarySelect(selectedItem: any) {
    console.log('Beneficiary selected from autocomplete:', selectedItem);
    this.selectedBeneficiary = selectedItem;
  }

  addSelectedBeneficiary() {
    if (this.selectedBeneficiary && typeof this.selectedBeneficiary.value === 'object') {
      console.log('Adding selected beneficiary:', this.selectedBeneficiary.value);
      this.beneficiarySelected.emit(this.selectedBeneficiary.value);
      this.selectedBeneficiary = null; // Clear selection after adding
    }
  }
}