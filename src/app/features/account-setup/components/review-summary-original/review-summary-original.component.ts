import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

// Local Imports  
import { FormData, CompletionStatus, Section } from '../../../../shared/models/types';
import { PdfPreviewModalComponent } from '../../../../shared/components/pdf-preview-modal/pdf-preview-modal.component';
import { AttachmentsModalComponent } from '../../../../shared/components/attachments-modal/attachments-modal.component';
import { EsignModalComponent } from '../../../../shared/components/esign-modal/esign-modal.component';

interface AccountSummary {
  id: string;
  name: string;
  owners: string;
  icon: string;
  completionPercentage: number;
  completedSections: number;
  totalSections: number;
  missingFields: string[];
  accountType: string;
  canSubmit: boolean;
  hasMissingFields: boolean;
  nextMissingSection: { entityId: string, sectionId: Section } | null;
  attachmentsCount: number;
  forms: string[];
}

@Component({
  selector: 'app-review-summary-original',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PdfPreviewModalComponent,
    AttachmentsModalComponent,
    EsignModalComponent
  ],
  template: `
    <div class="review-summary-original">
      <div class="header-section">
        <div class="header-content">
          <div class="header-text">
            <h2 class="page-title">Registration Overview and E-Signature</h2>
            <p class="page-subtitle">Review all account registrations and submit for e-signature when ready.</p>
          </div>
          <button 
            class="btn-send-all"
            [disabled]="getReadyAccountsCount() === 0"
            (click)="onOpenBulkEsignModal()">
            <i class="fa-regular fa-paper-plane"></i>
            Send Ready Packages
          </button>
        </div>
      </div>
      
      <div class="registrations-table">
        <div *ngFor="let account of accountSummaries" class="registration-row">
          <div class="registration-info">
            <h3 class="registration-title">{{account.name}}</h3>
            <div class="registration-meta">{{account.owners}}</div>
            <div class="registration-type">{{account.accountType}}</div>
          </div>
          
          <div class="action-links">
            <a *ngIf="account.id !== 'traditional-ira-account'" class="attachments-link" (click)="onViewAttachments(account.id); $event.stopPropagation()">{{account.attachmentsCount}} Attachments</a>
            <span *ngIf="account.id === 'traditional-ira-account'" class="attachments-text">0 Attachments</span>
            <a class="text-link" (click)="onPaperworkPreview(account.id)">Paperwork Preview</a>
          </div>
          
          <div class="completion-info">
            <div class="completion-percentage">{{account.completionPercentage}}% Complete</div>
            <div class="completion-sections">{{account.completedSections}}/{{account.totalSections}} sections</div>
          </div>
          
          <div class="action-buttons">
            <p-button 
              *ngIf="!account.canSubmit"
              label="Incomplete" 
              styleClass="p-button-danger p-button-sm incomplete-btn"
              (onClick)="onEditAccount(account.id)">
            </p-button>
            <p-button 
              *ngIf="account.canSubmit"
              label="Review" 
              styleClass="p-button-primary p-button-sm review-btn"
              (onClick)="onEditAccount(account.id)">
            </p-button>
            <p-button 
              label="Send E-sign" 
              styleClass="p-button-success p-button-sm esign-btn"
              [disabled]="!account.canSubmit"
              (onClick)="onSubmitForESign(account.id, account.name)">
            </p-button>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF Preview Modal -->
    <app-pdf-preview-modal
      [(visible)]="showPdfPreview"
      [accountName]="selectedAccountName">
    </app-pdf-preview-modal>

    <!-- Attachments Modal -->
    <app-attachments-modal
      [(visible)]="showAttachmentsModal"
      [registrationName]="selectedAccountName"
      [accountId]="selectedAccountId"
      (modalClosed)="onAttachmentsModalClosed()">
    </app-attachments-modal>

    <!-- E-Sign Modal -->
    <app-esign-modal
      [visible]="showEsignModal"
      [accountId]="selectedAccountId"
      [accountName]="selectedAccountName"
      [accounts]="bulkEsignAccounts"
      (visibleChange)="showEsignModal = $event"
      (modalClosed)="onEsignModalClosed()"
      (esignSubmitted)="onEsignSubmitted($event)">
    </app-esign-modal>
  `,
  styles: [`
    .review-summary-original {
      padding: 2rem;
      background: #ffffff;
      min-height: 100vh;
    }

    .header-section {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-text {
      flex: 1;
    }

    .page-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: #666;
      font-size: 0.875rem;
      margin: 0;
    }

    .btn-send-all {
      background: var(--color-green-5, #007a50);
      color: white;
      border: none;
      padding: 0.625rem 1.25rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-send-all:hover:not(:disabled) {
      background: var(--color-green-6, #005d3a);
    }

    .btn-send-all:disabled {
      background: var(--color-gray-3, #d0d0d5);
      color: var(--color-gray-5, #696a79);
      cursor: not-allowed;
    }

    .registrations-table {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .registration-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1.5fr;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .registration-row:last-child {
      border-bottom: none;
    }

    .registration-row:hover {
      background-color: #f9fafb;
    }

    .registration-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .registration-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .registration-meta {
      font-size: 0.875rem;
      color: #666;
    }

    .registration-type {
      font-size: 0.75rem;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .action-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .attachments-link {
      color: var(--color-blue-5, #006eb6);
      text-decoration: underline;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .attachments-link:hover {
      color: var(--color-blue-6, #005292);
    }

    .attachments-text {
      color: var(--color-gray-5, #696a79);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .text-link {
      background: none;
      border: none;
      color: var(--color-blue-5, #006eb6);
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      font-weight: 500;
    }

    .text-link:hover {
      color: var(--color-blue-6, #005292);
      text-decoration: underline;
    }

    .completion-info {
      text-align: center;
    }

    .completion-percentage {
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .completion-sections {
      font-size: 0.75rem;
      color: #666;
      margin-top: 0.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    :host ::ng-deep .p-button {
      font-size: 0.875rem !important;
      padding: 0.5rem 1rem !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      min-width: 130px !important;
      width: 130px !important;
      height: 36px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    :host ::ng-deep .incomplete-btn.p-button-danger {
      background-color: var(--color-red-5, #d70026) !important;
      border-color: var(--color-red-5, #d70026) !important;
      color: white !important;
    }

    :host ::ng-deep .incomplete-btn.p-button-danger:hover {
      background-color: var(--color-red-6, #a60016) !important;
      border-color: var(--color-red-6, #a60016) !important;
    }

    :host ::ng-deep .review-btn.p-button-primary {
      background-color: white !important;
      border-color: var(--color-blue-5, #006eb6) !important;
      color: var(--color-blue-5, #006eb6) !important;
    }

    :host ::ng-deep .review-btn.p-button-primary:hover {
      background-color: var(--color-blue-1, #eaf4ff) !important;
      border-color: var(--color-blue-5, #006eb6) !important;
      color: var(--color-blue-5, #006eb6) !important;
    }

    :host ::ng-deep .esign-btn.p-button-success {
      background-color: var(--color-green-5, #007a50) !important;
      border-color: var(--color-green-5, #007a50) !important;
    }

    :host ::ng-deep .esign-btn.p-button-success:disabled {
      background-color: var(--color-gray-3, #d0d0d5) !important;
      border-color: var(--color-gray-3, #d0d0d5) !important;
      color: var(--color-gray-5, #696a79) !important;
    }

    @media (max-width: 1024px) {
      .registration-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .action-links {
        flex-direction: row;
        gap: 1rem;
      }

      .completion-info {
        text-align: left;
      }

      .action-buttons {
        justify-content: flex-start;
      }
    }
  `]
})
export class ReviewSummaryOriginalComponent {
  @Input() formData: FormData = {};
  @Input() completionStatus: CompletionStatus = { accounts: {}, members: {} };
  @Input() activeRegistrationId: string = '';
  @Output() editAccount = new EventEmitter<string>();
  @Output() editAccountWithSection = new EventEmitter<any>();
  @Output() editAccountQuickReview = new EventEmitter<string>();
  @Output() submitForESign = new EventEmitter<string>();

