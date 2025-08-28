import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, SharedModule } from 'primeng/api';

// Local Imports
import { FormData } from '../../../../shared/models/types';
import { ExistingInstanceModalComponent, ExistingInstance } from '../../../../shared/components/existing-instance-modal/existing-instance-modal.component';
import { ExistingInstancesService } from '../../../../shared/services/existing-instances.service';
import { TrusteeDropdownComponent } from '../../../../shared/components/trustee-dropdown/trustee-dropdown.component';
import { BeneficiaryDropdownComponent } from '../../../../shared/components/beneficiary-dropdown/beneficiary-dropdown.component';
import { TrusteeStorageService, StoredTrustee } from '../../../../shared/services/trustee-storage.service';
import { BeneficiaryStorageService, StoredBeneficiary } from '../../../../shared/services/beneficiary-storage.service';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-account-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    AutoCompleteModule,
    InputTextareaModule,
    CheckboxModule,
    FileUploadModule,
    CardModule,
    InputMaskModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    SharedModule,
    ExistingInstanceModalComponent,
    TrusteeDropdownComponent,
    BeneficiaryDropdownComponent
  ],
  providers: [MessageService, ExistingInstancesService, TrusteeStorageService, BeneficiaryStorageService],
  template: `
    <div class="account-setup-section">
      <p-toast></p-toast>
      
      <!-- Edit Mode - Form -->
      <form *ngIf="!isReviewMode" [formGroup]="accountForm" (ngSubmit)="onSubmit()">
        
        <!-- Account Setup Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">Account Information</div>
          </ng-template>
          <div class="grid compact-form-grid">
            <!-- Row 1: Account Type and Account Profile -->
            <div class="col-12 md:col-6">
              <label for="accountType" class="block text-900 font-medium mb-1">
                Account Type <span class="text-red-500">*</span>
              </label>
              <p-autoComplete
                inputId="accountType"
                formControlName="accountType"
                [suggestions]="filteredAccountTypeOptions"
                (completeMethod)="filterAccountTypeOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Select account type"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('accountType')}"
                styleClass="w-full compact-autocomplete"
                (onSelect)="onAccountTypeChange($event)"
                [class.ng-invalid]="accountForm.get('accountType')?.invalid && accountForm.get('accountType')?.touched">
              </p-autoComplete>
              <small class="p-error" *ngIf="accountForm.get('accountType')?.invalid && accountForm.get('accountType')?.touched">
                Account type is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="accountProfile" class="block text-900 font-medium mb-1">
                Account Profile
              </label>
              <p-autoComplete
                inputId="accountProfile"
                formControlName="accountProfile"
                [suggestions]="filteredAccountProfileOptions"
                (completeMethod)="filterAccountProfileOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Select account profile"
                styleClass="w-full compact-autocomplete">
              </p-autoComplete>
            </div>
            
            <!-- Row 2: Investment Objective and Time Horizon -->
            <div class="col-12 md:col-6">
              <label for="investmentObjective" class="block text-900 font-medium mb-1">
                Investment Objective <span class="text-red-500">*</span>
              </label>
              <p-autoComplete
                inputId="investmentObjective"
                formControlName="investmentObjective"
                [suggestions]="filteredInvestmentObjectiveOptions"
                (completeMethod)="filterInvestmentObjectiveOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Please select one"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="accountForm.get('investmentObjective')?.invalid && accountForm.get('investmentObjective')?.touched">
              </p-autoComplete>
              <small class="p-error" *ngIf="accountForm.get('investmentObjective')?.invalid && accountForm.get('investmentObjective')?.touched">
                Investment objective is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="timeHorizon" class="block text-900 font-medium mb-1">
                Time Horizon
              </label>
              <p-autoComplete
                inputId="timeHorizon"
                formControlName="timeHorizon"
                [suggestions]="filteredTimeHorizonOptions"
                (completeMethod)="filterTimeHorizonOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Please select one"
                styleClass="w-full compact-autocomplete">
              </p-autoComplete>
            </div>
            
            <!-- Row 3: Risk Tolerance and Liquidity Needs -->
            <div class="col-12 md:col-6">
              <label for="riskTolerance" class="block text-900 font-medium mb-1">
                Risk Tolerance <span class="text-red-500">*</span>
              </label>
              <p-autoComplete
                inputId="riskTolerance"
                formControlName="riskTolerance"
                [suggestions]="filteredRiskToleranceOptions"
                (completeMethod)="filterRiskToleranceOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('riskTolerance')}"
                placeholder="Risk Tolerance for This Account"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="accountForm.get('riskTolerance')?.invalid && accountForm.get('riskTolerance')?.touched">
              </p-autoComplete>
              <small class="p-error" *ngIf="accountForm.get('riskTolerance')?.invalid && accountForm.get('riskTolerance')?.touched">
                Risk tolerance is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="liquidityTiming" class="block text-900 font-medium mb-1">
                When do you anticipate needing to withdraw funds?
              </label>
              <input
                pInputText
                id="liquidityTiming"
                formControlName="liquidityTiming"
                placeholder="Enter timing (e.g., 5-10 years)"
                class="w-full" />
            </div>
            
            <!-- Row 4: Primary Goals (full width) -->
            <div class="col-12">
              <label for="primaryGoals" class="block text-900 font-medium mb-1">
                Primary Goals
              </label>
              <textarea
                pInputTextarea
                id="primaryGoals"
                formControlName="primaryGoals"
                placeholder="Describe your primary investment goals for this account"
                rows="2"
                class="w-full">
              </textarea>
            </div>
          </div>
        </p-card>

        <!-- Source of Funds Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">Source of Funds</div>
          </ng-template>
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="initialSourceOfFunds" class="block text-900 font-medium mb-2">
                Initial Source of Funds <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="initialSourceOfFunds"
                formControlName="initialSourceOfFunds"
                placeholder="Enter initial source of funds"
                class="w-full"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('initialSourceOfFunds')}"
                [class.ng-invalid]="accountForm.get('initialSourceOfFunds')?.invalid && accountForm.get('initialSourceOfFunds')?.touched" />
              <small class="p-error" *ngIf="accountForm.get('initialSourceOfFunds')?.invalid && accountForm.get('initialSourceOfFunds')?.touched">
                Initial source of funds is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="investmentAmount" class="block text-900 font-medium mb-2">
                Investment Amount <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="investmentAmount"
                formControlName="investmentAmount"
                placeholder="Enter investment amount"
                class="w-full"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('investmentAmount')}"
                [class.ng-invalid]="accountForm.get('investmentAmount')?.invalid && accountForm.get('investmentAmount')?.touched" />
              <small class="p-error" *ngIf="accountForm.get('investmentAmount')?.invalid && accountForm.get('investmentAmount')?.touched">
                Investment amount is required
              </small>
            </div>
          </div>
        </p-card>

        <!-- Document Upload Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">Document Upload</div>
          </ng-template>
          <div class="grid">
            <div class="col-12 md:col-6">
              <label class="block text-900 font-medium mb-2">
                Upload Document
              </label>
              <p-fileUpload
                mode="basic"
                accept="image/*,.pdf"
                chooseLabel="Choose Document">
              </p-fileUpload>
            </div>
          </div>
        </p-card>

        <!-- Trust Information Card (Only for Trust Accounts) -->
        <p-card header="Trust Information" class="mb-4" *ngIf="isTrustAccount">
          <div class="grid">
            <div class="col-12">
              <label for="trustName" class="block text-900 font-medium mb-2">
                Trust Name <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="trustName"
                formControlName="trustName"
                placeholder="Enter full legal trust name"
                class="w-full"
                [class.ng-invalid]="accountForm.get('trustName')?.invalid && accountForm.get('trustName')?.touched" />
              <small class="p-error" *ngIf="accountForm.get('trustName')?.invalid && accountForm.get('trustName')?.touched">
                Trust name is required
              </small>
            </div>
          </div>
        </p-card>

        <!-- Trustees Card (Only for Trust Accounts) -->
        <p-card header="Trustees" class="mb-4" *ngIf="isTrustAccount">
          <div class="funding-simple-section">
            
            <!-- Copy Dropdown Mode - Trustee Dropdown -->
            <div *ngIf="copyDropdownsMode" class="copy-dropdown-section">
              <app-trustee-dropdown
                [formData]="formData"
                [disabled]="isReviewMode"
                (trusteeSelected)="onTrusteeSelected($event)">
              </app-trustee-dropdown>
            </div>

            <!-- Regular Mode - Add Trustee Button -->
            <div *ngIf="!copyDropdownsMode" class="section-header">
              <h4 class="section-title">Manage Trustees</h4>
              <div class="section-actions">
                <button class="add-existing-btn" (click)="showExistingTrusteesModal()">
                  <i class="fa-solid fa-clock-rotate-left"></i> Add Existing
                </button>
                <button class="add-new-link" (click)="handleAddTrustee()">
                  <i class="fa-solid fa-plus"></i> Add New
                </button>
              </div>
            </div>

            <!-- Trustee Form -->
            <div *ngIf="showTrusteeForm" class="mt-4">
              <p-card header="{{editingTrusteeIndex >= 0 ? 'Edit Trustee' : 'New Trustee'}}" class="mb-4">
                <form [formGroup]="trusteeForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="trusteeName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="trusteeName"
                        formControlName="name"
                        placeholder="Full name"
                        class="w-full" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="trusteeRole" class="block text-900 font-medium mb-2">Role <span class="text-red-500">*</span></label>
                      <p-autoComplete
                        inputId="trusteeRole"
                        formControlName="role"
                        [suggestions]="filteredTrusteeRoleOptions"
                        (completeMethod)="filterTrusteeRoles($event)"
                        field="label"
                        [dropdown]="true"
                        [forceSelection]="true"
                        placeholder="Select role"
                        styleClass="w-full compact-autocomplete">
                      </p-autoComplete>
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="trusteePhone" class="block text-900 font-medium mb-2">Phone <span class="text-red-500">*</span></label>
                      <p-inputMask
                        inputId="trusteePhone"
                        formControlName="phone"
                        mask="(999) 999-9999"
                        placeholder="(XXX) XXX-XXXX"
                        styleClass="w-full compact-autocomplete">
                      </p-inputMask>
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="trusteeEmail" class="block text-900 font-medium mb-2">Email</label>
                      <input
                        pInputText
                        id="trusteeEmail"
                        type="email"
                        formControlName="email"
                        placeholder="Email address"
                        class="w-full" />
                    </div>
                    <div class="col-12">
                      <label for="trusteeAddress" class="block text-900 font-medium mb-2">Address <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="trusteeAddress"
                        formControlName="address"
                        placeholder="Full address"
                        class="w-full" />
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- Form Action Buttons -->
              <div class="flex gap-2 justify-content-end mb-4">
                <p-button 
                  label="Cancel" 
                  severity="secondary" 
                  (onClick)="cancelTrusteeForm()">
                </p-button>
                <p-button 
                  [label]="editingTrusteeIndex >= 0 ? 'Update Trustee' : 'Save Trustee'"
                  (onClick)="saveTrustee()">
                </p-button>
              </div>
            </div>

            <!-- Trustees Grid -->
            <div class="simple-table" *ngIf="trustees.length > 0">
              <div class="table-header">
                <div class="col-name">Name</div>
                <div class="col-role">Role</div>
                <div class="col-phone">Phone</div>
                <div class="col-actions"></div>
              </div>
              <div *ngFor="let trustee of trustees; let i = index" class="table-row">
                <div class="col-name">{{trustee.name}}</div>
                <div class="col-role">{{trustee.role}}</div>
                <div class="col-phone">{{trustee.phone}}</div>
                <div class="col-actions">
                  <button class="icon-btn" (click)="editTrustee(i)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                  <button class="icon-btn danger" (click)="deleteTrustee(i)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
            </div>
            
            <!-- Empty State for Trustees -->
            <div *ngIf="trustees.length === 0 && !showTrusteeForm" class="enterprise-empty-state">
              <div class="empty-state-content">
                <div class="empty-state-icon">
                  <i class="fa-solid fa-users"></i>
                </div>
                <h3 class="empty-state-title">No Trustees Added</h3>
                <p class="empty-state-description">
                  Add trustees to manage this trust account
                </p>
                <div class="empty-state-actions">
                  <p-button 
                    label="Add New" 
                    icon="fa-solid fa-plus"
                    styleClass="empty-state-button"
                    (onClick)="handleAddTrustee()">
                  </p-button>
                </div>
              </div>
            </div>

          </div>
        </p-card>

        <!-- Beneficiaries Card (Only for IRA Accounts) -->
        <p-card header="Beneficiaries" class="mb-4" *ngIf="isIraAccount">
          <div class="funding-simple-section">
            
            <!-- Copy Dropdown Mode - Beneficiary Dropdown -->
            <div *ngIf="copyDropdownsMode" class="copy-dropdown-section">
              <app-beneficiary-dropdown
                [formData]="formData"
                [disabled]="isReviewMode"
                (beneficiarySelected)="onBeneficiarySelected($event)">
              </app-beneficiary-dropdown>
            </div>

            <!-- Regular Mode - Add Beneficiary Buttons -->
            <div *ngIf="!copyDropdownsMode" class="section-header">
              <h4 class="section-title">Manage Beneficiaries</h4>
              <div class="section-actions">
                <button class="add-existing-btn" (click)="showExistingBeneficiariesModal()">
                  <i class="fa-solid fa-clock-rotate-left"></i> Add Existing
                </button>
                <button class="add-new-link" (click)="handleAddBeneficiary()">
                  <i class="fa-solid fa-plus"></i> Add New
                </button>
              </div>
            </div>

            <!-- Beneficiary Form -->
            <div *ngIf="showBeneficiaryForm" class="mt-4">
              <p-card header="{{editingBeneficiaryIndex >= 0 ? 'Edit Beneficiary' : 'New Beneficiary'}}" class="mb-4">
                <form [formGroup]="beneficiaryForm">
                  <div class="grid">
                    <div class="col-12 md:col-6">
                      <label for="beneficiaryName" class="block text-900 font-medium mb-2">Name <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="beneficiaryName"
                        formControlName="name"
                        placeholder="Full name"
                        class="w-full" />
                    </div>
                    <div class="col-12 md:col-6">
                      <label for="beneficiaryRelationship" class="block text-900 font-medium mb-2">Relationship <span class="text-red-500">*</span></label>
                      <p-autoComplete
                        inputId="beneficiaryRelationship"
                        formControlName="relationship"
                        [suggestions]="filteredRelationshipOptions"
                (completeMethod)="filterRelationshipOptions($event)"
                        field="label"
                        [dropdown]="true"
                        [forceSelection]="true"
                        placeholder="Select relationship"
                        styleClass="w-full compact-autocomplete">
                      </p-autoComplete>
                    </div>
                    <div class="col-12 md:col-4">
                      <label for="beneficiaryPercentage" class="block text-900 font-medium mb-2">Percentage <span class="text-red-500">*</span></label>
                      <input
                        pInputText
                        id="beneficiaryPercentage"
                        type="number"
                        formControlName="percentage"
                        placeholder="0"
                        min="1"
                        max="100"
                        class="w-full" />
                    </div>
                    <div class="col-12 md:col-4">
                      <label for="beneficiaryDob" class="block text-900 font-medium mb-2">Date of Birth <span class="text-red-500">*</span></label>
                      <p-calendar
                        inputId="beneficiaryDob"
                        formControlName="dateOfBirth"
                        dateFormat="mm/dd/yy"
                        [showIcon]="true"
                        [maxDate]="maxDate"
                        placeholder="Select date"
                        styleClass="w-full compact-autocomplete">
                      </p-calendar>
                    </div>
                    <div class="col-12 md:col-4">
                      <label for="beneficiarySsn" class="block text-900 font-medium mb-2">SSN <span class="text-red-500">*</span></label>
                      <p-inputMask
                        inputId="beneficiarySsn"
                        formControlName="ssn"
                        mask="999-99-9999"
                        placeholder="XXX-XX-XXXX"
                        styleClass="w-full compact-autocomplete">
                      </p-inputMask>
                    </div>
                    <div class="col-12">
                      <label for="beneficiaryAddress" class="block text-900 font-medium mb-2">Address</label>
                      <input
                        pInputText
                        id="beneficiaryAddress"
                        formControlName="address"
                        placeholder="Full address"
                        class="w-full" />
                    </div>
                  </div>
                </form>
              </p-card>
              
              <!-- Form Action Buttons -->
              <div class="flex gap-2 justify-content-end mb-4">
                <p-button 
                  label="Cancel" 
                  severity="secondary" 
                  (onClick)="cancelBeneficiaryForm()">
                </p-button>
                <p-button 
                  [label]="editingBeneficiaryIndex >= 0 ? 'Update Beneficiary' : 'Save Beneficiary'"
                  (onClick)="saveBeneficiary()">
                </p-button>
              </div>
            </div>

            <!-- Beneficiaries Grid -->
            <div class="simple-table" *ngIf="beneficiaries.length > 0">
              <div class="table-header">
                <div class="col-name">Name</div>
                <div class="col-relationship">Relationship</div>
                <div class="col-percentage">Percentage</div>
                <div class="col-actions"></div>
              </div>
              <div *ngFor="let beneficiary of beneficiaries; let i = index" class="table-row">
                <div class="col-name">{{beneficiary.name || 'Beneficiary ' + (i + 1)}}</div>
                <div class="col-relationship">{{beneficiary.relationship || 'Not specified'}}</div>
                <div class="col-percentage">{{beneficiary.percentage || 0}}%</div>
                <div class="col-actions">
                  <button class="icon-btn" (click)="editBeneficiary(i)" pTooltip="Edit" tooltipPosition="top"><i class="fa-regular fa-pen-to-square"></i></button>
                  <button class="icon-btn danger" (click)="deleteBeneficiary(i)" pTooltip="Delete" tooltipPosition="top"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
            </div>
            
            <!-- Empty State for Beneficiaries -->
            <div *ngIf="beneficiaries.length === 0" class="enterprise-empty-state">
              <div class="empty-state-content">
                <div class="empty-state-icon">
                  <i class="fa-regular fa-heart"></i>
                </div>
                <h3 class="empty-state-title">No Beneficiaries Added</h3>
                <p class="empty-state-description">
                  Add beneficiaries for this IRA account
                </p>
                <div class="empty-state-actions">
                  <p-button 
                    label="Add New" 
                    icon="fa-solid fa-plus"
                    styleClass="empty-state-button"
                    (onClick)="handleAddBeneficiary()">
                  </p-button>
                </div>
              </div>
            </div>

          </div>
        </p-card>

      </form>

      <!-- Review Mode - Comprehensive Display -->
      <div *ngIf="isReviewMode" class="review-mode-container">
        
        <!-- Account Setup Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Account Info</div>
            <p-button 
              [label]="sectionEditMode['account-setup'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['account-setup'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['account-setup'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('account-setup')">
            </p-button>
          </div>
          <!-- Account Setup - Edit Mode -->
          <div *ngIf="sectionEditMode['account-setup']" class="grid">
            <div class="col-12 md:col-6">
              <label for="accountType" class="block text-900 font-medium mb-2">
                Account Type <span class="text-red-500">*</span>
              </label>
              <p-autoComplete
                inputId="accountType"
                formControlName="accountType"
                [suggestions]="filteredAccountTypeOptions"
                (completeMethod)="filterAccountTypeOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Select account type"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('accountType')}"
                styleClass="w-full compact-autocomplete"
                (onSelect)="onAccountTypeChange($event)"
                [class.ng-invalid]="accountForm.get('accountType')?.invalid && accountForm.get('accountType')?.touched">
              </p-autoComplete>
              <small class="p-error" *ngIf="accountForm.get('accountType')?.invalid && accountForm.get('accountType')?.touched">
                Account type is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="accountProfile" class="block text-900 font-medium mb-2">
                Account Profile
              </label>
              <p-autoComplete
                inputId="accountProfile"
                formControlName="accountProfile"
                [suggestions]="filteredAccountProfileOptions"
                (completeMethod)="filterAccountProfileOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Select account profile"
                styleClass="w-full compact-autocomplete">
              </p-autoComplete>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="investmentObjective" class="block text-900 font-medium mb-2">
                Primary Investment Objective for This Account <span class="text-red-500">*</span>
              </label>
              <p-autoComplete
                inputId="investmentObjective"
                formControlName="investmentObjective"
                [suggestions]="filteredInvestmentObjectiveOptions"
                (completeMethod)="filterInvestmentObjectiveOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                placeholder="Select investment objective"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('investmentObjective')}"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="accountForm.get('investmentObjective')?.invalid && accountForm.get('investmentObjective')?.touched">
              </p-autoComplete>
              <small class="p-error" *ngIf="accountForm.get('investmentObjective')?.invalid && accountForm.get('investmentObjective')?.touched">
                Investment objective is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="riskTolerance" class="block text-900 font-medium mb-2">
                Risk Tolerance <span class="text-red-500">*</span>
              </label>
              <p-autoComplete
                inputId="riskTolerance"
                formControlName="riskTolerance"
                [suggestions]="filteredRiskToleranceOptions"
                (completeMethod)="filterRiskToleranceOptions($event)"
                field="label"
                [dropdown]="true"
                [forceSelection]="true"
                [ngClass]="{'highlight-missing-field': shouldHighlightMissingField('riskTolerance')}"
                placeholder="Select risk tolerance"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="accountForm.get('riskTolerance')?.invalid && accountForm.get('riskTolerance')?.touched">
              </p-autoComplete>
              <small class="p-error" *ngIf="accountForm.get('riskTolerance')?.invalid && accountForm.get('riskTolerance')?.touched">
                Risk tolerance is required
              </small>
            </div>
          </div>

          <!-- Account Setup - Review Mode -->
          <div *ngIf="!sectionEditMode['account-setup']" class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Account Type</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !accountForm.get('accountType')?.value}">
                {{getFieldDisplayValue('accountType', accountTypeOptions) || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Account Profile</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !accountForm.get('accountProfile')?.value}">
                {{getFieldDisplayValue('accountProfile', accountProfileOptions) || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Primary Investment Objective</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !accountForm.get('investmentObjective')?.value}">
                {{getFieldDisplayValue('investmentObjective', investmentObjectiveOptions) || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Risk Tolerance</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !accountForm.get('riskTolerance')?.value}">
                {{getFieldDisplayValue('riskTolerance', riskToleranceOptions) || 'Required field missing'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Source of Funds Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Source of Funds</div>
            <p-button 
              [label]="sectionEditMode['source-of-funds'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['source-of-funds'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['source-of-funds'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('source-of-funds')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Initial Source of Funds</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !accountForm.get('initialSourceOfFunds')?.value}">
                {{accountForm.get('initialSourceOfFunds')?.value || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Investment Amount</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !accountForm.get('investmentAmount')?.value}">
                {{accountForm.get('investmentAmount')?.value || 'Required field missing'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Document Upload Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Document Upload</div>
            <p-button 
              [label]="sectionEditMode['document-upload'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['document-upload'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['document-upload'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('document-upload')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Uploaded Documents</div>
              <div class="review-field-value">
                No documents uploaded
              </div>
            </div>
          </div>
        </div>

        <!-- Trust Information Section -->
        <div *ngIf="isTrustAccount" class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Trust Information</div>
            <p-button 
              [label]="sectionEditMode['trust-info'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['trust-info'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['trust-info'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('trust-info')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Trust Name</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !accountForm.get('trustName')?.value}">
                {{accountForm.get('trustName')?.value || 'Required field missing'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Trustees Section -->
        <div *ngIf="isTrustAccount" class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Trustees</div>
            <p-button 
              [label]="sectionEditMode['trustees'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['trustees'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['trustees'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('trustees')">
            </p-button>
          </div>
          <div *ngIf="trustees.length > 0" class="review-mode-grid">
            <div *ngFor="let trustee of trustees; let i = index" class="review-field-group">
              <div class="review-field-label">Trustee {{i + 1}}</div>
              <div class="review-field-value">
                <strong>{{trustee.name}}</strong><br>
                Role: {{trustee.role}}<br>
                Phone: {{trustee.phone}}<br>
                <span *ngIf="trustee.email">Email: {{trustee.email}}<br></span>
                Address: {{trustee.address}}
              </div>
            </div>
          </div>
          <div *ngIf="trustees.length === 0" class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Trustees</div>
              <div class="review-field-value empty">
                No trustees added
              </div>
            </div>
          </div>
        </div>

        <!-- Beneficiaries Section -->
        <div *ngIf="isIraAccount" class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Beneficiaries</div>
            <p-button 
              [label]="sectionEditMode['beneficiaries'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['beneficiaries'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['beneficiaries'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('beneficiaries')">
            </p-button>
          </div>
          <div *ngIf="beneficiaries.length > 0" class="review-mode-grid">
            <div *ngFor="let beneficiary of beneficiaries; let i = index" class="review-field-group">
              <div class="review-field-label">Beneficiary {{i + 1}}</div>
              <div class="review-field-value">
                <strong>{{beneficiary.name}}</strong><br>
                Relationship: {{beneficiary.relationship}}<br>
                Percentage: {{beneficiary.percentage}}%<br>
                DOB: {{beneficiary.dateOfBirth | date:'shortDate'}}<br>
                SSN: {{beneficiary.ssn}}<br>
                <span *ngIf="beneficiary.address">Address: {{beneficiary.address}}</span>
              </div>
            </div>
          </div>
          <div *ngIf="beneficiaries.length === 0" class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Beneficiaries</div>
              <div class="review-field-value empty">
                No beneficiaries added
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Existing Instances Modal -->
      <app-existing-instance-modal
        [(visible)]="showExistingModal"
        [instanceType]="currentModalInstanceType"
        [instances]="existingInstances"
        [enableMultiSelect]="true"
        (instanceSelected)="onExistingInstanceSelected($event)"
        (instancesSelected)="onExistingInstancesSelected($event)"
        (modalClosed)="onExistingModalClosed()">
      </app-existing-instance-modal>
    </div>
  `,
  styles: [`
    /* Copy exact styles from funding component */
    .account-setup-section {
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

    .funding-buttons-container {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .funding-button-wrapper {
      flex: 0 0 auto;
    }

    .funding-type-button {
      background: #3b82f6;
      color: white;
      border: 2px solid #3b82f6;
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

    .funding-type-button:hover {
      background: #2563eb;
      border-color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .funding-type-name {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .funding-type-name i {
      font-size: 0.875rem;
    }

    /* Section header styles to match funding sections */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-title {
      font-weight: 600;
      font-size: 1.1rem;
      color: #111827;
      margin: 0;
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

    /* Simple table styles to match funding sections */
    .simple-table {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      background: #f9fafb;
      margin-top: 1rem;
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

    /* Column specific styles */
    .col-name { font-weight: 500; color: #111827; }
    .col-role, .col-phone, .col-relationship, .col-percentage { color: #374151; }
    .col-actions { 
      text-align: right; 
      display: flex; 
      justify-content: flex-end; 
      gap: 0.25rem; 
    }
    
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

    /* Funding simple section styles */
    .funding-simple-section {
      padding: 0;
    }

    .funding-instances-table {
      border: 1px solid var(--surface-border);
      border-radius: 6px;
      overflow: hidden;
    }

    .action-button {
      background: none;
      border: none;
      padding: 0.375rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-color-secondary);
    }

    .edit-button:hover {
      background: var(--blue-50);
      color: var(--blue-600);
    }

    .delete-button:hover {
      background: var(--red-50);
      color: var(--red-600);
    }

    .enterprise-empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-color-secondary);
    }

    .empty-state-icon {
      font-size: 3rem;
      color: var(--text-color-secondary);
      margin-bottom: 1rem;
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

    /* Review Mode Styles */
    .review-field {
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-weight: 500;
      color: var(--text-color);
      min-height: 42px;
      display: flex;
      align-items: center;
    }

    .review-field.missing-required {
      background: #fef2f2;
      border-color: #f87171;
      color: #dc2626;
    }

    .missing-field-warning {
      color: #dc2626;
      font-size: 0.75rem;
      font-weight: 500;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .missing-field-warning i {
      font-size: 0.875rem;
    }
    
    /* Highlight missing required fields with red border */
    .highlight-missing-field {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1) !important;
    }
    
    .highlight-missing-field:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2) !important;
    }

    /* Custom card header styling */
    .card-header-custom {
      background: #f8f9fa !important;
      border-bottom: 1px solid #e9ecef !important;
      padding: 1rem !important;
      font-weight: 600 !important;
      color: #495057 !important;
      font-size: 1.1rem !important;
      display: block !important;
      width: 100% !important;
      margin: 0 !important;
    }
    
    /* Force template header to display */
    :host :deep(.p-card .p-card-header .card-header-custom) {
      display: block !important;
      visibility: visible !important;
    }

    /* Ensure card headers are visible */
    :host :deep(.p-card .p-card-header) {
      display: block !important;
      visibility: visible !important;
      background: #f8f9fa !important;
      border-bottom: 1px solid #e9ecef !important;
      padding: 1rem !important;
      font-weight: 600 !important;
      color: #495057 !important;
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

    /* Existing Instance Button Styles */
    .funding-type-button.existing-instance-button {
      background: #0A8DFF;
      border-color: #0A8DFF;
    }

    .funding-type-button.existing-instance-button:hover {
      background: #087AE6;
      border-color: #087AE6;
    }

    /* Copy Dropdown Section Styles */
    .copy-dropdown-section {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 2px dashed #dee2e6;
    }

    .copy-dropdown-section:hover {
      border-color: #6c757d;
      background: #f1f3f4;
    }
    
    /* Compact form grid styles */
    .compact-form-grid {
      row-gap: 0.5rem !important; /* Further reduced from 1rem */
    }
    
    .compact-form-grid .col-12,
    .compact-form-grid .col-12.md\\:col-6 {
      margin-bottom: 0.5rem; /* Further reduced field spacing */
    }
    
    .compact-form-grid label {
      margin-bottom: 0.125rem !important; /* Even tighter label spacing */
    }
    
    .compact-autocomplete {
      font-size: 0.9rem; /* Slightly smaller font for compactness */
    }
    
    /* Reduce card spacing for account setup */
    .account-setup-section p-card {
      margin-bottom: 1rem !important; /* Reduced from default 1.5rem */
    }
    
    .account-setup-section .p-card .p-card-body {
      padding: 1rem !important; /* Reduced padding */
    }
    
    .account-setup-section .p-card .p-card-header {
      padding: 0.75rem 1rem !important; /* Reduced header padding */
    }
    
    /* Reduce spacing for form controls and error messages */
    .account-setup-section .p-error {
      margin-top: 0.125rem !important; /* Reduced error message spacing */
      font-size: 0.775rem !important; /* Smaller error text */
    }
    
    .account-setup-section .p-inputtext,
    .account-setup-section .p-autocomplete,
    .account-setup-section .p-calendar {
      margin-bottom: 0.25rem !important; /* Reduced input spacing */
    }
    
    .account-setup-section .mb-1 {
      margin-bottom: 0.25rem !important; /* Override mb-1 class for tighter spacing */
    }
  `]
})
export class AccountSetupComponent implements OnInit, OnChanges {
  @Input() formData: FormData = {};
  @Input() entityId: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() copyDropdownsMode: boolean = false;
  @Input() highlightMissingFields: boolean = false;
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() disableQuickReview = new EventEmitter<void>();

