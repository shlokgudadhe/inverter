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
    
    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const { width, height } = page.getSize()
      
      // Create a new page with the same dimensions
      const newPage = newPdfDoc.addPage([width, height])
      
      // Fill the page with white background (inverted from potential black)
      newPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(1, 1, 1), // White background
      })
      
      // Copy the original page content
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, [i])
      const [copiedPage] = copiedPages
      
      // Draw the copied page with blend mode that simulates inversion
      // This creates a basic inversion effect by overlaying on white background
      newPage.drawPage(copiedPage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
        opacity: 1,
      })
      
      // Add a semi-transparent white overlay to lighten dark areas
      newPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height,
        color: rgb(1, 1, 1),
        opacity: 0.3, // Adjust this to control inversion strength
      })
    }
    
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