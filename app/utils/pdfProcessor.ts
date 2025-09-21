import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export interface ProcessingOptions {
  resolution?: number;
  quality?: number;
}

class PDFProcessor {
  static async invertPDF(
    file: File, 
    options: ProcessingOptions = {}
  ): Promise<Blob> {
    const { resolution = 150, quality = 0.8 } = options;
    
    try {
      // Load the PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let outputPDF: jsPDF | null = null;
      
      // Process each page
      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: resolution / 72 });
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        // Invert colors using composite operation
        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate page dimensions in points (72 DPI)
        const pageWidth = (viewport.width * 72) / resolution;
        const pageHeight = (viewport.height * 72) / resolution;
        
        // Initialize jsPDF with first page dimensions
        if (!outputPDF) {
          outputPDF = new jsPDF({
            orientation: pageWidth > pageHeight ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [pageWidth, pageHeight],
          });
        } else {
          outputPDF.addPage([pageWidth, pageHeight]);
          outputPDF.setPage(pageNumber);
        }
        
        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL('image/jpeg', quality);
        outputPDF.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        
        // Clean up canvas to free memory
        canvas.width = 0;
        canvas.height = 0;
      }
      
      if (!outputPDF) {
        throw new Error('Failed to create output PDF');
      }
      
      // Return as blob
      const pdfBlob = outputPDF.output('blob');
      return pdfBlob;
      
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  static async processMultiplePDFs(
    files: File[],
    options: ProcessingOptions = {},
    onProgress?: (current: number, total: number) => void
  ): Promise<{ name: string; data: Blob; originalName: string }[]> {
    const results = [];
    const maxConcurrent = 2; // Process 2 PDFs at a time to avoid memory issues
    
    // Process files in batches
    for (let i = 0; i < files.length; i += maxConcurrent) {
      const batch = files.slice(i, i + maxConcurrent);
      
      const batchPromises = batch.map(async (file, batchIndex) => {
        const globalIndex = i + batchIndex;
        onProgress?.(globalIndex, files.length);
        
        try {
          const invertedBlob = await this.invertPDF(file, options);
          const baseName = file.name.replace('.pdf', '');
          
          return {
            name: `${baseName}_inverted.pdf`,
            data: invertedBlob,
            originalName: file.name,
            success: true
          };
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          return {
            name: file.name,
            data: new Blob(),
            originalName: file.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      // Only add successful results
      results.push(...batchResults.filter(result => result.success));
    }
    
    onProgress?.(files.length, files.length);
    return results;
  }
}

export default PDFProcessor;