import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DigitalMEng - Autonomous Organic Marketing Engine',
  description: 'Scale authority and traffic with AI-powered organic marketing automation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
