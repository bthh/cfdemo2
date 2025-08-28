import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, SharedModule } from 'primeng/api';

// Local Imports
import { FormData } from '../../../../shared/models/types';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-firm-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextareaModule,
    RadioButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    SharedModule
  ],
  providers: [MessageService],
  template: `
    <div class="firm-details-section">
      
      <!-- Edit Mode - Form -->
      <form *ngIf="!isReviewMode" [formGroup]="firmForm" (ngSubmit)="onSubmit()">
        
        <!-- Existing Product Information Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">Existing Product Information</div>
          </ng-template>
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="investmentName" class="block text-900 font-medium mb-2">
                Investment Name
              </label>
              <input
                pInputText
                id="investmentName"
                formControlName="investmentName"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="productType" class="block text-900 font-medium mb-2">
                Product Type
              </label>
              <input
                pInputText
                id="productType"
                formControlName="productType"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="accountPolicyNumber" class="block text-900 font-medium mb-2">
                Account/Policy Number
              </label>
              <input
                pInputText
                id="accountPolicyNumber"
                formControlName="accountPolicyNumber"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="initialDateOfPurchase" class="block text-900 font-medium mb-2">
                Initial Date of Purchase
              </label>
              <p-calendar
                inputId="initialDateOfPurchase"
                formControlName="initialDateOfPurchase"
                dateFormat="mm/dd/yy"
                [showIcon]="true"
                placeholder="N/A"
                styleClass="w-full compact-autocomplete">
              </p-calendar>
            </div>
            
            <div class="col-12 md:col-6">
              <label for="initialPremiumInvestment" class="block text-900 font-medium mb-2">
                Initial Premium/Investment Amount
              </label>
              <input
                pInputText
                id="initialPremiumInvestment"
                formControlName="initialPremiumInvestment"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="currentAccountValue" class="block text-900 font-medium mb-2">
                Current Account Value
              </label>
              <input
                pInputText
                id="currentAccountValue"
                formControlName="currentAccountValue"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="approximateAnnualCost" class="block text-900 font-medium mb-2">
                Approximate Annual Cost
              </label>
              <input
                pInputText
                id="approximateAnnualCost"
                formControlName="approximateAnnualCost"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="currentSurrenderValue" class="block text-900 font-medium mb-2">
                Current Surrender Value
              </label>
              <input
                pInputText
                id="currentSurrenderValue"
                formControlName="currentSurrenderValue"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="surrenderSalesPenaltyCharges" class="block text-900 font-medium mb-2">
                Surrender, Sales or Penalty Charge(s) (Dollar amount OR Percentage)
              </label>
              <input
                pInputText
                id="surrenderSalesPenaltyCharges"
                formControlName="surrenderSalesPenaltyCharges"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="deathBenefitRiderValue" class="block text-900 font-medium mb-2">
                Death Benefit Rider Value (For Annuities)
              </label>
              <input
                pInputText
                id="deathBenefitRiderValue"
                formControlName="deathBenefitRiderValue"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="livingBenefitRiderValue" class="block text-900 font-medium mb-2">
                Living Benefit Rider Value (For Annuities)
              </label>
              <input
                pInputText
                id="livingBenefitRiderValue"
                formControlName="livingBenefitRiderValue"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12 md:col-6">
              <label for="outstandingLoanAmount" class="block text-900 font-medium mb-2">
                Outstanding Loan Amount
              </label>
              <input
                pInputText
                id="outstandingLoanAmount"
                formControlName="outstandingLoanAmount"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12">
              <label for="wasExistingProductRecommended" class="block text-900 font-medium mb-2">
                Was existing product recommended by the same Advisor?
              </label>
              <input
                pInputText
                id="wasExistingProductRecommended"
                formControlName="wasExistingProductRecommended"
                placeholder="N/A"
                class="w-full" />
            </div>
          </div>
        </p-card>

        <!-- Employer Sponsored Retirement Plans Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">For Employer Sponsored Retirement Plans and IRAs: (Only show this section for all IRAs and Employer Sponsored Reg types?)</div>
          </ng-template>
          <div class="grid">
            <div class="col-12">
              <label for="recommendationIncludeRetainFunds" class="block text-900 font-medium mb-2">
                Did the recommendation include the decision to retain funds in the existing or source account?
              </label>
              <input
                pInputText
                id="recommendationIncludeRetainFunds"
                formControlName="recommendationIncludeRetainFunds"
                placeholder="N/A"
                class="w-full" />
            </div>
          </div>
        </p-card>

        <!-- Investment Policy Statement Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">Investment Policy Statement (only for UMAs)</div>
          </ng-template>
          <div class="grid">
            <div class="col-12">
              <label class="block text-900 font-medium mb-3">
                Generally the equity to fixed income ratio in Client's Account is expected to be in the following range:
              </label>
              
              <div class="field-radiobutton mb-3">
                <p-radioButton
                  inputId="equity_preservation"
                  name="equityRatio"
                  value="preservation"
                  formControlName="equityRatio">
                </p-radioButton>
                <label for="equity_preservation" class="ml-2">
                  Preservation
                </label>
              </div>
              
              <div class="field-radiobutton mb-3">
                <p-radioButton
                  inputId="equity_income"
                  name="equityRatio"
                  value="income"
                  formControlName="equityRatio">
                </p-radioButton>
                <label for="equity_income" class="ml-2">
                  Income
                </label>
              </div>
              
              <div class="field-radiobutton mb-3">
                <p-radioButton
                  inputId="equity_growth_income"
                  name="equityRatio"
                  value="growth-income"
                  formControlName="equityRatio">
                </p-radioButton>
                <label for="equity_growth_income" class="ml-2">
                  Growth and Income
                </label>
              </div>
              
              <div class="field-radiobutton mb-3">
                <p-radioButton
                  inputId="equity_growth"
                  name="equityRatio"
                  value="growth"
                  formControlName="equityRatio">
                </p-radioButton>
                <label for="equity_growth" class="ml-2">
                  Growth
                </label>
              </div>
              
              <div class="field-radiobutton mb-3">
                <p-radioButton
                  inputId="equity_aggressive_growth"
                  name="equityRatio"
                  value="aggressive-growth"
                  formControlName="equityRatio">
                </p-radioButton>
                <label for="equity_aggressive_growth" class="ml-2">
                  Aggressive Growth
                </label>
              </div>
              
              <div class="field-radiobutton mb-3">
                <p-radioButton
                  inputId="equity_other"
                  name="equityRatio"
                  value="other"
                  formControlName="equityRatio">
                </p-radioButton>
                <label for="equity_other" class="ml-2">
                  Other - Please fill in allocation model
                </label>
                <input
                  *ngIf="firmForm.get('equityRatio')?.value === 'other'"
                  pInputText
                  id="equityRatioOther"
                  formControlName="equityRatioOther"
                  placeholder="e.g. 60/40"
                  class="mt-2 ml-7"
                  style="width: 80px; max-width: 80px;" />
              </div>
            </div>
            
            <div class="col-12">
              <label for="allocationModelExplanation" class="block text-900 font-medium mb-2">
                If the allocation model selected does not match the Client's Risk Tolerance Questionnaire, please explain why:
              </label>
              <input
                pInputText
                id="allocationModelExplanation"
                formControlName="allocationModelExplanation"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12">
              <label for="nonQualifiedAssetConsiderations" class="block text-900 font-medium mb-2">
                If the assets to be managed are non-qualified, are the additional tax considerations that should be noted (for example: carry over losses, AMT liability or gains from other sources)
              </label>
              <input
                pInputText
                id="nonQualifiedAssetConsiderations"
                formControlName="nonQualifiedAssetConsiderations"
                placeholder="N/A"
                class="w-full" />
            </div>
            
            <div class="col-12">
              <label for="additionalInvestmentInstructions" class="block text-900 font-medium mb-2">
                Are there any additional instructions or restrictions regarding investment selection? If so, please describe:
              </label>
              <input
                pInputText
                id="additionalInvestmentInstructions"
                formControlName="additionalInvestmentInstructions"
                placeholder="N/A"
                class="w-full" />
            </div>
          </div>
        </p-card>

        <!-- Additional Account Information Card -->
        <p-card class="mb-4">
          <ng-template pTemplate="header">
            <div class="card-header-custom">Additional Account Information</div>
          </ng-template>
          <div class="grid">
            <div class="col-12 md:col-3">
              <label for="patriotActForeignFinancial" class="block text-900 font-medium mb-2">
                Patriot Act Foreign Financial Institution
              </label>
              <p-checkbox
                inputId="patriotActForeignFinancial"
                formControlName="patriotActForeignFinancial"
                [binary]="true">
              </p-checkbox>
            </div>
            
            <div class="col-12 md:col-3">
              <label for="patriotActPrivateBanking" class="block text-900 font-medium mb-2">
                Patriot Act Private Banking Account
              </label>
              <p-checkbox
                inputId="patriotActPrivateBanking"
                formControlName="patriotActPrivateBanking"
                [binary]="true">
              </p-checkbox>
            </div>
            
            <div class="col-12 md:col-3">
              <label for="patriotActOffshoreBank" class="block text-900 font-medium mb-2">
                Patriot Act Offshore Bank
              </label>
              <p-checkbox
                inputId="patriotActOffshoreBank"
                formControlName="patriotActOffshoreBank"
                [binary]="true">
              </p-checkbox>
            </div>
            
            <div class="col-12 md:col-3">
              <label for="patriotActGovernmentOfficial" class="block text-900 font-medium mb-2">
                Patriot Act Government Official
              </label>
              <p-checkbox
                inputId="patriotActGovernmentOfficial"
                formControlName="patriotActGovernmentOfficial"
                [binary]="true">
              </p-checkbox>
            </div>
          </div>
        </p-card>

        <!-- Member Firm Details -->
        <div *ngIf="isMemberEntity">
          
          <!-- Net Worth Assessment Card -->
          <p-card class="mb-4">
            <ng-template pTemplate="header">
              <div class="card-header-custom">Networth</div>
            </ng-template>
            <div class="grid">
              <div class="col-12 md:col-6">
                <label for="totalNetWorth" class="block text-900 font-medium mb-2">
                  Total Net Worth <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="totalNetWorth"
                  formControlName="totalNetWorth"
                  [options]="totalNetWorthOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select total net worth"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('totalNetWorth')?.invalid && firmForm.get('totalNetWorth')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('totalNetWorth')?.invalid && firmForm.get('totalNetWorth')?.touched">
                  Total net worth is required
                </small>
              </div>
              
              <div class="col-12 md:col-6">
                <label for="liquidNetWorth" class="block text-900 font-medium mb-2">
                  Liquid Net Worth <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="liquidNetWorth"
                  formControlName="liquidNetWorth"
                  [options]="liquidNetWorthOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select liquid net worth"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('liquidNetWorth')?.invalid && firmForm.get('liquidNetWorth')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('liquidNetWorth')?.invalid && firmForm.get('liquidNetWorth')?.touched">
                  Liquid net worth is required
                </small>
              </div>
              
              <div class="col-12 md:col-6">
                <label for="averageAnnualIncome" class="block text-900 font-medium mb-2">
                  Average Annual Income (Last 3 Years) <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="averageAnnualIncome"
                  formControlName="averageAnnualIncome"
                  [options]="averageIncomeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select average annual income"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('averageAnnualIncome')?.invalid && firmForm.get('averageAnnualIncome')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('averageAnnualIncome')?.invalid && firmForm.get('averageAnnualIncome')?.touched">
                  Average annual income is required
                </small>
              </div>
              
              <div class="col-12 md:col-6">
                <label for="incomeSource" class="block text-900 font-medium mb-2">
                  Primary Source of Income <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="incomeSource"
                  formControlName="incomeSource"
                  [options]="incomeSourceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select primary income source"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('incomeSource')?.invalid && firmForm.get('incomeSource')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('incomeSource')?.invalid && firmForm.get('incomeSource')?.touched">
                  Primary income source is required
                </small>
              </div>
            </div>
          </p-card>

          <!-- Investment Experience Card -->
          <p-card header="Investment Experience" class="mb-4">
            <div class="grid">
              <div class="col-12 md:col-6">
                <label for="investmentExperience" class="block text-900 font-medium mb-2">
                  Overall Investment Experience <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="investmentExperience"
                  formControlName="investmentExperience"
                  [options]="investmentExperienceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select investment experience"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('investmentExperience')?.invalid && firmForm.get('investmentExperience')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('investmentExperience')?.invalid && firmForm.get('investmentExperience')?.touched">
                  Overall investment experience is required
                </small>
              </div>
              
              <div class="col-12 md:col-6">
                <label for="stocksExperience" class="block text-900 font-medium mb-2">
                  Stocks Experience <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="stocksExperience"
                  formControlName="stocksExperience"
                  [options]="experienceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select stocks experience"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('stocksExperience')?.invalid && firmForm.get('stocksExperience')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('stocksExperience')?.invalid && firmForm.get('stocksExperience')?.touched">
                  Stocks experience is required
                </small>
              </div>
              
              <div class="col-12 md:col-6">
                <label for="bondsExperience" class="block text-900 font-medium mb-2">
                  Bonds Experience <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="bondsExperience"
                  formControlName="bondsExperience"
                  [options]="experienceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select bonds experience"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('bondsExperience')?.invalid && firmForm.get('bondsExperience')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('bondsExperience')?.invalid && firmForm.get('bondsExperience')?.touched">
                  Bonds experience is required
                </small>
              </div>
              
              <div class="col-12 md:col-6">
                <label for="optionsExperience" class="block text-900 font-medium mb-2">
                  Options/Derivatives Experience <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="optionsExperience"
                  formControlName="optionsExperience"
                  [options]="experienceOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select options experience"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('optionsExperience')?.invalid && firmForm.get('optionsExperience')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('optionsExperience')?.invalid && firmForm.get('optionsExperience')?.touched">
                  Options/derivatives experience is required
                </small>
              </div>
            </div>
          </p-card>

          <!-- Liquidity Needs Card -->
          <p-card header="Liquidity Needs" class="mb-4">
            <div class="grid">
              <div class="col-12">
                <label for="liquidityNeeds" class="block text-900 font-medium mb-2">
                  How much of your portfolio do you need to access within 2 years? <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="liquidityNeeds"
                  formControlName="liquidityNeeds"
                  [options]="liquidityNeedsOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select liquidity needs"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('liquidityNeeds')?.invalid && firmForm.get('liquidityNeeds')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('liquidityNeeds')?.invalid && firmForm.get('liquidityNeeds')?.touched">
                  Portfolio liquidity needs are required
                </small>
              </div>
              
              <div class="col-12">
                <label for="emergencyFund" class="block text-900 font-medium mb-2">
                  Do you have an emergency fund outside of this account? <span class="text-red-500">*</span>
                </label>
                <p-dropdown
                  inputId="emergencyFund"
                  formControlName="emergencyFund"
                  [options]="emergencyFundOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select emergency fund status"
                  styleClass="w-full compact-autocomplete"
                  [class.ng-invalid]="firmForm.get('emergencyFund')?.invalid && firmForm.get('emergencyFund')?.touched">
                </p-dropdown>
                <small class="p-error" *ngIf="firmForm.get('emergencyFund')?.invalid && firmForm.get('emergencyFund')?.touched">
                  Emergency fund status is required
                </small>
              </div>
              
              <div class="col-12">
                <label for="liquidityPurpose" class="block text-900 font-medium mb-2">
                  If you need liquidity, what would be the primary purpose?
                </label>
                <textarea
                  pInputTextarea
                  id="liquidityPurpose"
                  formControlName="liquidityPurpose"
                  rows="2"
                  placeholder="e.g., home purchase, education, medical expenses, etc."
                  class="w-full">
                </textarea>
              </div>
            </div>
          </p-card>

          <!-- Market Conditions Card -->
          <p-card header="Market Conditions" class="mb-4">
            <div class="grid">
              <div class="col-12">
                <label class="block text-900 font-medium mb-3">
                  If your investment portfolio declined by 10% in one month, you would: <span class="text-red-500">*</span>
                </label>
                
                <div class="field-radiobutton mb-3">
                  <p-radioButton
                    inputId="scenario1_sell-all"
                    name="scenario1"
                    value="sell-all"
                    formControlName="scenario1">
                  </p-radioButton>
                  <label for="scenario1_sell-all" class="ml-2">
                    Sell all investments immediately
                  </label>
                </div>
                
                <div class="field-radiobutton mb-3">
                  <p-radioButton
                    inputId="scenario1_sell-some"
                    name="scenario1"
                    value="sell-some"
                    formControlName="scenario1">
                  </p-radioButton>
                  <label for="scenario1_sell-some" class="ml-2">
                    Sell some investments to reduce risk
                  </label>
                </div>
                
                <div class="field-radiobutton mb-3">
                  <p-radioButton
                    inputId="scenario1_hold"
                    name="scenario1"
                    value="hold"
                    formControlName="scenario1">
                  </p-radioButton>
                  <label for="scenario1_hold" class="ml-2">
                    Hold your investments and wait for recovery
                  </label>
                </div>
                
                <div class="field-radiobutton mb-3">
                  <p-radioButton
                    inputId="scenario1_buy-more"
                    name="scenario1"
                    value="buy-more"
                    formControlName="scenario1">
                  </p-radioButton>
                  <label for="scenario1_buy-more" class="ml-2">
                    Buy more investments at lower prices
                  </label>
                </div>
                
                <small class="p-error" *ngIf="firmForm.get('scenario1')?.invalid && firmForm.get('scenario1')?.touched">
                  Market decline response is required
                </small>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Account Firm Details -->
        <div *ngIf="!isMemberEntity">
          
          <!-- Account Firm Details Card -->
          <p-card header="Broker Dealer Info" class="mb-4">
            <div class="grid">
              <div class="col-12">
                <label for="investmentObjectives" class="block text-900 font-medium mb-2">
                  Investment Objectives <span class="text-red-500">*</span>
                </label>
                <textarea
                  pInputTextarea
                  id="investmentObjectives"
                  formControlName="investmentObjectives"
                  rows="4"
                  placeholder="Describe the investment objectives for this account..."
                  class="w-full"
                  [class.ng-invalid]="firmForm.get('investmentObjectives')?.invalid && firmForm.get('investmentObjectives')?.touched">
                </textarea>
                <small class="p-error" *ngIf="firmForm.get('investmentObjectives')?.invalid && firmForm.get('investmentObjectives')?.touched">
                  Investment objectives are required
                </small>
              </div>
              
              <div class="col-12">
                <label for="recommendations" class="block text-900 font-medium mb-2">
                  Recommendations <span class="text-red-500">*</span>
                </label>
                <textarea
                  pInputTextarea
                  id="recommendations"
                  formControlName="recommendations"
                  rows="4"
                  placeholder="Provide investment recommendations for this account..."
                  class="w-full"
                  [class.ng-invalid]="firmForm.get('recommendations')?.invalid && firmForm.get('recommendations')?.touched">
                </textarea>
                <small class="p-error" *ngIf="firmForm.get('recommendations')?.invalid && firmForm.get('recommendations')?.touched">
                  Recommendations are required
                </small>
              </div>
              
              <div class="col-12">
                <label for="alternativeSuggestions" class="block text-900 font-medium mb-2">
                  Alternative Suggestions <span class="text-red-500">*</span>
                </label>
                <textarea
                  pInputTextarea
                  id="alternativeSuggestions"
                  formControlName="alternativeSuggestions"
                  rows="4"
                  placeholder="Suggest alternative investment options for this account..."
                  class="w-full"
                  [class.ng-invalid]="firmForm.get('alternativeSuggestions')?.invalid && firmForm.get('alternativeSuggestions')?.touched">
                </textarea>
                <small class="p-error" *ngIf="firmForm.get('alternativeSuggestions')?.invalid && firmForm.get('alternativeSuggestions')?.touched">
                  Alternative suggestions are required
                </small>
              </div>
            </div>
          </p-card>
        </div>

      </form>

      <!-- Review Mode - Comprehensive Display -->
      <div *ngIf="isReviewMode" class="review-mode-container">
        
        <!-- Existing Product Information Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Existing Product Information</div>
            <p-button 
              [label]="sectionEditMode['firm-details'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['firm-details'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['firm-details'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('firm-details')">
            </p-button>
          </div>
          
          <!-- Edit Mode: Show editable form -->
          <div *ngIf="sectionEditMode['firm-details']" class="p-4">
            <div class="grid">
              <div class="col-12 md:col-6">
                <label for="investmentName" class="block text-900 font-medium mb-2">Investment Name</label>
                <input
                  pInputText
                  id="investmentName"
                  formControlName="investmentName"
                  placeholder="Enter investment name"
                  class="w-full" />
              </div>
              <div class="col-12 md:col-6">
                <label for="productType" class="block text-900 font-medium mb-2">Product Type</label>
                <input
                  pInputText
                  id="productType"
                  formControlName="productType"
                  placeholder="Enter product type"
                  class="w-full" />
              </div>
              <div class="col-12 md:col-6">
                <label for="accountPolicyNumber" class="block text-900 font-medium mb-2">Account/Policy Number</label>
                <input
                  pInputText
                  id="accountPolicyNumber"
                  formControlName="accountPolicyNumber"
                  placeholder="Enter account/policy number"
                  class="w-full" />
              </div>
              <div class="col-12 md:col-6">
                <label for="currentAccountValue" class="block text-900 font-medium mb-2">Current Account Value</label>
                <input
                  pInputText
                  id="currentAccountValue"
                  formControlName="currentAccountValue"
                  placeholder="Enter current value"
                  class="w-full" />
              </div>
            </div>
          </div>
          
          <!-- View Mode: Show read-only display -->
          <div *ngIf="!sectionEditMode['firm-details']" class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Investment Name</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('investmentName')?.value}">
                {{firmForm.get('investmentName')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Product Type</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('productType')?.value}">
                {{firmForm.get('productType')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Account/Policy Number</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('accountPolicyNumber')?.value}">
                {{firmForm.get('accountPolicyNumber')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Initial Date of Purchase</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('initialDateOfPurchase')?.value}">
                {{(firmForm.get('initialDateOfPurchase')?.value | date:'shortDate') || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Initial Premium/Investment Amount</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('initialPremiumInvestment')?.value}">
                {{firmForm.get('initialPremiumInvestment')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Current Account Value</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('currentAccountValue')?.value}">
                {{firmForm.get('currentAccountValue')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Approximate Annual Cost</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('approximateAnnualCost')?.value}">
                {{firmForm.get('approximateAnnualCost')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Current Surrender Value</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('currentSurrenderValue')?.value}">
                {{firmForm.get('currentSurrenderValue')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Surrender/Sales/Penalty Charges</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('surrenderSalesPenaltyCharges')?.value}">
                {{firmForm.get('surrenderSalesPenaltyCharges')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Death Benefit Rider Value</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('deathBenefitRiderValue')?.value}">
                {{firmForm.get('deathBenefitRiderValue')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Living Benefit Rider Value</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('livingBenefitRiderValue')?.value}">
                {{firmForm.get('livingBenefitRiderValue')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Outstanding Loan Amount</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('outstandingLoanAmount')?.value}">
                {{firmForm.get('outstandingLoanAmount')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Was Product Recommended by Same Advisor</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('wasExistingProductRecommended')?.value}">
                {{firmForm.get('wasExistingProductRecommended')?.value || 'N/A'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Employer Sponsored Retirement Plans Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Employer Sponsored Retirement Plans and IRAs</div>
            <p-button 
              [label]="sectionEditMode['retirement-plans'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['retirement-plans'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['retirement-plans'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('retirement-plans')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Recommendation Include Retain Funds</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('recommendationIncludeRetainFunds')?.value}">
                {{firmForm.get('recommendationIncludeRetainFunds')?.value || 'N/A'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Investment Policy Statement Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Investment Policy Statement (UMAs)</div>
            <p-button 
              [label]="sectionEditMode['investment-policy'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['investment-policy'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['investment-policy'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('investment-policy')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Equity to Fixed Income Ratio</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('equityRatio')?.value}">
                {{getEquityRatioDisplayValue() || 'Not provided'}}
              </div>
            </div>
            
            <div class="review-field-group" *ngIf="firmForm.get('equityRatio')?.value === 'other'">
              <div class="review-field-label">Other Allocation Model</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('equityRatioOther')?.value}">
                {{firmForm.get('equityRatioOther')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Allocation Model Explanation</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('allocationModelExplanation')?.value}">
                {{firmForm.get('allocationModelExplanation')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Non-Qualified Asset Considerations</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('nonQualifiedAssetConsiderations')?.value}">
                {{firmForm.get('nonQualifiedAssetConsiderations')?.value || 'N/A'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Additional Investment Instructions</div>
              <div class="review-field-value"
                   [ngClass]="{'empty': !firmForm.get('additionalInvestmentInstructions')?.value}">
                {{firmForm.get('additionalInvestmentInstructions')?.value || 'N/A'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Account Information Section -->
        <div class="review-mode-section">
          <div class="review-mode-section-header">
            <div class="review-mode-section-title">Additional Account Information - Patriot Act</div>
            <p-button 
              [label]="sectionEditMode['patriot-act'] ? 'Save' : 'Edit'" 
              [icon]="sectionEditMode['patriot-act'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
              size="small" 
              [severity]="sectionEditMode['patriot-act'] ? 'success' : 'secondary'"
              styleClass="edit-section-button"
              (onClick)="toggleSectionEdit('patriot-act')">
            </p-button>
          </div>
          <div class="review-mode-grid">
            <div class="review-field-group">
              <div class="review-field-label">Foreign Financial Institution</div>
              <div class="review-field-value">
                {{firmForm.get('patriotActForeignFinancial')?.value ? 'Yes' : 'No'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Private Banking Account</div>
              <div class="review-field-value">
                {{firmForm.get('patriotActPrivateBanking')?.value ? 'Yes' : 'No'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Offshore Bank</div>
              <div class="review-field-value">
                {{firmForm.get('patriotActOffshoreBank')?.value ? 'Yes' : 'No'}}
              </div>
            </div>
            
            <div class="review-field-group">
              <div class="review-field-label">Government Official</div>
              <div class="review-field-value">
                {{firmForm.get('patriotActGovernmentOfficial')?.value ? 'Yes' : 'No'}}
              </div>
            </div>
          </div>
        </div>

        <!-- Member Firm Details Review -->
        <div *ngIf="isMemberEntity">
          
          <!-- Net Worth Assessment Section -->
          <div class="review-mode-section">
            <div class="review-mode-section-header">
              <div class="review-mode-section-title">Net Worth Assessment</div>
              <p-button 
                [label]="sectionEditMode['net-worth'] ? 'Save' : 'Edit'" 
                [icon]="sectionEditMode['net-worth'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
                size="small" 
                [severity]="sectionEditMode['net-worth'] ? 'success' : 'secondary'"
                styleClass="edit-section-button"
                (onClick)="toggleSectionEdit('net-worth')">
              </p-button>
            </div>
            
            <!-- Edit Mode: Show editable form -->
            <div *ngIf="sectionEditMode['net-worth']" class="p-4">
              <div class="grid">
                <div class="col-12 md:col-6">
                  <label for="totalNetWorth" class="block text-900 font-medium mb-2">Total Net Worth <span class="text-red-500">*</span></label>
                  <p-dropdown
                    inputId="totalNetWorth"
                    formControlName="totalNetWorth"
                    [options]="totalNetWorthOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select total net worth"
                    styleClass="w-full compact-autocomplete">
                  </p-dropdown>
                </div>
                <div class="col-12 md:col-6">
                  <label for="liquidNetWorth" class="block text-900 font-medium mb-2">Liquid Net Worth <span class="text-red-500">*</span></label>
                  <p-dropdown
                    inputId="liquidNetWorth"
                    formControlName="liquidNetWorth"
                    [options]="liquidNetWorthOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select liquid net worth"
                    styleClass="w-full compact-autocomplete">
                  </p-dropdown>
                </div>
              </div>
            </div>
            
            <!-- View Mode: Show read-only display -->
            <div *ngIf="!sectionEditMode['net-worth']" class="review-mode-grid">
              <div class="review-field-group">
                <div class="review-field-label">Total Net Worth</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('totalNetWorth')?.value}">
                  {{getFieldDisplayValue('totalNetWorth', totalNetWorthOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Liquid Net Worth</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('liquidNetWorth')?.value}">
                  {{getFieldDisplayValue('liquidNetWorth', liquidNetWorthOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Average Annual Income</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('averageAnnualIncome')?.value}">
                  {{getFieldDisplayValue('averageAnnualIncome', averageIncomeOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Primary Income Source</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('incomeSource')?.value}">
                  {{getFieldDisplayValue('incomeSource', incomeSourceOptions) || 'Required field missing'}}
                </div>
              </div>
            </div>
          </div>

          <!-- Investment Experience Section -->
          <div class="review-mode-section">
            <div class="review-mode-section-header">
              <div class="review-mode-section-title">Investment Experience</div>
              <p-button 
                [label]="sectionEditMode['investment-experience'] ? 'Save' : 'Edit'" 
                [icon]="sectionEditMode['investment-experience'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
                size="small" 
                [severity]="sectionEditMode['investment-experience'] ? 'success' : 'secondary'"
                styleClass="edit-section-button"
                (onClick)="toggleSectionEdit('investment-experience')">
              </p-button>
            </div>
            <div class="review-mode-grid">
              <div class="review-field-group">
                <div class="review-field-label">Overall Investment Experience</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('investmentExperience')?.value}">
                  {{getFieldDisplayValue('investmentExperience', investmentExperienceOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Stocks Experience</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('stocksExperience')?.value}">
                  {{getFieldDisplayValue('stocksExperience', experienceOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Bonds Experience</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('bondsExperience')?.value}">
                  {{getFieldDisplayValue('bondsExperience', experienceOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Options/Derivatives Experience</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('optionsExperience')?.value}">
                  {{getFieldDisplayValue('optionsExperience', experienceOptions) || 'Required field missing'}}
                </div>
              </div>
            </div>
          </div>

          <!-- Liquidity Needs Section -->
          <div class="review-mode-section">
            <div class="review-mode-section-header">
              <div class="review-mode-section-title">Liquidity Needs</div>
              <p-button 
                [label]="sectionEditMode['liquidity-needs'] ? 'Save' : 'Edit'" 
                [icon]="sectionEditMode['liquidity-needs'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
                size="small" 
                [severity]="sectionEditMode['liquidity-needs'] ? 'success' : 'secondary'"
                styleClass="edit-section-button"
                (onClick)="toggleSectionEdit('liquidity-needs')">
              </p-button>
            </div>
            <div class="review-mode-grid">
              <div class="review-field-group">
                <div class="review-field-label">Portfolio Liquidity Needs (2 years)</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('liquidityNeeds')?.value}">
                  {{getFieldDisplayValue('liquidityNeeds', liquidityNeedsOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Emergency Fund Outside Account</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('emergencyFund')?.value}">
                  {{getFieldDisplayValue('emergencyFund', emergencyFundOptions) || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Liquidity Purpose</div>
                <div class="review-field-value"
                     [ngClass]="{'empty': !firmForm.get('liquidityPurpose')?.value}">
                  {{firmForm.get('liquidityPurpose')?.value || 'Not provided'}}
                </div>
              </div>
            </div>
          </div>

          <!-- Market Conditions Section -->
          <div class="review-mode-section">
            <div class="review-mode-section-header">
              <div class="review-mode-section-title">Market Conditions Response</div>
              <p-button 
                [label]="sectionEditMode['market-conditions'] ? 'Save' : 'Edit'" 
                [icon]="sectionEditMode['market-conditions'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
                size="small" 
                [severity]="sectionEditMode['market-conditions'] ? 'success' : 'secondary'"
                styleClass="edit-section-button"
                (onClick)="toggleSectionEdit('market-conditions')">
              </p-button>
            </div>
            <div class="review-mode-grid">
              <div class="review-field-group">
                <div class="review-field-label">10% Portfolio Decline Response</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('scenario1')?.value}">
                  {{getScenario1DisplayValue() || 'Required field missing'}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Firm Details Review -->
        <div *ngIf="!isMemberEntity">
          
          <!-- Firm Details Section -->
          <div class="review-mode-section">
            <div class="review-mode-section-header">
              <div class="review-mode-section-title">Broker Dealer Info</div>
              <p-button 
                [label]="sectionEditMode['firm-details-account'] ? 'Save' : 'Edit'" 
                [icon]="sectionEditMode['firm-details-account'] ? 'fa-solid fa-check' : 'fa-solid fa-pencil'" 
                size="small" 
                [severity]="sectionEditMode['firm-details-account'] ? 'success' : 'secondary'"
                styleClass="edit-section-button"
                (onClick)="toggleSectionEdit('firm-details-account')">
              </p-button>
            </div>
            <div class="review-mode-grid">
              <div class="review-field-group">
                <div class="review-field-label">Investment Objectives</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('investmentObjectives')?.value}">
                  {{firmForm.get('investmentObjectives')?.value || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Recommendations</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('recommendations')?.value}">
                  {{firmForm.get('recommendations')?.value || 'Required field missing'}}
                </div>
              </div>
              
              <div class="review-field-group">
                <div class="review-field-label">Alternative Suggestions</div>
                <div class="review-field-value"
                     [ngClass]="{'missing': !firmForm.get('alternativeSuggestions')?.value}">
                  {{firmForm.get('alternativeSuggestions')?.value || 'Required field missing'}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .firm-details-section {
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

    .field-radiobutton {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
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

    .text-red-500 {
      color: #ef4444;
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
  `]
})
export class FirmDetailsComponent implements OnInit, OnChanges {
  @Input() formData: FormData = {};
  @Input() entityId: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() isMemberEntity: boolean = true; // Determines which form to show
  @Input() highlightMissingFields: boolean = false;
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() disableQuickReview = new EventEmitter<void>();

