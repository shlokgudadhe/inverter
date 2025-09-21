'use client'

import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { jsPDF } from 'jspdf'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`

interface PDFInverterProps {
  file: File
  onComplete: (invertedPdf: Blob, filename: string) => void
  onError: (error: string) => void
}

export default function PDFInverter({ file, onComplete, onError }: PDFInverterProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Starting...')

  const invertColors = (imageData: ImageData): ImageData => {
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Invert RGB values (keep alpha the same)
      data[i] = 255 - data[i]         // Red
      data[i + 1] = 255 - data[i + 1] // Green
      data[i + 2] = 255 - data[i + 2] // Blue
      // data[i + 3] stays the same (Alpha)
    }
    
    return imageData
  }

  const processPDF = async () => {
    try {
      setStatus('Loading PDF...')
      
      // Load PDF
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      setStatus('Processing pages...')
      
      // Create new PDF
      const newPdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      })
      
      let isFirstPage = true
      
      // Process each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress((pageNum - 1) / pdf.numPages * 100)
        setStatus(`Processing page ${pageNum} of ${pdf.numPages}...`)
        
        // Get page
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 2.0 }) // High resolution
        
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
        const invertedImageData = invertColors(imageData)
        
        // Put inverted image back on canvas
        context.putImageData(invertedImageData, 0, 0)
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        
        // Add page to new PDF
        if (!isFirstPage) {
          newPdf.addPage()
        }
        
        // Calculate dimensions to fit page
        const pdfWidth = newPdf.internal.pageSize.getWidth()
        const pdfHeight = newPdf.internal.pageSize.getHeight()
        const imgAspectRatio = canvas.width / canvas.height
        const pdfAspectRatio = pdfWidth / pdfHeight
        
        let imgWidth, imgHeight
        if (imgAspectRatio > pdfAspectRatio) {
          imgWidth = pdfWidth
          imgHeight = pdfWidth / imgAspectRatio
        } else {
          imgHeight = pdfHeight
          imgWidth = pdfHeight * imgAspectRatio
        }
        
        // Center the image
        const x = (pdfWidth - imgWidth) / 2
        const y = (pdfHeight - imgHeight) / 2
        
        newPdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight)
        isFirstPage = false
      }
      
      setProgress(100)
      setStatus('Generating PDF...')
      
      // Generate blob
      const pdfBlob = newPdf.output('blob')
      const filename = file.name.replace('.pdf', '_inverted.pdf')
      
      onComplete(pdfBlob, filename)
      
    } catch (error) {
      console.error('PDF processing error:', error)
      onError('Failed to process PDF: ' + (error as Error).message)
    }
  }

  // Auto-start processing when component mounts
  useState(() => {
    processPDF()
  })

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <div className="flex-1">
          <p className="font-medium text-blue-900">{status}</p>
          <div className="bg-blue-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700 mt-1">{Math.round(progress)}% complete</p>
        </div>
      </div>
    </div>
  )
}