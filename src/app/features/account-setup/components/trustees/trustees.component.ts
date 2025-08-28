import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Local Imports
import { FormData, CompletionStatus } from '../../../../shared/models/types';
import { TrusteeDropdownComponent } from '../../../../shared/components/trustee-dropdown/trustee-dropdown.component';

@Component({
  selector: 'app-trustees',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TrusteeDropdownComponent
  ],
  template: `
    <p-card header="Trustees">
      <div class="p-grid p-fluid">
        <div class="p-col-12">
          <h4>Trust Trustees</h4>
          <p>Select or add trustees for this trust account.</p>
          
          <div class="trustee-section">
            <app-trustee-dropdown
              [formData]="formData"
              [disabled]="isReviewMode">
            </app-trustee-dropdown>
          </div>
        </div>
      </div>
    </p-card>
  `,
  styles: [`
    .trustee-section {
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
export class TrusteesComponent {
  @Input() formData: FormData = {};
  @Input() entityId: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() highlightMissingFields: boolean = false;
  
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() disableQuickReview = new EventEmitter<void>();
}