  accountSummaries: AccountSummary[] = [];
  showPdfPreview = false;
  showAttachmentsModal = false;
  showEsignModal = false;
  selectedAccountName = '';
  selectedAccountId = '';
  bulkEsignAccounts: Array<{id: string, name: string}> = [];

  ngOnInit() {
    this.calculateAccountSummaries();
  }

  ngOnChanges() {
    this.calculateAccountSummaries();
  }

  private calculateAccountSummaries() {
    const accountData = [
      {
        id: 'joint-account',
        name: 'Joint Account',
        owners: 'John & Mary Smith',
        icon: 'fa-solid fa-users'
      },
      {
        id: 'roth-ira-account',
        name: 'Roth IRA Account',
        owners: 'Mary Smith',
        icon: 'fa-regular fa-star'
      },
      {
        id: 'trust-account',
        name: 'Family Trust Account',
        owners: 'Smith Family Trust',
        icon: 'fa-solid fa-shield'
      },
      {
        id: 'traditional-ira-account',
        name: 'Traditional IRA Account',
        owners: 'John Smith',
        icon: 'fa-solid fa-graduation-cap'
      }
    ];

    this.accountSummaries = accountData.map(account => {
      // Override completion for demo purposes
      let completionPercentage = 100;
      let completedSections = 0;
      let totalSections = 0;
      let canSubmit = true;
      
      // Only the trust account should be incomplete
      // Calculate completion based on actual form data
      const accountFormData = this.formData[account.id] || {};
      const missingFields = this.getMissingRequiredFields(account.id, accountFormData);
      
      if (account.id === 'trust-account') {
        const relevantSections = this.getRelevantSectionsForAccount(account.id);
        const completion = this.calculateAccountCompletion(account.id, relevantSections);
        completedSections = completion.completedSections;
        totalSections = completion.totalSections;
        completionPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
        canSubmit = completionPercentage === 100 && missingFields.length === 0; // Both sections complete AND no missing fields
      } else {
        // All other accounts are complete
        const relevantSections = this.getRelevantSectionsForAccount(account.id);
        completedSections = relevantSections.length;
        totalSections = relevantSections.length;
        completionPercentage = 100;
        canSubmit = true;
      }
      const attachmentsCount = account.id === 'traditional-ira-account' ? 0 : 3;
      
      return {
        ...account,
        completionPercentage,
        completedSections,
        totalSections,
        missingFields,
        accountType: this.getCustodianName(account.id).toUpperCase(),
        canSubmit,
        hasMissingFields: !canSubmit,
        nextMissingSection: canSubmit ? null : { entityId: account.id, sectionId: 'account-setup' as Section },
        attachmentsCount,
        forms: [`${this.getCustodianName(account.id)} Lorem Ipsum Form`]
      };
    });
  }

