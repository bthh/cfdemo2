import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

// Local Imports
import { FormData } from '../../../../shared/models/types';

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
    InputTextareaModule,
    CheckboxModule,
    FileUploadModule,
    CardModule,
    InputMaskModule,
    RadioButtonModule,
    ButtonModule,
    DividerModule
  ],
  template: `
    <div class="owner-details-section">
      <form [formGroup]="ownerForm" (ngSubmit)="onSubmit()">
        
        <!-- Personal Information Card -->
        <p-card header="Personal Information" class="field-group mb-4">
          <div class="grid">
            <!-- Name Fields -->
            <div class="col-12">
              <div class="subsection-title">Name</div>
            </div>
            <div class="col-12 md:col-4">
              <label for="firstName" class="block text-900 font-medium mb-2">
                First Name <span class="required-indicator">*</span>
              </label>
              <input
                pInputText
                id="firstName"
                formControlName="firstName"
                placeholder="First name"
                class="w-full"
                [disabled]="isReviewMode" />
              <small class="p-error" *ngIf="ownerForm.get('firstName')?.invalid && ownerForm.get('firstName')?.touched">
                First name is required
              </small>
            </div>
            
            <div class="col-12 md:col-4">
              <label for="middleInitial" class="block text-900 font-medium mb-2">
                M.I.
              </label>
              <input
                pInputText
                id="middleInitial"
                formControlName="middleInitial"
                placeholder="M.I."
                class="w-full"
                maxlength="1"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-4">
              <label for="lastName" class="block text-900 font-medium mb-2">
                Last Name <span class="required-indicator">*</span>
              </label>
              <input
                pInputText
                id="lastName"
                formControlName="lastName"
                placeholder="Last name"
                class="w-full"
                [disabled]="isReviewMode" />
              <small class="p-error" *ngIf="ownerForm.get('lastName')?.invalid && ownerForm.get('lastName')?.touched">
                Last name is required
              </small>
            </div>

            <div class="col-12"><div class="section-divider"></div></div>
            
            <!-- Basic Information -->
            <div class="col-12 md:col-6">
              <label for="dateOfBirth" class="block text-900 font-medium mb-2">
                Date of Birth <span class="required-indicator">*</span>
              </label>
              <p-calendar
                inputId="dateOfBirth"
                formControlName="dateOfBirth"
                [showIcon]="true"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                styleClass="w-full compact-autocomplete"
                [disabled]="isReviewMode"
                [maxDate]="maxDate">
              </p-calendar>
              <small class="p-error" *ngIf="ownerForm.get('dateOfBirth')?.invalid && ownerForm.get('dateOfBirth')?.touched">
                Date of birth is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="ssn" class="block text-900 font-medium mb-2">
                Social Security Number <span class="required-indicator">*</span>
              </label>
              <p-inputMask
                inputId="ssn"
                formControlName="ssn"
                mask="999-99-9999"
                placeholder="***-**-****"
                styleClass="w-full compact-autocomplete"
                [disabled]="isReviewMode">
              </p-inputMask>
              <small class="p-error" *ngIf="ownerForm.get('ssn')?.invalid && ownerForm.get('ssn')?.touched">
                SSN is required
              </small>
            </div>
            
            <!-- Contact Information -->
            <div class="col-12 md:col-6">
              <label for="primaryPhone" class="block text-900 font-medium mb-2">
                Primary Phone <span class="required-indicator">*</span>
              </label>
              <p-inputMask
                inputId="primaryPhone"
                formControlName="primaryPhone"
                mask="999-999-9999"
                placeholder="***-***-****"
                styleClass="w-full compact-autocomplete"
                [disabled]="isReviewMode">
              </p-inputMask>
              <small class="p-error" *ngIf="ownerForm.get('primaryPhone')?.invalid && ownerForm.get('primaryPhone')?.touched">
                Primary phone is required
              </small>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="secondaryPhone" class="block text-900 font-medium mb-2">
                Secondary Phone
              </label>
              <p-inputMask
                inputId="secondaryPhone"
                formControlName="secondaryPhone"
                mask="999-999-9999"
                placeholder="***-***-****"
                styleClass="w-full compact-autocomplete"
                [disabled]="isReviewMode">
              </p-inputMask>
            </div>
            
            <div class="col-12">
              <label for="email" class="block text-900 font-medium mb-2">
                Email Address <span class="required-indicator">*</span>
              </label>
              <input
                pInputText
                id="email"
                type="email"
                formControlName="email"
                placeholder="Email address"
                class="w-full"
                [disabled]="isReviewMode" />
              <small class="p-error" *ngIf="ownerForm.get('email')?.invalid && ownerForm.get('email')?.touched">
                Valid email is required
              </small>
            </div>
          </div>
        </p-card>

        <!-- Address Information Card -->
        <p-card header="Home Address" class="field-group mb-4">
          <div class="grid">
            <div class="col-12 md:col-8">
              <label for="homeAddress1" class="block text-900 font-medium mb-2">
                Address 1 <span class="required-indicator">*</span>
              </label>
              <input
                pInputText
                id="homeAddress1"
                formControlName="homeAddress1"
                placeholder="Street address"
                class="w-full"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-4">
              <label for="homeAddress2" class="block text-900 font-medium mb-2">
                Apt/ Other
              </label>
              <input
                pInputText
                id="homeAddress2"
                formControlName="homeAddress2"
                placeholder="Apt/Unit"
                class="w-full"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="homeCity" class="block text-900 font-medium mb-2">
                City <span class="required-indicator">*</span>
              </label>
              <input
                pInputText
                id="homeCity"
                formControlName="homeCity"
                placeholder="City"
                class="w-full"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="homeZip" class="block text-900 font-medium mb-2">
                Zip Code <span class="required-indicator">*</span>
              </label>
              <p-inputMask
                inputId="homeZip"
                formControlName="homeZip"
                mask="99999"
                placeholder="Zip Code"
                styleClass="w-full compact-autocomplete"
                [disabled]="isReviewMode">
              </p-inputMask>
            </div>
          </div>
        </p-card>

        <!-- Mailing Address Card -->
        <p-card header="Mailing Address(Optional)" class="field-group mb-4">
          <div class="grid">
            <div class="col-12 md:col-8">
              <label for="mailingAddress1" class="block text-900 font-medium mb-2">
                Address
              </label>
              <input
                pInputText
                id="mailingAddress1"
                formControlName="mailingAddress1"
                placeholder="Street address"
                class="w-full"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-4">
              <label for="mailingAddress2" class="block text-900 font-medium mb-2">
                Apt/ Other
              </label>
              <input
                pInputText
                id="mailingAddress2"
                formControlName="mailingAddress2"
                placeholder="Apt/Unit"
                class="w-full"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="mailingCity" class="block text-900 font-medium mb-2">
                City
              </label>
              <input
                pInputText
                id="mailingCity"
                formControlName="mailingCity"
                placeholder="City"
                class="w-full"
                [disabled]="isReviewMode" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="mailingZip" class="block text-900 font-medium mb-2">
                Zip Code
              </label>
              <p-inputMask
                inputId="mailingZip"
                formControlName="mailingZip"
                mask="99999"
                placeholder="Zip Code"
                styleClass="w-full compact-autocomplete"
                [disabled]="isReviewMode">
              </p-inputMask>
            </div>
          </div>
        </p-card>

        <!-- Continue with remaining sections... -->
        
      </form>
    </div>
  `,
  styles: [`
    .owner-details-section {
      padding: 0;
    }
  `]
})
export class OwnerDetailsComponent implements OnInit, OnChanges {
  @Input() formData: FormData = {};
  @Input() memberId: string = '';
  @Input() isReviewMode: boolean = false;
  @Output() formDataChange = new EventEmitter<FormData>();

