import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SharedModule } from 'primeng/api';

// Local Imports
import { FormData } from '../../../../shared/models/types';
import { ExistingInstanceModalComponent, ExistingInstance } from '../../../../shared/components/existing-instance-modal/existing-instance-modal.component';
import { ExistingInstancesService } from '../../../../shared/services/existing-instances.service';
import { AddressDropdownComponent } from '../../../../shared/components/address-dropdown/address-dropdown.component';
import { CompactDropdownComponent } from '../../../../shared/components/compact-dropdown/compact-dropdown.component';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-owner-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextareaModule,
    CheckboxModule,
    FileUploadModule,
    CardModule,
    InputMaskModule,
    RadioButtonModule,
    ButtonModule,
    DividerModule,
    SharedModule,
    ExistingInstanceModalComponent,
    AddressDropdownComponent
  ],
  providers: [ExistingInstancesService],
  template: `
      <!-- Edit Mode - Form -->
      <form *ngIf="!isReviewMode" [formGroup]="ownerForm" (ngSubmit)="onSubmit()">
        
        <!-- Personal Information Card -->
        <p-card header="Personal Information" class="mb-4">
          <div class="grid">
            <div class="col-12 md:col-4">
              <label for="firstName" class="block text-900 font-medium mb-2">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="firstName"
                formControlName="firstName"
                placeholder="First name"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('firstName')?.invalid && ownerForm.get('firstName')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('firstName')?.invalid && ownerForm.get('firstName')?.touched">
                First name is required (minimum 2 characters)
              </small>
            </div>
            
            <div class="col-12 md:col-4">
              <label for="middleInitial" class="block text-900 font-medium mb-2">
                Middle Initial
              </label>
              <input
                pInputText
                id="middleInitial"
                formControlName="middleInitial"
                placeholder="Middle initial"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-4">
              <label for="lastName" class="block text-900 font-medium mb-2">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="lastName"
                formControlName="lastName"
                placeholder="Last name"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('lastName')?.invalid && ownerForm.get('lastName')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('lastName')?.invalid && ownerForm.get('lastName')?.touched">
                Last name is required (minimum 2 characters)
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="dateOfBirth" class="block text-900 font-medium mb-2">
                Date of Birth <span class="text-red-500">*</span>
              </label>
              <p-calendar
                inputId="dateOfBirth"
                formControlName="dateOfBirth"
                [showIcon]="true"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                styleClass="w-full compact-autocomplete"
                [maxDate]="maxDate"
                [class.ng-invalid]="ownerForm.get('dateOfBirth')?.invalid && ownerForm.get('dateOfBirth')?.touched">
              </p-calendar>
              <small class="p-error" *ngIf="ownerForm.get('dateOfBirth')?.invalid && ownerForm.get('dateOfBirth')?.touched">
                <span *ngIf="ownerForm.get('dateOfBirth')?.errors?.['required']">Date of birth is required</span>
                <span *ngIf="ownerForm.get('dateOfBirth')?.errors?.['futureDate']">Date of birth cannot be in the future</span>
                <span *ngIf="ownerForm.get('dateOfBirth')?.errors?.['minimumAge']">Account holder must be at least 18 years old</span>
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="ssn" class="block text-900 font-medium mb-2">
                Social Security Number <span class="text-red-500">*</span>
              </label>
              <p-inputMask
                inputId="ssn"
                formControlName="ssn"
                mask="999-99-9999"
                placeholder="***-**-****"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('ssn')?.invalid && ownerForm.get('ssn')?.touched">
              </p-inputMask>
              <small class="p-error" *ngIf="ownerForm.get('ssn')?.invalid && ownerForm.get('ssn')?.touched">
                Please enter SSN in format: XXX-XX-XXXX
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="phoneHome" class="block text-900 font-medium mb-2">
                Phone (Home) <span class="text-red-500">*</span>
              </label>
              <p-inputMask
                inputId="phoneHome"
                formControlName="phoneHome"
                mask="(999) 999-9999"
                placeholder="(XXX) XXX-XXXX"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('phoneHome')?.invalid && ownerForm.get('phoneHome')?.touched">
              </p-inputMask>
              <small class="p-error" *ngIf="ownerForm.get('phoneHome')?.invalid && ownerForm.get('phoneHome')?.touched">
                Please enter phone number in format: (XXX) XXX-XXXX
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="phoneMobile" class="block text-900 font-medium mb-2">
                Phone (Mobile)
              </label>
              <p-inputMask
                inputId="phoneMobile"
                formControlName="phoneMobile"
                mask="(999) 999-9999"
                placeholder="(XXX) XXX-XXXX"
                styleClass="w-full compact-autocomplete">
              </p-inputMask>
              <small class="text-orange-500 text-xs">
                Recommended for account notifications
              </small>
            </div>
            
            <div class="col-12">
              <label for="email" class="block text-900 font-medium mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="email"
                type="email"
                formControlName="email"
                placeholder="Email address"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('email')?.invalid && ownerForm.get('email')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('email')?.invalid && ownerForm.get('email')?.touched">
                Please enter a valid email address
              </small>
            </div>
          </div>
        </p-card>

        <!-- Address Information Card -->
        <p-card header="Address Information" class="mb-4">
          <div class="grid">
            <!-- Home Address Section -->
            <div class="col-12">
              <div class="flex justify-content-between align-items-center mb-3">
                <h5 class="m-0 text-lg font-semibold">Home Address <span class="text-red-500">*</span></h5>
                <p-button 
                  *ngIf="!copyDropdownsMode"
                  label="Add Existing" 
                  icon="fa-solid fa-clock-rotate-left"
                  severity="primary"
                  size="small"
                  (onClick)="showExistingAddressModal('home')">
                </p-button>
              </div>
            </div>
            
            <!-- Copy Dropdowns Mode - Home Address Dropdown -->
            <div class="col-12" *ngIf="copyDropdownsMode">
              <app-address-dropdown
                [formGroup]="ownerForm"
                addressPrefix="home"
                label="Home Address"
                [disabled]="isReviewMode"
                [formData]="formData">
              </app-address-dropdown>
            </div>
            
            <!-- Regular Mode - Home Address Fields -->
            <div class="col-12 md:col-8" *ngIf="!copyDropdownsMode">
              <label for="homeAddress" class="block text-900 font-medium mb-2">
                Street Address <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="homeAddress"
                formControlName="homeAddress"
                placeholder="123 Main Street"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('homeAddress')?.invalid && ownerForm.get('homeAddress')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('homeAddress')?.invalid && ownerForm.get('homeAddress')?.touched">
                Street address is required
              </small>
            </div>
            
            <div class="col-12 md:col-4" *ngIf="!copyDropdownsMode">
              <label for="homeAddress2" class="block text-900 font-medium mb-2">
                Apt/Suite/Unit
              </label>
              <input
                pInputText
                id="homeAddress2"
                formControlName="homeAddress2"
                placeholder="Apt 123"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-5" *ngIf="!copyDropdownsMode">
              <label for="homeCity" class="block text-900 font-medium mb-2">
                City <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="homeCity"
                formControlName="homeCity"
                placeholder="City"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('homeCity')?.invalid && ownerForm.get('homeCity')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('homeCity')?.invalid && ownerForm.get('homeCity')?.touched">
                City is required
              </small>
            </div>
            
            <div class="col-12 md:col-2" *ngIf="!copyDropdownsMode">
              <label for="homeState" class="block text-900 font-medium mb-2">
                State <span class="text-red-500">*</span>
              </label>
              <p-dropdown
                inputId="homeState"
                formControlName="homeState"
                [options]="stateOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select state"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('homeState')?.invalid && ownerForm.get('homeState')?.touched">
              </p-dropdown>
              <small class="p-error" *ngIf="ownerForm.get('homeState')?.invalid && ownerForm.get('homeState')?.touched">
                State is required
              </small>
            </div>
            
            <div class="col-12 md:col-3" *ngIf="!copyDropdownsMode">
              <label for="homeZipCode" class="block text-900 font-medium mb-2">
                ZIP Code <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="homeZipCode"
                formControlName="homeZipCode"
                placeholder="12345"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('homeZipCode')?.invalid && ownerForm.get('homeZipCode')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('homeZipCode')?.invalid && ownerForm.get('homeZipCode')?.touched">
                ZIP code is required
              </small>
            </div>
            
            <div class="col-12 md:col-2" *ngIf="!copyDropdownsMode">
              <label for="homeCountry" class="block text-900 font-medium mb-2">
                Country <span class="text-red-500">*</span>
              </label>
              <p-dropdown
                inputId="homeCountry"
                formControlName="homeCountry"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select country"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('homeCountry')?.invalid && ownerForm.get('homeCountry')?.touched">
              </p-dropdown>
              <small class="p-error" *ngIf="ownerForm.get('homeCountry')?.invalid && ownerForm.get('homeCountry')?.touched">
                Country is required
              </small>
            </div>

            <!-- Mailing Address Section -->
            <div class="col-12 mt-4">
              <div class="flex justify-content-between align-items-center mb-3">
                <h5 class="m-0 text-lg font-semibold">Mailing Address</h5>
                <p-button 
                  *ngIf="!copyDropdownsMode"
                  label="Add Existing" 
                  icon="fa-solid fa-clock-rotate-left"
                  severity="primary"
                  size="small"
                  (onClick)="showExistingAddressModal('mailing')">
                </p-button>
              </div>
              <small class="text-orange-500 text-xs block mb-3" *ngIf="!copyDropdownsMode">
                Leave blank if same as home address
              </small>
            </div>
            
            <!-- Copy Dropdowns Mode - Mailing Address Dropdown -->
            <div class="col-12" *ngIf="copyDropdownsMode">
              <app-address-dropdown
                [formGroup]="ownerForm"
                addressPrefix="mailing"
                label="Mailing Address"
                [disabled]="isReviewMode"
                [formData]="formData">
              </app-address-dropdown>
            </div>
            
            <!-- Regular Mode - Mailing Address Fields -->
            <div class="col-12 md:col-8" *ngIf="!copyDropdownsMode">
              <label for="mailingAddress" class="block text-900 font-medium mb-2">
                Street Address
              </label>
              <input
                pInputText
                id="mailingAddress"
                formControlName="mailingAddress"
                placeholder="123 Main Street"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-4" *ngIf="!copyDropdownsMode">
              <label for="mailingAddress2" class="block text-900 font-medium mb-2">
                Apt/Suite/Unit
              </label>
              <input
                pInputText
                id="mailingAddress2"
                formControlName="mailingAddress2"
                placeholder="Apt 123"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-5" *ngIf="!copyDropdownsMode">
              <label for="mailingCity" class="block text-900 font-medium mb-2">
                City
              </label>
              <input
                pInputText
                id="mailingCity"
                formControlName="mailingCity"
                placeholder="City"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-2" *ngIf="!copyDropdownsMode">
              <label for="mailingState" class="block text-900 font-medium mb-2">
                State
              </label>
              <p-dropdown
                inputId="mailingState"
                formControlName="mailingState"
                [options]="stateOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select state"
                styleClass="w-full compact-autocomplete">
              </p-dropdown>
            </div>
            
            <div class="col-12 md:col-3" *ngIf="!copyDropdownsMode">
              <label for="mailingZipCode" class="block text-900 font-medium mb-2">
                ZIP Code
              </label>
              <input
                pInputText
                id="mailingZipCode"
                formControlName="mailingZipCode"
                placeholder="12345"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-2" *ngIf="!copyDropdownsMode">
              <label for="mailingCountry" class="block text-900 font-medium mb-2">
                Country
              </label>
              <p-dropdown
                inputId="mailingCountry"
                formControlName="mailingCountry"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Country"
                styleClass="w-full compact-autocomplete">
              </p-dropdown>
            </div>
            
          </div>
        </p-card>

        <!-- Citizenship Card -->
        <p-card header="Citizenship" class="mb-4">
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="citizenship" class="block text-900 font-medium mb-2">
                Citizenship Type <span class="text-red-500">*</span>
              </label>
              <p-dropdown
                inputId="citizenship"
                formControlName="citizenship"
                [options]="citizenshipOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select citizenship type"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('citizenship')?.invalid && ownerForm.get('citizenship')?.touched">
              </p-dropdown>
              <small class="p-error" *ngIf="ownerForm.get('citizenship')?.invalid && ownerForm.get('citizenship')?.touched">
                Citizenship type is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label class="block text-900 font-medium mb-2">
                Upload ID Document
              </label>
              <p-fileUpload
                mode="basic"
                accept="image/*,.pdf"
                chooseLabel="Choose Document">
              </p-fileUpload>
            </div>
          </div>
        </p-card>

        <!-- Employment Information Card -->
        <p-card header="Employment Information" class="mb-4">
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="employmentStatus" class="block text-900 font-medium mb-2">
                Employment Status <span class="text-red-500">*</span>
              </label>
              <p-dropdown
                inputId="employmentStatus"
                formControlName="employmentStatus"
                [options]="employmentOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select employment status"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('employmentStatus')?.invalid && ownerForm.get('employmentStatus')?.touched">
              </p-dropdown>
              <small class="p-error" *ngIf="ownerForm.get('employmentStatus')?.invalid && ownerForm.get('employmentStatus')?.touched">
                Employment status is required
              </small>
            </div>
            
            <div class="col-12 md:col-6" *ngIf="ownerForm.get('employmentStatus')?.value !== 'retired'">
              <label for="employerName" class="block text-900 font-medium mb-2">
                Employer Name
              </label>
              <input
                pInputText
                id="employerName"
                formControlName="employerName"
                placeholder="Enter employer name"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="annualIncome" class="block text-900 font-medium mb-2">
                Annual Income Range <span class="text-red-500">*</span>
              </label>
              <p-dropdown
                inputId="annualIncome"
                formControlName="annualIncome"
                [options]="incomeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select income range"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('annualIncome')?.invalid && ownerForm.get('annualIncome')?.touched">
              </p-dropdown>
              <small class="p-error" *ngIf="ownerForm.get('annualIncome')?.invalid && ownerForm.get('annualIncome')?.touched">
                Annual income is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="netWorth" class="block text-900 font-medium mb-2">
                Net Worth Range <span class="text-red-500">*</span>
              </label>
              <p-dropdown
                inputId="netWorth"
                formControlName="netWorth"
                [options]="netWorthOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select net worth range"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('netWorth')?.invalid && ownerForm.get('netWorth')?.touched">
              </p-dropdown>
              <small class="p-error" *ngIf="ownerForm.get('netWorth')?.invalid && ownerForm.get('netWorth')?.touched">
                Net worth range is required
              </small>
            </div>
            
            <div class="col-12">
              <label for="fundsSource" class="block text-900 font-medium mb-2">
                Source of Funds <span class="text-red-500">*</span>
              </label>
              <textarea
                pInputTextarea
                id="fundsSource"
                formControlName="fundsSource"
                rows="3"
                placeholder="Please describe the source of funds for this account..."
                class="w-full">
              </textarea>
              <small class="p-error" *ngIf="ownerForm.get('fundsSource')?.invalid && ownerForm.get('fundsSource')?.touched">
                Source of funds is required
              </small>
            </div>
          </div>
        </p-card>

        <!-- Disclosure Questions Card -->
        <p-card header="Disclosure Questions" class="mb-4">
          <div class="grid">
            <div class="col-12">
              <div class="field-checkbox">
                <p-checkbox
                  inputId="affiliatedFirm"
                  formControlName="affiliatedFirm"
                  [binary]="true">
                </p-checkbox>
                <label for="affiliatedFirm" class="ml-2">
                  I am affiliated with a financial services firm
                </label>
              </div>
            </div>
            <div class="col-12">
              <div class="field-checkbox">
                <p-checkbox
                  inputId="professionalAdvisor"
                  formControlName="professionalAdvisor"
                  [binary]="true">
                </p-checkbox>
                <label for="professionalAdvisor" class="ml-2">
                  I am a professional financial advisor
                </label>
              </div>
            </div>
          </div>
        </p-card>

        <!-- Trusted Contact Information Card -->
        <p-card header="Trusted Contact Information" class="mb-4">
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="trustedName" class="block text-900 font-medium mb-2">
                Contact Name
              </label>
              <input
                pInputText
                id="trustedName"
                formControlName="trustedName"
                placeholder="Full name"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="trustedPhone" class="block text-900 font-medium mb-2">
                Contact Phone
              </label>
              <p-inputMask
                inputId="trustedPhone"
                formControlName="trustedPhone"
                mask="(999) 999-9999"
                placeholder="Phone number"
                styleClass="w-full compact-autocomplete">
              </p-inputMask>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="trustedEmail" class="block text-900 font-medium mb-2">
                Contact Email
              </label>
              <input
                pInputText
                id="trustedEmail"
                type="email"
                formControlName="trustedEmail"
                placeholder="Email address"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="trustedRelationship" class="block text-900 font-medium mb-2">
                Relationship
              </label>
              <p-dropdown
                inputId="trustedRelationship"
                formControlName="trustedRelationship"
                [options]="relationshipOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select relationship"
                styleClass="w-full compact-autocomplete">
              </p-dropdown>
            </div>
          </div>
        </p-card>
      </form>

      <!-- Review Mode - Flattened Data -->
      <div *ngIf="isReviewMode" class="review-mode-container">
        
        <!-- Personal Information Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Personal Information</div>
            <p-button 
              [label]="sectionEditMode['personal'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['personal'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['personal'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('personal')">
            </p-button>
          </div>
          
          <!-- Personal Info - Edit Mode -->
          <div *ngIf="sectionEditMode['personal']" class="grid">
            <div class="col-12 md:col-4">
              <label for="firstName" class="block text-900 font-medium mb-2">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="firstName"
                formControlName="firstName"
                placeholder="Enter first name"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('firstName')?.invalid && ownerForm.get('firstName')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('firstName')?.invalid && ownerForm.get('firstName')?.touched">
                First name is required (minimum 2 characters)
              </small>
            </div>
            
            <div class="col-12 md:col-4">
              <label for="middleInitial" class="block text-900 font-medium mb-2">
                Middle Initial
              </label>
              <input
                pInputText
                id="middleInitial"
                formControlName="middleInitial"
                placeholder="MI"
                maxlength="1"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-4">
              <label for="lastName" class="block text-900 font-medium mb-2">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="lastName"
                formControlName="lastName"
                placeholder="Enter last name"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('lastName')?.invalid && ownerForm.get('lastName')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('lastName')?.invalid && ownerForm.get('lastName')?.touched">
                Last name is required (minimum 2 characters)
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="dateOfBirth" class="block text-900 font-medium mb-2">
                Date of Birth <span class="text-red-500">*</span>
              </label>
              <p-calendar
                inputId="dateOfBirth"
                formControlName="dateOfBirth"
                [maxDate]="maxDate"
                dateFormat="mm/dd/yy"
                placeholder="MM/DD/YYYY"
                styleClass="w-full compact-autocomplete"
                [class.ng-invalid]="ownerForm.get('dateOfBirth')?.invalid && ownerForm.get('dateOfBirth')?.touched">
              </p-calendar>
              <small class="p-error" *ngIf="ownerForm.get('dateOfBirth')?.invalid && ownerForm.get('dateOfBirth')?.touched">
                Date of birth is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="ssn" class="block text-900 font-medium mb-2">
                Social Security Number <span class="text-red-500">*</span>
              </label>
              <input
                pInputText
                id="ssn"
                formControlName="ssn"
                placeholder="XXX-XX-XXXX"
                pInputMask="999-99-9999"
                class="w-full"
                [class.ng-invalid]="ownerForm.get('ssn')?.invalid && ownerForm.get('ssn')?.touched" />
              <small class="p-error" *ngIf="ownerForm.get('ssn')?.invalid && ownerForm.get('ssn')?.touched">
                Valid SSN is required
              </small>
            </div>
          </div>
          
          <!-- Personal Info - Review Mode -->
          <div *ngIf="!sectionEditMode['personal']" class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">First Name</div>
              <div class="review-field-value" 
                   [ngClass]="{'missing': !ownerForm.get('firstName')?.value}">
                {{ownerForm.get('firstName')?.value || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Middle Initial</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('middleInitial')?.value}">
                {{ownerForm.get('middleInitial')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Last Name</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('lastName')?.value}">
                {{ownerForm.get('lastName')?.value || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Date of Birth</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('dateOfBirth')?.value}">
                {{formatDate(ownerForm.get('dateOfBirth')?.value) || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Social Security Number</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('ssn')?.value}">
                {{ownerForm.get('ssn')?.value || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Home Phone</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('phoneHome')?.value}">
                {{ownerForm.get('phoneHome')?.value || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Mobile Phone</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('phoneMobile')?.value}">
                {{ownerForm.get('phoneMobile')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Email Address</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('email')?.value}">
                {{ownerForm.get('email')?.value || 'Required field missing'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Address Information Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Address Information</div>
            <p-button 
              label="Edit" 
              icon="fa-solid fa-pencil" 
              size="small" 
              severity="secondary"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('address')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Home Address</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('homeAddress')?.value}">
                {{ownerForm.get('homeAddress')?.value || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Mailing Address</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('mailingAddress')?.value}">
                {{ownerForm.get('mailingAddress')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Citizenship Type</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('citizenship')?.value}">
                {{getFieldDisplayValue('citizenship', citizenshipOptions) || 'Required field missing'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Employment Information Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Employment Information</div>
            <p-button 
              label="Edit" 
              icon="fa-solid fa-pencil" 
              size="small" 
              severity="secondary"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('employment')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Employment Status</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('employmentStatus')?.value}">
                {{getFieldDisplayValue('employmentStatus', employmentOptions) || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group" *ngIf="ownerForm.get('employmentStatus')?.value !== 'retired'">
              <div class="review-field-label">Employer Name</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('employerName')?.value}">
                {{ownerForm.get('employerName')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Annual Income</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('annualIncome')?.value}">
                {{getFieldDisplayValue('annualIncome', incomeOptions) || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Net Worth</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('netWorth')?.value}">
                {{getFieldDisplayValue('netWorth', netWorthOptions) || 'Required field missing'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Source of Funds</div>
              <div class="review-field-value"
                   [ngClass]="{'missing': !ownerForm.get('fundsSource')?.value}">
                {{ownerForm.get('fundsSource')?.value || 'Required field missing'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Disclosure Questions Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Disclosure Questions</div>
            <p-button 
              label="Edit" 
              icon="fa-solid fa-pencil" 
              size="small" 
              severity="secondary"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('disclosure')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Affiliated with Financial Services Firm</div>
              <div class="review-field-value">
                {{ownerForm.get('affiliatedFirm')?.value ? 'Yes' : 'No'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Professional Financial Advisor</div>
              <div class="review-field-value">
                {{ownerForm.get('professionalAdvisor')?.value ? 'Yes' : 'No'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Trusted Contact Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Trusted Contact Information</div>
            <p-button 
              label="Edit" 
              icon="fa-solid fa-pencil" 
              size="small" 
              severity="secondary"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('trusted')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Contact Name</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('trustedName')?.value}">
                {{ownerForm.get('trustedName')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Contact Phone</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('trustedPhone')?.value}">
                {{ownerForm.get('trustedPhone')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Contact Email</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('trustedEmail')?.value}">
                {{ownerForm.get('trustedEmail')?.value || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Relationship</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !ownerForm.get('trustedRelationship')?.value}">
                {{getFieldDisplayValue('trustedRelationship', relationshipOptions) || 'Not provided'}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Existing Address Modal -->
      <app-existing-instance-modal
        [(visible)]="showExistingModal"
        [instanceType]="'address'"
        [instances]="existingInstances"
        [currentRegistration]="getCurrentRegistration()"
        [enableMultiSelect]="false"
        (instanceSelected)="onExistingAddressSelected($event)"
        (modalClosed)="onExistingModalClosed()">
      </app-existing-instance-modal>
  `,
  styles: [`
    /* Remove all constraints that cause overflow */
    :host :deep(.p-card) {
      width: 100%;
      margin-bottom: 1rem;
      box-sizing: border-box;
      overflow: visible;
    }
    
    /* Pull first card up to eliminate gap with header */
    :host :deep(.p-card:first-child) {
      margin-top: -60px !important;
    }
    
    :host :deep(.p-card-content) {
      width: 100%;
      box-sizing: border-box;
      overflow: visible;
    }
    
    :host :deep(.grid) {
      width: 100%;
      box-sizing: border-box;
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
    
    .review-mode-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    
    .review-mode-section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      flex: 1;
    }
    
    .edit-section-button {
      flex-shrink: 0;
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

    /* Existing Address Button Styling */
    ::ng-deep .existing-address-button .p-button {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      color: #64748b;
      transition: all 0.2s ease;
    }

    ::ng-deep .existing-address-button .p-button:hover {
      background: #e2e8f0;
      border-color: #94a3b8;
      color: #475569;
    }

    ::ng-deep .existing-address-button .p-button .p-button-icon {
      margin-right: 0.5rem;
    }
  `]
})
export class OwnerDetailsComponent implements OnInit, OnChanges {
  @Input() formData: FormData = {};
  @Input() entityId: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() copyDropdownsMode: boolean = false;
  @Input() highlightMissingFields: boolean = false;
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() disableQuickReview = new EventEmitter<void>();