  private getRelevantSectionsForAccount(accountId: string): Section[] {
    const allSections: Section[] = ['account-setup', 'beneficiaries', 'trustees', 'funding'];
    
    switch (accountId) {
      case 'joint-account':
        return ['account-setup', 'funding'];
      case 'roth-ira-account':
      case 'traditional-ira-account':
        return ['account-setup', 'beneficiaries', 'funding'];
      case 'trust-account':
        return ['account-setup', 'beneficiaries', 'trustees', 'funding'];
      default:
        return allSections;
    }
  }

  private getMissingRequiredFields(accountId: string, accountData: any): string[] {
    const missingFields: string[] = [];
    
    // Check basic required fields
    if (!accountData.accountType) missingFields.push('Account Type');
    if (!accountData.investmentObjective) missingFields.push('Investment Objective');
    if (!accountData.riskTolerance) missingFields.push('Risk Tolerance');
    
    // Check trust-specific fields for trust accounts
    if (accountData.accountType === 'trust' || accountId === 'trust-account') {
      if (!accountData.trustName) missingFields.push('Trust Name');
      if (!accountData.trustType) missingFields.push('Trust Type');
      if (!accountData.trustEin) missingFields.push('Trust EIN');
    }
    
    return missingFields;
  }

  private calculateAccountCompletion(accountId: string, relevantSections: Section[]) {
    let completedSections = 0;
    let totalSections = relevantSections.length;
    let firstMissingSection: { entityId: string, sectionId: Section } | null = null;
    
    for (const section of relevantSections) {
      const isComplete = this.isSectionComplete(accountId, section);
      if (isComplete) {
        completedSections++;
      } else if (!firstMissingSection) {
        firstMissingSection = { entityId: accountId, sectionId: section };
      }
    }
    
    return {
      completedSections,
      totalSections,
      hasMissingFields: completedSections < totalSections,
      nextMissingSection: firstMissingSection
    };
  }

