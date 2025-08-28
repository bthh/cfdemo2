import { Injectable } from '@angular/core';

export interface StoredBeneficiary {
  id: string;
  label: string;
  name: string;
  relationship: string;
  percentage: number;
  dateOfBirth: string;
  ssn: string;
  address?: string;
  createdDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryStorageService {
  private readonly STORAGE_KEY = 'copyDropdowns_beneficiaries';

  constructor() { }

  getStoredBeneficiaries(): StoredBeneficiary[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const beneficiaries = JSON.parse(stored);
        return beneficiaries.map((beneficiary: any) => ({
          ...beneficiary,
          createdDate: beneficiary.createdDate ? new Date(beneficiary.createdDate) : undefined
        }));
      }
    } catch (error) {
      console.warn('Error loading stored beneficiaries:', error);
    }
    return [];
  }

  saveBeneficiary(beneficiary: Omit<StoredBeneficiary, 'id' | 'createdDate'>): StoredBeneficiary {
    const beneficiaries = this.getStoredBeneficiaries();
    
    const newBeneficiary: StoredBeneficiary = {
      ...beneficiary,
      id: this.generateId(),
      createdDate: new Date()
    };

    const existingIndex = beneficiaries.findIndex(b => 
      this.beneficiariesAreEqual(b, newBeneficiary)
    );

    if (existingIndex === -1) {
      beneficiaries.unshift(newBeneficiary);
      this.saveBeneficiaries(beneficiaries);
    } else {
      return beneficiaries[existingIndex];
    }
    
    return newBeneficiary;
  }

  deleteBeneficiary(id: string): void {
    const beneficiaries = this.getStoredBeneficiaries();
    const filteredBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.id !== id);
    this.saveBeneficiaries(filteredBeneficiaries);
  }

  clearAllBeneficiaries(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getBeneficiaryDropdownOptions(currentFormData?: any): Array<{label: string, value: StoredBeneficiary | string}> {
    const storedBeneficiaries = this.getStoredBeneficiaries();
    const allBeneficiaries = [...storedBeneficiaries];
    
    // Add beneficiaries from current form data if provided
    if (currentFormData) {
      console.log('Processing form data for beneficiaries:', currentFormData);
      const formBeneficiaries = this.extractBeneficiariesFromFormData(currentFormData);
      console.log('Extracted form beneficiaries:', formBeneficiaries);
      
      // Add form beneficiaries that aren't already in stored beneficiaries
      formBeneficiaries.forEach(formBeneficiary => {
        const exists = storedBeneficiaries.some(stored => 
          this.beneficiariesAreEqual(stored, formBeneficiary)
        );
        if (!exists) {
          allBeneficiaries.push(formBeneficiary);
        }
      });
    }
    
    const options: Array<{label: string, value: StoredBeneficiary | string}> = allBeneficiaries.map(beneficiary => ({
      label: this.formatBeneficiaryLabel(beneficiary),
      value: beneficiary
    }));
    
    return options;
  }

  private saveBeneficiaries(beneficiaries: StoredBeneficiary[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(beneficiaries));
    } catch (error) {
      console.warn('Error saving beneficiaries:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private beneficiariesAreEqual(b1: StoredBeneficiary, b2: StoredBeneficiary): boolean {
    return b1.name === b2.name && 
           b1.relationship === b2.relationship && 
           b1.ssn === b2.ssn &&
           b1.dateOfBirth === b2.dateOfBirth;
  }

  private formatBeneficiaryLabel(beneficiary: StoredBeneficiary): string {
    return `${beneficiary.name} - ${beneficiary.relationship} (${beneficiary.percentage}%)`;
  }

  private extractBeneficiariesFromFormData(formData: any): StoredBeneficiary[] {
    const beneficiaries: StoredBeneficiary[] = [];
    
    // Look through all entity IDs in form data
    Object.keys(formData).forEach(entityId => {
      const entityData = formData[entityId];
      if (entityData && entityData.beneficiaries && Array.isArray(entityData.beneficiaries)) {
        entityData.beneficiaries.forEach((beneficiary: any) => {
          if (beneficiary && beneficiary.name && beneficiary.relationship && beneficiary.ssn) {
            const storedBeneficiary: StoredBeneficiary = {
              id: this.generateId(),
              label: `${beneficiary.name} - ${beneficiary.relationship} (${beneficiary.percentage}%)`,
              name: beneficiary.name,
              relationship: beneficiary.relationship,
              percentage: beneficiary.percentage || 0,
              dateOfBirth: beneficiary.dateOfBirth || '',
              ssn: beneficiary.ssn,
              address: beneficiary.address || '',
              createdDate: new Date()
            };
            beneficiaries.push(storedBeneficiary);
          }
        });
      }
    });
    
    return beneficiaries;
  }
}