  firmForm!: FormGroup;

  // Section edit mode tracking
  sectionEditMode: { [key: string]: boolean } = {
    'firm-details': false,
    'retirement-plans': false,
    'investment-policy': false,
    'patriot-act': false,
    'net-worth': false,
    'investment-experience': false,
    'liquidity-needs': false,
    'market-conditions': false,
    'firm-details-account': false
  };

  // Dropdown options exactly matching V2 specification
  totalNetWorthOptions: DropdownOption[] = [
    { label: 'Under $250,000', value: 'under-250k' },
    { label: '$250,000 - $500,000', value: '250k-500k' },
    { label: '$500,000 - $1,000,000', value: '500k-1m' },
    { label: '$1,000,000 - $5,000,000', value: '1m-5m' },
    { label: 'Over $5,000,000', value: 'over-5m' }
  ];

  liquidNetWorthOptions: DropdownOption[] = [
    { label: 'Under $100,000', value: 'under-100k' },
    { label: '$100,000 - $250,000', value: '100k-250k' },
    { label: '$250,000 - $500,000', value: '250k-500k' },
    { label: '$500,000 - $1,000,000', value: '500k-1m' },
    { label: 'Over $1,000,000', value: 'over-1m' }
  ];

  averageIncomeOptions: DropdownOption[] = [
    { label: 'Under $75,000', value: 'under-75k' },
    { label: '$75,000 - $150,000', value: '75k-150k' },
    { label: '$150,000 - $300,000', value: '150k-300k' },
    { label: '$300,000 - $500,000', value: '300k-500k' },
    { label: 'Over $500,000', value: 'over-500k' }
  ];

