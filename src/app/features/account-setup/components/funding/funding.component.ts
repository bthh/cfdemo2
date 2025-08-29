import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Local Imports
import { FormData, FundingInstance as SharedFundingInstance } from '../../../../shared/models/types';
import { ExistingInstanceModalComponent, ExistingInstance } from '../../../../shared/components/existing-instance-modal/existing-instance-modal.component';
import { ExistingInstancesService } from '../../../../shared/services/existing-instances.service';

interface DropdownOption {
  label: string;
  value: string;
}

interface FundingInstances {
  acat: SharedFundingInstance[];
  ach: SharedFundingInstance[];
  'initial-ach': SharedFundingInstance[];
  withdrawal: SharedFundingInstance[];
  contribution: SharedFundingInstance[];
  'third-party-check': SharedFundingInstance[];
}

@Component({
  selector: 'app-funding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    AutoCompleteModule,
    DialogModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TooltipModule,
    ExistingInstanceModalComponent
  ],
  providers: [MessageService, ExistingInstancesService],
  template: `
    <div class="funding-section">
      <p-toast></p-toast>
      
              <!-- Edit Mode - Form -->
        <p-card *ngIf="!isReviewMode" header="Funding & Move Money" class="mb-4">
          <div class="funding-dashboard" [class.funding-columns-layout]="fundingColumnsMode">
            <!-- ACAT Transfers Section -->
            <div class="funding-section-wrapper">
              <div class="section-header">
                <div class="section-title">{{brinkerFundingMode ? 'Transfer of Assets' : 'ACAT Transfers'}}</div>
                <div class="section-actions">
                  <button class="add-existing-btn" (click)="showExistingInstanceModalForType('acat')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                  <button class="add-new-link" (click)="openModal('acat')"><i class="fa-solid fa-plus"></i> Add New</button>
                </div>
              </div>
              <div class="funding-simple-section">
                <div class="simple-table" *ngIf="fundingInstances.acat.length > 0">
                  <div class="table-header">
                    <div class="col-name">Name</div>
                    <div class="col-amount">Amount</div>
                    <div class="col-frequency">Frequency</div>
                    <div class="col-actions"></div>
                  </div>
                  <div *ngFor="let instance of fundingInstances.acat" class="table-row">
                    <div class="col-name">{{instance.name}}</div>
                    <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                    <div class="col-frequency">{{instance.frequency || 'One-time'}}</div>
                    <div class="col-actions">
                      <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
                <div class="enterprise-empty-state" *ngIf="fundingInstances.acat.length === 0">
                  <div class="empty-state-content">
                    <div class="empty-state-icon">
                      <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <h3 class="empty-state-title">No {{brinkerFundingMode ? 'Transfer of Assets' : 'ACAT Transfers'}} Added</h3>
                    <p class="empty-state-description">Add {{brinkerFundingMode ? 'transfer of assets' : 'ACAT transfers'}} for this account</p>
                    <div class="empty-state-actions">
                      <p-button 
                        label="Add New" 
                        icon="fa-solid fa-plus"
                        styleClass="empty-state-button"
                        (onClick)="openModal('acat')">
                      </p-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Two-column container for other funding types when in columns mode -->
            <div class="funding-columns-container" *ngIf="fundingColumnsMode">
            
            <!-- ACH Transfers Section -->
            <div class="funding-section-wrapper">
              <div class="section-header">
                <div class="section-title">{{brinkerFundingMode ? 'One-Time Bank ACH/EFT' : 'ACH Transfers'}}</div>
                <div class="section-actions">
                  <button class="add-existing-btn" (click)="showExistingInstanceModalForType('ach')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                  <button class="add-new-link" (click)="openModal('ach')"><i class="fa-solid fa-plus"></i> Add New</button>
                </div>
              </div>
              <div class="funding-simple-section">
                <div class="simple-table" *ngIf="fundingInstances.ach.length > 0">
                  <div class="table-header">
                    <div class="col-name">Name</div>
                    <div class="col-amount">Amount</div>
                    <div class="col-frequency">Frequency</div>
                    <div class="col-actions"></div>
                  </div>
                  <div *ngFor="let instance of fundingInstances.ach" class="table-row">
                    <div class="col-name">{{instance.name}}</div>
                    <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                    <div class="col-frequency">{{instance.frequency || 'One-time'}}</div>
                    <div class="col-actions">
                      <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
                <div class="enterprise-empty-state" *ngIf="fundingInstances.ach.length === 0">
                  <div class="empty-state-content">
                    <div class="empty-state-icon">
                      <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <h3 class="empty-state-title">No {{brinkerFundingMode ? 'One-Time Bank ACH/EFT' : 'ACH Transfers'}} Added</h3>
                    <p class="empty-state-description">Add {{brinkerFundingMode ? 'one-time bank ACH/EFT' : 'ACH transfers'}} for this account</p>
                    <div class="empty-state-actions">
                      <p-button 
                        label="Add New" 
                        icon="fa-solid fa-plus"
                        styleClass="empty-state-button"
                        (onClick)="openModal('ach')">
                      </p-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Systematic Contributions Section -->
            <div class="funding-section-wrapper">
              <div class="section-header">
                <div class="section-title">{{brinkerFundingMode ? 'Standing ACH/EFT' : 'Systematic Contributions'}}</div>
                <div class="section-actions">
                  <button class="add-existing-btn" (click)="showExistingInstanceModalForType('contribution')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                  <button class="add-new-link" (click)="openModal('contribution')"><i class="fa-solid fa-plus"></i> Add New</button>
                </div>
              </div>
              <div class="funding-simple-section">
                <div class="simple-table" *ngIf="fundingInstances.contribution.length > 0">
                  <div class="table-header">
                    <div class="col-name">Name</div>
                    <div class="col-amount">Amount</div>
                    <div class="col-frequency">Frequency</div>
                    <div class="col-actions"></div>
                  </div>
                  <div *ngFor="let instance of fundingInstances.contribution" class="table-row">
                    <div class="col-name">{{instance.name}}</div>
                    <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                    <div class="col-frequency">{{instance.frequency || 'Monthly'}}</div>
                    <div class="col-actions">
                      <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
                <div class="enterprise-empty-state" *ngIf="fundingInstances.contribution.length === 0">
                  <div class="empty-state-content">
                    <div class="empty-state-icon">
                      <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <h3 class="empty-state-title">No {{brinkerFundingMode ? 'Standing ACH/EFT' : 'Systematic Contributions'}} Added</h3>
                    <p class="empty-state-description">Add {{brinkerFundingMode ? 'standing ACH/EFT' : 'systematic contributions'}} for this account</p>
                    <div class="empty-state-actions">
                      <p-button 
                        label="Add New" 
                        icon="fa-solid fa-plus"
                        styleClass="empty-state-button"
                        (onClick)="openModal('contribution')">
                      </p-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Standing Withdrawal Section -->
            <div class="funding-section-wrapper">
              <div class="section-header">
                <div class="section-title">Standing Withdrawal</div>
                <div class="section-actions">
                  <button class="add-existing-btn" (click)="showExistingInstanceModalForType('withdrawal')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                  <button class="add-new-link" (click)="openModal('withdrawal')"><i class="fa-solid fa-plus"></i> Add New</button>
                </div>
              </div>
              <div class="funding-simple-section">
                <div class="simple-table" *ngIf="fundingInstances.withdrawal.length > 0">
                  <div class="table-header">
                    <div class="col-name">Name</div>
                    <div class="col-amount">Amount</div>
                    <div class="col-frequency">Frequency</div>
                    <div class="col-actions"></div>
                  </div>
                  <div *ngFor="let instance of fundingInstances.withdrawal" class="table-row">
                    <div class="col-name">{{instance.name}}</div>
                    <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                    <div class="col-frequency">{{instance.frequency || 'Monthly'}}</div>
                    <div class="col-actions">
                      <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
                <div class="enterprise-empty-state" *ngIf="fundingInstances.withdrawal.length === 0">
                  <div class="empty-state-content">
                    <div class="empty-state-icon">
                      <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <h3 class="empty-state-title">No Standing Withdrawals Added</h3>
                    <p class="empty-state-description">Add standing withdrawals for this account</p>
                    <div class="empty-state-actions">
                      <p-button 
                        label="Add New" 
                        icon="fa-solid fa-plus"
                        styleClass="empty-state-button"
                        (onClick)="openModal('withdrawal')">
                      </p-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3rd Party Check Section -->
            <div class="funding-section-wrapper" *ngIf="brinkerFundingMode; else initialAch">
              <div class="section-header">
                <div class="section-title">3rd Party Check</div>
                <div class="section-actions">
                  <button class="add-existing-btn" (click)="showExistingInstanceModalForType('third-party-check')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                  <button class="add-new-link" (click)="openModal('third-party-check')"><i class="fa-solid fa-plus"></i> Add New</button>
                </div>
              </div>
              <div class="funding-simple-section">
                <div class="simple-table" *ngIf="fundingInstances['third-party-check'].length > 0">
                  <div class="table-header">
                    <div class="col-name">Name</div>
                    <div class="col-amount">Amount</div>
                    <div class="col-frequency">Frequency</div>
                    <div class="col-actions"></div>
                  </div>
                  <div *ngFor="let instance of fundingInstances['third-party-check']" class="table-row">
                    <div class="col-name">{{instance.name}}</div>
                    <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                    <div class="col-frequency">One-time</div>
                    <div class="col-actions">
                      <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
                <div class="enterprise-empty-state" *ngIf="fundingInstances['third-party-check'].length === 0">
                  <div class="empty-state-content">
                    <div class="empty-state-icon">
                      <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <h3 class="empty-state-title">No 3rd Party Checks Added</h3>
                    <p class="empty-state-description">Add 3rd party checks for this account</p>
                    <div class="empty-state-actions">
                      <p-button 
                        label="Add New" 
                        icon="fa-solid fa-plus"
                        styleClass="empty-state-button"
                        (onClick)="openModal('third-party-check')">
                      </p-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #initialAch>
              <!-- Initial ACH Transfer Section -->
              <div class="funding-section-wrapper">
                <div class="section-header">
                  <div class="section-title">Initial ACH Transfer</div>
                  <div class="section-actions">
                    <button class="add-existing-btn" (click)="showExistingInstanceModalForType('initial-ach')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                    <button class="add-new-link" (click)="openModal('initial-ach')"><i class="fa-solid fa-plus"></i> Add New</button>
                  </div>
                </div>
                <div class="funding-simple-section">
                  <div class="simple-table" *ngIf="fundingInstances['initial-ach'].length > 0">
                    <div class="table-header">
                      <div class="col-name">Name</div>
                      <div class="col-amount">Amount</div>
                      <div class="col-frequency">Frequency</div>
                      <div class="col-actions"></div>
                    </div>
                    <div *ngFor="let instance of fundingInstances['initial-ach']" class="table-row">
                      <div class="col-name">{{instance.name}}</div>
                      <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                      <div class="col-frequency">One-time</div>
                      <div class="col-actions">
                        <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="enterprise-empty-state" *ngIf="fundingInstances['initial-ach'].length === 0">
                    <div class="empty-state-content">
                      <div class="empty-state-icon">
                        <i class="fa-regular fa-folder-open"></i>
                      </div>
                      <h3 class="empty-state-title">No Initial ACH Transfers Added</h3>
                      <p class="empty-state-description">Add initial ACH transfers for this account</p>
                      <div class="empty-state-actions">
                        <p-button 
                          label="Add New" 
                          icon="fa-solid fa-plus"
                          styleClass="empty-state-button"
                          (onClick)="openModal('initial-ach')">
                        </p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-template>
            
            </div> <!-- End funding-columns-container -->

            <!-- Regular layout when columns mode is off -->
            <ng-container *ngIf="!fundingColumnsMode">
              <!-- ACH Transfers Section -->
              <div class="funding-section-wrapper">
                <div class="section-header">
                  <div class="section-title">{{brinkerFundingMode ? 'One-Time Bank ACH/EFT' : 'ACH Transfers'}}</div>
                  <div class="section-actions">
                    <button class="add-existing-btn" (click)="showExistingInstanceModalForType('ach')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                    <button class="add-new-link" (click)="openModal('ach')"><i class="fa-solid fa-plus"></i> Add New</button>
                  </div>
                </div>
                <div class="funding-simple-section">
                  <div class="simple-table" *ngIf="fundingInstances.ach.length > 0">
                    <div class="table-header">
                      <div class="col-name">Name</div>
                      <div class="col-amount">Amount</div>
                      <div class="col-frequency">Frequency</div>
                      <div class="col-actions"></div>
                    </div>
                    <div *ngFor="let instance of fundingInstances.ach" class="table-row">
                      <div class="col-name">{{instance.name}}</div>
                      <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                      <div class="col-frequency">{{instance.frequency || 'One-time'}}</div>
                      <div class="col-actions">
                        <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="enterprise-empty-state" *ngIf="fundingInstances.ach.length === 0">
                    <div class="empty-state-content">
                      <div class="empty-state-icon">
                        <i class="fa-regular fa-folder-open"></i>
                      </div>
                      <h3 class="empty-state-title">No {{brinkerFundingMode ? 'One-Time Bank ACH/EFT' : 'ACH Transfers'}} Added</h3>
                      <p class="empty-state-description">Add {{brinkerFundingMode ? 'one-time bank ACH/EFT' : 'ACH transfers'}} for this account</p>
                      <div class="empty-state-actions">
                        <p-button 
                          label="Add New" 
                          icon="fa-solid fa-plus"
                          styleClass="empty-state-button"
                          (onClick)="openModal('ach')">
                        </p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Systematic Contributions Section -->
              <div class="funding-section-wrapper">
                <div class="section-header">
                  <div class="section-title">{{brinkerFundingMode ? 'Standing ACH/EFT' : 'Systematic Contributions'}}</div>
                  <div class="section-actions">
                    <button class="add-existing-btn" (click)="showExistingInstanceModalForType('contribution')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                    <button class="add-new-link" (click)="openModal('contribution')"><i class="fa-solid fa-plus"></i> Add New</button>
                  </div>
                </div>
                <div class="funding-simple-section">
                  <div class="simple-table" *ngIf="fundingInstances.contribution.length > 0">
                    <div class="table-header">
                      <div class="col-name">Name</div>
                      <div class="col-amount">Amount</div>
                      <div class="col-frequency">Frequency</div>
                      <div class="col-actions"></div>
                    </div>
                    <div *ngFor="let instance of fundingInstances.contribution" class="table-row">
                      <div class="col-name">{{instance.name}}</div>
                      <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                      <div class="col-frequency">{{instance.frequency || 'Monthly'}}</div>
                      <div class="col-actions">
                        <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="enterprise-empty-state" *ngIf="fundingInstances.contribution.length === 0">
                    <div class="empty-state-content">
                      <div class="empty-state-icon">
                        <i class="fa-regular fa-folder-open"></i>
                      </div>
                      <h3 class="empty-state-title">No {{brinkerFundingMode ? 'Standing ACH/EFT' : 'Systematic Contributions'}} Added</h3>
                      <p class="empty-state-description">Add {{brinkerFundingMode ? 'standing ACH/EFT' : 'systematic contributions'}} for this account</p>
                      <div class="empty-state-actions">
                        <p-button 
                          label="Add New" 
                          icon="fa-solid fa-plus"
                          styleClass="empty-state-button"
                          (onClick)="openModal('contribution')">
                        </p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Standing Withdrawal Section -->
              <div class="funding-section-wrapper">
                <div class="section-header">
                  <div class="section-title">Standing Withdrawal</div>
                  <div class="section-actions">
                    <button class="add-existing-btn" (click)="showExistingInstanceModalForType('withdrawal')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                    <button class="add-new-link" (click)="openModal('withdrawal')"><i class="fa-solid fa-plus"></i> Add New</button>
                  </div>
                </div>
                <div class="funding-simple-section">
                  <div class="simple-table" *ngIf="fundingInstances.withdrawal.length > 0">
                    <div class="table-header">
                      <div class="col-name">Name</div>
                      <div class="col-amount">Amount</div>
                      <div class="col-frequency">Frequency</div>
                      <div class="col-actions"></div>
                    </div>
                    <div *ngFor="let instance of fundingInstances.withdrawal" class="table-row">
                      <div class="col-name">{{instance.name}}</div>
                      <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                      <div class="col-frequency">{{instance.frequency || 'Monthly'}}</div>
                      <div class="col-actions">
                        <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="enterprise-empty-state" *ngIf="fundingInstances.withdrawal.length === 0">
                    <div class="empty-state-content">
                      <div class="empty-state-icon">
                        <i class="fa-regular fa-folder-open"></i>
                      </div>
                      <h3 class="empty-state-title">No Standing Withdrawals Added</h3>
                      <p class="empty-state-description">Add standing withdrawals for this account</p>
                      <div class="empty-state-actions">
                        <p-button 
                          label="Add New" 
                          icon="fa-solid fa-plus"
                          styleClass="empty-state-button"
                          (onClick)="openModal('withdrawal')">
                        </p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3rd Party Check Section -->
              <div class="funding-section-wrapper" *ngIf="brinkerFundingMode; else initialAch">
                <div class="section-header">
                  <div class="section-title">3rd Party Check</div>
                  <div class="section-actions">
                    <button class="add-existing-btn" (click)="showExistingInstanceModalForType('third-party-check')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                    <button class="add-new-link" (click)="openModal('third-party-check')"><i class="fa-solid fa-plus"></i> Add New</button>
                  </div>
                </div>
                <div class="funding-simple-section">
                  <div class="simple-table" *ngIf="fundingInstances['third-party-check'].length > 0">
                    <div class="table-header">
                      <div class="col-name">Name</div>
                      <div class="col-amount">Amount</div>
                      <div class="col-frequency">Frequency</div>
                      <div class="col-actions"></div>
                    </div>
                    <div *ngFor="let instance of fundingInstances['third-party-check']" class="table-row">
                      <div class="col-name">{{instance.name}}</div>
                      <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                      <div class="col-frequency">One-time</div>
                      <div class="col-actions">
                        <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="enterprise-empty-state" *ngIf="fundingInstances['third-party-check'].length === 0">
                    <div class="empty-state-content">
                      <div class="empty-state-icon">
                        <i class="fa-regular fa-folder-open"></i>
                      </div>
                      <h3 class="empty-state-title">No 3rd Party Checks Added</h3>
                      <p class="empty-state-description">Add 3rd party checks for this account</p>
                      <div class="empty-state-actions">
                        <p-button 
                          label="Add New" 
                          icon="fa-solid fa-plus"
                          styleClass="empty-state-button"
                          (onClick)="openModal('third-party-check')">
                        </p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #initialAch>
                <!-- Initial ACH Transfer Section -->
                <div class="funding-section-wrapper">
                  <div class="section-header">
                    <div class="section-title">Initial ACH Transfer</div>
                    <div class="section-actions">
                      <button class="add-existing-btn" (click)="showExistingInstanceModalForType('initial-ach')"><i class="fa-solid fa-clock-rotate-left"></i> Add Existing</button>
                      <button class="add-new-link" (click)="openModal('initial-ach')"><i class="fa-solid fa-plus"></i> Add New</button>
                    </div>
                  </div>
                  <div class="funding-simple-section">
                    <div class="simple-table" *ngIf="fundingInstances['initial-ach'].length > 0">
                      <div class="table-header">
                        <div class="col-name">Name</div>
                        <div class="col-amount">Amount</div>
                        <div class="col-frequency">Frequency</div>
                        <div class="col-actions"></div>
                      </div>
                      <div *ngFor="let instance of fundingInstances['initial-ach']" class="table-row">
                        <div class="col-name">{{instance.name}}</div>
                        <div class="col-amount">{{formatStoredAmount(instance.amount)}}</div>
                        <div class="col-frequency">One-time</div>
                        <div class="col-actions">
                          <button class="icon-btn" (click)="editInstance(instance)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                          <button class="icon-btn danger" (click)="deleteInstance(instance)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                      </div>
                    </div>
                    <div class="enterprise-empty-state" *ngIf="fundingInstances['initial-ach'].length === 0">
                      <div class="empty-state-content">
                        <div class="empty-state-icon">
                          <i class="fa-regular fa-folder-open"></i>
                        </div>
                        <h3 class="empty-state-title">No Initial ACH Transfers Added</h3>
                        <p class="empty-state-description">Add initial ACH transfers for this account</p>
                        <div class="empty-state-actions">
                          <p-button 
                            label="Add New" 
                            icon="fa-solid fa-plus"
                            styleClass="empty-state-button"
                            (onClick)="openModal('initial-ach')">
                          </p-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ng-template>
            </ng-container>

          <!-- Modal with existing forms -->
          <p-dialog [(visible)]="showFundingModal" [modal]="true" [draggable]="false" [resizable]="false" styleClass="funding-dialog" [header]="getModalHeader()" (onHide)="cancelForm()">
            <div class="mt-2">
              <ng-container [ngSwitch]="showFundingForm">
              
              <!-- ACAT Transfer Form -->
              <p-card *ngSwitchCase="'acat'" [header]="brinkerFundingMode ? 'New Transfer of Assets' : 'New ACAT Transfer'" class="mb-4">
                <form [formGroup]="fundingForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="acatName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="acatName"
                        formControlName="name"
                        placeholder="Transfer name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="acatAmount" class="block text-900 font-medium mb-2">Amount <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="acatAmount"
                        formControlName="amount"
                        placeholder="$0.00"
                        class="w-full"
                        (input)="onCurrencyInput($event)"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="fromFirm" class="block text-900 font-medium mb-2">From Firm <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="fromFirm"
                        formControlName="fromFirm"
                        placeholder="Current custodian"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="transferType" class="block text-900 font-medium mb-2">Transfer Type <span class="text-red-500">*</span></label>
                      <p-autoComplete
                        inputId="transferType"
                        formControlName="transferType"
                        [suggestions]="filteredTransferTypeOptions"
                        (completeMethod)="filterTransferTypeOptions($event)"
                        field="label"
                        [dropdown]="true"
                        [forceSelection]="true"
                        placeholder="Select type"
                        styleClass="w-full compact-autocomplete"
                        [disabled]="isReviewMode">
                      </p-autoComplete>
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- ACH Transfer Form -->
              <p-card *ngSwitchCase="'ach'" [header]="brinkerFundingMode ? 'New Bank ACH/EFT' : 'New ACH Transfer'" class="mb-4">
                <form [formGroup]="fundingForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="achName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="achName"
                        formControlName="name"
                        placeholder="Transfer name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="achAmount" class="block text-900 font-medium mb-2">Amount <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="achAmount"
                        formControlName="amount"
                        placeholder="$0.00"
                        class="w-full"
                        (input)="onCurrencyInput($event)"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="bankName" class="block text-900 font-medium mb-2">Bank Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="bankName"
                        formControlName="bankName"
                        placeholder="Bank name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="achFrequency" class="block text-900 font-medium mb-2">Frequency</label>
                      <p-autoComplete
                        inputId="achFrequency"
                        formControlName="frequency"
                        [suggestions]="filteredAchFrequencyOptions"
                        (completeMethod)="filterAchFrequencyOptions($event)"
                        field="label"
                        [dropdown]="true"
                        [forceSelection]="true"
                        placeholder="Select frequency"
                        styleClass="w-full compact-autocomplete"
                        [disabled]="isReviewMode">
                      </p-autoComplete>
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- Initial ACH Transfer Form -->
              <p-card *ngSwitchCase="'initial-ach'" header="New Initial ACH Transfer" class="mb-4">
                <form [formGroup]="fundingForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="initialName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="initialName"
                        formControlName="name"
                        placeholder="Transfer name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="initialAmount" class="block text-900 font-medium mb-2">Amount <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="initialAmount"
                        formControlName="amount"
                        placeholder="$0.00"
                        class="w-full"
                        (input)="onCurrencyInput($event)"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="initialBank" class="block text-900 font-medium mb-2">Bank Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="initialBank"
                        formControlName="bankName"
                        placeholder="Bank name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="transferDate" class="block text-900 font-medium mb-2">Transfer Date <span class="text-red-500">*</span></label>
                      <p-calendar
                        inputId="transferDate"
                        formControlName="transferDate"
                        [showIcon]="true"
                        dateFormat="mm/dd/yy"
                        placeholder="Select date"
                        styleClass="w-full compact-autocomplete"
                        [disabled]="isReviewMode">
                      </p-calendar>
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- Systematic Withdrawal Form -->
              <p-card *ngSwitchCase="'withdrawal'" [header]="brinkerFundingMode ? 'New Standing Wire' : 'New Systematic Withdrawal'" class="mb-4">
                <form [formGroup]="fundingForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="withdrawalName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="withdrawalName"
                        formControlName="name"
                        placeholder="Withdrawal name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="withdrawalAmount" class="block text-900 font-medium mb-2">Amount <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="withdrawalAmount"
                        formControlName="amount"
                        placeholder="$0.00"
                        class="w-full"
                        (input)="onCurrencyInput($event)"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="withdrawalFreq" class="block text-900 font-medium mb-2">Frequency <span class="text-red-500">*</span></label>
                      <p-autoComplete
                        inputId="withdrawalFreq"
                        formControlName="frequency"
                        [suggestions]="filteredWithdrawalFrequencyOptions"
                        (completeMethod)="filterWithdrawalFrequencyOptions($event)"
                        field="label"
                        [dropdown]="true"
                        [forceSelection]="true"
                        placeholder="Select frequency"
                        styleClass="w-full compact-autocomplete"
                        [disabled]="isReviewMode">
                      </p-autoComplete>
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="startDate" class="block text-900 font-medium mb-2">Start Date <span class="text-red-500">*</span></label>
                      <p-calendar
                        inputId="startDate"
                        formControlName="startDate"
                        [showIcon]="true"
                        dateFormat="mm/dd/yy"
                        placeholder="Select start date"
                        styleClass="w-full compact-autocomplete"
                        [disabled]="isReviewMode">
                      </p-calendar>
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- Systematic Contribution Form -->
              <p-card *ngSwitchCase="'contribution'" [header]="brinkerFundingMode ? 'New Standing ACH/EFT' : 'New Systematic Contribution'" class="mb-4">
                <form [formGroup]="fundingForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="contributionName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="contributionName"
                        formControlName="name"
                        placeholder="Contribution name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="contributionAmount" class="block text-900 font-medium mb-2">Amount <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="contributionAmount"
                        formControlName="amount"
                        placeholder="$0.00"
                        class="w-full"
                        (input)="onCurrencyInput($event)"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="contributionBank" class="block text-900 font-medium mb-2">Bank Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="contributionBank"
                        formControlName="bankName"
                        placeholder="Bank name"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="contributionFreq" class="block text-900 font-medium mb-2">Frequency <span class="text-red-500">*</span></label>
                      <p-autoComplete
                        inputId="contributionFreq"
                        formControlName="frequency"
                        [suggestions]="filteredContributionFrequencyOptions"
                        (completeMethod)="filterContributionFrequencyOptions($event)"
                        field="label"
                        [dropdown]="true"
                        [forceSelection]="true"
                        placeholder="Select frequency"
                        styleClass="w-full compact-autocomplete"
                        [disabled]="isReviewMode">
                      </p-autoComplete>
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- Third Party Check Form -->
              <p-card *ngSwitchCase="'third-party-check'" header="New 3rd Party Check" class="mb-4">
                <form [formGroup]="fundingForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="checkName" class="block text-900 font-medium mb-2">Check Description <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="checkName"
                        formControlName="name"
                        placeholder="Check description"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="checkAmount" class="block text-900 font-medium mb-2">Amount <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="checkAmount"
                        formControlName="amount"
                        placeholder="$0.00"
                        class="w-full"
                        (input)="onCurrencyInput($event)"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="checkPayor" class="block text-900 font-medium mb-2">Payor Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="checkPayor"
                        formControlName="payorName"
                        placeholder="Name on check"
                        class="w-full"
                        [disabled]="isReviewMode" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="checkDate" class="block text-900 font-medium mb-2">Expected Date</label>
                      <p-calendar
                        inputId="checkDate"
                        formControlName="expectedDate"
                        placeholder="Select date"
                        styleClass="w-full"
                        [disabled]="isReviewMode">
                      </p-calendar>
                    </div>
                  </div>
                </form>
              </p-card>
              
            </ng-container>
            
            <!-- Form Action Buttons -->
            <div class="flex gap-2 justify-content-end" *ngIf="!isReviewMode">
              <p-button 
                label="Cancel" 
                severity="secondary" 
                (onClick)="cancelForm()">
              </p-button>
              <p-button 
                [label]="editingInstance ? 'Update Instance' : 'Save Instance'"
                (onClick)="saveInstance()">
              </p-button>
            </div>
          </div>
          </p-dialog>

        </div>
      </p-card>

      <!-- Review Mode - Comprehensive Display -->
      <div *ngIf="isReviewMode" class="review-mode-container">
        
        <!-- Funding Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Funding & Move Money</div>
            <p-button 
              [label]="sectionEditMode['funding'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['funding'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['funding'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('funding')">
            </p-button>
          </div>
          
          <!-- ACAT Transfers -->
          <div *ngIf="fundingInstances.acat.length > 0" class="review-subsection">
            <div class="review-subsection-title">ACAT Transfers</div>
            <div *ngFor="let acat of fundingInstances.acat; let i = index" class="funding-instance-row">
              <div class="funding-instance-header">ACAT Transfer {{i + 1}}: {{acat.name}}</div>
              <div class="funding-instance-details">
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Amount:</span>
                  <span class="funding-detail-value">{{formatStoredAmount(acat.amount)}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">From Firm:</span>
                  <span class="funding-detail-value">{{acat.fromFirm}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Transfer Type:</span>
                  <span class="funding-detail-value">{{acat.transferType}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ACH Transfers -->
          <div *ngIf="fundingInstances.ach.length > 0" class="review-subsection">
            <div class="review-subsection-title">ACH Transfers</div>
            <div *ngFor="let ach of fundingInstances.ach; let i = index" class="funding-instance-row">
              <div class="funding-instance-header">ACH Transfer {{i + 1}}: {{ach.name}}</div>
              <div class="funding-instance-details">
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Amount:</span>
                  <span class="funding-detail-value">{{formatStoredAmount(ach.amount)}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Bank:</span>
                  <span class="funding-detail-value">{{ach.bankName}}</span>
                </div>
                <div class="funding-detail-item" *ngIf="ach.frequency">
                  <span class="funding-detail-label">Frequency:</span>
                  <span class="funding-detail-value">{{ach.frequency}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Initial ACH Transfers -->
          <div *ngIf="fundingInstances['initial-ach'].length > 0" class="review-subsection">
            <div class="review-subsection-title">Initial ACH Transfers</div>
            <div *ngFor="let initialAch of fundingInstances['initial-ach']; let i = index" class="funding-instance-row">
              <div class="funding-instance-header">Initial ACH {{i + 1}}: {{initialAch.name}}</div>
              <div class="funding-instance-details">
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Amount:</span>
                  <span class="funding-detail-value">{{formatStoredAmount(initialAch.amount)}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Bank:</span>
                  <span class="funding-detail-value">{{initialAch.bankName}}</span>
                </div>
                <div class="funding-detail-item" *ngIf="initialAch.transferDate">
                  <span class="funding-detail-label">Transfer Date:</span>
                  <span class="funding-detail-value">{{initialAch.transferDate | date:'shortDate'}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Withdrawals -->
          <div *ngIf="fundingInstances.withdrawal.length > 0" class="review-subsection">
            <div class="review-subsection-title">Systematic Withdrawals</div>
            <div *ngFor="let withdrawal of fundingInstances.withdrawal; let i = index" class="funding-instance-row">
              <div class="funding-instance-header">Withdrawal {{i + 1}}: {{withdrawal.name}}</div>
              <div class="funding-instance-details">
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Amount:</span>
                  <span class="funding-detail-value">{{formatStoredAmount(withdrawal.amount)}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Frequency:</span>
                  <span class="funding-detail-value">{{withdrawal.frequency}}</span>
                </div>
                <div class="funding-detail-item" *ngIf="withdrawal.startDate">
                  <span class="funding-detail-label">Start Date:</span>
                  <span class="funding-detail-value">{{withdrawal.startDate | date:'shortDate'}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contributions -->
          <div *ngIf="fundingInstances.contribution.length > 0" class="review-subsection">
            <div class="review-subsection-title">Systematic Contributions</div>
            <div *ngFor="let contribution of fundingInstances.contribution; let i = index" class="funding-instance-row">
              <div class="funding-instance-header">Contribution {{i + 1}}: {{contribution.name}}</div>
              <div class="funding-instance-details">
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Amount:</span>
                  <span class="funding-detail-value">{{formatStoredAmount(contribution.amount)}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Bank:</span>
                  <span class="funding-detail-value">{{contribution.bankName}}</span>
                </div>
                <div class="funding-detail-item">
                  <span class="funding-detail-label">Frequency:</span>
                  <span class="funding-detail-value">{{contribution.frequency}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="getAllFundingInstances().length === 0" class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Funding Sources</div>
              <div class="review-field-value empty">
                No funding sources added
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Existing Instance Modal -->
    <app-existing-instance-modal
      [(visible)]="showExistingModal"
      [instanceType]="'funding'"
      [instances]="existingInstances"
      [currentRegistration]="getCurrentRegistration()"
      [enableMultiSelect]="true"
      (instanceSelected)="onExistingInstanceSelected($event)"
      (instancesSelected)="onExistingInstancesSelected($event)"
      (modalClosed)="onExistingModalClosed()">
    </app-existing-instance-modal>
  `,
  styles: [`
    .funding-section {
      padding: 0;
    }

    .p-card {
      margin-bottom: 1.5rem;
    }

    .p-card .p-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
    }

    .funding-dashboard {
      /* Container for all funding sections */
    }

    /* Column layout styles */
    .funding-columns-layout .funding-columns-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
      .funding-columns-layout .funding-columns-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .funding-buttons-container {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
      /* Ensure Add Existing is first */
    }

    /* Funding section wrapper to match beneficiary/trustee sections */
    .funding-section-wrapper {
      margin-bottom: 2rem;
    }

    .funding-section-wrapper:last-child {
      margin-bottom: 0;
    }

    /* Simple sections without dotted border */
    .funding-simple-section {
      padding: 1.25rem;
      background: white;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .section-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #111827;
    }

    .section-actions {
      display: flex;
      gap: 0.75rem;
    }

    .add-new-link, .add-existing-btn {
      background: none;
      border: none;
      color: #0A8DFF;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: color 0.2s;
    }

    .add-new-link i, .add-existing-btn i {
      font-size: 0.875rem;
    }

    .add-new-link:hover, .add-existing-btn:hover {
      color: #087AE6;
    }

    .add-existing-btn {
      color: #6b7280;
    }

    .add-existing-btn:hover {
      color: #374151;
    }

    .simple-table {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      background: #f9fafb;
    }

    .table-header {
      background: #f3f4f6;
      color: #374151;
      font-weight: 600;
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 100px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 100px;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      align-items: center;
      font-size: 0.875rem;
      background: white;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:hover {
      background: #eff6ff;
    }

    .col-name { font-weight: 500; color: #111827; }
    .col-amount { color: #374151; }
    .col-frequency { color: #6b7280; }
    .col-actions { text-align: right; display: flex; justify-content: flex-end; gap: 0.25rem; }
    
    .icon-btn { 
      background: none; 
      border: none; 
      cursor: pointer; 
      color: #6b7280; 
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .icon-btn:hover { 
      color: #111827; 
      background: #f3f4f6;
    }
    .icon-btn.danger { color: #ef4444; }
    .icon-btn.danger:hover { 
      color: #dc2626; 
      background: #fee2e2;
    }

    /* Enterprise empty state styling to match beneficiary/trustee */
    .enterprise-empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-color-secondary);
      transition: background 0.2s;
    }

    .enterprise-empty-state:hover {
      background: #eff6ff;
    }

    .empty-state-content {
      /* Content is styled by global styles */
    }

    .empty-state-icon {
      /* Icon styling handled by global styles in styles.css */
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .empty-state-description {
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Empty state button styling using PrimeNG button */
    :host ::ng-deep .empty-state-button {
      background: #3b82f6;
      border-color: #3b82f6;
      font-weight: 600;
    }

    :host ::ng-deep .empty-state-button:hover {
      background: #2563eb;
      border-color: #2563eb;
    }

    :host ::ng-deep .funding-dialog .p-dialog { width: 900px; max-width: 95vw; }

    .funding-button-wrapper {
      flex: 0 0 auto;
    }

    .funding-type-button {
      background: #0A8DFF;
      color: white;
      border: 2px solid #0A8DFF;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 500;
      min-width: fit-content;
      white-space: nowrap;
    }

    .funding-type-button:hover:not(.disabled) {
      background: #087AE6;
      border-color: #087AE6;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(10, 141, 255, 0.25);
    }

    .funding-type-button.disabled {
      background: #9ca3af;
      border-color: #9ca3af;
      color: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.7;
    }

    .funding-type-name {
      font-weight: 500;
      color: white;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .funding-type-button.disabled .funding-type-name {
      color: #f3f4f6;
    }

    .funding-type-button.existing-instance-button {
      background: #0A8DFF;
      border-color: #0A8DFF;
    }

    .funding-type-button.existing-instance-button:hover {
      background: #087AE6;
      border-color: #087AE6;
    }
    
    .funding-type-button.existing-instance-button-inline {
      background: #0A8DFF;
      border-color: #0A8DFF;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      min-height: auto;
    }
    
    .funding-type-button.existing-instance-button-inline:hover {
      background: #087AE6;
      border-color: #087AE6;
    }

    .funding-instances-table {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .action-button {
      background: none;
      border: none;
      padding: 0.25rem;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .action-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .edit-button {
      color: #6b7280;
    }

    .edit-button:hover {
      color: #374151;
    }

    .delete-button {
      color: #ef4444;
    }

    .delete-button:hover {
      color: #dc2626;
      background-color: rgba(239, 68, 68, 0.05);
    }

    .text-red-500 {
      color: #ef4444;
    }

    .p-error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }

    .ng-invalid.ng-touched {
      border-color: #ef4444 !important;
    }

    /* Review mode styling - clean, flattened display */
    .review-mode-container {
      width: 100%;
      padding: 1rem;
      background: #f8f9fa;
    }
    
    .review-mode-section {
      width: 100%;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .review-mode-section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }

    .review-mode-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .review-mode-section-header .review-mode-section-title {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }

    ::ng-deep .edit-section-button .p-button {
      font-size: 0.75rem !important;
      padding: 0.25rem 0.75rem !important;
    }
    
    .review-subsection {
      margin-bottom: 1.5rem;
    }
    
    .review-subsection:last-child {
      margin-bottom: 0;
    }
    
    .review-subsection-title {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.25rem;
    }
    
    .review-mode-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .review-field-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .review-field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .review-field-value {
      font-size: 1rem;
      color: #111827;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .review-field-value.missing {
      color: #dc2626;
      font-style: italic;
    }
    
    .review-field-value.empty {
      color: #9ca3af;
      font-style: italic;
    }

    /* Funding Instance Row Layout */
    .funding-instance-row {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .funding-instance-header {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .funding-instance-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .funding-detail-item {
      display: flex;
      flex-direction: column;
      min-width: 150px;
    }

    .funding-detail-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .funding-detail-value {
      font-size: 0.875rem;
      color: #1f2937;
      font-weight: 500;
    }
  `]
})
export class FundingComponent implements OnInit, OnChanges {
  @Input() formData: FormData = {};
  @Input() entityId: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() brinkerFundingMode: boolean = false;
  @Input() fundingColumnsMode: boolean = false;
  @Input() registrationName: string = '';
  @Input() highlightMissingFields: boolean = false;
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() disableQuickReview = new EventEmitter<void>();