  accountForm!: FormGroup;
  isTrustAccount: boolean = false;
  isIraAccount: boolean = false;
  trustees: any[] = [];
  beneficiaries: any[] = [];
  showTrusteeForm: string | null = null;
  showBeneficiaryForm: string | null = null;
  trusteeForm!: FormGroup;
  beneficiaryForm!: FormGroup;
  editingTrusteeIndex: number = -1;
  editingBeneficiaryIndex: number = -1;
  maxDate: Date = new Date();

  // Existing instances functionality
  showExistingModal = false;
  existingInstances: ExistingInstance[] = [];
  currentModalInstanceType: 'beneficiary' | 'trustee' = 'beneficiary';

  // Filtered arrays for AutoComplete components
  filteredAccountTypeOptions: DropdownOption[] = [];
  filteredAccountProfileOptions: DropdownOption[] = [];
  filteredInvestmentObjectiveOptions: DropdownOption[] = [];
  filteredTimeHorizonOptions: DropdownOption[] = [];
  filteredRiskToleranceOptions: DropdownOption[] = [];
  filteredRelationshipOptions: DropdownOption[] = [];

  // Section edit mode tracking
  sectionEditMode: { [key: string]: boolean } = {
    'account-setup': false,
    'source-of-funds': false,
    'document-upload': false,
    'trust-info': false,
    'trustees': false,
    'beneficiaries': false
  };