  incomeSourceOptions: DropdownOption[] = [
    { label: 'Employment/Salary', value: 'employment' },
    { label: 'Business Ownership', value: 'business' },
    { label: 'Investment Income', value: 'investments' },
    { label: 'Retirement/Pension', value: 'retirement' },
    { label: 'Other', value: 'other' }
  ];

  investmentExperienceOptions: DropdownOption[] = [
    { label: 'No Experience', value: 'none' },
    { label: 'Limited (1-3 years)', value: 'limited' },
    { label: 'Good (3-10 years)', value: 'good' },
    { label: 'Extensive (10+ years)', value: 'extensive' }
  ];

  experienceOptions: DropdownOption[] = [
    { label: 'None', value: 'none' },
    { label: 'Limited', value: 'limited' },
    { label: 'Good', value: 'good' },
    { label: 'Extensive', value: 'extensive' }
  ];

  liquidityNeedsOptions: DropdownOption[] = [
    { label: 'None (0%)', value: 'none' },
    { label: 'Low (1-10%)', value: 'low' },
    { label: 'Moderate (11-25%)', value: 'moderate' },
    { label: 'High (26-50%)', value: 'high' },
    { label: 'Very High (50%+)', value: 'very-high' }
  ];

  emergencyFundOptions: DropdownOption[] = [
    { label: 'Yes, 6+ months expenses', value: 'yes' },
    { label: 'Yes, 3-6 months expenses', value: 'partial' },
    { label: 'Yes, less than 3 months', value: 'minimal' },
    { label: 'No emergency fund', value: 'no' }
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  ngOnInit() {
    this.initializeForm();
    this.loadFormData();
    this.setupFormSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['formData'] || changes['entityId']) && this.firmForm) {
      this.loadFormData();
    }
  }

  private initializeForm() {
    // Base form fields (common to all entities)
    const baseFormConfig = {
      // Existing Product Information
      investmentName: [''],
      productType: [''],
      accountPolicyNumber: [''],
      initialDateOfPurchase: [''],
      initialPremiumInvestment: [''],
      currentAccountValue: [''],
      approximateAnnualCost: [''],
      currentSurrenderValue: [''],
      surrenderSalesPenaltyCharges: [''],
      deathBenefitRiderValue: [''],
      livingBenefitRiderValue: [''],
      outstandingLoanAmount: [''],
      wasExistingProductRecommended: [''],
      
      // Employer Sponsored Retirement Plans
      recommendationIncludeRetainFunds: [''],
      
      // Investment Policy Statement
      equityRatio: [''],
      equityRatioOther: [''],
      allocationModelExplanation: [''],
      nonQualifiedAssetConsiderations: [''],
      additionalInvestmentInstructions: [''],
      
      // Additional Account Information
      patriotActForeignFinancial: [false],
      patriotActPrivateBanking: [false],
      patriotActOffshoreBank: [false],
      patriotActGovernmentOfficial: [false]
    };
    
    if (this.isMemberEntity) {
      // Member firm details form
      this.firmForm = this.fb.group({
        ...baseFormConfig,
        totalNetWorth: ['', Validators.required],
        liquidNetWorth: ['', Validators.required],
        averageAnnualIncome: ['', Validators.required],
        incomeSource: ['', Validators.required],
        investmentExperience: ['', Validators.required],
        stocksExperience: ['', Validators.required],
        bondsExperience: ['', Validators.required],
        optionsExperience: ['', Validators.required],
        liquidityNeeds: ['', Validators.required],
        emergencyFund: ['', Validators.required],
        liquidityPurpose: [''],
        scenario1: ['', Validators.required]
      });
    } else {
      // Account firm details form
      this.firmForm = this.fb.group({
        ...baseFormConfig,
        investmentObjectives: ['', Validators.required],
        recommendations: ['', Validators.required],
        alternativeSuggestions: ['', Validators.required]
      });
    }
  }

  private loadFormData() {
    if (this.entityId === 'mary-smith') {
      console.log('🔍 MARY DEBUG: loadFormData called');
      console.log('🔍 MARY DEBUG: formData:', this.formData);
      console.log('🔍 MARY DEBUG: entityId:', this.entityId);
      console.log('🔍 MARY DEBUG: isMemberEntity:', this.isMemberEntity);
    }
    
    if (this.entityId === 'joint-account') {
      console.log('🔍 JOINT DEBUG: loadFormData called');
      console.log('🔍 JOINT DEBUG: formData:', this.formData);
      console.log('🔍 JOINT DEBUG: entityId:', this.entityId);
      console.log('🔍 JOINT DEBUG: isMemberEntity:', this.isMemberEntity);
    }
    
    if (this.formData && this.formData[this.entityId]) {
      const entityData = this.formData[this.entityId];
      
      if (this.entityId === 'mary-smith') {
        console.log('🔍 MARY DEBUG: entityData:', entityData);
        console.log('🔍 MARY DEBUG: investmentExperience in data:', entityData.investmentExperience);
        console.log('🔍 MARY DEBUG: bondsExperience in data:', entityData.bondsExperience);
        console.log('🔍 MARY DEBUG: form controls before patch:', Object.keys(this.firmForm.controls));
      }
      
      if (this.entityId === 'joint-account') {
        console.log('🔍 JOINT DEBUG: entityData:', entityData);
        console.log('🔍 JOINT DEBUG: investmentObjectives in data:', entityData['investmentObjectives']);
        console.log('🔍 JOINT DEBUG: recommendations in data:', entityData['recommendations']);
        console.log('🔍 JOINT DEBUG: form controls before patch:', Object.keys(this.firmForm.controls));
      }
      
      this.firmForm.patchValue(entityData);
      
      if (this.entityId === 'mary-smith') {
        console.log('🔍 MARY DEBUG: form values after patch:', this.firmForm.value);
        console.log('🔍 MARY DEBUG: investmentExperience form value:', this.firmForm.get('investmentExperience')?.value);
        console.log('🔍 MARY DEBUG: bondsExperience form value:', this.firmForm.get('bondsExperience')?.value);
      }
      
      if (this.entityId === 'joint-account') {
        console.log('🔍 JOINT DEBUG: form values after patch:', this.firmForm.value);
        console.log('🔍 JOINT DEBUG: investmentObjectives form value:', this.firmForm.get('investmentObjectives')?.value);
        console.log('🔍 JOINT DEBUG: recommendations form value:', this.firmForm.get('recommendations')?.value);
      }
    }
  }

  private setupFormSubscriptions() {
    // Clear the 'other' text field when a different equity ratio is selected
    this.firmForm.get('equityRatio')?.valueChanges.subscribe(value => {
      if (value !== 'other') {
        this.firmForm.get('equityRatioOther')?.setValue('');
      }
    });
    
    this.firmForm.valueChanges.subscribe(() => {
      this.updateFormData();
    });
  }

  private updateFormData() {
    const updatedFormData = { ...this.formData };
    if (!updatedFormData[this.entityId]) {
      updatedFormData[this.entityId] = {};
    }
    
    Object.assign(updatedFormData[this.entityId], this.firmForm.value);
    this.formDataChange.emit(updatedFormData);
  }

  onSubmit() {
    if (this.firmForm.valid) {
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

  getFieldDisplayValue(fieldName: string, options: DropdownOption[]): string {
    const value = this.firmForm.get(fieldName)?.value;
    if (!value) return '';
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getScenario1DisplayValue(): string {
    const value = this.firmForm.get('scenario1')?.value;
    if (!value) return '';
    
    const scenarioMap: { [key: string]: string } = {
      'sell-all': 'Sell all investments immediately',
      'sell-some': 'Sell some investments to reduce risk',
      'hold': 'Hold your investments and wait for recovery',
      'buy-more': 'Buy more investments at lower prices'
    };
    
    return scenarioMap[value] || value;
  }

  getEquityRatioDisplayValue(): string {
    const value = this.firmForm.get('equityRatio')?.value;
    if (!value) return '';
    
    const equityRatioMap: { [key: string]: string } = {
      'preservation': 'Preservation',
      'income': 'Income',
      'growth-income': 'Growth and Income',
      'growth': 'Growth',
      'aggressive-growth': 'Aggressive Growth',
      'other': 'Other - See allocation model'
    };
    
    return equityRatioMap[value] || value;
  }

  // Check if a field should be highlighted as missing
  shouldHighlightMissingField(fieldName: string): boolean {
    if (!this.highlightMissingFields) return false;
    
    // For firm-details, we don't typically have required fields that need highlighting
    // This can be expanded if needed for specific required fields
    return false;
  }
}