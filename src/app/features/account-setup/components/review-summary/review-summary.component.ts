import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

// PrimeNG Imports - removed unused modules for cleaner design

// Local Imports  
import { FormData, CompletionStatus, Section } from '../../../../shared/models/types';
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
  selector: 'app-review-summary',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    AttachmentsModalComponent,
    EsignModalComponent
  ],
  template: `
    <div class="review-summary-section">
      <div class="summary-header">
        <div class="summary-header-row">
          <div class="summary-header-texts">
            <h3>Review & Send for Signatures</h3>
            <div class="summary-subtitle">Forms Management</div>
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

      <!-- Account List -->
      <div class="accounts-list">
        <div *ngFor="let account of accountSummaries" class="account-card">
          <!-- Card Header -->
          <div class="card-header">
            <div class="card-title">
              <i [class]="account.icon + ' account-icon'"></i>
              <div class="title-texts">
                <div class="account-title">{{account.name}}</div>
                <div class="account-meta">{{account.accountType}} | 1 Account | {{account.attachmentsCount}} Attachments</div>
              </div>
            </div>
            <div class="header-actions-icons">
              <button class="icon-btn" (click)="onPaperworkPreview(account.id)" pTooltip="Preview" tooltipPosition="bottom">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="icon-btn" (click)="onViewAttachments(account.id)" pTooltip="Attachments" tooltipPosition="bottom">
                <i class="fa-regular fa-paperclip"></i>
              </button>
              <button class="icon-btn" [disabled]="!account.canSubmit" (click)="onSubmitForESign(account.id, account.name)" pTooltip="Send for E-Sign" tooltipPosition="bottom">
                <i class="fa-regular fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <!-- Forms Section (only when ready) -->
          <div *ngIf="account.canSubmit" class="forms-section">
            <div class="forms-header">Docusign Forms (167 pages)</div>
            <div class="forms-list">
              <a class="form-link" href="javascript:void(0)">
                {{account.forms[0] || (getCustodianName(account.id) + ' Lorem Ipsum Form')}}
              </a>
            </div>
          </div>

          <!-- Footer / Status Row -->
          <div class="card-footer" [class.ready]="account.canSubmit" [class.incomplete]="!account.canSubmit">
            <div class="footer-status" *ngIf="account.canSubmit">
              <i class="fa-solid fa-check-circle text-green"></i>
              <span>Ready for Signatures</span>
            </div>
            <div class="footer-status" *ngIf="!account.canSubmit">
              <i class="fa-solid fa-triangle-exclamation text-warning"></i>
              <span>{{account.missingFields.length}} required fields Incomplete for form generation.</span>
            </div>
            <div class="footer-actions">
              <button *ngIf="!account.canSubmit" class="btn-go-missing" (click)="onEditAccount(account.id)">Go to Missing Fields</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attachments Modal -->
    <app-attachments-modal
      [(visible)]="showAttachmentsModal"
      [registrationName]="selectedAccountName"
      [accountId]="selectedAccountId"
      (modalClosed)="onAttachmentsModalClosed()">
    </app-attachments-modal>

    <!-- E-Signature Modal -->
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
    .review-summary-section {
      width: 100%;
      min-height: calc(100vh - 100px);
      padding: 0;
      background: #f8f9fa;
    }

    .summary-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.25rem 2rem;
      background: white;
    }

    .summary-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .summary-header-texts h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .summary-subtitle {
      margin-top: 0.25rem;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .btn-send-all {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.9rem;
      background: white;
      color: #111827;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-send-all:hover:not(:disabled) {
      background: #f3f4f6;
    }

    .btn-send-all:disabled {
      cursor: not-allowed;
      color: #9ca3af;
    }


    .accounts-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0 2rem 2rem 2rem;
    }

    .account-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .account-icon {
      color: #6b7280;
    }

    .title-texts {
      display: flex;
      flex-direction: column;
    }

    .account-title {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
    }

    .account-meta {
      font-size: 0.85rem;
      color: #6b7280;
    }

    .header-actions-icons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .icon-btn:hover:not(:disabled) {
      background: #f9fafb;
    }

    .icon-btn:disabled {
      color: #9ca3af;
      cursor: not-allowed;
    }

    .forms-section {
      padding: 0.75rem 1.25rem 0.5rem 1.25rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .forms-header {
      font-size: 0.85rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .forms-list .form-link {
      color: #0A8DFF;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    .forms-list .form-link:hover {
      text-decoration: underline;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.25rem;
      background: #fafafa;
    }

    .footer-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #374151;
    }

    .text-green { color: #10b981; }
    .text-warning { color: #f59e0b; }

    .footer-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-go-missing {
      background: #0A8DFF;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-go-missing:hover {
      background: #087AE6;
    }

    @media (max-width: 768px) {
      .summary-header {
        padding: 1rem;
      }
      
      .accounts-list {
        margin: 0 1rem 1rem 1rem;
      }
      
      .card-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    }
    
    @media (max-width: 480px) {
      .summary-header-texts h3 {
        font-size: 1.25rem;
      }
      .account-title { font-size: 1rem; }
      .card-header { padding: 0.75rem 1rem; }
    }
  `]
})
export class ReviewSummaryComponent {
  @Input() formData: FormData = {};
  @Input() completionStatus: CompletionStatus = { members: {}, accounts: {} };
  @Output() editAccount = new EventEmitter<string>();
  @Output() editAccountWithSection = new EventEmitter<{accountId: string, entityId: string, sectionId: Section, disableQuickReview?: boolean}>();
  @Output() editAccountQuickReview = new EventEmitter<string>();
  @Output() submitForESign = new EventEmitter<string>();
  @Output() submitAllReady = new EventEmitter<string[]>();

