# 🖨️ PDF Color Inverter

Save up to 90% on printing costs by inverting PDF colors! Perfect for dark backgrounds, presentations, and code documentation.

## ✨ Features

- **💰 Save Money**: Up to 90% less ink usage
- **🌱 Eco-Friendly**: Reduce environmental impact  
- **⚡ Batch Processing**: Process multiple PDFs simultaneously
- **🔒 Privacy First**: All processing happens in your browser
- **📱 Modern Interface**: Drag & drop, progress tracking, batch downloads
- **⚙️ Configurable**: Adjust resolution and quality settings
- **📦 Bulk Download**: Download all processed files as ZIP

## 🚀 Quick Start

### Option 1: Run Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

### Option 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

### Option 3: Build for Production
```bash
npm run build
npm start
```

## 📖 How to Use

1. **Upload PDFs**: Drag & drop multiple files or click to browse
2. **Configure**: Choose resolution (72-300 DPI) and quality settings
3. **Process**: Click "Process X PDFs" to invert colors
4. **Download**: Get individual files or download all as ZIP

### 🔧 Processing Options

- **Resolution**: 72 DPI (fast), 150 DPI (balanced), 300 DPI (high quality)
- **Quality**: 60% (smaller files), 80% (balanced), 100% (best quality)
- **Batch Size**: Processes 2 PDFs concurrently for optimal performance

## 🎯 Perfect For

- Dark-themed presentations
- Code documentation with dark backgrounds
- Academic papers with dark figures
- Any PDF with lots of dark content

## 🔧 Technical Details

- **Frontend**: Next.js 14, React 18, TypeScript
- **PDF Processing**: PDF.js + jsPDF (client-side rendering & inversion)
- **Styling**: Tailwind CSS
- **File Handling**: JSZip for batch downloads
- **Deployment**: Optimized for Vercel with proper CORS headers

## 📊 Color Inversion Process

The app applies mathematical color inversion:
- ⚫ Black backgrounds → ⚪ White backgrounds  
- ⚪ White text → ⚫ Black text
- 🎨 Dark colors → Light colors
- Perfect contrast preservation for readability

## 🌐 Browser Support

Works in all modern browsers that support:
- File API
- Blob/ArrayBuffer
- ES6+ features

## 📝 License

MIT License - Feel free to use and modify!

---

**💡 Pro Tip**: This tool can save you hundreds of dollars per year in ink costs, especially for printing presentations and documentation!