  // Dropdown options
  accountTypeOptions: DropdownOption[] = [
    { label: 'Joint Taxable Account', value: 'joint-taxable' },
    { label: 'Individual Taxable Account', value: 'individual-taxable' },
    { label: 'Trust Account', value: 'trust' },
    { label: 'IRA', value: 'ira' },
    { label: 'Roth IRA', value: 'roth-ira' },
    { label: 'Traditional IRA', value: 'traditional-ira' }
  ];

  investmentObjectiveOptions: DropdownOption[] = [
    { label: 'Growth', value: 'growth' },
    { label: 'Income', value: 'income' },
    { label: 'Balanced', value: 'balanced' },
    { label: 'Capital Preservation', value: 'preservation' },
    { label: 'Speculation', value: 'speculation' }
  ];

  riskToleranceOptions: DropdownOption[] = [
    { label: 'Conservative', value: 'conservative' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Aggressive', value: 'aggressive' },
    { label: 'Very Aggressive', value: 'very-aggressive' }
  ];

  timeHorizonOptions: DropdownOption[] = [
    { label: 'Less than 1 year', value: 'less-1' },
    { label: '1-3 years', value: '1-3' },
    { label: '3-5 years', value: '3-5' },
    { label: '5-10 years', value: '5-10' },
    { label: 'More than 10 years', value: 'more-10' }
  ];

  accountProfileOptions: DropdownOption[] = [
    { label: 'Conservative', value: 'conservative' },
    { label: 'Moderate Conservative', value: 'moderate-conservative' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Moderate Aggressive', value: 'moderate-aggressive' },
    { label: 'Aggressive', value: 'aggressive' }
  ];

  trusteeRoleOptions: DropdownOption[] = [
    { label: 'Trustee', value: 'trustee' },
    { label: 'Co-Trustee', value: 'co-trustee' },
    { label: 'Successor Trustee', value: 'successor-trustee' }
  ];

  filteredTrusteeRoleOptions: DropdownOption[] = [];

  relationshipOptions: DropdownOption[] = [
    { label: 'Spouse', value: 'spouse' },
    { label: 'Child', value: 'child' },
    { label: 'Parent', value: 'parent' },
    { label: 'Sibling', value: 'sibling' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private fb: FormBuilder, 
    private messageService: MessageService,
    private existingInstancesService: ExistingInstancesService,
    private trusteeStorageService: TrusteeStorageService,
    private beneficiaryStorageService: BeneficiaryStorageService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadFormData();
    this.setupFormSubscriptions();
    // Initialize filtered options
    this.filteredTrusteeRoleOptions = [...this.trusteeRoleOptions];
    this.initializeFilteredOptions();
    // Add demo data if none exists
    this.addDemoDataIfNeeded();
  }

  private initializeFilteredOptions() {
    this.filteredAccountTypeOptions = [...this.accountTypeOptions];
    this.filteredAccountProfileOptions = [...this.accountProfileOptions];
    this.filteredInvestmentObjectiveOptions = [...this.investmentObjectiveOptions];
    this.filteredTimeHorizonOptions = [...this.timeHorizonOptions];
    this.filteredRiskToleranceOptions = [...this.riskToleranceOptions];
    this.filteredRelationshipOptions = [...this.relationshipOptions];
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['formData'] || changes['entityId']) && this.accountForm) {
      this.loadFormData();
      this.updateAccountType();
    }
  }

  private initializeForm() {
    this.accountForm = this.fb.group({
      // Account Setup
      accountType: ['', Validators.required],
      accountProfile: [''],
      investmentObjective: ['', Validators.required],
      liquidityTiming: [''],
      timeHorizon: [''],
      riskTolerance: ['', Validators.required],
      primaryGoals: [''],
      
      // Source of Funds
      initialSourceOfFunds: ['', Validators.required],
      investmentAmount: ['', Validators.required],
      
      // Document Upload
      uploadedDocuments: [''],
      
      // Trust-specific fields
      trustName: ['']
    });

    // Initialize trustee form
    this.trusteeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      address: ['', Validators.required]
    });

