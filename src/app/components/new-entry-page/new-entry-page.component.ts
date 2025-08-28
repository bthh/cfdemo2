import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-new-entry-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    InputSwitchModule
  ],
  template: `
    <div class="new-entry-page">
      <!-- Parent Logo -->
      <div class="parent-logo">
        <h1>WHITE LABEL</h1>
      </div>

      <!-- Parent Sidebar -->
      <div class="parent-sidebar">
        <div class="parent-nav-item active">
          <i class="fa-solid fa-table-cells-large"></i>
          Dashboard
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-users"></i>
          Clients
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-briefcase"></i>
          Accounts
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-chart-line"></i>
          Portfolio
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-file-lines"></i>
          Reports
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-gear"></i>
          Settings
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-circle-question"></i>
          Support
        </div>
        <div class="parent-nav-item">
          <i class="fa-solid fa-book"></i>
          Resources
        </div>
      </div>

      <!-- Parent Header -->
      <div class="parent-header">
        <div class="search-container">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search clients..."
          />
        </div>
        <div class="profile-section">
          <span>Valued Advisor</span>
          <div class="profile-dropdown-container">
            <div class="profile-icon">
              <i class="fa-regular fa-user"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="progress-steps">
        <div class="step completed">
          <div class="step-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="step-label">Account Info</span>
        </div>
        <div class="step completed">
          <div class="step-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="step-label">Investor Goals</span>
        </div>
        <div class="step completed">
          <div class="step-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="step-label">Personal Finances</span>
        </div>
        <div class="step completed">
          <div class="step-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="step-label">Questionnaires</span>
        </div>
        <div class="step completed">
          <div class="step-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <span class="step-label">Proposed Accounts</span>
        </div>
        <div class="step current">
          <div class="step-circle">6</div>
          <span class="step-label">Proposal</span>
        </div>
      </div>

      <!-- Main Content Section -->
      <div class="main-content-section">
        <div class="content-header">
          <div class="content-title">
            <i class="fa-regular fa-clipboard"></i>
            Build Your Proposal Output:
          </div>
          <div class="header-actions">
            <button class="btn-secondary">
              <i class="fa-regular fa-envelope"></i>
              Email to Client
            </button>
            <button class="btn-secondary">
              <i class="fa-regular fa-download"></i>
              Download Now
            </button>
            <button class="btn-open-account" (click)="onOpenAccountModal()">
              <i class="fa-solid fa-plus"></i>
              Open Account(s)
            </button>
          </div>
        </div>

        <!-- Template Selection -->
        <div class="template-section">
          <h4>1. Select a template:</h4>
          <div class="template-dropdown">
            <select class="form-select">
              <option>New...</option>
            </select>
          </div>
        </div>

        <!-- Pages Selection Header -->
        <div class="pages-header">
          <h4>2. Select pages to include into output:</h4>
        </div>
        
        <!-- Split Layout -->
        <div class="split-layout">
          <!-- Left Side - Name, Description, Actions -->
          <div class="left-section">
            <div class="left-table-header">
              <div class="col-name-left">Name</div>
              <div class="col-description-left">Description</div>
              <div class="col-actions-left">
                <button class="btn-select-all">Select All</button>
              </div>
            </div>
            
            <div class="left-table-rows">
              <div class="left-table-row" *ngFor="let item of proposalItems" [class.empty-row]="!item.name">
                <div class="col-name-left">{{item.name}}</div>
                <div class="col-description-left">{{item.description}}</div>
                <div class="col-actions-left">
                  <button class="btn-expand" *ngIf="item.name">+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Proposal Output -->
          <div class="right-section">
            <div class="right-header">
              <div class="col-output-header">Proposal Output</div>
              <button class="btn-save-template">Save as Template</button>
            </div>
            
            <div class="right-content">
              <div class="output-row" *ngFor="let item of proposalItems; let i = index" [class.locked-row]="!item.template">
                <div class="output-item">
                  <span class="output-text">{{item.output}}</span>
                  <button class="menu-button" *ngIf="item.template">
                    <i class="fa-solid fa-ellipsis"></i>
                  </button>
                  <i class="fa-solid fa-lock lock-icon" *ngIf="!item.template"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .new-entry-page {
      margin-left: 200px;
      margin-top: 60px;
      min-height: calc(100vh - 60px);
      background: #f8f9fa;
      padding: 0;
    }

    /* Parent Application Layout */
    .parent-logo {
      position: fixed;
      top: 0;
      left: 0;
      width: 200px;
      height: 60px;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }

    .parent-logo h1 {
      color: #374151;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .parent-sidebar {
      position: fixed;
      top: 60px;
      left: 0;
      width: 200px;
      height: calc(100vh - 60px);
      background: #f8fafc;
      border-right: 1px solid #e5e7eb;
      overflow-y: auto;
      z-index: 999;
    }

    .parent-header {
      position: fixed;
      top: 0;
      left: 200px;
      right: 0;
      height: 60px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Parent Sidebar Navigation */
    .parent-nav-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1.5rem;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .parent-nav-item:hover {
      background: #e5e7eb;
      color: #374151;
      border-left-color: #3b82f6;
    }

    .parent-nav-item.active {
      background: #e5e7eb;
      color: #1f2937;
      border-left-color: #3b82f6;
      font-weight: 600;
    }

    .parent-nav-item i {
      margin-right: 0.75rem;
      font-size: 1rem;
      width: 1.25rem;
      text-align: center;
    }

    /* Parent Header Components */
    .search-container {
      flex: 1;
      max-width: 400px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem 0.5rem 2.25rem;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      font-size: 0.875rem;
      background: #f9fafb;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-size: 0.875rem;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #374151;
      font-weight: 500;
    }

    .profile-dropdown-container {
      position: relative;
    }

    .profile-icon {
      width: 32px;
      height: 32px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .profile-icon:hover {
      background: #2563eb;
      transform: scale(1.05);
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      margin: 1rem 0.5rem 0 0.5rem;
      padding: 2.5rem 3rem;
      background: white;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      border: 1px solid #e5e7eb;
      border-bottom: none;
      max-width: 90vw;
      width: 90vw;
      margin-left: auto;
      margin-right: auto;
      position: relative;
    }

    .progress-steps::before {
      content: '';
      position: absolute;
      top: calc(2.5rem + 25px);
      left: calc(3rem + 25px);
      right: calc(3rem + 25px);
      height: 1px;
      background: #d1d5db;
      z-index: 0;
    }

    @media (max-width: 1024px) {
      .progress-steps {
        padding: 2.5rem 2rem;
        gap: 1.5rem;
        width: 95vw;
        max-width: 95vw;
      }

      .progress-steps::before {
        left: calc(2rem + 25px);
        right: calc(2rem + 25px);
      }
    }

    @media (max-width: 768px) {
      .progress-steps {
        padding: 2rem 1rem;
        gap: 1rem;
        width: 98vw;
        max-width: 98vw;
      }

      .progress-steps::before {
        left: calc(1rem + 25px);
        right: calc(1rem + 25px);
      }
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      position: relative;
    }


    .step-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .step.completed .step-circle {
      background: #0A8DFF;
      color: white;
    }

    .step.current .step-circle {
      background: #0A8DFF;
      color: white;
    }

    .step-label {
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 600;
      text-align: center;
    }

    .step.completed .step-label,
    .step.current .step-label {
      color: #374151;
      font-weight: 600;
    }

    .main-content-section {
      background: white;
      border-radius: 0 0 8px 8px;
      padding: 1.5rem;
      margin: 0 0.5rem 1rem 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      border: 1px solid #e5e7eb;
      border-top: none;
      min-height: calc(100vh - 200px);
      max-width: 90vw;
      width: 90vw;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 1024px) {
      .main-content-section {
        width: 95vw;
        max-width: 95vw;
      }
    }

    @media (max-width: 768px) {
      .main-content-section {
        width: 98vw;
        max-width: 98vw;
      }
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }

    .content-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .pages-header h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1.5rem;
    }

    .split-layout {
      display: grid;
      grid-template-columns: 65fr 35fr;
      gap: 2rem;
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
    }

    .content-title i {
      color: #6b7280;
    }

    .left-section {
      border-right: 1px solid #e5e7eb;
      padding-right: 1.5rem;
    }

    .left-table-header {
      display: grid;
      grid-template-columns: 2fr 3fr 1fr;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-bottom: none;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
    }

    .left-table-rows {
      border: 1px solid #e5e7eb;
      border-top: none;
    }

    .left-table-row {
      display: grid;
      grid-template-columns: 2fr 3fr 1fr;
      gap: 1rem;
      padding: 1rem 0.75rem;
      border-bottom: 1px solid #f3f4f6;
      align-items: center;
    }

    .left-table-row:last-child {
      border-bottom: none;
    }

    .left-table-row:hover {
      background: #f9fafb;
    }

    .left-table-row.empty-row {
      background: transparent !important;
      pointer-events: none;
    }

    .right-section {
      padding-left: 1.5rem;
    }

    .right-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
    }

    .right-content {
      border: 1px solid #e5e7eb;
      border-top: none;
    }

    .output-row {
      padding: 1rem 0.75rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .output-row:last-child {
      border-bottom: none;
    }

    .output-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .output-text {
      font-size: 0.875rem;
      color: #374151;
    }

    .menu-button {
      background: none;
      border: none;
      color: var(--enterprise-gray-500, #6b7280);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .menu-button:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .lock-icon {
      color: var(--enterprise-gray-400, #9ca3af);
      font-size: 0.875rem;
      padding: 0.25rem;
    }

    .locked-row .output-text {
      color: var(--enterprise-gray-600, #4b5563);
    }

    .btn-save-template {
      background: #f8f9fa;
      color: var(--enterprise-gray-700, #374151);
      border: 1px solid var(--enterprise-gray-300, #d1d5db);
      border-radius: 6px;
      padding: 0.4rem 0.8rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-save-template:hover {
      background: #e5e7eb;
      border-color: var(--enterprise-gray-400, #9ca3af);
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      color: #374151;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      border-color: #9ca3af;
      background: #f9fafb;
    }

    .template-section {
      margin-bottom: 2rem;
    }

    .template-section h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .template-dropdown select {
      width: 200px;
      padding: 0.5rem;
      border: 1px solid var(--enterprise-gray-300, #d1d5db);
      border-radius: 6px;
      background: white;
      color: var(--enterprise-gray-700, #374151);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .pages-section h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .pages-table {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 3fr 1fr 2fr 1fr;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 3fr 1fr 2fr 1fr;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
      align-items: center;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:hover {
      background: #f9fafb;
    }

    .btn-select-all {
      background: #0A8DFF;
      color: white;
      border: none;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-select-all:hover {
      background: #0980E6;
    }

    .btn-expand {
      background: none;
      border: 1px solid #d1d5db;
      color: #374151;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .col-template i {
      color: #6b7280;
      cursor: pointer;
    }

    .col-template i:hover {
      color: #374151;
    }

    .btn-open-account {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #0A8DFF;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .btn-open-account:hover {
      background: #0980E6;
      box-shadow: 0 4px 6px rgba(10, 141, 255, 0.3);
    }
  `]
})
export class NewEntryPageComponent {
  @Output() openAccountModal = new EventEmitter<void>();

