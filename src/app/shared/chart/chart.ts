import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class ChartComponent implements OnInit {
  @Input() chartType: ChartType = ChartType.PieChart;
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() options: any = {};
  @Input() width: number = 400;
  @Input() height: number = 300;

  ngOnInit(): void {
    // Set default options if none provided
    if (Object.keys(this.options).length === 0) {
      this.options = {
        is3D: true,
        backgroundColor: 'transparent',
        titleTextStyle: { color: '#333', fontSize: 16 },
        legend: { position: 'bottom', textStyle: { color: '#333' } }
      };
    }
  }
}
