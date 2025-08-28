import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Local Imports
import { FormData, CompletionStatus } from '../../../../shared/models/types';
import { BeneficiaryDropdownComponent } from '../../../../shared/components/beneficiary-dropdown/beneficiary-dropdown.component';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    BeneficiaryDropdownComponent
  ],
  template: `
    <p-card header="Beneficiaries">
      <div class="p-grid p-fluid">
        <div class="p-col-12">
          <h4>Account Beneficiaries</h4>
          <p>Select or add beneficiaries for this account.</p>
          
          <div class="beneficiary-section">
            <app-beneficiary-dropdown
              [formData]="formData"
              [disabled]="isReviewMode">
            </app-beneficiary-dropdown>
          </div>
        </div>
      </div>
    </p-card>
  `,
  styles: [`
    .beneficiary-section {
      margin-top: 1rem;
    }
    
    h4 {
      color: #374151;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }
  `]
})
export class BeneficiariesComponent {
  @Input() formData: FormData = {};
  @Input() entityId: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() highlightMissingFields: boolean = false;
  
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() disableQuickReview = new EventEmitter<void>();
}