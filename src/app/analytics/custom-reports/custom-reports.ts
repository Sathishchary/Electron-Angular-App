import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AnalyticsData } from '../services/analytics-data';

@Component({
  selector: 'app-custom-reports',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './custom-reports.html',
  styleUrl: './custom-reports.css'
})
export class CustomReports implements OnInit {
  filterForm: FormGroup;
  reportData: any[] = [];
  loading = false;
  reportGenerated = false;
  
  displayedColumns: string[] = ['id', 'name', 'value', 'category'];
  
  reportTypes = [
    { value: 'users', label: 'User Report' },
    { value: 'customers', label: 'Customer Report' },
    { value: 'revenue', label: 'Revenue Report' },
    { value: 'engagement', label: 'Engagement Report' }
  ];

  dateRanges = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: AnalyticsData,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      reportType: ['users'],
      dateRange: ['last_30_days'],
      startDate: [null],
      endDate: [null],
      category: [''],
      minValue: [null],
      maxValue: [null]
    });
  }

  ngOnInit() {
    // Watch for date range changes
    this.filterForm.get('dateRange')?.valueChanges.subscribe(value => {
      const isCustom = value === 'custom';
      if (isCustom) {
        this.filterForm.get('startDate')?.enable();
        this.filterForm.get('endDate')?.enable();
      } else {
        this.filterForm.get('startDate')?.disable();
        this.filterForm.get('endDate')?.disable();
      }
    });
  }

  generateReport() {
    if (this.filterForm.valid) {
      this.loading = true;
      const filters = this.filterForm.value;
      
      this.dataService.generateReport(filters).subscribe({
        next: (report) => {
          this.reportData = report.data;
          this.reportGenerated = true;
          this.loading = false;
          this.snackBar.open('Report generated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error generating report. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  exportToCSV() {
    if (this.reportData.length > 0) {
      const reportType = this.filterForm.get('reportType')?.value;
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${reportType}_report_${timestamp}`;
      
      this.dataService.exportToCSV(this.reportData, filename);
      this.snackBar.open('Report exported to CSV successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  exportToExcel() {
    // Simulate Excel export (in real implementation, you would use a library like SheetJS)
    this.snackBar.open('Excel export feature would be implemented with a library like SheetJS', 'Close', {
      duration: 5000,
      panelClass: ['info-snackbar']
    });
  }

  clearFilters() {
    this.filterForm.reset({
      reportType: 'users',
      dateRange: 'last_30_days',
      startDate: null,
      endDate: null,
      category: '',
      minValue: null,
      maxValue: null
    });
    this.reportData = [];
    this.reportGenerated = false;
  }

  isCustomDateRange(): boolean {
    return this.filterForm.get('dateRange')?.value === 'custom';
  }
}
