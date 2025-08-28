import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-compact-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  templateUrl: './compact-dropdown.component.html',
  styleUrls: ['./compact-dropdown.component.scss']
})
export class CompactDropdownComponent implements OnInit {
  @Input() options: Array<{label: string, value: any}> = [];
  @Input() selectedValue: any = null;
  @Input() placeholder: string = 'Select an option';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() showClear: boolean = false;
  @Input() filter: boolean = true;
  @Input() styleClass: string = '';
  
  @Output() valueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  filteredOptions: Array<{label: string, value: any}> = [];
  selectedOption: any = null;

  ngOnInit() {
    this.initializeSelection();
    this.filteredOptions = [...this.options];
  }

  ngOnChanges() {
    this.initializeSelection();
    this.filteredOptions = [...this.options];
  }

  private initializeSelection() {
    if (this.selectedValue !== null && this.options.length > 0) {
      this.selectedOption = this.options.find(option => 
        (option as any)[this.optionValue] === this.selectedValue || 
        option.value === this.selectedValue
      );
    }
  }

  filterOptions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredOptions = this.options.filter(option => 
      (option as any)[this.optionLabel].toLowerCase().includes(query) ||
      option.label.toLowerCase().includes(query)
    );
  }

  onOptionSelect(selectedItem: any) {
    if (selectedItem) {
      this.selectedOption = selectedItem;
      const value = selectedItem[this.optionValue] || selectedItem.value;
      this.selectedValue = value;
      this.valueChange.emit(value);
      this.selectionChange.emit(selectedItem);
    }
  }

  onClear() {
    this.selectedOption = null;
    this.selectedValue = null;
    this.valueChange.emit(null);
    this.selectionChange.emit(null);
  }
}