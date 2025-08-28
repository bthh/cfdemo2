import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';

export interface ExistingInstance {
  id: string;
  type: 'funding' | 'trustee' | 'beneficiary' | 'address';
  title: string;
  subtitle?: string;
  sourceRegistration: string;
  data: any;
  displayFields: { [key: string]: any };
}

@Component({
  selector: 'app-existing-instance-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    CardModule,
    BadgeModule
  ],
  template: `
    <p-dialog 
      [header]="'Select Existing ' + instanceTypeLabel"
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="w-11 md:w-8 lg:w-6"
      (onHide)="onHide()">
      
      <div class="existing-instances-content">
        <!-- Search Filter -->
        <div class="search-container mb-4">
          <span class="p-input-icon-left w-full">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              pInputText 
              placeholder="Search existing instances..."
              [(ngModel)]="searchTerm"
              class="w-full"
              (input)="filterInstances()">
          </span>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredInstances.length === 0" class="text-center py-6">
          <i class="pi pi-info-circle text-4xl text-400 mb-3"></i>
          <p class="text-600 m-0">No existing instances found</p>
        </div>

        <!-- Multi-select Toggle (hidden for address type) -->
        <div *ngIf="filteredInstances.length > 1 && instanceType !== 'address'" class="multi-select-toggle mb-3">
          <label class="flex align-items-center cursor-pointer">
            <input 
              type="checkbox" 
              [(ngModel)]="enableMultiSelect" 
              class="mr-2">
            <span class="text-sm text-600">Enable multi-select ({{selectedInstances.length}} selected)</span>
          </label>
        </div>

        <!-- Instance Cards -->
        <div *ngIf="filteredInstances.length > 0" class="instances-grid">
          <p-card 
            *ngFor="let instance of filteredInstances" 
            class="instance-card cursor-pointer"
            (click)="onInstanceClick(instance)"
            [styleClass]="getCardStyleClass(instance)">
            
            <div class="instance-header flex justify-content-between align-items-start mb-3">
              <div class="instance-info flex-1 flex align-items-start">
                <!-- Multi-select checkbox -->
                <input 
                  *ngIf="enableMultiSelect"
                  type="checkbox" 
                  [checked]="isInstanceSelected(instance)"
                  (click)="$event.stopPropagation()"
                  (change)="onCheckboxChange(instance, $event)"
                  class="mr-2 mt-1">
                
                <div class="flex-1">
                  <h4 class="instance-title m-0 mb-1">{{instance.title}}</h4>
                  <p *ngIf="instance.subtitle" class="instance-subtitle text-600 text-sm m-0">{{instance.subtitle}}</p>
                </div>
              </div>
              <p-badge 
                [value]="instance.sourceRegistration" 
                severity="info" 
                styleClass="text-xs">
              </p-badge>
            </div>

            <!-- Display Fields -->
            <div class="instance-fields">
              <div 
                *ngFor="let field of getDisplayFields(instance)" 
                class="field-row flex justify-content-between py-1">
                <span class="field-label text-600 text-sm">{{field.label}}:</span>
                <span class="field-value text-900 text-sm font-medium">{{field.value}}</span>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button 
          label="Cancel" 
          icon="fa-solid fa-xmark" 
          severity="secondary"
          (onClick)="onCancel()">
        </p-button>
        <p-button 
          [label]="getAddButtonLabel()" 
          icon="fa-solid fa-plus" 
          severity="primary"
          [disabled]="!canAddSelected()"
          (onClick)="onAddSelected()"
          styleClass="ml-2">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .existing-instances-content {
      max-height: 60vh;
      overflow-y: auto;
    }

    .instances-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr;
    }

    @media (min-width: 768px) {
      .instances-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .instance-card {
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .instance-card:hover {
      border-color: var(--primary-color);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .instance-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .instance-subtitle {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }

    .field-row {
      border-bottom: 1px solid var(--surface-200);
      padding: 0.25rem 0;
    }

    .field-row:last-child {
      border-bottom: none;
    }

    .field-label {
      font-weight: 500;
    }

    .field-value {
      text-align: right;
      max-width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::ng-deep .p-dialog .p-dialog-content {
      padding: 2rem;
    }

    ::ng-deep .p-dialog .p-dialog-footer {
      padding: 1rem 2rem;
      justify-content: flex-end;
    }

    /* Fix search input placeholder positioning - comprehensive approach */
    .search-container .p-input-icon-left > input,
    .search-container .p-input-icon-left > .p-inputtext {
      padding-left: 3.5rem !important;
    }

    .search-container .p-input-icon-left > i {
      left: 1rem !important;
      z-index: 10 !important;
      position: absolute !important;
    }

    /* Additional PrimeNG specific overrides */
    ::ng-deep .search-container .p-input-icon-left {
      position: relative !important;
    }

    ::ng-deep .search-container .p-input-icon-left > input {
      padding-left: 3.5rem !important;
    }

    ::ng-deep .search-container .p-input-icon-left > i {
      left: 1rem !important;
      position: absolute !important;
      top: 52% !important;
      transform: translateY(-50%) !important;
      z-index: 10 !important;
    }

    /* Selected instance styling */
    ::ng-deep .selected-instance {
      border-color: var(--primary-color) !important;
      background-color: var(--primary-50, rgba(var(--primary-color-rgb), 0.05));
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    /* Multi-select toggle styling */
    .multi-select-toggle {
      padding: 0.75rem;
      background-color: var(--surface-50);
      border-radius: 6px;
      border: 1px solid var(--surface-200);
    }

    .multi-select-toggle label {
      margin: 0;
      font-weight: 500;
    }

    /* Checkbox styling */
    .instance-card input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      accent-color: var(--primary-color);
      cursor: pointer;
    }
  `]
})
export class ExistingInstanceModalComponent implements OnInit {
  @Input() visible = false;
  @Input() instanceType: 'funding' | 'trustee' | 'beneficiary' | 'address' = 'funding';
  @Input() instances: ExistingInstance[] = [];
  @Input() currentRegistration = '';
  @Input() enableMultiSelect = false;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() instanceSelected = new EventEmitter<ExistingInstance>();
  @Output() instancesSelected = new EventEmitter<ExistingInstance[]>();
  @Output() modalClosed = new EventEmitter<void>();

