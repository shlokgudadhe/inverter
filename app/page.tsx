'use client'

import { useState } from 'react'
import JSZip from 'jszip'

interface ProcessedFile {
  name: string
  data: Blob
  originalName: string
}

interface FileStatus {
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [resolution, setResolution] = useState(150)
  const [quality, setQuality] = useState(0.8)
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      file => file.type === 'application/pdf'
    )
    
    if (selectedFiles.length === 0) {
      setError('Please select valid PDF files only')
      return
    }
    
    setFiles(prev => [...prev, ...selectedFiles])
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    )
    setFiles(prev => [...prev, ...droppedFiles])
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setFiles([])
    setProcessedFiles([])
    setError(null)
    setProgress(0)
  }

  const processFiles = async () => {
    if (files.length === 0) return

    setProcessing(true)
    setError(null)
    setProcessedFiles([])
    setProgress(0)

    try {
      const processed: ProcessedFile[] = []

      // Import PDF processing components dynamically
      const { default: PDFProcessor } = await import('./utils/pdfProcessor')
      
      const results = await PDFProcessor.processMultiplePDFs(
        files,
        { resolution, quality },
        (current, total) => {
          setProgress((current / total) * 100)
        }
      )
      
      processed.push(...results)

      setProcessedFiles(processed)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const downloadFile = (file: ProcessedFile) => {
    const url = URL.createObjectURL(file.data)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllAsZip = async () => {
    const zip = new JSZip()
    
    processedFiles.forEach(file => {
      zip.file(file.name, file.data)
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inverted_pdfs.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpg')" }} // put your image in public/background.jpg
    >
      <div className="bg-white/80 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              🖨️ PDF Color Inverter
            </h1>
            <p className="text-xl text-secondary">
              for Sayee Navachi Ek Porgi
            </p>
          </div>

          {/* ... rest of your code stays unchanged ... */}
        </div>
      </div>
    </div>
  )
}