    // Initialize beneficiary form
    this.beneficiaryForm = this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      dateOfBirth: ['', Validators.required],
      ssn: ['', Validators.required],
      address: ['']
    });
  }

  private loadFormData() {
    if (this.formData && this.formData[this.entityId]) {
      const entityData = this.formData[this.entityId];
      this.accountForm.patchValue(entityData);
      
      // Check account type to show/hide conditional fields
      this.isTrustAccount = entityData.accountType === 'trust';
      this.isIraAccount = entityData.accountType === 'roth-ira' || entityData.accountType === 'ira' || entityData.accountType === 'traditional-ira';
      
      // Update field validators based on account type
      this.updateFieldValidators();
      
      // Load trustees and beneficiaries
      this.trustees = entityData['trustees'] || [];
      this.beneficiaries = entityData['beneficiaries'] || [];
      
    }
  }

  private setupFormSubscriptions() {
    this.accountForm.valueChanges.subscribe(() => {
      this.updateFormData();
    });
  }

  onAccountTypeChange(event: any) {
    // For p-autoComplete, event is the selected object with {label, value} structure
    const value = event?.value || event;
    this.isTrustAccount = value === 'trust';
    this.isIraAccount = value === 'roth-ira' || value === 'ira' || value === 'traditional-ira';
    
    // Update field validators based on account type
    this.updateFieldValidators();
  }

  private updateAccountType() {
    const accountType = this.accountForm.get('accountType')?.value;
    this.isTrustAccount = accountType === 'trust';
    this.isIraAccount = accountType === 'roth-ira' || accountType === 'ira' || accountType === 'traditional-ira';
    this.updateFieldValidators();
  }

  private updateFieldValidators() {
    const initialSourceOfFundsControl = this.accountForm.get('initialSourceOfFunds');
    const investmentAmountControl = this.accountForm.get('investmentAmount');
    const trustNameControl = this.accountForm.get('trustName');

    if (this.isTrustAccount) {
      // For trust accounts, source of funds fields are still required
      initialSourceOfFundsControl?.setValidators([Validators.required]);
      investmentAmountControl?.setValidators([Validators.required]);
      // Trust name becomes required
      trustNameControl?.setValidators([Validators.required]);
    } else {
      // For non-trust accounts, source of funds fields are required
      initialSourceOfFundsControl?.setValidators([Validators.required]);
      investmentAmountControl?.setValidators([Validators.required]);
      // Trust name is not required
      trustNameControl?.clearValidators();
    }

    // Update validity
    initialSourceOfFundsControl?.updateValueAndValidity();
    investmentAmountControl?.updateValueAndValidity();
    trustNameControl?.updateValueAndValidity();
  }

  handleAddTrustee() {
    this.showTrusteeForm = 'new';
    this.editingTrusteeIndex = -1;
    this.trusteeForm.reset();
  }

  editTrustee(index: number) {
    if (index >= 0 && index < this.trustees.length) {
      this.showTrusteeForm = 'edit';
      this.editingTrusteeIndex = index;
      this.trusteeForm.patchValue(this.trustees[index]);
    }
  }

  deleteTrustee(index: number) {
    if (index >= 0 && index < this.trustees.length) {
      this.trustees.splice(index, 1);
      this.updateFormData();
      this.messageService.add({
        severity: 'info',
        summary: 'Trustee Removed',
        detail: 'Trustee removed successfully',
        life: 2000
      });
    }
  }

  saveTrustee() {
    if (this.trusteeForm.valid) {
      const trusteeData = this.trusteeForm.value;
      
      if (this.editingTrusteeIndex >= 0) {
        // Update existing trustee
        this.trustees[this.editingTrusteeIndex] = trusteeData;
      } else {
        // Add new trustee
        this.trustees.push(trusteeData);
        
        // Also save to copy dropdown storage for future use
        if (trusteeData.name && trusteeData.role && trusteeData.phone && trusteeData.address) {
          this.trusteeStorageService.saveTrustee({
            label: `${trusteeData.name} - ${trusteeData.role}`,
            name: trusteeData.name,
            role: trusteeData.role,
            phone: trusteeData.phone,
            email: trusteeData.email || '',
            address: trusteeData.address
          });
        }
      }
      
      this.cancelTrusteeForm();
      this.updateFormData();
      
      this.messageService.add({
        severity: 'success',
        summary: this.editingTrusteeIndex >= 0 ? 'Trustee Updated' : 'Trustee Added',
        detail: this.editingTrusteeIndex >= 0 ? 'Trustee updated successfully' : 'New trustee added successfully',
        life: 2000
      });
    }
  }

  cancelTrusteeForm() {
    this.showTrusteeForm = null;
    this.editingTrusteeIndex = -1;
    this.trusteeForm.reset();
  }

  handleAddBeneficiary() {
    this.showBeneficiaryForm = 'new';
    this.editingBeneficiaryIndex = -1;
    this.beneficiaryForm.reset();
  }

  editBeneficiary(index: number) {
    if (index >= 0 && index < this.beneficiaries.length) {
      this.showBeneficiaryForm = 'edit';
      this.editingBeneficiaryIndex = index;
      this.beneficiaryForm.patchValue(this.beneficiaries[index]);
    }
  }

  saveBeneficiary() {
    if (this.beneficiaryForm.valid) {
      const beneficiaryData = this.beneficiaryForm.value;
      
      if (this.editingBeneficiaryIndex >= 0) {
        // Update existing beneficiary
        this.beneficiaries[this.editingBeneficiaryIndex] = beneficiaryData;
      } else {
        // Add new beneficiary
        this.beneficiaries.push(beneficiaryData);
        
        // Also save to copy dropdown storage for future use
        if (beneficiaryData.name && beneficiaryData.relationship && beneficiaryData.ssn) {
          this.beneficiaryStorageService.saveBeneficiary({
            label: `${beneficiaryData.name} - ${beneficiaryData.relationship} (${beneficiaryData.percentage}%)`,
            name: beneficiaryData.name,
            relationship: beneficiaryData.relationship,
            percentage: beneficiaryData.percentage || 0,
            dateOfBirth: beneficiaryData.dateOfBirth || '',
            ssn: beneficiaryData.ssn,
            address: beneficiaryData.address || ''
          });
        }
      }
      
      this.cancelBeneficiaryForm();
      this.updateFormData();
      
      this.messageService.add({
        severity: 'success',
        summary: this.editingBeneficiaryIndex >= 0 ? 'Beneficiary Updated' : 'Beneficiary Added',
        detail: this.editingBeneficiaryIndex >= 0 ? 'Beneficiary updated successfully' : 'New beneficiary added successfully',
        life: 2000
      });
    }
  }

  cancelBeneficiaryForm() {
    this.showBeneficiaryForm = null;
    this.editingBeneficiaryIndex = -1;
    this.beneficiaryForm.reset();
  }

  filterTrusteeRoles(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTrusteeRoleOptions = this.trusteeRoleOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  deleteBeneficiary(index: number) {
    if (index >= 0 && index < this.beneficiaries.length) {
      this.beneficiaries.splice(index, 1);
      this.updateFormData();
      this.messageService.add({
        severity: 'info',
        summary: 'Beneficiary Removed',
        detail: 'Beneficiary removed successfully',
        life: 2000
      });
    }
  }

  private updateFormData() {
    const updatedFormData = { ...this.formData };
    if (!updatedFormData[this.entityId]) {
      updatedFormData[this.entityId] = {};
    }
    
    Object.assign(updatedFormData[this.entityId], this.accountForm.value);
    
    // Update trustees and beneficiaries
    updatedFormData[this.entityId]['trustees'] = this.trustees;
    updatedFormData[this.entityId]['beneficiaries'] = this.beneficiaries;
    
    this.formDataChange.emit(updatedFormData);
  }

  getFieldDisplayValue(fieldName: string, options: DropdownOption[]): string {
    const fieldValue = this.accountForm.get(fieldName)?.value;
    if (!fieldValue) return '';
    
    const option = options.find(opt => opt.value === fieldValue);
    return option ? option.label : fieldValue;
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.updateFormData();
    }
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

  // Unified Existing Instances Event Handlers
  onExistingInstanceSelected(instance: ExistingInstance) {
    if (this.currentModalInstanceType === 'beneficiary') {
      this.onExistingBeneficiarySelected(instance);
    } else if (this.currentModalInstanceType === 'trustee') {
      this.onExistingTrusteeSelected(instance);
    }
  }

  onExistingInstancesSelected(instances: ExistingInstance[]) {
    if (this.currentModalInstanceType === 'beneficiary') {
      this.onExistingBeneficiariesSelected(instances);
    } else if (this.currentModalInstanceType === 'trustee') {
      this.onExistingTrusteesSelected(instances);
    }
  }

  // Existing Beneficiaries Modal Methods
  showExistingBeneficiariesModal() {
    this.currentModalInstanceType = 'beneficiary';
    // Collect all existing instances from the form data
    this.existingInstances = this.existingInstancesService.collectExistingInstances(this.formData);
    this.showExistingModal = true;
  }

  onExistingBeneficiarySelected(instance: ExistingInstance) {
    const result = this.addBeneficiaryInstance(instance);
    if (result.added) {
      this.messageService.add({
        severity: 'success',
        summary: 'Beneficiary Added',
        detail: `${result.name} added from ${instance.sourceRegistration}`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Beneficiary Already Exists',
        detail: `${result.name} is already added to this account`,
        life: 3000
      });
    }
    this.showExistingModal = false;
  }

  onExistingBeneficiariesSelected(instances: ExistingInstance[]) {
    let addedCount = 0;
    let skippedCount = 0;
    const addedNames: string[] = [];
    const skippedNames: string[] = [];

    instances.forEach(instance => {
      const result = this.addBeneficiaryInstance(instance);
      if (result.added) {
        addedCount++;
        addedNames.push(result.name);
      } else {
        skippedCount++;
        skippedNames.push(result.name);
      }
    });

    // Show success message for added beneficiaries
    if (addedCount > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Beneficiaries Added',
        detail: `${addedCount} beneficiar${addedCount > 1 ? 'ies' : 'y'} added successfully`,
        life: 3000
      });
    }

    // Show warning for skipped beneficiaries
    if (skippedCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Some Beneficiaries Already Exist',
        detail: `${skippedCount} beneficiar${skippedCount > 1 ? 'ies were' : 'y was'} already in this account`,
        life: 3000
      });
    }

    this.showExistingModal = false;
  }

  private addBeneficiaryInstance(instance: ExistingInstance): {added: boolean, name: string} {
    if (instance.type === 'beneficiary') {
      // Add the existing beneficiary to this account
      const beneficiaryData = { ...instance.data };
      
      // Check if this beneficiary already exists in the current account
      const existingBeneficiary = this.beneficiaries.find(b => 
        b.name === beneficiaryData.name && 
        b.ssn === beneficiaryData.ssn
      );
      
      if (!existingBeneficiary) {
        this.beneficiaries.push(beneficiaryData);
        this.updateFormData();
        return { added: true, name: beneficiaryData.name };
      } else {
        return { added: false, name: beneficiaryData.name };
      }
    }
    return { added: false, name: 'Unknown' };
  }

  onExistingModalClosed() {
    this.showExistingModal = false;
  }

  // Existing Trustees Modal Methods
  showExistingTrusteesModal() {
    this.currentModalInstanceType = 'trustee';
    // Collect all existing instances from the form data
    this.existingInstances = this.existingInstancesService.collectExistingInstances(this.formData);
    this.showExistingModal = true;
  }

  onExistingTrusteeSelected(instance: ExistingInstance) {
    const result = this.addTrusteeInstance(instance);
    if (result.added) {
      this.messageService.add({
        severity: 'success',
        summary: 'Trustee Added',
        detail: `${result.name} has been added successfully`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Trustee',
        detail: `${result.name} is already in your trustees list`,
        life: 3000
      });
    }
  }

  onExistingTrusteesSelected(instances: ExistingInstance[]) {
    let addedCount = 0;
    let skippedCount = 0;
    const addedNames: string[] = [];
    const skippedNames: string[] = [];

    instances.forEach(instance => {
      const result = this.addTrusteeInstance(instance);
      if (result.added) {
        addedCount++;
        addedNames.push(result.name);
      } else {
        skippedCount++;
        skippedNames.push(result.name);
      }
    });

    // Show success message for added trustees
    if (addedCount > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Trustees Added',
        detail: `${addedCount} trustee${addedCount > 1 ? 's' : ''} added successfully`,
        life: 3000
      });
    }

    // Show warning for skipped trustees
    if (skippedCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Trustees',
        detail: `${skippedCount} trustee${skippedCount > 1 ? 's' : ''} already exist in your list`,
        life: 3000
      });
    }
  }

  private addTrusteeInstance(instance: ExistingInstance): {added: boolean, name: string} {
    const trusteeData = instance.data;
    
    // Check for duplicates based on name and role
    const isDuplicate = this.trustees.some(trustee => 
      trustee.name === trusteeData.name && 
      trustee.role === trusteeData.role
    );
    
    if (!isDuplicate) {
      // Add the trustee to current trustees list
      this.trustees.push({
        name: trusteeData.name,
        role: trusteeData.role,
        phone: trusteeData.phone,
        email: trusteeData.email,
        address: trusteeData.address
      });
      
      this.updateFormData();
      return { added: true, name: trusteeData.name };
    }
    
    return { added: false, name: trusteeData.name };
  }

  // Copy dropdown event handlers
  onTrusteeSelected(trustee: StoredTrustee) {
    console.log('Trustee selected from dropdown:', trustee);
    
    // Check if trustee already exists in current trustees list
    const existingTrustee = this.trustees.find(t => 
      t.name === trustee.name && t.role === trustee.role && t.phone === trustee.phone
    );
    
    if (existingTrustee) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Trustee Already Exists',
        detail: 'This trustee is already added to this account',
        life: 3000
      });
    } else {
      // Add the trustee to the list
      const newTrustee = {
        name: trustee.name,
        role: trustee.role,
        phone: trustee.phone,
        email: trustee.email || '',
        address: trustee.address
      };
      
      this.trustees.push(newTrustee);
      this.updateFormData();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Trustee Added',
        detail: `${trustee.name} added successfully`,
        life: 3000
      });
    }
  }

  onBeneficiarySelected(beneficiary: StoredBeneficiary) {
    console.log('Beneficiary selected from dropdown:', beneficiary);
    
    // Check if beneficiary already exists in current beneficiaries list
    const existingBeneficiary = this.beneficiaries.find(b => 
      b.name === beneficiary.name && b.ssn === beneficiary.ssn
    );
    
    if (existingBeneficiary) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Beneficiary Already Exists',
        detail: 'This beneficiary is already added to this account',
        life: 3000
      });
    } else {
      // Add the beneficiary to the list
      const newBeneficiary = {
        name: beneficiary.name,
        relationship: beneficiary.relationship,
        percentage: beneficiary.percentage,
        dateOfBirth: beneficiary.dateOfBirth,
        ssn: beneficiary.ssn,
        address: beneficiary.address || ''
      };
      
      this.beneficiaries.push(newBeneficiary);
      this.updateFormData();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Beneficiary Added',
        detail: `${beneficiary.name} added successfully`,
        life: 3000
      });
    }
  }

  private addDemoDataIfNeeded() {
    // Add demo trustees if none exist
    const existingTrustees = this.trusteeStorageService.getStoredTrustees();
    if (existingTrustees.length === 0) {
      this.trusteeStorageService.saveTrustee({
        label: 'John Smith - Trustee',
        name: 'John Smith',
        role: 'Trustee',
        phone: '(555) 123-4567',
        email: 'john.smith@email.com',
        address: '123 Main St, Anytown, CA 90210'
      });

      this.trusteeStorageService.saveTrustee({
        label: 'Sarah Johnson - Co-Trustee',
        name: 'Sarah Johnson',
        role: 'Co-Trustee',
        phone: '(555) 987-6543',
        email: 'sarah.johnson@email.com',
        address: '456 Oak Ave, Springfield, NY 12345'
      });
    }

    // Add demo beneficiaries if none exist
    const existingBeneficiaries = this.beneficiaryStorageService.getStoredBeneficiaries();
    if (existingBeneficiaries.length === 0) {
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
    }
  }

  // Filter methods for AutoComplete components
  filterAccountTypeOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAccountTypeOptions = this.accountTypeOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterAccountProfileOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAccountProfileOptions = this.accountProfileOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterInvestmentObjectiveOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredInvestmentObjectiveOptions = this.investmentObjectiveOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterTimeHorizonOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTimeHorizonOptions = this.timeHorizonOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterRiskToleranceOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRiskToleranceOptions = this.riskToleranceOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterRelationshipOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRelationshipOptions = this.relationshipOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  // Check if a field should be highlighted as missing
  shouldHighlightMissingField(fieldName: string): boolean {
    if (!this.highlightMissingFields) return false;
    
    // List of required fields that should be highlighted
    const requiredFields = ['accountType', 'investmentObjective', 'riskTolerance', 'initialSourceOfFunds', 'investmentAmount'];
    if (!requiredFields.includes(fieldName)) return false;
    
    // Check if the field is empty
    const fieldValue = this.accountForm.get(fieldName)?.value;
    return !fieldValue || fieldValue.toString().trim() === '';
  }
}