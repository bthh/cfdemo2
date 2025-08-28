import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

interface AttachmentDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  icon: string;
}

@Component({
  selector: 'app-attachments-modal',
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
      [style]="{width: '700px'}"
      [closable]="true"
      [header]="'Attachments - ' + registrationName"
      (onHide)="onClose()">
      
      <div class="attachments-content">
        <div class="attachments-header">
          <h4>Document Attachments</h4>
          <p class="text-sm text-gray-600">{{documents.length}} document{{documents.length !== 1 ? 's' : ''}} attached</p>
        </div>
        
        <div class="documents-list">
          <div 
            *ngFor="let doc of documents" 
            class="document-item"
            [class.clickable]="true">
            <div class="document-icon">
              <i [class]="doc.icon"></i>
            </div>
            <div class="document-details">
              <div class="document-name">{{doc.name}}</div>
              <div class="document-meta">
                <span class="document-type">{{doc.type}}</span>
                <span class="document-separator">•</span>
                <span class="document-size">{{doc.size}}</span>
                <span class="document-separator">•</span>
                <span class="document-date">{{doc.uploadDate}}</span>
              </div>
            </div>
            <div class="document-actions">
              <button class="action-btn view-btn" title="View Document">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="action-btn download-btn" title="Download">
                <i class="fa-regular fa-download"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="attachments-footer">
          <p class="text-xs text-gray-500">
            Documents are securely stored and encrypted. Click any document to view or download.
          </p>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button 
            label="Close" 
            severity="secondary" 
            (onClick)="onClose()">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .attachments-content {
      padding: 1rem 0;
    }
    
    .attachments-header {
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }
    
    .attachments-header h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }
    
    .documents-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    .document-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      transition: all 0.2s ease;
    }
    
    .document-item.clickable {
      cursor: pointer;
    }
    
    .document-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
      background: #fafbff;
    }
    
    .document-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #fee2e2;
      color: #dc2626;
      font-size: 1.25rem;
    }
    
    .document-details {
      flex: 1;
      min-width: 0;
    }
    
    .document-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
      text-decoration: underline;
      text-decoration-color: #3b82f6;
      text-underline-offset: 2px;
    }
    
    .document-item:hover .document-name {
      color: #3b82f6;
    }
    
    .document-meta {
      font-size: 0.8rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .document-separator {
      color: #d1d5db;
    }
    
    .document-actions {
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .document-item:hover .document-actions {
      opacity: 1;
    }
    
    .action-btn {
      padding: 0.4rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }
    
    .action-btn:hover {
      border-color: #3b82f6;
      color: #3b82f6;
      background: #f0f9ff;
    }
    
    .attachments-footer {
      border-top: 1px solid #f3f4f6;
      padding-top: 1rem;
    }
    
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    
    .text-xs {
      font-size: 0.75rem;
    }
    
    .text-sm {
      font-size: 0.875rem;
    }
    
    .text-gray-500 {
      color: #6b7280;
    }
    
    .text-gray-600 {
      color: #4b5563;
    }
  `]
})
export class AttachmentsModalComponent {
  @Input() visible: boolean = false;
  @Input() registrationName: string = '';
  @Input() accountId: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() modalClosed = new EventEmitter<void>();

  documents: AttachmentDocument[] = [];

  ngOnChanges() {
    if (this.visible && this.accountId) {
      this.generateDocuments();
    }
  }

  private generateDocuments() {
    // Show the same 3 standardized documents for all registrations
    this.documents = [
      {
        id: '1',
        name: 'Identity Verification Documents',
        type: 'PDF',
        size: '1.8 MB',
        uploadDate: '2024-01-15',
        icon: 'fa-regular fa-file-pdf'
      },
      {
        id: '2',
        name: 'Financial Information Statement',
        type: 'PDF',
        size: '956 KB',
        uploadDate: '2024-01-16',
        icon: 'fa-regular fa-file-pdf'
      },
      {
        id: '3',
        name: 'Letter of Instruction',
        type: 'PDF',
        size: '512 KB',
        uploadDate: '2024-01-17',
        icon: 'fa-regular fa-file-pdf'
      }
    ];
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.modalClosed.emit();
  }
}