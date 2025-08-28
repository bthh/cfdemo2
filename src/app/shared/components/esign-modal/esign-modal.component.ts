import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface Signer {
  role: string;
  name: string;
  email: string;
  order: number;
  registrations?: string[];
}

@Component({
  selector: 'app-esign-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="esign-modal"
      [header]="accounts.length > 0 ? 'Send Ready Packages' : 'Send for E-Signature'"
      (onHide)="onClose()">
      
      <div class="modal-content">
        <div class="account-info">
          <h3>{{accounts.length > 0 ? 'Multiple Registrations' : accountName}}</h3>
          <p class="account-description" *ngIf="accounts.length === 0">Please review and confirm the signing order and contact information.</p>
          <ng-container *ngIf="accounts.length > 0">
            <p class="account-description">The following registrations are ready for signatures:</p>
            <ul class="accounts-list">
              <li *ngFor="let a of accounts">{{a.name}}</li>
            </ul>
          </ng-container>
        </div>

        <div class="signers-section">
          <h4>Signing Order</h4>
          <div class="signers-list">
            <div *ngFor="let signer of signers; let i = index" class="signer-item">
              <div class="signer-order">{{i + 1}}</div>
              <div class="signer-details">
                <div class="signer-role">{{signer.role}}</div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      pInputText 
                      [(ngModel)]="signer.name"
                      [placeholder]="'Enter ' + signer.role.toLowerCase() + ' name'"
                      class="form-control">
                  </div>
                  <div class="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      pInputText 
                      [(ngModel)]="signer.email"
                      [placeholder]="'Enter ' + signer.role.toLowerCase() + ' email'"
                      class="form-control">
                  </div>
                </div>
                <div *ngIf="signer.registrations?.length" class="registrations">
                  <span class="reg-label">Registrations:</span>
                  <span class="reg-item" *ngFor="let r of signer.registrations">{{r}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <p-button 
            label="Cancel" 
            severity="secondary"
            (onClick)="onClose()"
            styleClass="cancel-btn">
          </p-button>
          <p-button 
            label="Send for E-Signature" 
            severity="success"
            icon="pi pi-send"
            (onClick)="onSubmit()"
            [disabled]="!isFormValid()"
            styleClass="submit-btn">
          </p-button>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .esign-modal .p-dialog {
      width: 90vw;
      max-width: 600px;
      border-radius: 12px;
    }

    :host ::ng-deep .esign-modal .p-dialog-header {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem 2rem;
    }

    :host ::ng-deep .esign-modal .p-dialog-content {
      padding: 0;
    }

    .modal-content {
      padding: 2rem;
    }

    .account-info {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .account-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .account-description {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .accounts-list {
      margin: 0.75rem 0 0 1rem;
      color: #374151;
      font-size: 0.9rem;
    }

    .signers-section h4 {
      margin: 0 0 1.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
    }

    .signers-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .signer-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .signer-order {
      width: 32px;
      height: 32px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .signer-details {
      flex: 1;
    }

    .signer-role {
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .registrations {
      margin-top: 0.75rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .reg-label {
      color: #6b7280;
      font-size: 0.8rem;
      margin-right: 0.25rem;
    }

    .reg-item {
      background: #eef2ff;
      color: #4338ca;
      border: 1px solid #e0e7ff;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    :host ::ng-deep .cancel-btn {
      background: #f3f4f6 !important;
      color: #374151 !important;
      border-color: #d1d5db !important;
    }

    :host ::ng-deep .cancel-btn:hover {
      background: #e5e7eb !important;
      border-color: #9ca3af !important;
    }

    :host ::ng-deep .submit-btn {
      background: #10b981 !important;
      border-color: #10b981 !important;
    }

    :host ::ng-deep .submit-btn:hover {
      background: #059669 !important;
      border-color: #059669 !important;
    }

    :host ::ng-deep .submit-btn:disabled {
      background: #9ca3af !important;
      border-color: #9ca3af !important;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-actions {
        flex-direction: column-reverse;
      }
      
      :host ::ng-deep .esign-modal .p-dialog {
        width: 95vw;
        margin: 1rem;
      }
    }
  `]
})
export class EsignModalComponent {
  @Input() visible = false;
  @Input() accountId = '';
  @Input() accountName = '';
  @Input() accounts: Array<{id: string, name: string}> = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() esignSubmitted = new EventEmitter<{accountId?: string, accountIds?: string[], signers: Signer[]}>();

  signers: Signer[] = [];

  ngOnChanges() {
    if (this.visible) {
      this.setupSigners();
    }
  }

  private setupSigners() {
    this.signers = [];
    
    if (this.accounts && this.accounts.length > 0) {
      // Bulk mode: aggregate across all provided accounts
      const accountIds = this.accounts.map(a => a.id);
      const accountNames = this.accounts.map(a => a.name);

      // Representative signs all
      this.signers.push({
        role: 'Representative',
        name: 'Valued Advisor',
        email: 'Orion@demo.com',
        order: 1,
        registrations: accountNames
      });

      // Determine if John signs any of these
      const johnAccounts = this.accounts.filter(a => a.id === 'joint-account' || a.id === 'trust-account' || a.id === 'traditional-ira-account');
      if (johnAccounts.length > 0) {
        this.signers.push({
          role: 'Primary Owner',
          name: 'John Smith',
          email: this.getOwnerEmail('John Smith'),
          order: 2,
          registrations: johnAccounts.map(a => a.name)
        });
      }

      // Determine if Mary signs any of these
      const maryAccounts = this.accounts.filter(a => a.id === 'joint-account' || a.id === 'trust-account' || a.id === 'roth-ira-account');
      if (maryAccounts.length > 0) {
        this.signers.push({
          role: 'Joint Owner',
          name: 'Mary Smith',
          email: this.getOwnerEmail('Mary Smith'),
          order: this.signers.length + 1,
          registrations: maryAccounts.map(a => a.name)
        });
      }
      return;
    }

    // Single-account mode
    // Always add Representative first
    this.signers.push({
      role: 'Representative',
      name: 'Valued Advisor',
      email: 'Orion@demo.com',
      order: 1,
      registrations: [this.accountName]
    });

    // Add Primary Owner
    const primaryOwnerName = this.getPrimaryOwnerName();
    this.signers.push({
      role: 'Primary Owner',
      name: primaryOwnerName,
      email: this.getOwnerEmail(primaryOwnerName),
      order: 2,
      registrations: [this.accountName]
    });

    // Add Joint Owner for Trust and JTWROS accounts
    if (this.accountId === 'trust-account' || this.accountId === 'joint-account') {
      const jointOwnerName = this.getJointOwnerName();
      this.signers.push({
        role: 'Joint Owner',
        name: jointOwnerName,
        email: this.getOwnerEmail(jointOwnerName),
        order: 3,
        registrations: [this.accountName]
      });
    }
  }

  private getPrimaryOwnerName(): string {
    switch (this.accountId) {
      case 'joint-account':
        return 'John Smith';
      case 'roth-ira-account':
        return 'Mary Smith';
      case 'trust-account':
        return 'John Smith';
      case 'traditional-ira-account':
        return 'John Smith';
      default:
        return '';
    }
  }

  private getJointOwnerName(): string {
    switch (this.accountId) {
      case 'joint-account':
        return 'Mary Smith';
      case 'trust-account':
        return 'Mary Smith';
      default:
        return '';
    }
  }

  private getOwnerEmail(ownerName: string): string {
    // Generate demo email based on owner name
    if (ownerName === 'John Smith') {
      return 'john.smith@demo.com';
    } else if (ownerName === 'Mary Smith') {
      return 'mary.smith@demo.com';
    }
    return '';
  }

  isFormValid(): boolean {
    return this.signers.every(signer => 
      signer.name.trim() !== '' && 
      signer.email.trim() !== '' && 
      this.isValidEmail(signer.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.modalClosed.emit();
  }

  onSubmit() {
    if (this.isFormValid()) {
      if (this.accounts && this.accounts.length > 0) {
        this.esignSubmitted.emit({
          accountIds: this.accounts.map(a => a.id),
          signers: this.signers
        });
      } else {
        this.esignSubmitted.emit({
          accountId: this.accountId,
          signers: this.signers
        });
      }
      this.onClose();
    }
  }
}