  ownerForm!: FormGroup;
  maxDate = new Date();
  showAdditionalTrustedContact = false;

  // Dropdown Options
  stateOptions: DropdownOption[] = [
    { label: 'California', value: 'CA' },
    { label: 'New York', value: 'NY' },
    { label: 'Texas', value: 'TX' },
    { label: 'Florida', value: 'FL' },
    // Add more states as needed
  ];

  identificationTypeOptions: DropdownOption[] = [
    { label: 'Drivers License', value: 'drivers-license' },
    { label: 'Passport', value: 'passport' },
    { label: 'Other', value: 'other' }
  ];

  employmentOptions: DropdownOption[] = [
    { label: 'Employed', value: 'employed' },
    { label: 'Self-Employed', value: 'self-employed' },
    { label: 'Unemployed', value: 'unemployed' },
    { label: 'Retired', value: 'retired' },
    { label: 'Student', value: 'student' }
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
    { label: 'Attorney', value: 'attorney' },
    { label: 'Accountant', value: 'accountant' },
    { label: 'Other', value: 'other' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.loadFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] || changes['memberId']) {
      this.loadFormData();
    }
  }

  private initializeForm() {
    this.ownerForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleInitial: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      ssn: ['', Validators.required],
      primaryPhone: ['', Validators.required],
      secondaryPhone: [''],
      email: ['', [Validators.required, Validators.email]],
      
      // Address Information
      homeAddress1: ['', Validators.required],
      homeAddress2: [''],
      homeCity: ['', Validators.required],
      homeZip: ['', Validators.required],
      mailingAddress1: [''],
      mailingAddress2: [''],
      mailingCity: [''],
      mailingZip: [''],
      citizenship: ['', Validators.required],
      
      // Identification
      identificationType: ['', Validators.required],
      idNumber: ['', Validators.required],
      idIssueDate: [''],
      idExpDate: [''],
      
      // Employment
      employmentStatus: ['', Validators.required],
      occupation: [''],
      industry: [''],
      employerName: [''],
      employerPhone: [''],
      employerAddress: [''],
      employerCity: [''],
      employerZip: [''],
      
      // Disclosure Questions
      publicCompanyAffiliation: ['', Validators.required],
      brokerDealerAffiliation: ['', Validators.required],
      
      // Financial Information
      annualIncome: ['', Validators.required],
      netWorth: [''],
      sourceOfFunds: ['', Validators.required],
      ongoingSourceOfFunds: [''],
      
      // Trusted Contact
      addTrustedToAll: [false],
      trustedFirstName: [''],
      trustedMiddleInitial: [''],
      trustedLastName: [''],
      trustedSuffix: [''],
      trustedPhone: [''],
      trustedMobile: [''],
      trustedEmail: [''],
      trustedAddress: [''],
      trustedCity: [''],
      trustedZip: [''],
      trustedRelationship: [''],
      
      // Additional Trusted Contact
      addAdditionalTrustedToAll: [false],
      additionalTrustedFirstName: [''],
      additionalTrustedMiddleInitial: [''],
      additionalTrustedLastName: [''],
      additionalTrustedSuffix: [''],
      additionalTrustedPhone: [''],
      additionalTrustedMobile: [''],
      additionalTrustedEmail: [''],
      additionalTrustedAddress: [''],
      additionalTrustedCity: [''],
      additionalTrustedZip: [''],
      additionalTrustedRelationship: ['']
    });
  }

  private loadFormData() {
    if (this.formData && this.memberId && this.formData[this.memberId]) {
      const memberData = this.formData[this.memberId];
      this.ownerForm.patchValue(memberData);
    }
  }

  onSameAsHomeChange(event: any) {
    if (event.checked) {
      // Copy home address to mailing address
      this.ownerForm.patchValue({
        mailingAddress1: this.ownerForm.get('homeAddress1')?.value,
        mailingAddress2: this.ownerForm.get('homeAddress2')?.value,
        mailingCity: this.ownerForm.get('homeCity')?.value,
        mailingZip: this.ownerForm.get('homeZip')?.value
      });
    }
  }

  addAdditionalTrustedContact() {
    this.showAdditionalTrustedContact = true;
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      const updatedFormData = { ...this.formData };
      updatedFormData[this.memberId] = { ...this.ownerForm.value };
      this.formDataChange.emit(updatedFormData);
    }
  }
}