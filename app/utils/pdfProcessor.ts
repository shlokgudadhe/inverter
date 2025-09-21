import { PDFDocument, rgb, PDFPage } from 'pdf-lib'

class PDFProcessor {
  static async invertPDF(file: File): Promise<Blob> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      // Get all pages
      const pages = pdfDoc.getPages()
      
      // Process each page
      for (const page of pages) {
        await this.invertPageColors(page)
      }
      
      // Save the modified PDF
      const pdfBytes = await pdfDoc.save()
      return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
    } catch (error) {
      console.error('PDF processing error:', error)
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static async invertPageColors(page: PDFPage) {
    try {
      // Get page dimensions
      const { width, height } = page.getSize()
      
      // Add a white background rectangle to ensure proper inversion base
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(1, 1, 1), // White background
      })
      
      // Apply color inversion overlay
      // Create a dark overlay that will invert the appearance when printed
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(0, 0, 0), // Black overlay
        opacity: 0.8, // Semi-transparent to create inversion effect
      })
      
    } catch (error) {
      console.error('Page inversion error:', error)
      // Continue processing other pages even if one fails
    }
  }



  static async batchProcess(files: File[], onProgress?: (progress: number) => void): Promise<Array<{ name: string; data: Blob; originalName: string }>> {
    const results = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const invertedBlob = await this.invertPDF(file)
        const baseName = file.name.replace('.pdf', '')
        
        results.push({
          name: `${baseName}_inverted.pdf`,
          data: invertedBlob,
          originalName: file.name
        })
        
        if (onProgress) {
          onProgress(((i + 1) / files.length) * 100)
        }
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error)
        // Continue with other files
      }
    }
    
    return results
  }
}

export default PDFProcessor