  searchTerm = '';
  filteredInstances: ExistingInstance[] = [];
  selectedInstance: ExistingInstance | null = null;
  selectedInstances: ExistingInstance[] = [];
  multiSelectMode = false;

  get instanceTypeLabel(): string {
    const labels = {
      'funding': 'Funding Instance',
      'trustee': 'Trustee',
      'beneficiary': 'Beneficiary', 
      'address': 'Address'
    };
    return labels[this.instanceType] || 'Instance';
  }

  ngOnInit() {
    this.filterInstances();
  }

  ngOnChanges() {
    this.filterInstances();
  }

  filterInstances() {
    if (!this.searchTerm.trim()) {
      // For addresses, allow sharing across registrations since they're often the same
      if (this.instanceType === 'address') {
        this.filteredInstances = this.instances.filter(instance => 
          instance.type === this.instanceType
        );
      } else {
        this.filteredInstances = this.instances.filter(instance => 
          instance.type === this.instanceType && 
          instance.sourceRegistration !== this.currentRegistration
        );
      }
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      if (this.instanceType === 'address') {
        this.filteredInstances = this.instances.filter(instance => 
          instance.type === this.instanceType &&
          (instance.title.toLowerCase().includes(searchLower) ||
           instance.subtitle?.toLowerCase().includes(searchLower) ||
           Object.values(instance.displayFields).some(value => 
             String(value).toLowerCase().includes(searchLower)
           ))
        );
      } else {
        this.filteredInstances = this.instances.filter(instance => 
          instance.type === this.instanceType && 
          instance.sourceRegistration !== this.currentRegistration &&
          (instance.title.toLowerCase().includes(searchLower) ||
           instance.subtitle?.toLowerCase().includes(searchLower) ||
           Object.values(instance.displayFields).some(value => 
             String(value).toLowerCase().includes(searchLower)
           ))
        );
      }
    }
  }

  getDisplayFields(instance: ExistingInstance): Array<{label: string, value: any}> {
    return Object.entries(instance.displayFields).map(([key, value]) => ({
      label: this.formatFieldLabel(key),
      value: this.formatFieldValue(value)
    }));
  }

  private formatFieldLabel(key: string): string {
    // Convert camelCase to Title Case
    return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
  }

  private formatFieldValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  onInstanceClick(instance: ExistingInstance) {
    if (this.enableMultiSelect) {
      // Toggle selection in multi-select mode
      this.toggleInstanceSelection(instance);
    } else {
      // Single select mode
      this.selectedInstance = instance;
    }
  }

  onCheckboxChange(instance: ExistingInstance, event: any) {
    if (event.target.checked) {
      this.addToSelection(instance);
    } else {
      this.removeFromSelection(instance);
    }
  }

  toggleInstanceSelection(instance: ExistingInstance) {
    if (this.isInstanceSelected(instance)) {
      this.removeFromSelection(instance);
    } else {
      this.addToSelection(instance);
    }
  }

  addToSelection(instance: ExistingInstance) {
    if (!this.isInstanceSelected(instance)) {
      this.selectedInstances.push(instance);
    }
  }

  removeFromSelection(instance: ExistingInstance) {
    const index = this.selectedInstances.findIndex(i => i.id === instance.id);
    if (index > -1) {
      this.selectedInstances.splice(index, 1);
    }
  }

  isInstanceSelected(instance: ExistingInstance): boolean {
    return this.selectedInstances.some(i => i.id === instance.id);
  }

  getCardStyleClass(instance: ExistingInstance): string {
    const baseClasses = 'hover:border-primary transition-colors';
    
    if (this.enableMultiSelect) {
      return this.isInstanceSelected(instance) 
        ? 'border-primary selected-instance ' + baseClasses
        : baseClasses;
    } else {
      return this.selectedInstance?.id === instance.id 
        ? 'border-primary selected-instance ' + baseClasses
        : baseClasses;
    }
  }

  getAddButtonLabel(): string {
    if (this.enableMultiSelect) {
      const count = this.selectedInstances.length;
      return count === 1 ? 'Add 1 Selected' : `Add ${count} Selected`;
    }
    return 'Add Selected';
  }

  canAddSelected(): boolean {
    return this.enableMultiSelect ? this.selectedInstances.length > 0 : !!this.selectedInstance;
  }

  onAddSelected() {
    if (this.enableMultiSelect && this.selectedInstances.length > 0) {
      this.instancesSelected.emit([...this.selectedInstances]);
      this.close();
    } else if (!this.enableMultiSelect && this.selectedInstance) {
      this.instanceSelected.emit(this.selectedInstance);
      this.close();
    }
  }

  selectInstance(instance: ExistingInstance) {
    this.instanceSelected.emit(instance);
    this.close();
  }

  onCancel() {
    this.close();
  }

  onHide() {
    this.close();
  }

  private close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.modalClosed.emit();
    this.searchTerm = '';
    this.selectedInstance = null;
    this.selectedInstances = [];
    this.enableMultiSelect = false;
  }
}