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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🖨️ PDF Color Inverter
        </h1>
        <p className="text-xl text-secondary">
          Save ink by inverting PDF colors for printing
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-semibold mb-2">Save Money</h3>
          <p className="text-sm text-gray-600">Up to 90% less ink usage</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-2">🌱</div>
          <h3 className="font-semibold mb-2">Eco-Friendly</h3>
          <p className="text-sm text-gray-600">Reduce environmental impact</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600">Batch process multiple PDFs</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">📁 Upload PDF Files</h2>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="upload-area"
        >
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <div className="text-6xl mb-4">📄</div>
          <p className="text-lg mb-2">Drag & drop PDF files here</p>
          <p className="text-gray-500 mb-4">or click to browse</p>
          <label htmlFor="file-input" className="btn-secondary cursor-pointer">
            Browse Files
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={clearAllFiles}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📄</span>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Options */}
        {files.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">⚙️ Processing Options</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resolution (DPI)
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={72}>72 DPI (Fast, Lower Quality)</option>
                  <option value={150}>150 DPI (Balanced)</option>
                  <option value={300}>300 DPI (High Quality, Slower)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0.6}>60% (Smaller Files)</option>
                  <option value={0.8}>80% (Balanced)</option>
                  <option value={1.0}>100% (Best Quality)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        {files.length > 0 && (
          <div className="mt-6">
            <button
              onClick={processFiles}
              disabled={processing}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? '🔄 Processing...' : `🔄 Process ${files.length} PDF${files.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {processing && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Processing {files.length} PDF{files.length > 1 ? 's' : ''}... {Math.round(progress)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This may take a few moments for large files or high resolution settings
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-box mt-4">
            <p>❌ {error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {processedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="success-box mb-6">
            <p>🎉 Successfully processed {processedFiles.length} PDF files!</p>
          </div>

          <h2 className="text-2xl font-semibold mb-4">📥 Download Results</h2>

          {/* Download All Button */}
          {processedFiles.length > 1 && (
            <button
              onClick={downloadAllAsZip}
              className="btn-primary mb-4 w-full"
            >
              📦 Download All as ZIP ({processedFiles.length} files)
            </button>
          )}

          {/* Individual Downloads */}
          <div className="space-y-3">
            {processedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      From: {file.originalName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => downloadFile(file)}
                  className="btn-secondary"
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* What Changed */}
          <div className="info-box mt-6">
            <h3 className="font-semibold mb-2">🔍 What Changed?</h3>
            <ul className="text-sm space-y-1">
              <li>⚫ Black backgrounds → ⚪ White backgrounds</li>
              <li>⚪ White text → ⚫ Black text</li>
              <li>🎨 Dark colors → Light colors</li>
              <li>🖨️ Perfect for ink-saving printing!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500">
        <p>Perfect for presentations, code docs, and academic papers</p>
        <p className="text-sm mt-2">Save up to 90% on printing costs! 🖨️💰</p>
      </div>
    </div>
  )
}