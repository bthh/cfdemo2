import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pdf-preview-modal',
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
      [style]="{width: '90vw', height: '90vh'}"
      [draggable]="false" 
      [resizable]="false"
      header="Document Preview"
      (onHide)="onClose()">
      
      <div class="pdf-preview-container">
        <iframe 
          [src]="pdfUrl"
          width="100%" 
          height="100%"
          frameborder="0">
        </iframe>
      </div>
      
      <ng-template pTemplate="footer">
        <p-button 
          label="Close" 
          icon="pi pi-times" 
          (onClick)="onClose()" 
          styleClass="p-button-text">
        </p-button>
        <p-button 
          label="Download" 
          icon="pi pi-download" 
          (onClick)="onDownload()">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .pdf-preview-container {
      width: 100%;
      height: calc(90vh - 150px);
      overflow: hidden;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
    }

    :host ::ng-deep .p-dialog-content {
      padding: 0;
      overflow: hidden;
    }
  `]
})
export class PdfPreviewModalComponent {
  @Input() visible: boolean = false;
  @Input() pdfUrl: string = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // Demo PDF
  @Input() accountName: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onDownload() {
    // In a real app, this would download the PDF
    window.open(this.pdfUrl, '_blank');
  }
}
