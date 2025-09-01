import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Chart Component that can render different types of Google Charts.
 * Supports all Google Chart types including BarChart, PieChart, LineChart, AreaChart, etc.
 * 
 * Usage:
 * <app-chart 
 *   [chartType]="'BarChart'"
 *   [chartData]="chartData"
 *   [chartOptions]="chartOptions"
 *   [chartId]="'unique-chart-id'">
 * </app-chart>
 * 
 * @example
 * // Bar Chart
 * chartData = [
 *   ['Month', 'Users', 'Customers'],
 *   ['Jan', 1000, 400],
 *   ['Feb', 1170, 460]
 * ];
 * 
 * @example
 * // Pie Chart
 * chartData = [
 *   ['Type', 'Count'],
 *   ['Users', 70],
 *   ['Customers', 30]
 * ];
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  /**
   * Type of chart to render (e.g., 'BarChart', 'PieChart', 'LineChart', 'AreaChart', etc.)
   */
  @Input() chartType!: string;

  /**
   * Chart data in Google Charts format - array of arrays where first array contains headers
   */
  @Input() chartData!: any[];

  /**
   * Chart configuration options (title, colors, dimensions, etc.)
   */
  @Input() chartOptions: any = {};

  /**
   * Unique identifier for the chart element
   */
  @Input() chartId!: string;

  /**
   * Width of the chart container (default: 100%)
   */
  @Input() width: string = '100%';

  /**
   * Height of the chart container (default: 300px)
   */
  @Input() height: string = '300px';

  private chart: any;
  public isGoogleChartsLoaded = false;

  ngOnInit() {
    this.loadGoogleCharts();
  }

  ngAfterViewInit() {
    if (this.isGoogleChartsLoaded) {
      this.drawChart();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.clearChart();
    }
  }

  /**
   * Loads Google Charts library - fallback to mock implementation if not available
   */
  private loadGoogleCharts(): void {
    // Try to load from window.google first
    if (typeof (window as any).google !== 'undefined' && (window as any).google.charts) {
      this.isGoogleChartsLoaded = true;
      (window as any).google.charts.setOnLoadCallback(() => this.drawChart());
      return;
    }

    // Try loading from CDN with fallback to mock
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      (window as any).google.charts.load('current', { packages: ['corechart'] });
      (window as any).google.charts.setOnLoadCallback(() => {
        this.isGoogleChartsLoaded = true;
        this.drawChart();
      });
    };
    script.onerror = () => {
      // Fallback to mock implementation
      console.warn('Google Charts CDN not available, using mock charts');
      this.setupMockCharts();
    };
    document.head.appendChild(script);

    // Timeout fallback
    setTimeout(() => {
      if (!this.isGoogleChartsLoaded) {
        console.warn('Google Charts loading timeout, using mock charts');
        this.setupMockCharts();
      }
    }, 3000);
  }

  /**
   * Sets up mock chart implementation for when Google Charts is not available
   */
  private setupMockCharts(): void {
    this.isGoogleChartsLoaded = true;
    setTimeout(() => this.drawMockChart(), 100);
  }

  /**
   * Draws the chart using Google Charts API
   */
  private drawChart(): void {
    if (!this.isGoogleChartsLoaded || !this.chartData || !this.chartType) {
      return;
    }

    try {
      const google = (window as any).google;
      if (!google || !google.visualization) {
        this.drawMockChart();
        return;
      }

      // Create data table
      const dataTable = google.visualization.arrayToDataTable(this.chartData);

      // Default options
      const defaultOptions = {
        width: this.chartContainer.nativeElement.offsetWidth || 400,
        height: parseInt(this.height) || 300,
        backgroundColor: 'transparent',
        chartArea: { left: 50, top: 50, width: '80%', height: '70%' }
      };

      // Merge default options with custom options
      const options = { ...defaultOptions, ...this.chartOptions };

      // Create chart instance based on type
      this.chart = new google.visualization[this.chartType](this.chartContainer.nativeElement);

      // Draw the chart
      this.chart.draw(dataTable, options);

      // Add resize listener for responsive behavior
      window.addEventListener('resize', () => this.onResize());

    } catch (error) {
      console.error('Error drawing chart:', error);
      this.drawMockChart();
    }
  }

  /**
   * Draws a mock chart using SVG when Google Charts is not available
   */
  private drawMockChart(): void {
    if (!this.chartData || this.chartData.length < 2) {
      this.showError('No data available');
      return;
    }

    const container = this.chartContainer.nativeElement;
    container.innerHTML = '';

    const width = container.offsetWidth || 400;
    const height = parseInt(this.height) || 300;

    if (this.chartType === 'BarChart') {
      this.drawMockBarChart(container, width, height);
    } else if (this.chartType === 'PieChart') {
      this.drawMockPieChart(container, width, height);
    } else if (this.chartType === 'LineChart') {
      this.drawMockLineChart(container, width, height);
    } else {
      this.drawMockBarChart(container, width, height); // Default to bar chart
    }
  }

  /**
   * Draws a mock bar chart using SVG
   */
  private drawMockBarChart(container: HTMLElement, width: number, height: number): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.style.backgroundColor = 'white';

    const data = this.chartData.slice(1); // Skip header
    const maxValue = Math.max(...data.map(row => Math.max(...row.slice(1).map((val: any) => parseFloat(val) || 0))));
    const barWidth = (width - 100) / data.length;
    const chartHeight = height - 80;

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width / 2).toString());
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial, sans-serif');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.textContent = this.chartOptions.title || 'Chart';
    svg.appendChild(title);

    // Draw bars
    data.forEach((row, i) => {
      const values = row.slice(1).map((val: any) => parseFloat(val) || 0);
      const x = 60 + (i * barWidth);
      
      values.forEach((value: number, j: number) => {
        const barHeight = (value / maxValue) * chartHeight;
        const y = height - 40 - barHeight;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        rect.setAttribute('x', (x + (j * barWidth/values.length)).toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', (barWidth/values.length - 2).toString());
        rect.setAttribute('height', barHeight.toString());
        rect.setAttribute('fill', this.getColor(j));
        svg.appendChild(rect);
      });

      // X-axis labels
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (x + barWidth/2).toString());
      label.setAttribute('y', (height - 15).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-family', 'Arial, sans-serif');
      label.setAttribute('font-size', '12');
      label.textContent = row[0].toString().substring(0, 8);
      svg.appendChild(label);
    });

    container.appendChild(svg);
  }

  /**
   * Draws a mock pie chart using SVG
   */
  private drawMockPieChart(container: HTMLElement, width: number, height: number): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.style.backgroundColor = 'white';

    const data = this.chartData.slice(1); // Skip header
    const total = data.reduce((sum, row) => sum + (parseFloat(row[1]) || 0), 0);
    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const radius = Math.min(width, height) / 3;

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', centerX.toString());
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial, sans-serif');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.textContent = this.chartOptions.title || 'Chart';
    svg.appendChild(title);

    let currentAngle = 0;
    data.forEach((row, i) => {
      const value = parseFloat(row[1]) || 0;
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      const x1 = centerX + radius * Math.cos(currentAngle);
      const y1 = centerY + radius * Math.sin(currentAngle);
      const x2 = centerX + radius * Math.cos(currentAngle + sliceAngle);
      const y2 = centerY + radius * Math.sin(currentAngle + sliceAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', this.getColor(i));
      path.setAttribute('stroke', 'white');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);

      currentAngle += sliceAngle;
    });

    container.appendChild(svg);
  }

  /**
   * Draws a mock line chart using SVG
   */
  private drawMockLineChart(container: HTMLElement, width: number, height: number): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.style.backgroundColor = 'white';

    const data = this.chartData.slice(1); // Skip header
    const values = data.map(row => parseFloat(row[1]) || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width / 2).toString());
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial, sans-serif');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.textContent = this.chartOptions.title || 'Chart';
    svg.appendChild(title);

    // Draw line
    const pathData = values.map((value, i) => {
      const x = 60 + (i * (width - 120) / (values.length - 1));
      const y = height - 40 - ((value - minValue) / range) * (height - 80);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', this.getColor(0));
    path.setAttribute('stroke-width', '3');
    svg.appendChild(path);

    // Draw points
    values.forEach((value, i) => {
      const x = 60 + (i * (width - 120) / (values.length - 1));
      const y = height - 40 - ((value - minValue) / range) * (height - 80);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', this.getColor(0));
      svg.appendChild(circle);
    });

    container.appendChild(svg);
  }

  /**
   * Gets a color for the given index
   */
  private getColor(index: number): string {
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
    return colors[index % colors.length];
  }

  /**
   * Handles window resize events to redraw chart responsively
   */
  private onResize(): void {
    if (this.isGoogleChartsLoaded) {
      setTimeout(() => this.drawChart(), 100);
    }
  }

  /**
   * Updates chart data and redraws the chart
   * @param newData - New data for the chart
   */
  public updateChartData(newData: any[]): void {
    this.chartData = newData;
    if (this.isGoogleChartsLoaded) {
      this.drawChart();
    }
  }

  /**
   * Updates chart options and redraws the chart
   * @param newOptions - New options for the chart
   */
  public updateChartOptions(newOptions: any): void {
    this.chartOptions = { ...this.chartOptions, ...newOptions };
    if (this.isGoogleChartsLoaded) {
      this.drawChart();
    }
  }

  /**
   * Shows an error message in the chart container
   */
  private showError(message: string): void {
    if (this.chartContainer) {
      this.chartContainer.nativeElement.innerHTML = `
        <div class="chart-error">
          <p>⚠️ ${message}</p>
        </div>
      `;
    }
  }
}