import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TrusteeStorageService, StoredTrustee } from '../../services/trustee-storage.service';

@Component({
  selector: 'app-trustee-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule
  ],
  template: `
    <div class="trustee-dropdown-container">
      <!-- Trustee Selection AutoComplete -->
      <div class="field">
        <label class="field-label small-label">Select Existing Trustee</label>
        <p-autoComplete
          [(ngModel)]="selectedTrustee"
          [suggestions]="filteredTrustees"
          (completeMethod)="filterTrustees($event)"
          (onSelect)="onTrusteeSelect($event)"
          (onDropdownClick)="onDropdownClick()"
          field="label"
          [placeholder]="'Type to search existing trustees'"
          [dropdown]="true"
          [forceSelection]="false"
          [disabled]="disabled"
          styleClass="w-full compact-autocomplete">
        </p-autoComplete>
        
        <!-- Add Selected Trustee Button -->
        <div class="mt-2">
          <p-button 
            label="+ Add Selected Trustee" 
            icon="fa-solid fa-plus"
            size="small"
            severity="success"
            [disabled]="!selectedTrustee || disabled"
            (onClick)="addSelectedTrustee()"
            styleClass="p-button-sm">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .trustee-dropdown-container {
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
export class TrusteeDropdownComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() formData: any = {};
  @Output() trusteeSelected = new EventEmitter<StoredTrustee>();

  trusteeOptions: Array<{label: string, value: StoredTrustee | string}> = [];
  filteredTrustees: Array<{label: string, value: StoredTrustee | string}> = [];
  selectedTrustee: any = null;

  constructor(private trusteeStorageService: TrusteeStorageService) {}

  ngOnInit() {
    this.loadTrusteeOptions();
    this.addDemoDataIfNeeded();
  }

  private addDemoDataIfNeeded() {
    // Add demo trustees if none exist
    const existingTrustees = this.trusteeStorageService.getStoredTrustees();
    if (existingTrustees.length === 0) {
      console.log('No existing trustees found, adding demo data...');
      this.trusteeStorageService.saveTrustee({
        label: 'John Smith - Trustee',
        name: 'John Smith',
        role: 'Trustee',
        phone: '(555) 123-4567',
        email: 'john.smith@example.com',
        address: '123 Main St, Anytown, CA 90210'
      });

      this.trusteeStorageService.saveTrustee({
        label: 'Sarah Johnson - Co-Trustee',
        name: 'Sarah Johnson',
        role: 'Co-Trustee',
        phone: '(555) 987-6543',
        email: 'sarah.johnson@example.com',
        address: '456 Oak Ave, Springfield, NY 12345'
      });
      
      // Reload options after adding demo data
      this.loadTrusteeOptions();
    }
  }

  private loadTrusteeOptions() {
    console.log('Loading trustee options with formData:', this.formData);
    this.trusteeOptions = this.trusteeStorageService.getTrusteeDropdownOptions(this.formData);
    this.filteredTrustees = [...this.trusteeOptions];
    console.log('Loaded trustee options:', this.trusteeOptions);
  }

  filterTrustees(event: any) {
    const query = event.query.toLowerCase();
    console.log('Filtering trustees with query:', query, 'from options:', this.trusteeOptions);
    this.filteredTrustees = this.trusteeOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
    console.log('Filtered trustees:', this.filteredTrustees);
  }

  refreshOptions() {
    this.loadTrusteeOptions();
  }

  onDropdownClick() {
    console.log('Dropdown clicked, showing all options');
    this.filteredTrustees = [...this.trusteeOptions];
  }

  onTrusteeSelect(selectedItem: any) {
    console.log('Trustee selected from autocomplete:', selectedItem);
    this.selectedTrustee = selectedItem;
  }

  addSelectedTrustee() {
    if (this.selectedTrustee && typeof this.selectedTrustee.value === 'object') {
      console.log('Adding selected trustee:', this.selectedTrustee.value);
      this.trusteeSelected.emit(this.selectedTrustee.value);
      this.selectedTrustee = null; // Clear selection after adding
    }
  }
}