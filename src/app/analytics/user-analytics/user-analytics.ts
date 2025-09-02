import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnalyticsData, UserData } from '../services/analytics-data';

declare var google: any;

@Component({
  selector: 'app-user-analytics',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-analytics.html',
  styleUrl: './user-analytics.css'
})
export class UserAnalytics implements OnInit, AfterViewInit {
  @ViewChild('userGrowthChart', { static: false }) userGrowthChart!: ElementRef;
  @ViewChild('signupChart', { static: false }) signupChart!: ElementRef;
  @ViewChild('demographicsChart', { static: false }) demographicsChart!: ElementRef;

  analyticsData: any = {};
  userList: UserData[] = [];
  loading = true;
  
  displayedColumns: string[] = ['id', 'name', 'email', 'signupDate', 'lastActive', 'region', 'status'];

  constructor(private dataService: AnalyticsData) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Load Google Charts
    if (typeof google !== 'undefined' && google.charts) {
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.userGrowthChart) {
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
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(() => {
        if (this.analyticsData.userGrowthChart) {
          this.drawCharts();
        }
      });
    };
    document.head.appendChild(script);
  }

  private loadData() {
    this.dataService.getUserAnalytics().subscribe(data => {
      this.analyticsData = data;
      this.loading = false;
      
      // Draw charts if Google Charts is already loaded
      if (typeof google !== 'undefined' && google.charts && google.visualization) {
        setTimeout(() => this.drawCharts(), 100);
      }
    });

    this.dataService.getUserList().subscribe(users => {
      this.userList = users;
    });
  }

  private drawCharts() {
    if (!this.userGrowthChart || !this.signupChart || !this.demographicsChart) {
      return;
    }

    this.drawUserGrowthChart();
    this.drawSignupChart();
    this.drawDemographicsChart();
  }

  private drawUserGrowthChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.userGrowthChart);
    
    const options = {
      title: 'User Growth Over Time',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Month' },
      vAxis: { title: 'Users' },
      series: {
        0: { color: '#3f51b5' },
        1: { color: '#ff9800' }
      },
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.LineChart(this.userGrowthChart.nativeElement);
    chart.draw(data, options);
  }

  private drawSignupChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.signupChart);
    
    const options = {
      title: 'Weekly Signups',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      hAxis: { title: 'Week' },
      vAxis: { title: 'Signups' },
      bars: 'vertical',
      colors: ['#4caf50'],
      legend: { position: 'none' }
    };

    const chart = new google.visualization.ColumnChart(this.signupChart.nativeElement);
    chart.draw(data, options);
  }

  private drawDemographicsChart() {
    const data = google.visualization.arrayToDataTable(this.analyticsData.demographicsChart);
    
    const options = {
      title: 'User Demographics by Region',
      titleTextStyle: { fontSize: 16, bold: true },
      height: 300,
      pieHole: 0.4,
      colors: ['#3f51b5', '#ff9800', '#4caf50', '#f44336'],
      legend: { position: 'bottom' }
    };

    const chart = new google.visualization.PieChart(this.demographicsChart.nativeElement);
    chart.draw(data, options);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
