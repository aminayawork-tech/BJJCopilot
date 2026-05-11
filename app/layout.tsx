import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BJJ Copilot — AI-Powered Grappling Coach',
  description:
    'Upload a BJJ photo or video frame and get instant, expert coaching feedback powered by Claude AI.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#0a0a0a' }}>
        <div id="app-scroll-root">
          {children}
        </div>
      </body>
    </html>
  );
}
