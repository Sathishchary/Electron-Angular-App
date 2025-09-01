import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartComponent } from '../shared/chart/chart.component';
import { ChartDataService } from '../shared/services/chart-data.service';

/**
 * Dashboard component that displays multiple Google Charts in Angular Material cards.
 * Features three example charts: bar chart for users/customers, pie chart for distribution,
 * and line chart for monthly active users trend.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatGridListModule,
    ChartComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  
  constructor(public chartDataService: ChartDataService) {}

  /**
   * Chart configurations for the dashboard.
   * Each chart has a type, data, options, and container styling.
   */
  get charts() {
    return [
      {
        id: 'users-customers-bar',
        type: 'BarChart',
        title: 'Users & Customers per Month',
        data: this.chartDataService.getUsersCustomersData(),
        options: {
          title: 'Monthly Users & Customers',
          titleTextStyle: { fontSize: 16 },
          hAxis: { title: 'Count' },
          vAxis: { title: 'Month' },
          colors: ['#1f77b4', '#ff7f0e'],
          height: 300,
          legend: { position: 'top', maxLines: 3 },
          bar: { groupWidth: '75%' }
        }
      },
      {
        id: 'user-distribution-pie',
        type: 'PieChart',
        title: 'User vs Customer Distribution',
        data: this.chartDataService.getUserDistributionData(),
        options: {
          title: 'User Distribution',
          titleTextStyle: { fontSize: 16 },
          height: 300,
          colors: ['#2ca02c', '#d62728'],
          legend: { position: 'bottom' },
          pieSliceText: 'percentage'
        }
      },
      {
        id: 'monthly-active-users-line',
        type: 'LineChart',
        title: 'Monthly Active Users Trend',
        data: this.chartDataService.getMonthlyActiveUsersData(),
        options: {
          title: 'Monthly Active Users Trend',
          titleTextStyle: { fontSize: 16 },
          hAxis: { title: 'Month' },
          vAxis: { title: 'Active Users' },
          height: 300,
          colors: ['#9467bd'],
          curveType: 'function',
          legend: { position: 'bottom' },
          pointSize: 5
        }
      }
    ];
  }
}