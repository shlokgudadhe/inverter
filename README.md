# 🖨️ PDF Color Inverter

Save up to 90% on printing costs by inverting PDF colors! Perfect for dark backgrounds, presentations, and code documentation.

## ✨ Features

- **💰 Save Money**: Up to 90% less ink usage
- **🌱 Eco-Friendly**: Reduce environmental impact  
- **⚡ Fast Processing**: Batch process multiple PDFs
- **🔒 Privacy First**: All processing happens in your browser
- **📱 Modern Interface**: Drag & drop, progress tracking, batch downloads

## 🚀 Quick Start

### Option 1: Run Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

### Option 2: Build for Production
```bash
npm run build
npm start
```

## 📖 How to Use

1. **Upload PDFs**: Drag & drop or click to browse
2. **Process**: Click "Invert Colors & Process" 
3. **Download**: Get individual files or download all as ZIP

## 🎯 Perfect For

- Dark-themed presentations
- Code documentation with dark backgrounds
- Academic papers with dark figures
- Any PDF with lots of dark content

## 🔧 Technical Details

- **Frontend**: Next.js 14, React 18, TypeScript
- **PDF Processing**: pdf-lib (client-side)
- **Styling**: Tailwind CSS
- **File Handling**: JSZip for batch downloads

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