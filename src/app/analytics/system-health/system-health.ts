import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AnalyticsData } from '../services/analytics-data';

declare var google: any;

@Component({
  selector: 'app-system-health',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './system-health.html',
  styleUrl: './system-health.css'
})
export class SystemHealth implements OnInit, AfterViewInit {
  @ViewChild('apiUsageChart', { static: false }) apiUsageChart!: ElementRef;
  @ViewChild('performanceChart', { static: false }) performanceChart!: ElementRef;

  analyticsData: any = {};
  loading = true;

  constructor(private dataService: AnalyticsData) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Load Google Charts
    if (typeof google !== 'undefined' && google.charts) {
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.apiUsageChart) {
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
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.apiUsageChart) {
          this.drawCharts();
        }
      });
    };
    document.head.appendChild(script);
  }

  private loadData() {
    this.dataService.getSystemHealth().subscribe(data => {
      this.analyticsData = data;
      this.loading = false;
      
      if (typeof google !== 'undefined' && google.charts && google.visualization) {
        setTimeout(() => this.drawCharts(), 100);
      }
    });
  }

  private drawCharts() {
    if (!this.apiUsageChart || !this.performanceChart) {
      return;
    }

    this.drawApiUsageChart();
    this.drawPerformanceChart();
  }

  private drawApiUsageChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.apiUsageChart);
    
    const options = {
      title: 'API Usage and Errors Over Time',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Time' },
      vAxes: {
        0: { title: 'Requests', textStyle: { color: '#3f51b5' } },
        1: { title: 'Errors', textStyle: { color: '#f44336' } }
      },
      series: {
        0: { color: '#3f51b5', targetAxisIndex: 0, type: 'area' },
        1: { color: '#f44336', targetAxisIndex: 1, type: 'line' }
      },
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.ComboChart(this.apiUsageChart.nativeElement);
    chart.draw(data, options);
  }

  private drawPerformanceChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.performanceChart);
    
    const options = {
      title: 'Response Time Trends',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Time' },
      vAxis: { title: 'Response Time (ms)' },
      colors: ['#ff9800'],
      legend: { position: 'none' },
      curveType: 'function'
    };

    const chart = new google.visualization.AreaChart(this.performanceChart.nativeElement);
    chart.draw(data, options);
  }

  getUptimeColor(): string {
    const uptime = this.analyticsData.uptime;
    if (uptime >= 99.5) return '#4caf50';
    if (uptime >= 99.0) return '#ff9800';
    return '#f44336';
  }

  getErrorRateColor(): string {
    const errorRate = this.analyticsData.errorRate;
    if (errorRate <= 0.1) return '#4caf50';
    if (errorRate <= 0.5) return '#ff9800';
    return '#f44336';
  }

  getResponseTimeColor(): string {
    const responseTime = this.analyticsData.avgResponseTime;
    if (responseTime <= 200) return '#4caf50';
    if (responseTime <= 500) return '#ff9800';
    return '#f44336';
  }

  getSystemStatus(): { status: string, color: string, icon: string } {
    const uptime = this.analyticsData.uptime;
    const errorRate = this.analyticsData.errorRate;
    const responseTime = this.analyticsData.avgResponseTime;

    if (uptime >= 99.5 && errorRate <= 0.1 && responseTime <= 200) {
      return { status: 'Excellent', color: '#4caf50', icon: 'check_circle' };
    } else if (uptime >= 99.0 && errorRate <= 0.5 && responseTime <= 500) {
      return { status: 'Good', color: '#ff9800', icon: 'warning' };
    } else {
      return { status: 'Needs Attention', color: '#f44336', icon: 'error' };
    }
  }
}
