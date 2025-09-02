import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AnalyticsData, CustomerData } from '../services/analytics-data';

declare var google: any;

@Component({
  selector: 'app-customer-analytics',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './customer-analytics.html',
  styleUrl: './customer-analytics.css'
})
export class CustomerAnalytics implements OnInit, AfterViewInit {
  @ViewChild('acquisitionChart', { static: false }) acquisitionChart!: ElementRef;
  @ViewChild('revenueChart', { static: false }) revenueChart!: ElementRef;
  @ViewChild('regionChart', { static: false }) regionChart!: ElementRef;

  analyticsData: any = {};
  customerList: CustomerData[] = [];
  loading = true;
  
  displayedColumns: string[] = ['id', 'companyName', 'contactEmail', 'acquisitionDate', 'region', 'tier', 'churnRisk', 'monthlyRevenue'];

  constructor(private dataService: AnalyticsData) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Load Google Charts
    if (typeof google !== 'undefined' && google.charts) {
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.acquisitionChart) {
          this.drawCharts();
        }
      });
    } else {
      this.loadGoogleCharts();
    }
  }

  private loadGoogleCharts() {
    // Dynamically load Google Charts if not already loaded
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.acquisitionChart) {
          this.drawCharts();
        }
      });
    };
    document.head.appendChild(script);
  }

  private loadData() {
    this.dataService.getCustomerAnalytics().subscribe(data => {
      this.analyticsData = data;
      this.loading = false;
      
      // Draw charts if Google Charts is already loaded
      if (typeof google !== 'undefined' && google.charts && google.visualization) {
        setTimeout(() => this.drawCharts(), 100);
      }
    });

    // Generate mock customer data
    const mockCustomers: CustomerData[] = [
      { id: '1', companyName: 'Tech Corp', contactEmail: 'admin@techcorp.com', acquisitionDate: new Date('2024-01-15'), region: 'North America', tier: 'enterprise', churnRisk: 'low', monthlyRevenue: 15000 },
      { id: '2', companyName: 'StartupXYZ', contactEmail: 'team@startupxyz.com', acquisitionDate: new Date('2024-02-20'), region: 'Europe', tier: 'premium', churnRisk: 'medium', monthlyRevenue: 8500 },
      { id: '3', companyName: 'Global Solutions', contactEmail: 'info@globalsol.com', acquisitionDate: new Date('2024-03-10'), region: 'Asia', tier: 'basic', churnRisk: 'high', monthlyRevenue: 2500 },
    ];
    this.customerList = mockCustomers;
  }

  private drawCharts() {
    if (!this.acquisitionChart || !this.revenueChart || !this.regionChart) {
      return;
    }

    this.drawAcquisitionChart();
    this.drawRevenueChart();
    this.drawRegionChart();
  }

  private drawAcquisitionChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.acquisitionChart);
    
    const options = {
      title: 'Customer Acquisition vs Churn',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Month' },
      vAxis: { title: 'Customers' },
      series: {
        0: { color: '#4caf50', type: 'columns' },
        1: { color: '#f44336', type: 'columns' }
      },
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.ComboChart(this.acquisitionChart.nativeElement);
    chart.draw(data, options);
  }

  private drawRevenueChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.revenueChart);
    
    const options = {
      title: 'Monthly Revenue Trend',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Month' },
      vAxis: { title: 'Revenue ($)', format: 'currency' },
      colors: ['#3f51b5'],
      legend: { position: 'none' },
      curveType: 'function'
    };

    const chart = new google.visualization.AreaChart(this.revenueChart.nativeElement);
    chart.draw(data, options);
  }

  private drawRegionChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.regionChart);
    
    const options = {
      title: 'Customers by Region',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      pieHole: 0.4,
      colors: ['#3f51b5', '#ff9800', '#4caf50'],
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.PieChart(this.regionChart.nativeElement);
    chart.draw(data, options);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  getChurnRiskColor(risk: string): string {
    switch (risk) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      default: return 'primary';
    }
  }

  getTierColor(tier: string): string {
    switch (tier) {
      case 'basic': return '#9e9e9e';
      case 'premium': return '#ff9800';
      case 'enterprise': return '#3f51b5';
      default: return '#9e9e9e';
    }
  }
}
