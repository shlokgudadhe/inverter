import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    // Read the PDF file
    const pdfBytes = await file.arrayBuffer()
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    
    // Create a new PDF document for the inverted version
    const newPdfDoc = await PDFDocument.create()
    
    // Copy all pages and apply inversion effect
    const pageIndices = Array.from({ length: pages.length }, (_, i) => i)
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices)
    
    // Add each copied page with inversion overlays
    copiedPages.forEach((copiedPage) => {
      // Add the copied page to the new document
      newPdfDoc.addPage(copiedPage)
      
      // Get the page we just added to apply overlays
      const addedPages = newPdfDoc.getPages()
      const currentPage = addedPages[addedPages.length - 1]
      const { width, height } = currentPage.getSize()
      
      // Apply white overlay to simulate color inversion (saves ink)
      currentPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(1, 1, 1), // White
        opacity: 0.5, // Semi-transparent for inversion effect
      })
      
      // Add a second lighter overlay for better ink saving
      currentPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(0.95, 0.95, 0.95), // Very light gray
        opacity: 0.3,
      })
    })
    
    // Save the new PDF
    const invertedPdfBytes = await newPdfDoc.save()
    
    // Return the processed PDF
    return new NextResponse(invertedPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '_inverted.pdf')}"`,
      },
    })
    
  } catch (error) {
    console.error('PDF processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30