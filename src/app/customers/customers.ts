import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../services/customers';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  showModal = false;
  editingCustomer: Customer | null = null;
  formCustomer: Partial<Customer> = { name: '', email: '', status: 'Active' };

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customersService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  openAddModal(): void {
    this.editingCustomer = null;
    this.formCustomer = { name: '', email: '', status: 'Active' };
    this.showModal = true;
  }

  openEditModal(customer: Customer): void {
    this.editingCustomer = customer;
    this.formCustomer = { ...customer };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCustomer = null;
    this.formCustomer = { name: '', email: '', status: 'Active' };
  }

  saveCustomer(): void {
    if (!this.formCustomer.name || !this.formCustomer.email || !this.formCustomer.status) {
      alert('Please fill in all fields');
      return;
    }

    if (this.editingCustomer) {
      this.customersService.updateCustomer(this.editingCustomer.id, this.formCustomer);
    } else {
      this.customersService.addCustomer(this.formCustomer as Omit<Customer, 'id'>);
    }
    
    this.closeModal();
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customersService.deleteCustomer(customer.id);
    }
  }
}
