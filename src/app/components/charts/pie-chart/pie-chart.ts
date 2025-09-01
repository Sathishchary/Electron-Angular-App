import { Component, Input, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleChartsService } from '../../../services/google-charts.service';
import { ChartData } from '../../../models';

@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css'
})
export class PieChart implements OnInit, OnChanges {
  @Input() data: ChartData[] = [];
  @Input() title: string = '';
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private googleChartsService: GoogleChartsService) {}

  ngOnInit(): void {
    this.loadChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.loadChart();
    }
  }

  private async loadChart(): Promise<void> {
    try {
      await this.googleChartsService.loadGoogleCharts();
      this.drawChart();
    } catch (error) {
      console.error('Failed to load chart:', error);
    }
  }

  private drawChart(): void {
    if (!this.data || this.data.length === 0) {
      return;
    }

    const chartData = [
      ['Category', 'Count'],
      ...this.data.map(item => [item.label, item.value])
    ];

    this.googleChartsService.createPieChart(
      this.chartContainer.nativeElement,
      chartData,
      this.title
    );
  }
}