  fundingForm!: FormGroup;
  showFundingForm: string | null = null;
  showFundingModal = false;
  editingInstance: SharedFundingInstance | null = null;

  // Funding instances organized by type
  fundingInstances: FundingInstances = {
    acat: [],
    ach: [],
    'initial-ach': [],
    withdrawal: [],
    contribution: [],
    'third-party-check': []
  };

  // Existing instance modal properties
  showExistingModal = false;
  currentFundingTypeForExisting: string = '';

  // Section edit mode tracking
  sectionEditMode: { [key: string]: boolean } = {
    'funding': false
  };
  existingInstances: ExistingInstance[] = [];

  // Filtered arrays for AutoComplete components
  filteredTransferTypeOptions: DropdownOption[] = [];
  filteredAchFrequencyOptions: DropdownOption[] = [];
  filteredWithdrawalFrequencyOptions: DropdownOption[] = [];
  filteredContributionFrequencyOptions: DropdownOption[] = [];

  // Funding type names
  fundingTypeNames = {
    'acat': 'ACAT Transfers',
    'ach': 'ACH Transfers', 
    'initial-ach': 'Initial ACH Transfers',
    'withdrawal': 'Systematic Withdrawals',
    'contribution': 'Systematic Contributions',
    'third-party-check': '3rd Party Checks'
  };

