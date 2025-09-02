import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleChartsService {
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  loadGoogleCharts(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.charts) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => {
          this.isLoaded = true;
          resolve();
        });
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Charts'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  createBarChart(element: HTMLElement, data: any[], title: string): void {
    if (!this.isLoaded || typeof google === 'undefined') {
      console.error('Google Charts not loaded');
      return;
    }

    const chartData = google.visualization.arrayToDataTable(data);
    const options = {
      title: title,
      chartArea: { width: '50%' },
      hAxis: {
        title: 'Count',
        minValue: 0
      },
      vAxis: {
        title: 'Categories'
      },
      backgroundColor: 'transparent',
      titleTextStyle: {
        fontSize: 16,
        bold: true
      }
    };

    const chart = new google.visualization.BarChart(element);
    chart.draw(chartData, options);
  }

  createPieChart(element: HTMLElement, data: any[], title: string): void {
    if (!this.isLoaded || typeof google === 'undefined') {
      console.error('Google Charts not loaded');
      return;
    }

    const chartData = google.visualization.arrayToDataTable(data);
    const options = {
      title: title,
      backgroundColor: 'transparent',
      titleTextStyle: {
        fontSize: 16,
        bold: true
      },
      legend: {
        position: 'bottom'
      }
    };

    const chart = new google.visualization.PieChart(element);
    chart.draw(chartData, options);
  }
}