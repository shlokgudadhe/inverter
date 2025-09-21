import * as pdfjsLib from 'pdfjs-dist'
import { jsPDF } from 'jspdf'

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`
}

class PDFProcessor {
  static async invertPDF(file: File): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        // Load PDF
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        
        // Create new PDF with proper dimensions
        const firstPage = await pdf.getPage(1)
        const firstViewport = firstPage.getViewport({ scale: 1.0 })
        
        const newPdf = new jsPDF({
          orientation: firstViewport.width > firstViewport.height ? 'landscape' : 'portrait',
          unit: 'pt',
          format: [firstViewport.width, firstViewport.height]
        })
        
        let isFirstPage = true
        
        // Process each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          // Get page
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: 2.0 }) // High resolution for quality
          
          // Create canvas
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')!
          canvas.height = viewport.height
          canvas.width = viewport.width
          
          // Render page to canvas
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise
          
          // Get image data and invert colors
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          this.invertImageColors(imageData)
          
          // Put inverted image back on canvas
          context.putImageData(imageData, 0, 0)
          
          // Convert canvas to image
          const imgData = canvas.toDataURL('image/png', 1.0) // PNG for better quality
          
          // Add page to new PDF
          if (!isFirstPage) {
            newPdf.addPage([viewport.width / 2, viewport.height / 2])
          }
          
          // Add full-size image to PDF
          newPdf.addImage(
            imgData, 
            'PNG', 
            0, 
            0, 
            viewport.width / 2, 
            viewport.height / 2
          )
          
          isFirstPage = false
        }
        
        // Generate blob
        const pdfBlob = newPdf.output('blob')
        resolve(pdfBlob)
        
      } catch (error) {
        reject(error)
      }
    })
  }
  
  private static invertImageColors(imageData: ImageData): void {
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // True color inversion: 255 - original value
      data[i] = 255 - data[i]         // Red
      data[i + 1] = 255 - data[i + 1] // Green
      data[i + 2] = 255 - data[i + 2] // Blue
      // Alpha channel (data[i + 3]) remains unchanged
    }
  }
}

export default PDFProcessor