  // Dropdown options exactly matching V2
  transferTypeOptions: DropdownOption[] = [
    { label: 'Full Transfer', value: 'Full Transfer' },
    { label: 'Partial Transfer', value: 'Partial Transfer' }
  ];

  achFrequencyOptions: DropdownOption[] = [
    { label: 'One-time', value: 'One-time' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' }
  ];

  withdrawalFrequencyOptions: DropdownOption[] = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Semi-Annually', value: 'Semi-Annually' },
    { label: 'Annually', value: 'Annually' }
  ];

  contributionFrequencyOptions: DropdownOption[] = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Bi-weekly', value: 'Bi-weekly' },
    { label: 'Weekly', value: 'Weekly' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private existingInstancesService: ExistingInstancesService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadFundingData();
    this.initializeFilteredOptions();
  }

  private initializeFilteredOptions() {
    this.filteredTransferTypeOptions = [...this.transferTypeOptions];
    this.filteredAchFrequencyOptions = [...this.achFrequencyOptions];
    this.filteredWithdrawalFrequencyOptions = [...this.withdrawalFrequencyOptions];
    this.filteredContributionFrequencyOptions = [...this.contributionFrequencyOptions];
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['formData'] || changes['entityId']) && this.fundingForm) {
      this.loadFundingData();
    }
  }

  private initializeForm() {
    this.fundingForm = this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      frequency: [''],
      fromFirm: [''],
      transferType: [''],
      bankName: [''],
      transferDate: [''],
      startDate: [''],
      payorName: [''], // For third-party-check
      expectedDate: [''] // For third-party-check
    });
  }

  private loadFundingData() {
    if (this.formData && this.formData[this.entityId] && this.formData[this.entityId].fundingInstances) {
      const savedInstances = this.formData[this.entityId].fundingInstances!;
      this.fundingInstances = {
        acat: savedInstances.acat || [],
        ach: savedInstances.ach || [],
        'initial-ach': savedInstances['initial-ach'] || [],
        withdrawal: savedInstances.withdrawal || [],
        contribution: savedInstances.contribution || [],
        'third-party-check': savedInstances['third-party-check'] || []
      };
    }
  }

  private updateFormData() {
    const updatedFormData = { ...this.formData };
    if (!updatedFormData[this.entityId]) {
      updatedFormData[this.entityId] = {};
    }
    
    updatedFormData[this.entityId].fundingInstances = {
      acat: this.fundingInstances.acat,
      ach: this.fundingInstances.ach,
      'initial-ach': this.fundingInstances['initial-ach'],
      withdrawal: this.fundingInstances.withdrawal,
      contribution: this.fundingInstances.contribution
    };
    this.formDataChange.emit(updatedFormData);
  }

  toggleSectionEdit(sectionKey: string) {
    if (this.sectionEditMode[sectionKey]) {
      // Save changes and exit edit mode
      this.updateFormData();
      this.sectionEditMode[sectionKey] = false;
    } else {
      // Enter edit mode
      this.sectionEditMode[sectionKey] = true;
      // When enabling any section edit in quick review mode, disable overall quick review mode
      this.disableQuickReview.emit();
    }
  }

  handleFundingTypeClick(type: string) {
    if (this.isReviewMode) return;
    console.log('Funding type clicked:', type); // Debug log
    
    const typeInstances = (this.fundingInstances as any)[type]?.length || 0;
    const totalInstances = this.getTotalFundingInstances();
    
    if (typeInstances >= 4) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Limit Reached',
        detail: `Maximum 4 instances allowed per funding type`,
        life: 3000
      });
      return;
    }
    
    if (totalInstances >= 20) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Limit Reached',
        detail: `Maximum 20 total funding instances allowed`,
        life: 3000
      });
      return;
    }
    
    this.showFundingForm = type;
    this.showFundingModal = true;
    this.editingInstance = null;
    this.resetForm(type);
  }

  private resetForm(type: string) {
    // Set appropriate validators based on funding type
    this.fundingForm.reset();
    
    // Reset all validators first
    Object.keys(this.fundingForm.controls).forEach(key => {
      this.fundingForm.get(key)?.clearValidators();
    });
    
    // Set required validators based on type
    this.fundingForm.get('name')?.setValidators([Validators.required]);
    this.fundingForm.get('amount')?.setValidators([Validators.required]);
    
    switch (type) {
      case 'acat':
        this.fundingForm.get('fromFirm')?.setValidators([Validators.required]);
        this.fundingForm.get('transferType')?.setValidators([Validators.required]);
        break;
      case 'ach':
        this.fundingForm.get('bankName')?.setValidators([Validators.required]);
        break;
      case 'initial-ach':
        this.fundingForm.get('bankName')?.setValidators([Validators.required]);
        this.fundingForm.get('transferDate')?.setValidators([Validators.required]);
        break;
      case 'withdrawal':
        this.fundingForm.get('frequency')?.setValidators([Validators.required]);
        this.fundingForm.get('startDate')?.setValidators([Validators.required]);
        break;
      case 'contribution':
        this.fundingForm.get('bankName')?.setValidators([Validators.required]);
        this.fundingForm.get('frequency')?.setValidators([Validators.required]);
        break;
    }
    
    // Update validity for all controls
    Object.keys(this.fundingForm.controls).forEach(key => {
      this.fundingForm.get(key)?.updateValueAndValidity();
    });
  }

  onCurrencyInput(event: any) {
    const value = event.target.value;
    const formatted = this.formatCurrency(value);
    this.fundingForm.patchValue({ amount: formatted });
  }

  private formatCurrency(value: string): string {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Handle empty or invalid input
    if (!numericValue || numericValue === '.') return '';
    
    // Parse as number and format
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    // Format as currency without cents if it's a whole number, with cents if not
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: number % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(number);
  }

  private parseCurrencyValue(formattedValue: string): string {
    return formattedValue.replace(/[^0-9.]/g, '');
  }

  formatStoredAmount(amount: string | number): string {
    if (!amount) return 'N/A';
    const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numValue)) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: numValue % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }

  saveInstance() {
    if (!this.fundingForm.valid || !this.showFundingForm) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Data',
        detail: 'Please fill in all required fields',
        life: 3000
      });
      return;
    }

    const formValue = this.fundingForm.value;
    const instance: SharedFundingInstance = {
      type: this.showFundingForm as any,
      typeName: (this.fundingTypeNames as any)[this.showFundingForm],
      name: formValue.name,
      amount: this.parseCurrencyValue(formValue.amount),
      frequency: formValue.frequency,
      fromFirm: formValue.fromFirm,
      transferType: formValue.transferType,
      bankName: formValue.bankName,
      transferDate: formValue.transferDate,
      startDate: formValue.startDate
    };

    if (this.editingInstance) {
      // Update existing instance
      const typeInstances = (this.fundingInstances as any)[this.showFundingForm];
      const index = typeInstances.findIndex((inst: SharedFundingInstance) => 
        inst.originalIndex === this.editingInstance!.originalIndex
      );
      if (index !== -1) {
        typeInstances[index] = instance;
      }
      
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: `${instance.name} has been updated`,
        life: 3000
      });
    } else {
      // Add new instance
      (this.fundingInstances as any)[this.showFundingForm].push(instance);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: `${instance.name} has been added`,
        life: 3000
      });
    }

    this.updateFormData();
    this.cancelForm();
  }

  editInstance(instance: SharedFundingInstance) {
    this.editingInstance = instance;
    this.showFundingForm = instance.type;
    this.showFundingModal = true;
    this.resetForm(instance.type);
    
    // Populate form with instance data
    this.fundingForm.patchValue({
      name: instance.name,
      amount: this.formatCurrency(instance.amount),
      frequency: instance.frequency,
      fromFirm: instance.fromFirm,
      transferType: instance.transferType,
      bankName: instance.bankName,
      transferDate: instance.transferDate,
      startDate: instance.startDate
    });
  }

  deleteInstance(instance: SharedFundingInstance) {
    const typeInstances = (this.fundingInstances as any)[instance.type];
    const index = typeInstances.findIndex((inst: SharedFundingInstance) => 
      inst.name === instance.name && inst.amount === instance.amount
    );
    
    if (index !== -1) {
      typeInstances.splice(index, 1);
      this.updateFormData();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${instance.name} has been removed`,
        life: 3000
      });
    }
  }

  cancelForm() {
    this.showFundingForm = null;
    this.showFundingModal = false;
    this.editingInstance = null;
    this.fundingForm.reset();
  }

  getAllFundingInstances(): SharedFundingInstance[] {
    const allInstances: SharedFundingInstance[] = [];
    Object.keys(this.fundingInstances).forEach(type => {
      const instances = (this.fundingInstances as any)[type] || [];
      instances.forEach((instance: SharedFundingInstance, index: number) => {
        allInstances.push({
          ...instance,
          originalIndex: index
        });
      });
    });
    return allInstances;
  }

  // New helpers for modal header and open action
  openModal(type: string) {
    this.handleFundingTypeClick(type);
  }

  getModalHeader(): string {
    const map: any = {
      'acat': this.brinkerFundingMode ? 'Transfer of Assets' : 'ACAT Transfer',
      'ach': this.brinkerFundingMode ? 'Bank ACH/EFT' : 'ACH Transfer',
      'initial-ach': 'Initial ACH Transfer',
      'withdrawal': this.brinkerFundingMode ? 'Standing Wire' : 'Systematic Withdrawal',
      'contribution': this.brinkerFundingMode ? 'Standing ACH/EFT' : 'Systematic Contribution',
      'third-party-check': '3rd Party Check'
    };
    return (this.editingInstance ? 'Edit ' : 'New ') + (map[this.showFundingForm || ''] || 'Funding');
  }

  getTotalFundingInstances(): number {
    return Object.values(this.fundingInstances).reduce((total, instances) => total + instances.length, 0);
  }

  // Existing instance modal methods
  showExistingInstanceModal() {
    // Collect all existing instances from the form data (no filter)
    this.existingInstances = this.existingInstancesService.collectExistingInstances(this.formData);
    this.currentFundingTypeForExisting = '';
    this.showExistingModal = true;
  }

  showExistingInstanceModalForType(type: string) {
    // Collect only existing instances of the specified funding type
    this.existingInstances = this.existingInstancesService.collectExistingInstances(this.formData, type);
    this.currentFundingTypeForExisting = type;
    this.showExistingModal = true;
  }

  onExistingInstanceSelected(instance: ExistingInstance) {
    this.addFundingInstance(instance);
    this.messageService.add({
      severity: 'success',
      summary: 'Instance Added',
      detail: `${instance.title} has been added successfully`,
      life: 3000
    });
  }

  onExistingInstancesSelected(instances: ExistingInstance[]) {
    let addedCount = 0;
    instances.forEach(instance => {
      this.addFundingInstance(instance);
      addedCount++;
    });
    
    this.messageService.add({
      severity: 'success',
      summary: 'Instances Added',
      detail: `${addedCount} funding instance${addedCount > 1 ? 's' : ''} added successfully`,
      life: 3000
    });
  }

  private addFundingInstance(instance: ExistingInstance) {
    // Apply the selected instance data to create a new funding instance
    const fundingData = instance.data;
    
    // Determine the funding type based on current context or instance data
    let fundingType: string = this.currentFundingTypeForExisting || 'acat'; // use current type if set
    
    if (!this.currentFundingTypeForExisting) {
      // Auto-determine type if not specified
      if (fundingData.bankName || fundingData.routingNumber) {
        fundingType = 'ach';
      } else if (fundingData.institutionName) {
        fundingType = 'acat';
      }
    }

    // Add the funding instance to the appropriate type
    const fundingInstances = this.fundingInstances as any;
    fundingInstances[fundingType].push({
      ...fundingData,
      type: fundingType,
      typeName: (this.fundingTypeNames as any)[fundingType],
      id: `${fundingType}-${Date.now()}-${Math.random()}` // Generate unique ID
    });

    this.updateFormData();
  }

  onExistingModalClosed() {
    this.showExistingModal = false;
    this.currentFundingTypeForExisting = '';
  }

  getCurrentRegistration(): string {
    // Map entity IDs to registration names
    const registrationMap: { [key: string]: string } = {
      'john-smith': 'Joint Registration',
      'mary-smith': 'Joint Registration',
      'smith-trust': 'Trust Registration',
      'joint-account': 'Joint Registration',
      'roth-ira-account': 'Roth Registration',
      'trust-account': 'Trust Registration'
    };
    
    return registrationMap[this.entityId] || 'Unknown Registration';
  }

  // Filter methods for AutoComplete components
  filterTransferTypeOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTransferTypeOptions = this.transferTypeOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterAchFrequencyOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAchFrequencyOptions = this.achFrequencyOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterWithdrawalFrequencyOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredWithdrawalFrequencyOptions = this.withdrawalFrequencyOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterContributionFrequencyOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredContributionFrequencyOptions = this.contributionFrequencyOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  // Check if a field should be highlighted as missing
  shouldHighlightMissingField(fieldName: string): boolean {
    if (!this.highlightMissingFields) return false;
    
    // For funding, we don't typically have required fields that need highlighting
    // This can be expanded if needed for specific required fields
    return false;
  }
}