  // Section editing state for quick review mode
  sectionEditMode: { [key: string]: boolean } = {
    personal: false,
    address: false,
    employment: false,
    disclosure: false,
    trusted: false
  };

  // Filtered arrays for AutoComplete components
  filteredCitizenshipOptions: DropdownOption[] = [];
  filteredEmploymentOptions: DropdownOption[] = [];
  filteredIncomeOptions: DropdownOption[] = [];
  filteredNetWorthOptions: DropdownOption[] = [];
  filteredRelationshipOptions: DropdownOption[] = [];
  filteredStateOptions: DropdownOption[] = [];
  filteredCountryOptions: DropdownOption[] = [];

  // Existing instance modal properties
  showExistingModal = false;
  existingInstances: ExistingInstance[] = [];

  ownerForm!: FormGroup;
  maxDate = new Date();

  citizenshipOptions: DropdownOption[] = [
    { label: 'US Citizen', value: 'us-citizen' },
    { label: 'Permanent Resident', value: 'permanent-resident' },
    { label: 'Non-Resident Alien', value: 'non-resident' }
  ];

  employmentOptions: DropdownOption[] = [
    { label: 'Employed', value: 'employed' },
    { label: 'Self-Employed', value: 'self-employed' },
    { label: 'Retired', value: 'retired' },
    { label: 'Unemployed', value: 'unemployed' }
  ];

