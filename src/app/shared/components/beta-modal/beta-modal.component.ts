import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-beta-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{width: '600px'}"
      [closable]="true"
      header="Choose Your Account Opening Experience"
      (onHide)="onClose()">
      
      <div class="modal-content">
        <p class="modal-description">
          Select how you'd like to open your new account. You can use our trusted legacy process or try our new streamlined beta experience.
        </p>
        
        <div class="experience-options">
          <!-- Legacy Interface -->
          <div class="experience-option">
            <div class="option-header">
              <div class="option-radio">
                <input type="radio" id="legacy" name="experience" value="legacy" checked>
                <label for="legacy"></label>
              </div>
              <div class="option-title">
                <span class="title-text">Legacy Interface</span>
                <span class="trusted-badge">Trusted</span>
              </div>
            </div>
            <p class="option-description">
              Use our established account opening process with familiar steps and comprehensive verification.
            </p>
            <button class="btn-legacy" (click)="onContinueWithLegacy()">
              Continue with Legacy
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <!-- Beta Experience -->
          <div class="experience-option beta-option">
            <div class="option-header">
              <div class="option-radio">
                <input type="radio" id="beta" name="experience" value="beta">
                <label for="beta"></label>
              </div>
              <div class="option-title">
                <span class="title-text">Beta Experience</span>
                <span class="new-badge">New</span>
              </div>
            </div>
            <p class="option-description">
              Try our new streamlined process with enhanced user experience and faster completion times.
            </p>
            <button class="btn-beta" (click)="onTryBetaExperience()">
              <i class="fa-solid fa-bolt"></i>
              TRY BETA EXPERIENCE
            </button>
          </div>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    .modal-content {
      padding: 1rem 0;
    }
    
    .modal-description {
      font-size: 0.95rem;
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    
    .experience-options {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .experience-option {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s ease;
      background: white;
    }
    
    .experience-option:hover {
      border-color: #d1d5db;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .beta-option {
      border-color: #3b82f6;
      background: #fafbff;
    }
    
    .option-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .option-radio {
      position: relative;
    }
    
    .option-radio input[type="radio"] {
      width: 20px;
      height: 20px;
      accent-color: #3b82f6;
    }
    
    .option-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .title-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
    }
    
    .trusted-badge {
      background: #f3f4f6;
      color: #374151;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .new-badge {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .option-description {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .btn-legacy {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: white;
      color: #374151;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-legacy:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
    
    .btn-beta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    
    .btn-beta:hover {
      background: #2563eb;
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }
  `]
})
export class BetaModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() tryBetaExperience = new EventEmitter<void>();
  @Output() continueWithLegacy = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.modalClosed.emit();
  }

  onTryBetaExperience() {
    this.tryBetaExperience.emit();
    this.onClose();
  }

  onContinueWithLegacy() {
    this.continueWithLegacy.emit();
    this.onClose();
  }
}