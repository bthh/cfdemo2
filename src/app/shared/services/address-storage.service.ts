import { Injectable } from '@angular/core';

export interface StoredAddress {
  id: string;
  label: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AddressStorageService {
  private readonly STORAGE_KEY = 'copyDropdowns_addresses';

  constructor() { }

  getStoredAddresses(): StoredAddress[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const addresses = JSON.parse(stored);
        return addresses.map((addr: any) => ({
          ...addr,
          createdDate: addr.createdDate ? new Date(addr.createdDate) : undefined
        }));
      }
    } catch (error) {
      console.warn('Error loading stored addresses:', error);
    }
    return [];
  }

  saveAddress(address: Omit<StoredAddress, 'id' | 'createdDate'>): StoredAddress {
    const addresses = this.getStoredAddresses();
    
    const newAddress: StoredAddress = {
      ...address,
      id: this.generateId(),
      createdDate: new Date()
    };

    const existingIndex = addresses.findIndex(addr => 
      this.addressesAreEqual(addr, newAddress)
    );

    if (existingIndex === -1) {
      addresses.unshift(newAddress);
      this.saveAddresses(addresses);
    } else {
      return addresses[existingIndex];
    }
    
    return newAddress;
  }

  deleteAddress(id: string): void {
    const addresses = this.getStoredAddresses();
    const filteredAddresses = addresses.filter(addr => addr.id !== id);
    this.saveAddresses(filteredAddresses);
  }

  clearAllAddresses(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getAddressDropdownOptions(currentFormData?: any): Array<{label: string, value: StoredAddress | string}> {
    const storedAddresses = this.getStoredAddresses();
    const allAddresses = [...storedAddresses];
    
    // Add addresses from current form data if provided
    if (currentFormData) {
      console.log('Processing form data for addresses:', currentFormData);
      const formAddresses = this.extractAddressesFromFormData(currentFormData);
      console.log('Extracted form addresses:', formAddresses);
      
      // Add form addresses that aren't already in stored addresses
      formAddresses.forEach(formAddr => {
        const exists = storedAddresses.some(stored => 
          this.addressesAreEqual(stored, formAddr)
        );
        if (!exists) {
          allAddresses.push(formAddr);
        }
      });
    }
    
    const options: Array<{label: string, value: StoredAddress | string}> = allAddresses.map(addr => ({
      label: this.formatAddressLabel(addr),
      value: addr
    }));
    
    // Note: "Enter New Address" option is now handled by a separate button
    
    return options;
  }

  private extractAddressesFromFormData(formData: any): StoredAddress[] {
    const addresses: StoredAddress[] = [];
    console.log('Extracting addresses from formData keys:', Object.keys(formData));
    
    // Extract all addresses from all entities in form data
    Object.keys(formData).forEach(entityId => {
      const entityData = formData[entityId];
      console.log(`Processing entity ${entityId}:`, entityData);
      
      // Home address
      if (entityData.homeAddress && entityData.homeCity && entityData.homeState) {
        const homeAddr = {
          id: `form_home_${entityId}`,
          label: `Home Address (${entityId})`,
          address: entityData.homeAddress || '',
          address2: entityData.homeAddress2 || '',
          city: entityData.homeCity || '',
          state: entityData.homeState || '',
          zipCode: entityData.homeZipCode || '',
          country: entityData.homeCountry || 'US'
        };
        console.log('Adding home address:', homeAddr);
        addresses.push(homeAddr);
      } else {
        console.log(`Skipping home address for ${entityId} - missing required fields:`, {
          homeAddress: entityData.homeAddress,
          homeCity: entityData.homeCity,
          homeState: entityData.homeState
        });
      }
      
      // Mailing address
      if (entityData.mailingAddress && entityData.mailingCity && entityData.mailingState) {
        addresses.push({
          id: `form_mailing_${entityId}`,
          label: 'Mailing Address',
          address: entityData.mailingAddress || '',
          address2: entityData.mailingAddress2 || '',
          city: entityData.mailingCity || '',
          state: entityData.mailingState || '',
          zipCode: entityData.mailingZipCode || '',
          country: entityData.mailingCountry || 'US'
        });
      }
      
      // Work address (if exists)
      if (entityData.workAddress && entityData.workCity && entityData.workState) {
        addresses.push({
          id: `form_work_${entityId}`,
          label: 'Work Address',
          address: entityData.workAddress || '',
          address2: entityData.workAddress2 || '',
          city: entityData.workCity || '',
          state: entityData.workState || '',
          zipCode: entityData.workZipCode || '',
          country: entityData.workCountry || 'US'
        });
      }
      
      // Trustee addresses
      if (entityData.trustees) {
        entityData.trustees.forEach((trustee: any, index: number) => {
          if (trustee.address && trustee.city && trustee.state) {
            addresses.push({
              id: `form_trustee_${entityId}_${index}`,
              label: `Trustee Address (${trustee.name || 'Trustee'})`,
              address: trustee.address || '',
              address2: trustee.address2 || '',
              city: trustee.city || '',
              state: trustee.state || '',
              zipCode: trustee.zipCode || '',
              country: trustee.country || 'US'
            });
          }
        });
      }
      
      // Beneficiary addresses
      if (entityData.beneficiaries) {
        entityData.beneficiaries.forEach((beneficiary: any, index: number) => {
          if (beneficiary.address && beneficiary.city && beneficiary.state) {
            addresses.push({
              id: `form_beneficiary_${entityId}_${index}`,
              label: `Beneficiary Address (${beneficiary.name || 'Beneficiary'})`,
              address: beneficiary.address || '',
              address2: beneficiary.address2 || '',
              city: beneficiary.city || '',
              state: beneficiary.state || '',
              zipCode: beneficiary.zipCode || '',
              country: beneficiary.country || 'US'
            });
          }
        });
      }
    });
    
    return addresses;
  }

  private saveAddresses(addresses: StoredAddress[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(addresses));
    } catch (error) {
      console.error('Error saving addresses to storage:', error);
    }
  }

  private generateId(): string {
    return 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private addressesAreEqual(addr1: StoredAddress, addr2: StoredAddress): boolean {
    return addr1.address === addr2.address &&
           addr1.address2 === addr2.address2 &&
           addr1.city === addr2.city &&
           addr1.state === addr2.state &&
           addr1.zipCode === addr2.zipCode &&
           addr1.country === addr2.country;
  }

  private formatAddressLabel(address: StoredAddress): string {
    const parts = [address.address];
    if (address.city && address.state) {
      parts.push(`${address.city}, ${address.state}`);
    }
    if (address.zipCode) {
      parts.push(address.zipCode);
    }
    return parts.join(' - ');
  }
}