import { Injectable } from '@angular/core';

export interface StoredTrustee {
  id: string;
  label: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  address: string;
  createdDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TrusteeStorageService {
  private readonly STORAGE_KEY = 'copyDropdowns_trustees';

  constructor() { }

  getStoredTrustees(): StoredTrustee[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const trustees = JSON.parse(stored);
        return trustees.map((trustee: any) => ({
          ...trustee,
          createdDate: trustee.createdDate ? new Date(trustee.createdDate) : undefined
        }));
      }
    } catch (error) {
      console.warn('Error loading stored trustees:', error);
    }
    return [];
  }

  saveTrustee(trustee: Omit<StoredTrustee, 'id' | 'createdDate'>): StoredTrustee {
    const trustees = this.getStoredTrustees();
    
    const newTrustee: StoredTrustee = {
      ...trustee,
      id: this.generateId(),
      createdDate: new Date()
    };

    const existingIndex = trustees.findIndex(t => 
      this.trusteesAreEqual(t, newTrustee)
    );

    if (existingIndex === -1) {
      trustees.unshift(newTrustee);
      this.saveTrustees(trustees);
    } else {
      return trustees[existingIndex];
    }
    
    return newTrustee;
  }

  deleteTrustee(id: string): void {
    const trustees = this.getStoredTrustees();
    const filteredTrustees = trustees.filter(trustee => trustee.id !== id);
    this.saveTrustees(filteredTrustees);
  }

  clearAllTrustees(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getTrusteeDropdownOptions(currentFormData?: any): Array<{label: string, value: StoredTrustee | string}> {
    const storedTrustees = this.getStoredTrustees();
    const allTrustees = [...storedTrustees];
    
    // Add trustees from current form data if provided
    if (currentFormData) {
      console.log('Processing form data for trustees:', currentFormData);
      const formTrustees = this.extractTrusteesFromFormData(currentFormData);
      console.log('Extracted form trustees:', formTrustees);
      
      // Add form trustees that aren't already in stored trustees
      formTrustees.forEach(formTrustee => {
        const exists = storedTrustees.some(stored => 
          this.trusteesAreEqual(stored, formTrustee)
        );
        if (!exists) {
          allTrustees.push(formTrustee);
        }
      });
    }
    
    const options: Array<{label: string, value: StoredTrustee | string}> = allTrustees.map(trustee => ({
      label: this.formatTrusteeLabel(trustee),
      value: trustee
    }));
    
    return options;
  }

  private saveTrustees(trustees: StoredTrustee[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trustees));
    } catch (error) {
      console.warn('Error saving trustees:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private trusteesAreEqual(t1: StoredTrustee, t2: StoredTrustee): boolean {
    return t1.name === t2.name && 
           t1.role === t2.role && 
           t1.phone === t2.phone &&
           t1.address === t2.address;
  }

  private formatTrusteeLabel(trustee: StoredTrustee): string {
    return `${trustee.name} - ${trustee.role}`;
  }

  private extractTrusteesFromFormData(formData: any): StoredTrustee[] {
    const trustees: StoredTrustee[] = [];
    
    // Look through all entity IDs in form data
    Object.keys(formData).forEach(entityId => {
      const entityData = formData[entityId];
      if (entityData && entityData.trustees && Array.isArray(entityData.trustees)) {
        entityData.trustees.forEach((trustee: any) => {
          if (trustee && trustee.name && trustee.role && trustee.phone && trustee.address) {
            const storedTrustee: StoredTrustee = {
              id: this.generateId(),
              label: `${trustee.name} - ${trustee.role}`,
              name: trustee.name,
              role: trustee.role,
              phone: trustee.phone,
              email: trustee.email || '',
              address: trustee.address,
              createdDate: new Date()
            };
            trustees.push(storedTrustee);
          }
        });
      }
    });
    
    return trustees;
  }
}