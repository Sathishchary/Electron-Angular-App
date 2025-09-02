import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private customers: Customer[] = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', status: 'Active' },
    { id: 2, name: 'Tech Solutions Inc', email: 'info@techsolutions.com', status: 'Active' },
    { id: 3, name: 'Global Industries', email: 'hello@global.com', status: 'Pending' },
    { id: 4, name: 'Digital Services LLC', email: 'support@digital.com', status: 'Active' },
    { id: 5, name: 'Innovation Labs', email: 'contact@innovation.com', status: 'Inactive' }
  ];

  private customersSubject = new BehaviorSubject<Customer[]>(this.customers);
  private nextId = 6;

  constructor() { }

  getCustomers(): Observable<Customer[]> {
    return this.customersSubject.asObservable();
  }

  getCustomerById(id: number): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  addCustomer(customer: Omit<Customer, 'id'>): Customer {
    const newCustomer: Customer = { ...customer, id: this.nextId++ };
    this.customers.push(newCustomer);
    this.customersSubject.next([...this.customers]);
    return newCustomer;
  }

  updateCustomer(id: number, updates: Partial<Omit<Customer, 'id'>>): Customer | null {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updates };
      this.customersSubject.next([...this.customers]);
      return this.customers[index];
    }
    return null;
  }

  deleteCustomer(id: number): boolean {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
      this.customersSubject.next([...this.customers]);
      return true;
    }
    return false;
  }

  getCustomerStats() {
    const total = this.customers.length;
    const statusStats = this.customers.reduce((acc, customer) => {
      acc[customer.status] = (acc[customer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, statusStats };
  }
}