  private isSectionComplete(entityId: string, sectionId: Section): boolean {
    // Check if the section is complete based on completion status
    if (entityId === 'john-smith' || entityId === 'mary-smith') {
      return this.completionStatus.members[entityId]?.[sectionId] || false;
    } else {
      return this.completionStatus.accounts[entityId]?.[sectionId] || false;
    }
  }

  private getCustodianName(accountId: string): string {
    switch (accountId) {
      case 'joint-account':
        return 'Fidelity';
      case 'roth-ira-account':
      case 'traditional-ira-account':
        return 'Schwab';
      case 'trust-account':
        return 'Schwab';
      default:
        return 'Unknown';
    }
  }

  onEditAccount(accountId: string) {
    const account = this.accountSummaries.find(a => a.id === accountId);
    if (account && account.nextMissingSection) {
      // Account is incomplete - navigate to the next missing field
      this.editAccountWithSection.emit({
        accountId,
        entityId: account.nextMissingSection.entityId,
        sectionId: account.nextMissingSection.sectionId,
        disableQuickReview: true
      });
    } else {
      // If no missing fields (registration complete), automatically enter quick review mode
      this.editAccountQuickReview.emit(accountId);
    }
  }

  onSubmitForESign(accountId: string, accountName: string) {
    // Open the e-signature modal instead of immediately submitting
    this.selectedAccountId = accountId;
    this.selectedAccountName = accountName;
    this.showEsignModal = true;
  }

  onPaperworkPreview(accountId: string) {
    const account = this.accountSummaries.find(a => a.id === accountId);
    if (account) {
      this.selectedAccountName = account.name;
      this.selectedAccountId = accountId;
      this.showPdfPreview = true;
    }
  }

  onViewAttachments(accountId: string) {
    const account = this.accountSummaries.find(a => a.id === accountId);
    if (account) {
      this.selectedAccountId = accountId;
      this.selectedAccountName = account.name;
      this.showAttachmentsModal = true;
    }
  }

  getReadyAccountsCount(): number {
    return this.accountSummaries.filter(a => a.canSubmit).length;
  }

  onOpenBulkEsignModal() {
    const ready = this.accountSummaries.filter(a => a.canSubmit).map(a => ({ id: a.id, name: a.name }));
    if (!ready.length) return;
    this.bulkEsignAccounts = ready;
    this.selectedAccountId = '';
    this.selectedAccountName = '';
    this.showEsignModal = true;
  }

  onAttachmentsModalClosed() {
    this.showAttachmentsModal = false;
    this.selectedAccountId = '';
    this.selectedAccountName = '';
  }

  onEsignModalClosed() {
    this.showEsignModal = false;
    this.selectedAccountId = '';
    this.selectedAccountName = '';
    this.bulkEsignAccounts = [];
  }

  onEsignSubmitted(event: any) {
    console.log('E-sign submitted:', event);
    this.onEsignModalClosed();
  }
}
