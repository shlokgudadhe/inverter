import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF Color Inverter - Save Ink When Printing',
  description: 'Invert PDF colors to save up to 90% ink when printing. Perfect for dark backgrounds, presentations, and code documentation.',
  keywords: 'PDF, color invert, save ink, printing, dark mode, presentations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}