  incomeOptions: DropdownOption[] = [
    { label: 'Under $50,000', value: 'under-50k' },
    { label: '$50,000 - $100,000', value: '50k-100k' },
    { label: '$100,000 - $250,000', value: '100k-250k' },
    { label: '$250,000 - $500,000', value: '250k-500k' },
    { label: 'Over $500,000', value: 'over-500k' }
  ];

  netWorthOptions: DropdownOption[] = [
    { label: 'Under $100,000', value: 'under-100k' },
    { label: '$100,000 - $500,000', value: '100k-500k' },
    { label: '$500,000 - $1,000,000', value: '500k-1m' },
    { label: '$1,000,000 - $5,000,000', value: '1m-5m' },
    { label: 'Over $5,000,000', value: 'over-5m' }
  ];

  relationshipOptions: DropdownOption[] = [
    { label: 'Spouse', value: 'spouse' },
    { label: 'Parent', value: 'parent' },
    { label: 'Child', value: 'child' },
    { label: 'Sibling', value: 'sibling' },
    { label: 'Friend', value: 'friend' },
    { label: 'Other', value: 'other' }
  ];

  stateOptions: DropdownOption[] = [
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

  countryOptions: DropdownOption[] = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' },
    { label: 'France', value: 'FR' },
    { label: 'Japan', value: 'JP' },
    { label: 'Other', value: 'OTHER' }
  ];

