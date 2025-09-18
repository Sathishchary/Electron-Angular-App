import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// For Word document handling, we'll use mammoth to read docx files
// and create simple HTML content for display
declare var mammoth: any;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor() {}

  // Word Document Operations
  async loadWordDocument(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // For simplicity, we'll use a basic text extraction approach
          // In a full implementation, you would use mammoth.js or similar
          if (file.name.endsWith('.txt')) {
            const text = new TextDecoder().decode(arrayBuffer);
            resolve(`<p>${text.replace(/\n/g, '</p><p>')}</p>`);
          } else {
            // For docx files, provide a placeholder until mammoth is properly integrated
            resolve('<p>Word document loaded. Content extraction requires mammoth.js integration.</p><p>You can start editing this document...</p>');
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  async saveWordDocument(content: string, fileName: string): Promise<void> {
    // Convert HTML content to plain text for simple saving
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const name = fileName.replace(/\.[^/.]+$/, '') + '.txt';
    saveAs(blob, name);
  }

  async exportWordToPDF(content: string, fileName: string): Promise<void> {
    // For PDF export, we would typically use jsPDF or similar
    // For now, we'll save as HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 1in; line-height: 1.5; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const name = fileName.replace(/\.[^/.]+$/, '') + '.html';
    saveAs(blob, name);
  }

  // Excel Document Operations
  async loadExcelDocument(file: File): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to array of arrays
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Ensure minimum size
          const result = jsonData.length > 0 ? jsonData : [['Column A', 'Column B', 'Column C']];
          resolve(result as any[][]);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  async saveExcelDocument(data: any[][], fileName: string): Promise<void> {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const name = fileName.includes('.') ? fileName : fileName + '.xlsx';
    saveAs(blob, name);
  }

  async exportExcelToCSV(data: any[][], fileName: string): Promise<void> {
    const csv = data.map(row => 
      row.map(cell => {
        const cellStr = String(cell || '');
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return '"' + cellStr.replace(/"/g, '""') + '"';
        }
        return cellStr;
      }).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const name = fileName.replace(/\.[^/.]+$/, '') + '.csv';
    saveAs(blob, name);
  }

  // Presentation Document Operations
  async loadPresentationDocument(file: File): Promise<any[]> {
    // For now, return a basic structure
    // In a full implementation, you would parse PPTX files
    return Promise.resolve([
      {
        title: 'Loaded Presentation',
        content: 'This presentation was loaded from: ' + file.name,
        backgroundColor: '#ffffff'
      },
      {
        title: 'Slide 2',
        content: 'PowerPoint parsing requires specialized libraries like pptx2json or similar.',
        backgroundColor: '#f5f5f5'
      }
    ]);
  }

  async savePresentationDocument(slides: any[], fileName: string): Promise<void> {
    // Create a simple HTML representation of the presentation
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .slide { 
            width: 800px; 
            height: 600px; 
            margin: 20px auto; 
            padding: 40px; 
            border: 2px solid #ccc; 
            page-break-after: always;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .slide h1 { font-size: 36px; margin-bottom: 30px; text-align: center; }
          .slide p { font-size: 18px; line-height: 1.6; text-align: center; }
          @media print {
            .slide { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        ${slides.map((slide, index) => `
          <div class="slide" style="background-color: ${slide.backgroundColor}">
            <h1>${slide.title}</h1>
            <p>${slide.content}</p>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const name = fileName.replace(/\.[^/.]+$/, '') + '.html';
    saveAs(blob, name);
  }

  async exportPresentationToPDF(slides: any[], fileName: string): Promise<void> {
    // For now, export as HTML (in production, you'd use jsPDF or similar)
    await this.savePresentationDocument(slides, fileName);
  }

  // Utility methods
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  getSupportedFormats(): { [key: string]: string[] } {
    return {
      word: ['doc', 'docx', 'txt'],
      excel: ['xls', 'xlsx', 'csv'],
      presentation: ['ppt', 'pptx']
    };
  }

  isFileSupported(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    const allSupported = Object.values(this.getSupportedFormats()).flat();
    return allSupported.includes(extension);
  }

  getDocumentType(fileName: string): 'word' | 'excel' | 'presentation' | null {
    const extension = this.getFileExtension(fileName);
    const formats = this.getSupportedFormats();
    
    for (const [type, extensions] of Object.entries(formats)) {
      if (extensions.includes(extension)) {
        return type as 'word' | 'excel' | 'presentation';
      }
    }
    
    return null;
  }
}