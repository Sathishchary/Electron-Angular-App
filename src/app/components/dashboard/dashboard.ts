import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { 
  User, 
  Customer, 
  EmailAddressWithRelations, 
  DashboardStats, 
  ChartData 
} from '../../models';
import { BarChart } from '../charts/bar-chart/bar-chart';
import { PieChart } from '../charts/pie-chart/pie-chart';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    BarChart,
    PieChart
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats$!: Observable<DashboardStats>;
  users$!: Observable<User[]>;
  customers$!: Observable<Customer[]>;
  emailAddresses$!: Observable<EmailAddressWithRelations[]>;
  
  departmentChartData$!: Observable<ChartData[]>;
  userStatusChartData$!: Observable<ChartData[]>;
  customerStatusChartData$!: Observable<ChartData[]>;
  industryChartData$!: Observable<ChartData[]>;

  userColumns: string[] = ['firstName', 'lastName', 'email', 'department', 'role', 'status'];
  customerColumns: string[] = ['companyName', 'contactFirstName', 'contactLastName', 'primaryEmail', 'industry', 'revenue', 'status'];
  emailColumns: string[] = ['email', 'userName', 'customerName', 'type', 'isVerified'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.stats$ = this.dataService.getDashboardStats();
    this.users$ = this.dataService.getUsers();
    this.customers$ = this.dataService.getCustomers();
    this.emailAddresses$ = this.dataService.getEmailAddressesWithRelations();
    
    this.departmentChartData$ = this.dataService.getDepartmentChartData();
    this.userStatusChartData$ = this.dataService.getUserStatusChartData();
    this.customerStatusChartData$ = this.dataService.getCustomerStatusChartData();
    this.industryChartData$ = this.dataService.getIndustryChartData();
  }

  getStatusChipColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'pending': return 'accent';
      default: return '';
    }
  }

  formatRevenue(revenue: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(revenue);
  }
}
