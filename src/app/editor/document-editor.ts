import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DocumentService } from './document.service';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './document-editor.html',
  styleUrl: './document-editor.css'
})
export class DocumentEditor implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('wordEditor') wordEditor!: ElementRef<HTMLDivElement>;
  @ViewChild('excelContainer') excelContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('presentationContainer') presentationContainer!: ElementRef<HTMLDivElement>;

  currentDocumentType: 'word' | 'excel' | 'presentation' | null = null;
  fileName = 'Untitled';
  isLoading = false;
  
  // Word document content
  wordContent = '';
  
  // Excel data
  excelData: any[][] = [
    ['Name', 'Age', 'City', 'Salary'],
    ['John Doe', 30, 'New York', 50000],
    ['Jane Smith', 25, 'Los Angeles', 45000],
    ['Bob Johnson', 35, 'Chicago', 55000]
  ];
  
  // Presentation data
  slides: any[] = [
    {
      title: 'Welcome to My Presentation',
      content: 'This is the first slide of your presentation.',
      backgroundColor: '#ffffff'
    },
    {
      title: 'Second Slide',
      content: 'Add your content here...',
      backgroundColor: '#f5f5f5'
    }
  ];
  
  currentSlideIndex = 0;

  constructor(
    private documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.initializeWordEditor();
  }

  private initializeWordEditor() {
    if (this.wordEditor) {
      this.wordEditor.nativeElement.innerHTML = this.wordContent || '<p>Start typing your document...</p>';
      this.wordEditor.nativeElement.addEventListener('input', (event) => {
        this.wordContent = this.wordEditor.nativeElement.innerHTML;
      });
    }
  }

  // File operations
  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isLoading = true;
    this.fileName = file.name;

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      switch (fileExtension) {
        case 'docx':
        case 'doc':
          await this.loadWordDocument(file);
          this.currentDocumentType = 'word';
          break;
        case 'xlsx':
        case 'xls':
          await this.loadExcelDocument(file);
          this.currentDocumentType = 'excel';
          break;
        case 'pptx':
        case 'ppt':
          await this.loadPresentationDocument(file);
          this.currentDocumentType = 'presentation';
          break;
        default:
          this.snackBar.open('Unsupported file format', 'Close', { duration: 3000 });
          return;
      }
      
      this.snackBar.open(`${file.name} loaded successfully`, 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error loading file:', error);
      this.snackBar.open('Error loading file', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  private async loadWordDocument(file: File) {
    try {
      const content = await this.documentService.loadWordDocument(file);
      this.wordContent = content;
      if (this.wordEditor) {
        this.wordEditor.nativeElement.innerHTML = content;
      }
    } catch (error) {
      console.error('Error loading Word document:', error);
      throw error;
    }
  }

  private async loadExcelDocument(file: File) {
    try {
      const data = await this.documentService.loadExcelDocument(file);
      this.excelData = data;
    } catch (error) {
      console.error('Error loading Excel document:', error);
      throw error;
    }
  }

  private async loadPresentationDocument(file: File) {
    try {
      const slides = await this.documentService.loadPresentationDocument(file);
      this.slides = slides;
      this.currentSlideIndex = 0;
    } catch (error) {
      console.error('Error loading presentation:', error);
      throw error;
    }
  }

  // Document type selection
  createNewDocument(type: 'word' | 'excel' | 'presentation') {
    this.currentDocumentType = type;
    this.fileName = `Untitled.${type === 'word' ? 'docx' : type === 'excel' ? 'xlsx' : 'pptx'}`;
    
    switch (type) {
      case 'word':
        this.wordContent = '<p>Start typing your document...</p>';
        setTimeout(() => this.initializeWordEditor(), 0);
        break;
      case 'excel':
        this.excelData = [
          ['Column A', 'Column B', 'Column C'],
          ['', '', ''],
          ['', '', '']
        ];
        break;
      case 'presentation':
        this.slides = [
          {
            title: 'Title Slide',
            content: 'Your presentation content...',
            backgroundColor: '#ffffff'
          }
        ];
        this.currentSlideIndex = 0;
        break;
    }
  }

  // Word formatting
  formatText(command: string, value?: string) {
    document.execCommand(command, false, value);
    this.wordContent = this.wordEditor.nativeElement.innerHTML;
  }

  // Excel operations
  addRow() {
    const newRow = new Array(this.excelData[0]?.length || 3).fill('');
    this.excelData.push(newRow);
  }

  addColumn() {
    this.excelData.forEach(row => row.push(''));
  }

  deleteRow(index: number) {
    if (this.excelData.length > 1) {
      this.excelData.splice(index, 1);
    }
  }

  deleteColumn(index: number) {
    if (this.excelData[0]?.length > 1) {
      this.excelData.forEach(row => row.splice(index, 1));
    }
  }

  updateCell(rowIndex: number, colIndex: number, value: string) {
    this.excelData[rowIndex][colIndex] = value;
  }

  // Presentation operations
  addSlide() {
    const newSlide = {
      title: 'New Slide',
      content: 'Add your content here...',
      backgroundColor: '#ffffff'
    };
    this.slides.push(newSlide);
    this.currentSlideIndex = this.slides.length - 1;
  }

  deleteSlide(index: number) {
    if (this.slides.length > 1) {
      this.slides.splice(index, 1);
      if (this.currentSlideIndex >= this.slides.length) {
        this.currentSlideIndex = this.slides.length - 1;
      }
    }
  }

  selectSlide(index: number) {
    this.currentSlideIndex = index;
  }

  updateSlideTitle(title: string) {
    if (this.slides[this.currentSlideIndex]) {
      this.slides[this.currentSlideIndex].title = title;
    }
  }

  updateSlideContent(content: string) {
    if (this.slides[this.currentSlideIndex]) {
      this.slides[this.currentSlideIndex].content = content;
    }
  }

  changeSlideBackground(color: string) {
    if (this.slides[this.currentSlideIndex]) {
      this.slides[this.currentSlideIndex].backgroundColor = color;
    }
  }

  // Save operations
  async saveDocument() {
    if (!this.currentDocumentType) {
      this.snackBar.open('Please create or open a document first', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      switch (this.currentDocumentType) {
        case 'word':
          await this.documentService.saveWordDocument(this.wordContent, this.fileName);
          break;
        case 'excel':
          await this.documentService.saveExcelDocument(this.excelData, this.fileName);
          break;
        case 'presentation':
          await this.documentService.savePresentationDocument(this.slides, this.fileName);
          break;
      }
      this.snackBar.open('Document saved successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error saving document:', error);
      this.snackBar.open('Error saving document', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  // Export operations
  async exportDocument(format: string) {
    if (!this.currentDocumentType) {
      this.snackBar.open('Please create or open a document first', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    try {
      switch (this.currentDocumentType) {
        case 'word':
          if (format === 'pdf') {
            await this.documentService.exportWordToPDF(this.wordContent, this.fileName);
          } else {
            await this.saveDocument();
          }
          break;
        case 'excel':
          await this.documentService.exportExcelToCSV(this.excelData, this.fileName);
          break;
        case 'presentation':
          await this.documentService.exportPresentationToPDF(this.slides, this.fileName);
          break;
      }
      this.snackBar.open(`Document exported as ${format.toUpperCase()}`, 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error exporting document:', error);
      this.snackBar.open('Error exporting document', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  // Helper methods
  getColumnName(index: number): string {
    return String.fromCharCode(65 + index);
  }

  onCellInput(event: Event, rowIndex: number, colIndex: number) {
    const target = event.target as HTMLInputElement;
    this.updateCell(rowIndex, colIndex, target.value);
  }

  onBackgroundColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.changeSlideBackground(target.value);
  }

  onSlideTitleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateSlideTitle(target.value);
  }

  onSlideContentInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.updateSlideContent(target.value);
  }
}