  accountSummaries: AccountSummary[] = [];
  
  // Modal state
  showAttachmentsModal = false;
  showEsignModal = false;
  selectedAccountId = '';
  selectedAccountName = '';
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
        icon: 'fa-solid fa-building-columns'
      }
    ];

    this.accountSummaries = accountData.map(account => {
      const relevantSections = this.getRelevantSectionsForAccount(account.id);
      const { completedSections, totalSections, hasMissingFields, nextMissingSection } = this.calculateAccountCompletion(account.id, relevantSections);
      const completionPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
      
      const accountFormData = this.formData[account.id] || {};
      const missingFields = this.getMissingRequiredFields(account.id, accountFormData);
      const attachmentsCount = 3;
      
      return {
        ...account,
        completionPercentage,
        completedSections,
        totalSections,
        missingFields,
        accountType: this.getCustodianName(account.id),
        canSubmit: completionPercentage === 100 && missingFields.length === 0,
        hasMissingFields,
        nextMissingSection,
        attachmentsCount,
        forms: [`${this.getCustodianName(account.id)} Lorem Ipsum Form`]
      };
    });
  }

  private getRelevantSectionsForAccount(accountId: string): Array<{entityId: string, sectionId: Section}> {
    const sections: Array<{entityId: string, sectionId: Section}> = [];
    
    // Determine which members are relevant for this account
    if (accountId === 'joint-account') {
      // John and Mary sections
      sections.push(
        { entityId: 'john-smith', sectionId: 'owner-details' },
        { entityId: 'john-smith', sectionId: 'firm-details' },
        { entityId: 'mary-smith', sectionId: 'owner-details' },
        { entityId: 'mary-smith', sectionId: 'firm-details' }
      );
    } else if (accountId === 'roth-ira-account') {
      // Mary sections only
      sections.push(
        { entityId: 'mary-smith', sectionId: 'owner-details' },
        { entityId: 'mary-smith', sectionId: 'firm-details' }
      );
    } else if (accountId === 'trust-account') {
      // Trust sections - for Smith Family Trust, John and Mary are the trustees
      sections.push(
        { entityId: 'john-smith', sectionId: 'owner-details' },
        { entityId: 'mary-smith', sectionId: 'owner-details' }
      );
    } else if (accountId === 'traditional-ira-account') {
      // John Smith sections for Traditional IRA
      sections.push(
        { entityId: 'john-smith', sectionId: 'owner-details' },
        { entityId: 'john-smith', sectionId: 'firm-details' }
      );
    }
    
    // Add account-specific sections  
    sections.push(
      { entityId: accountId, sectionId: 'account-setup' },
      { entityId: accountId, sectionId: 'funding' }
    );
    
    return sections;
  }

  private calculateAccountCompletion(accountId: string, relevantSections: Array<{entityId: string, sectionId: Section}>) {
    let completedSections = 0;
    let totalSections = relevantSections.length;
    let firstMissingSection: { entityId: string, sectionId: Section } | null = null;
    
    for (const section of relevantSections) {
      const isComplete = this.isSectionComplete(section.entityId, section.sectionId);
      if (isComplete) {
        completedSections++;
      } else if (!firstMissingSection) {
        firstMissingSection = section;
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

  private getMissingRequiredFields(accountId: string, accountData: any): string[] {
    const missingFields: string[] = [];
    
    // Check basic required fields
    if (!accountData.accountType) missingFields.push('Account Type');
    if (!accountData.investmentObjective) missingFields.push('Investment Objective');
    if (!accountData.riskTolerance) missingFields.push('Risk Tolerance');
    
    // Check trust-specific fields
    if (accountData.accountType === 'trust') {
      if (!accountData.trustName) missingFields.push('Trust Name');
      if (!accountData.trustType) missingFields.push('Trust Type');
      if (!accountData.trustEin) missingFields.push('Trust EIN');
    }
    
    return missingFields;
  }

  private getAccountTypeLabel(accountType: string): string {
    const typeMap: { [key: string]: string } = {
      'joint-taxable': 'Joint Taxable',
      'individual-taxable': 'Individual Taxable', 
      'trust': 'Trust',
      'ira': 'IRA',
      'roth-ira': 'Roth IRA',
      'traditional-ira': 'Traditional IRA'
    };
    return typeMap[accountType] || accountType || 'Not Set';
  }

  getCustodianName(accountId: string): string {
    // First 2 registrations get Fidelity, next 2 get Schwab
    const accountOrder = ['joint-account', 'roth-ira-account', 'trust-account', 'traditional-ira-account'];
    const accountIndex = accountOrder.indexOf(accountId);
    
    if (accountIndex === -1) return '';
    
    return accountIndex < 2 ? 'Fidelity' : 'Schwab';
  }

  getOverallCompletionPercentage(): number {
    // Use the same calculation as the main app header for consistency
    return this.getOverallProgress();
  }

  private getOverallProgress(): number {
    let totalRequiredFields = 0;
    let filledRequiredFields = 0;

    // Define required fields for each entity type (matching main app)
    const memberRequiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'ssn', 'phoneHome', 'email', 
      'homeAddress', 'citizenship', 'employmentStatus', 'annualIncome', 'netWorth', 'fundsSource'
    ];
    
    const accountRequiredFields = [
      'accountType', 'investmentObjective', 'riskTolerance'
    ];

    // Count member fields
    const memberIds = ['john-smith', 'mary-smith', 'smith-trust'];
    memberIds.forEach(memberId => {
      const memberData = this.formData[memberId];
      memberRequiredFields.forEach(field => {
        totalRequiredFields++;
        if (memberData && memberData[field] && memberData[field].toString().trim()) {
          filledRequiredFields++;
        }
      });
    });

    // Count account fields
    const accountIds = ['joint-account', 'roth-ira-account', 'trust-account', 'traditional-ira-account'];
    accountIds.forEach(accountId => {
      const accountData = this.formData[accountId];
      accountRequiredFields.forEach(field => {
        totalRequiredFields++;
        if (accountData && accountData[field] && accountData[field].toString().trim()) {
          filledRequiredFields++;
        }
      });
    });

    return totalRequiredFields > 0 ? Math.round((filledRequiredFields / totalRequiredFields) * 100) : 0;
  }

  getCompletedAccountsCount(): number {
    return this.accountSummaries.filter(account => account.completionPercentage === 100).length;
  }

  getReadyAccountsCount(): number {
    return this.accountSummaries.filter(account => account.canSubmit).length;
  }

  onEditAccount(accountId: string) {
    const account = this.accountSummaries.find(a => a.id === accountId);
    if (account && account.nextMissingSection) {
      // Account is incomplete - navigate to the next missing field
      // Always disable Quick Review mode for incomplete accounts
      this.editAccountWithSection.emit({
        accountId,
        entityId: account.nextMissingSection.entityId,
        sectionId: account.nextMissingSection.sectionId,
        disableQuickReview: true // Flag to disable Quick Review
      });
    } else {
      // If no missing fields (registration complete), automatically enter quick review mode
      // Emit a new event specifically for quick review mode
      this.editAccountQuickReview.emit(accountId);
    }
  }

  onSubmitForESign(accountId: string, accountName: string) {
    // Open the e-signature modal instead of immediately submitting
    this.selectedAccountId = accountId;
    this.selectedAccountName = accountName;
    this.showEsignModal = true;
  }

  onSubmitAllReady() {
    const readyAccounts = this.accountSummaries.filter(account => account.canSubmit).map(account => account.id);
    this.submitAllReady.emit(readyAccounts);
  }

  onViewAttachments(accountId: string) {
    const account = this.accountSummaries.find(a => a.id === accountId);
    if (account) {
      this.selectedAccountId = accountId;
      this.selectedAccountName = account.name;
      this.showAttachmentsModal = true;
    }
  }

  onPaperworkPreview(accountId: string) {
    // TODO: Implement paperwork preview functionality
    console.log('Paperwork preview for account:', accountId);
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

  onEsignSubmitted(event: {accountId?: string, accountIds?: string[], signers: any[]}) {
    // Emit the original submitForESign event(s) with the collected signer information
    if (event.accountId) {
      this.submitForESign.emit(event.accountId);
      console.log('E-signature submitted for account:', event.accountId, 'with signers:', event.signers);
    }
    if (event.accountIds && event.accountIds.length) {
      event.accountIds.forEach(id => this.submitForESign.emit(id));
      console.log('E-signature submitted for accounts:', event.accountIds, 'with signers:', event.signers);
    }
  }

  onOpenBulkEsignModal() {
    const ready = this.accountSummaries.filter(a => a.canSubmit).map(a => ({ id: a.id, name: a.name }));
    if (!ready.length) return;
    this.bulkEsignAccounts = ready;
    this.selectedAccountId = '';
    this.selectedAccountName = '';
    this.showEsignModal = true;
  }
}