  proposalItems = [
    {
      name: 'Brinker - Fee Summary (Total)',
      description: 'Non - itemized Summary of fees for the proposed investment portfolio',
      output: '⠿ Brinker Cover Page - Your logo and contact information',
      template: true
    },
    {
      name: 'Personalized Distribution Strategy',
      description: 'A personalized withdrawal strategy for Destinations accounts',
      output: '⠿ Brinker - About Your Team - A personalized overview of the client\'s selected financial advisor, including a professional biography and photo',
      template: true
    },
    {
      name: 'Blended Platform Performance Fact Sheet - General',
      description: 'Blended, accumulative performance for each of the models included in the portfolio',
      output: '⠿ Investment Recommendation - Single Strategy - Breakdown of proposed investment selections - For use if you have selected only 1 model for the client portfolio',
      template: true
    },
    {
      name: 'Registration Risk/Reward Questionnaire Answers',
      description: 'Answers to the risk tolerance questionnaire that help you understand your investment style, objectives, and tolerance for risk',
      output: '⠿ Brinker - Fee Summary (Itemized) - Itemized list of fees for the proposed investment portfolio',
      template: true
    },
    {
      name: '',
      description: '',
      output: 'Investment Proposal Tools FAQ - These are sample disclosures regarding the use of the investment proposal tool. Such sample disclosures may not be appropriate for every client communication and should be reviewed by a financial professional for appropriateness prior to providing to, or utilizing with, investor clients.',
      template: false
    },
    {
      name: '',
      description: '',
      output: 'Brinker Disclosures - Disclosures',
      template: false
    }
  ];

  onOpenAccountModal() {
    this.openAccountModal.emit();
  }
}