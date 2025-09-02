import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsData } from '../services/analytics-data';

declare var google: any;

@Component({
  selector: 'app-email-insights',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './email-insights.html',
  styleUrl: './email-insights.css'
})
export class EmailInsights implements OnInit, AfterViewInit {
  @ViewChild('domainsChart', { static: false }) domainsChart!: ElementRef;
  @ViewChild('usageChart', { static: false }) usageChart!: ElementRef;

  analyticsData: any = {};
  loading = true;
  
  displayedColumns: string[] = ['domain', 'users', 'customers', 'totalUsage', 'type'];

  constructor(private dataService: AnalyticsData) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Load Google Charts
    if (typeof google !== 'undefined' && google.charts) {
      google.charts.load('current', { packages: ['corechart', 'table'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.topDomains) {
          this.drawCharts();
        }
      });
    } else {
      this.loadGoogleCharts();
    }
  }

  private loadGoogleCharts() {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      google.charts.load('current', { packages: ['corechart', 'table'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.topDomains) {
          this.drawCharts();
        }
      });
    };
    document.head.appendChild(script);
  }

  private loadData() {
    this.dataService.getEmailInsights().subscribe(data => {
      this.analyticsData = data;
      this.loading = false;
      
      if (typeof google !== 'undefined' && google.charts && google.visualization) {
        setTimeout(() => this.drawCharts(), 100);
      }
    });
  }

  private drawCharts() {
    if (!this.domainsChart || !this.usageChart) {
      return;
    }

    this.drawDomainsChart();
    this.drawUsageChart();
  }

  private drawDomainsChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.topDomains);
    
    const options = {
      title: 'Top Email Domains',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Domain' },
      vAxis: { title: 'Count' },
      series: {
        0: { color: '#3f51b5', targetAxisIndex: 0 },
        1: { color: '#ff9800', targetAxisIndex: 0 }
      },
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.ColumnChart(this.domainsChart.nativeElement);
    chart.draw(data, options);
  }

  private drawUsageChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.usageChart);
    
    const options = {
      title: 'Email Usage by Type',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      pieHole: 0.4,
      colors: ['#3f51b5', '#ff9800', '#4caf50'],
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.PieChart(this.usageChart.nativeElement);
    chart.draw(data, options);
  }

  getDomainData() {
    // Convert chart data to table format
    if (!this.analyticsData.topDomains) return [];
    
    return this.analyticsData.topDomains.slice(1).map((row: any[]) => ({
      domain: row[0],
      users: row[1],
      customers: row[2],
      totalUsage: row[1] + row[2],
      type: this.getDomainType(row[0])
    }));
  }

  getDomainType(domain: string): string {
    const businessDomains = ['company.com', 'enterprise.org', 'business.net'];
    const techDomains = ['tech.co', 'startup.io'];
    
    if (businessDomains.includes(domain)) return 'Business';
    if (techDomains.includes(domain)) return 'Technology';
    return 'Other';
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'Business': return '#3f51b5';
      case 'Technology': return '#ff9800';
      default: return '#4caf50';
    }
  }
}