  constructor(
    private fb: FormBuilder,
    private existingInstancesService: ExistingInstancesService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadFormData();
    this.setupFormSubscriptions();
    this.initializeFilteredOptions();
  }

  private initializeFilteredOptions() {
    this.filteredCitizenshipOptions = [...this.citizenshipOptions];
    this.filteredEmploymentOptions = [...this.employmentOptions];
    this.filteredIncomeOptions = [...this.incomeOptions];
    this.filteredNetWorthOptions = [...this.netWorthOptions];
    this.filteredRelationshipOptions = [...this.relationshipOptions];
    this.filteredStateOptions = [...this.stateOptions];
    this.filteredCountryOptions = [...this.countryOptions];
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['formData'] || changes['entityId']) && this.ownerForm) {
      this.loadFormData();
    }
  }

  initializeForm() {
    this.ownerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleInitial: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required, this.futureDateValidator, this.minimumAgeValidator]],
      ssn: ['', [Validators.required, this.ssnValidator]],
      phoneHome: ['', [Validators.required, this.phoneValidator]],
      phoneMobile: [''],
      email: ['', [Validators.required, Validators.email]],
      // Home Address Fields
      homeAddress: ['', [Validators.required, Validators.minLength(5)]],
      homeAddress2: [''],
      homeCity: ['', Validators.required],
      homeState: ['', Validators.required],
      homeZipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      homeCountry: ['US', Validators.required],
      // Mailing Address Fields
      mailingAddress: [''],
      mailingAddress2: [''],
      mailingCity: [''],
      mailingState: [''],
      mailingZipCode: ['', Validators.pattern(/^\d{5}(-\d{4})?$/)],
      mailingCountry: [''],
      citizenship: ['', Validators.required],
      employmentStatus: ['', Validators.required],
      employerName: [''],
      annualIncome: ['', Validators.required],
      netWorth: ['', Validators.required],
      fundsSource: ['', Validators.required],
      affiliatedFirm: [false],
      professionalAdvisor: [false],
      trustedName: [''],
      trustedPhone: [''],
      trustedEmail: [''],
      trustedRelationship: ['']
    });
  }

  loadFormData() {
    if (this.formData && this.formData[this.entityId]) {
      const data = this.formData[this.entityId];
      this.ownerForm.patchValue(data);
    }
  }

  setupFormSubscriptions() {
    this.ownerForm.valueChanges.subscribe(() => {
      this.updateFormData();
    });
  }

  updateFormData() {
    const updatedFormData = { ...this.formData };
    if (!updatedFormData[this.entityId]) {
      updatedFormData[this.entityId] = {};
    }
    Object.assign(updatedFormData[this.entityId], this.ownerForm.value);
    this.formDataChange.emit(updatedFormData);
  }

  getFieldDisplayValue(fieldName: string, options: DropdownOption[]): string {
    const value = this.ownerForm.get(fieldName)?.value;
    if (!value) return '';
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  toggleSectionEdit(sectionName: string): void {
    console.log('Toggling section edit mode for:', sectionName);
    
    // If switching from edit mode to review mode, save the changes
    if (this.sectionEditMode[sectionName]) {
      this.updateFormData();
    }
    
    this.sectionEditMode[sectionName] = !this.sectionEditMode[sectionName];
    
    // When enabling any section edit in quick review mode, disable overall quick review mode
    if (this.sectionEditMode[sectionName]) {
      this.disableQuickReview.emit();
    }
  }

  // Store which address type we're populating
  private selectedAddressType: 'home' | 'mailing' = 'home';

  // Existing Address Modal Methods
  showExistingAddressModal(addressType: 'home' | 'mailing') {
    this.selectedAddressType = addressType;
    // Collect all existing instances from the form data
    this.existingInstances = this.existingInstancesService.collectExistingInstances(this.formData);
    this.showExistingModal = true;
  }

  onExistingAddressSelected(instance: ExistingInstance) {
    if (instance.type === 'address') {
      // Use the service to apply the address data
      const currentValues = this.ownerForm.value;
      const updatedValues = this.existingInstancesService.applyInstanceData('address', instance.data, currentValues);
      
      // Apply to the specific address type that was requested
      if (this.selectedAddressType === 'home') {
        this.ownerForm.patchValue({
          homeAddress: instance.data.address || '',
          homeAddress2: instance.data.address2 || '',
          homeCity: instance.data.city || '',
          homeState: instance.data.state || '',
          homeZipCode: instance.data.zipCode || '',
          homeCountry: instance.data.country || 'US'
        });
      } else {
        this.ownerForm.patchValue({
          mailingAddress: instance.data.address || '',
          mailingAddress2: instance.data.address2 || '',
          mailingCity: instance.data.city || '',
          mailingState: instance.data.state || '',
          mailingZipCode: instance.data.zipCode || '',
          mailingCountry: instance.data.country || 'US'
        });
      }
      
      this.updateFormData();
    }
  }

  onExistingModalClosed() {
    this.showExistingModal = false;
  }

  getCurrentRegistration(): string {
    // Map entity IDs to registration names
    const registrationMap: { [key: string]: string } = {
      'john-smith': 'Joint Registration',
      'mary-smith': 'Joint Registration', 
      'smith-trust': 'Trust Registration',
      'joint-account': 'Joint Registration',
      'roth-ira-account': 'Roth Registration',
      'trust-account': 'Trust Registration',
      'traditional-ira-account': 'Traditional IRA Registration'
    };
    
    return registrationMap[this.entityId] || 'Unknown Registration';
  }

  formatDate(date: any): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US');
    } catch {
      return '';
    }
  }

  // Validators
  futureDateValidator(control: any) {
    if (control.value && new Date(control.value) > new Date()) {
      return { futureDate: true };
    }
    return null;
  }

  minimumAgeValidator(control: any) {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age < 18 ? { minimumAge: true } : null;
  }

  ssnValidator(control: any) {
    if (!control.value) return null;
    return /^\d{3}-\d{2}-\d{4}$/.test(control.value) ? null : { invalidSsn: true };
  }

  phoneValidator(control: any) {
    if (!control.value) return null;
    return /^\(\d{3}\)\s\d{3}-\d{4}$/.test(control.value) ? null : { invalidPhone: true };
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      this.updateFormData();
    }
  }

  // Filter methods for AutoComplete components
  filterCitizenshipOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCitizenshipOptions = this.citizenshipOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterEmploymentOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredEmploymentOptions = this.employmentOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterIncomeOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredIncomeOptions = this.incomeOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterNetWorthOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredNetWorthOptions = this.netWorthOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterRelationshipOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRelationshipOptions = this.relationshipOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterStateOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredStateOptions = this.stateOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  filterCountryOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCountryOptions = this.countryOptions.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }

  // Check if a field should be highlighted as missing
  shouldHighlightMissingField(fieldName: string): boolean {
    if (!this.highlightMissingFields) return false;
    
    // List of required fields that should be highlighted
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'ssn', 'phoneHome', 'email'];
    if (!requiredFields.includes(fieldName)) return false;
    
    // Check if the field is empty
    const fieldValue = this.ownerForm.get(fieldName)?.value;
    return !fieldValue || fieldValue.toString().trim() === '';
  }
}