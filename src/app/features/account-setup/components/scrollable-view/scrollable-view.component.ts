import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Local Imports
import { FormData, CompletionStatus, Section } from '../../../../shared/models/types';
import { OwnerDetailsComponent } from '../owner-details/owner-details.component';
import { FirmDetailsComponent } from '../firm-details/firm-details.component';
import { AccountSetupComponent } from '../account-setup/account-setup.component';
import { FundingComponent } from '../funding/funding.component';

@Component({
  selector: 'app-scrollable-view',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    OwnerDetailsComponent,
    FirmDetailsComponent,
    AccountSetupComponent,
    FundingComponent
  ],
  template: `
    <div class="scrollable-view-container" #scrollContainer>
      
      <!-- Current Entity Sections -->
      <div *ngIf="currentEntityData" class="entity-section" [attr.data-entity]="currentEntityData.id">
        <div class="entity-header">
          <div class="entity-info">
            <i [class]="currentEntityData.icon + ' entity-icon'"></i>
            <div class="entity-details">
              <h2 class="entity-name">
                {{currentEntityData.name}}
                <span *ngIf="currentAccount && getCustodianName(currentAccount)" class="custodian-name">({{getCustodianName(currentAccount)}})</span>
              </h2>
            </div>
          </div>
        </div>

        <!-- Entity Sections -->
        <div *ngFor="let section of currentEntitySections" 
             class="section-container" 
             [attr.data-section]="section.id"
             [id]="'section-' + currentEntityData.id + '-' + section.id">
          
          <!-- Owner Details Section -->
          <app-owner-details 
            *ngIf="section.id === 'owner-details' && currentMember"
            [formData]="formData"
            [entityId]="currentEntityData.id"
            [isReviewMode]="isReviewMode"
            [copyDropdownsMode]="copyDropdownsMode"
            [highlightMissingFields]="highlightMissingFields"
            (formDataChange)="onFormDataChange($event)"
            (disableQuickReview)="onDisableQuickReview()">
          </app-owner-details>

          <!-- Firm Details Section -->
          <app-firm-details 
            *ngIf="section.id === 'firm-details' && shouldShowFirmDetails()"
            [formData]="formData"
            [entityId]="currentEntityData.id"
            [isReviewMode]="isReviewMode"
            [isMemberEntity]="currentMember !== ''"
            [highlightMissingFields]="highlightMissingFields"
            (formDataChange)="onFormDataChange($event)"
            (disableQuickReview)="onDisableQuickReview()">
          </app-firm-details>

          <!-- Account Setup Section -->
          <app-account-setup 
            *ngIf="section.id === 'account-setup' && currentAccount"
            [formData]="formData"
            [entityId]="currentEntityData.id"
            [isReviewMode]="isReviewMode"
            [copyDropdownsMode]="copyDropdownsMode"
            [highlightMissingFields]="highlightMissingFields"
            (formDataChange)="onFormDataChange($event)"
            (disableQuickReview)="onDisableQuickReview()">
          </app-account-setup>

          <!-- Funding Section -->
          <app-funding 
            *ngIf="section.id === 'funding' && currentAccount"
            [formData]="formData"
            [entityId]="currentEntityData.id"
            [isReviewMode]="isReviewMode"
            [brinkerFundingMode]="brinkerFundingMode"
            [fundingColumnsMode]="fundingColumnsMode"
            [registrationName]="registrationName"
            [highlightMissingFields]="highlightMissingFields"
            (formDataChange)="onFormDataChange($event)"
            (disableQuickReview)="onDisableQuickReview()">
          </app-funding>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scrollable-view-container {
      padding: 1rem;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    .entity-section {
      margin-bottom: 3rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .entity-header {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 1.5rem 2rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .entity-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .entity-icon {
      font-size: 2rem;
      color: #3b82f6;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .entity-details {
      flex: 1;
    }

    .entity-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .custodian-name {
      font-size: 1rem;
      font-weight: 500;
      color: #6b7280;
      margin-left: 0.5rem;
    }

    .entity-role {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      font-weight: 500;
    }

    .section-container {
      padding: 0;
      scroll-margin-top: 2rem;
    }

    .section-container:not(:last-child) {
      border-bottom: 1px solid #f3f4f6;
    }


    /* Global container adjustments for scrollable view */
    :host :deep(.p-card) {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #f3f4f6;
      box-shadow: none;
      margin-bottom: 0;
    }

    :host :deep(.p-card:last-child) {
      border-bottom: none;
    }

    :host :deep(.p-card .p-card-header) {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
      padding: 1rem 2rem;
    }

    :host :deep(.p-card .p-card-body) {
      padding: 2rem;
    }

    /* Scrollbar styling */
    .scrollable-view-container::-webkit-scrollbar {
      width: 8px;
    }

    .scrollable-view-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .scrollable-view-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .scrollable-view-container::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class ScrollableViewComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @Input() formData: FormData = {};
  @Input() completionStatus: CompletionStatus = { members: {}, accounts: {} };
  @Input() currentMember: string = '';
  @Input() currentAccount: string = '';
  @Input() isReviewMode: boolean = false;
  @Input() copyDropdownsMode: boolean = false;
  @Input() brinkerFundingMode: boolean = false;
  @Input() fundingColumnsMode: boolean = false;
  @Input() registrationName: string = '';
  @Input() highlightMissingFields: boolean = false;
  @Input() ownerFirmDetailsMode: boolean = false;
  @Input() brokerDealerInfoMode: boolean = false;
  @Output() formDataChange = new EventEmitter<FormData>();
  @Output() sectionChange = new EventEmitter<{section: Section, memberId: string, accountId: string}>();
  @Output() disableQuickReview = new EventEmitter<void>();

  currentEntityData: any = null;
  currentEntitySections: any[] = [];

  // Data arrays (should match parent component)
  memberData = [
    {
      id: 'john-smith',
      name: 'John Smith',
      role: 'Primary Account Holder',
      icon: 'pi pi-user',
      sections: [
        { id: 'owner-details', name: 'Personal Details', icon: 'pi pi-user' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    },
    {
      id: 'mary-smith',
      name: 'Mary Smith',
      role: 'Joint Account Holder',
      icon: 'pi pi-user',
      sections: [
        { id: 'owner-details', name: 'Personal Details', icon: 'pi pi-user' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    },
    {
      id: 'smith-trust',
      name: 'Smith Family Trust',
      role: 'Trust Entity',
      icon: 'pi pi-shield',
      sections: [
        { id: 'owner-details', name: 'Personal Details', icon: 'pi pi-user' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    }
  ];

  accountData = [
    {
      id: 'joint-account',
      name: 'Joint Account',
      owners: 'John & Mary Smith',
      icon: 'pi pi-users',
      sections: [
        { id: 'account-setup', name: 'Account Setup', icon: 'pi pi-cog' },
        { id: 'funding', name: 'Funding', icon: 'pi pi-dollar' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    },
    {
      id: 'roth-ira-account',
      name: 'Roth IRA Account',
      owners: 'Mary Smith',
      icon: 'pi pi-star',
      sections: [
        { id: 'account-setup', name: 'Account Setup', icon: 'pi pi-cog' },
        { id: 'funding', name: 'Funding', icon: 'pi pi-dollar' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    },
    {
      id: 'trust-account',
      name: 'Family Trust Account',
      owners: 'Smith Family Trust',
      icon: 'pi pi-shield',
      sections: [
        { id: 'account-setup', name: 'Account Setup', icon: 'pi pi-cog' },
        { id: 'funding', name: 'Funding', icon: 'pi pi-dollar' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    },
    {
      id: 'traditional-ira-account',
      name: 'Traditional IRA Account',
      owners: 'John Smith',
      icon: 'pi pi-university',
      sections: [
        { id: 'account-setup', name: 'Account Setup', icon: 'pi pi-cog' },
        { id: 'funding', name: 'Funding', icon: 'pi pi-dollar' },
        { id: 'firm-details', name: 'Firm Details', icon: 'pi pi-building' }
      ]
    }
  ];

  private scrollTimeout: any;
  private lastEmittedSection = '';

  ngOnInit() {
    this.updateCurrentEntity();
    setTimeout(() => {
      this.setupScrollListener();
    }, 500);
  }

  ngOnChanges() {
    this.updateCurrentEntity();
  }

  ngOnDestroy() {
    this.removeScrollListener();
  }

  private setupScrollListener() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  private removeScrollListener() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  private onScroll() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.detectCurrentSection();
    }, 100);
  }

  private detectCurrentSection() {
    if (!this.scrollContainer || !this.currentEntityData) return;

    const container = this.scrollContainer.nativeElement;
    const sections = container.querySelectorAll('.section-container');
    
    let currentSectionId = '';
    let minDistance = Infinity;

    sections.forEach((section: any) => {
      const rect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const sectionTop = rect.top - containerRect.top;
      
      if (sectionTop >= -50 && sectionTop < containerRect.height / 2) {
        const distance = Math.abs(sectionTop);
        if (distance < minDistance) {
          minDistance = distance;
          currentSectionId = section.getAttribute('data-section');
        }
      }
    });

    if (currentSectionId && currentSectionId !== this.lastEmittedSection) {
      this.lastEmittedSection = currentSectionId;
      this.sectionChange.emit({
        section: currentSectionId as Section,
        memberId: this.currentMember,
        accountId: this.currentAccount
      });
    }
  }

  private updateCurrentEntity() {
    if (this.currentMember) {
      // Find member data
      this.currentEntityData = this.memberData.find(m => m.id === this.currentMember);
      this.currentEntitySections = this.currentEntityData?.sections || [];
    } else if (this.currentAccount) {
      // Find account data
      this.currentEntityData = this.accountData.find(a => a.id === this.currentAccount);
      this.currentEntitySections = this.currentEntityData?.sections || [];
    } else {
      this.currentEntityData = null;
      this.currentEntitySections = [];
    }
  }

  onFormDataChange(newFormData: FormData) {
    this.formDataChange.emit(newFormData);
  }

  onDisableQuickReview() {
    this.disableQuickReview.emit();
  }

  scrollToSection(entityId: string, sectionId: string) {
    // Only scroll if the entityId matches the current entity
    if (entityId === this.currentMember || entityId === this.currentAccount) {
      const elementId = `section-${entityId}-${sectionId}`;
      const element = document.getElementById(elementId);
      if (element) {
        // Use native scrollIntoView centering for reliability
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Emit section change for state management
        const memberId = this.memberData.find(m => m.id === entityId) ? entityId : '';
        const accountId = this.accountData.find(a => a.id === entityId) ? entityId : '';
        this.sectionChange.emit({
          section: sectionId as Section,
          memberId,
          accountId
        });
      }
    }
  }

  shouldShowFirmDetails(): boolean {
    // For member entities, check owner firm details toggle
    if (this.currentMember) {
      return this.ownerFirmDetailsMode;
    }
    // For account entities, check broker dealer info toggle
    if (this.currentAccount) {
      return this.brokerDealerInfoMode;
    }
    return false;
  }

  getCustodianName(accountId: string): string {
    // First 2 registrations get Fidelity, next 2 get Schwab
    const accountOrder = ['joint-account', 'roth-ira-account', 'trust-account', 'traditional-ira-account'];
    const accountIndex = accountOrder.indexOf(accountId);
    
    if (accountIndex === -1) return '';
    
    return accountIndex < 2 ? 'Fidelity' : 'Schwab';
  }
}