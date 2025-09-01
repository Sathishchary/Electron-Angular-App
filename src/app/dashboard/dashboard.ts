import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users';
import { CustomersService } from '../services/customers';
import { ChartComponent } from '../shared/chart/chart';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalCustomers = 0;
  userChartData: any[] = [];
  customerChartData: any[] = [];
  chartType = ChartType.PieChart;
  
  userChartOptions = {
    title: 'Users by Role',
    is3D: true,
    backgroundColor: 'transparent',
    titleTextStyle: { color: '#333', fontSize: 16 },
    legend: { position: 'bottom', textStyle: { color: '#333' } }
  };

  customerChartOptions = {
    title: 'Customers by Status',
    is3D: true,
    backgroundColor: 'transparent',
    titleTextStyle: { color: '#333', fontSize: 16 },
    legend: { position: 'bottom', textStyle: { color: '#333' } }
  };

  constructor(
    private usersService: UsersService,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load user stats
    const userStats = this.usersService.getUserStats();
    this.totalUsers = userStats.total;
    this.userChartData = Object.entries(userStats.roleStats).map(([role, count]) => [role, count]);

    // Load customer stats
    const customerStats = this.customersService.getCustomerStats();
    this.totalCustomers = customerStats.total;
    this.customerChartData = Object.entries(customerStats.statusStats).map(([status, count]) => [status, count]);
  }
}
