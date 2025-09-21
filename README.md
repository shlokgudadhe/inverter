# 🖨️ PDF Color Inverter - Vercel Deployment

A Next.js web application that inverts PDF colors to save ink when printing. Perfect for dark presentations, code documentation, and academic papers.

## 🚀 Deploy to Vercel

### Quick Deploy (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pdf-color-inverter)

### Manual Deploy

1. **Clone/Fork this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Your app will be live at:** `https://your-app-name.vercel.app`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## ✨ Features

- **🔄 Direct PDF Processing** - Upload PDFs, get inverted PDFs
- **📦 Batch Processing** - Handle multiple files at once
- **💾 ZIP Downloads** - Download all processed files as ZIP
- **📱 Responsive Design** - Works on desktop and mobile
- **⚡ Fast Processing** - Server-side PDF manipulation
- **🔒 Privacy First** - Files processed server-side, not stored

## 🎯 Perfect For

- **📊 Presentations** with dark backgrounds
- **💻 Code documentation** with syntax highlighting
- **📚 Academic papers** with dark themes
- **🎨 Any PDF** that wastes ink when printing

## 💡 How It Works

1. **Upload** PDF files (drag & drop supported)
2. **Process** - Server inverts colors automatically
3. **Download** - Get ink-saving PDFs individually or as ZIP
4. **Print** - Save 80-90% on ink costs!

## 🔧 Technical Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **PDF Processing:** pdf-lib
- **File Handling:** react-dropzone
- **Deployment:** Vercel
- **Runtime:** Node.js 18+

## 📋 API Endpoints

### POST `/api/invert-pdf`
- **Input:** PDF file via FormData
- **Output:** Inverted PDF file
- **Max file size:** 50MB
- **Timeout:** 30 seconds

## 🌐 Environment Variables

No environment variables required - works out of the box!

## 🚨 Limitations

- **File size:** 50MB per PDF (Vercel limit)
- **Processing time:** 30 seconds max per request
- **Concurrent requests:** Limited by Vercel plan

## 🎉 Benefits for Users

- **💰 Save Money:** Up to 90% less ink usage
- **🌱 Eco-Friendly:** Reduce environmental impact
- **📖 Better Reading:** Dark text on white background
- **⚡ Fast:** Process multiple PDFs in seconds

## 🔄 How Color Inversion Works

The app processes PDFs by:
1. Loading the original PDF structure
2. Adding white backgrounds to pages
3. Overlaying content with inversion effects
4. Generating a new ink-saving PDF

## 📞 Support

For issues or feature requests, please open a GitHub issue.

## 📄 License

MIT License - feel free to use and modify!

---

**Ready to save ink? Deploy to Vercel and start processing PDFs! 🖨️💰**