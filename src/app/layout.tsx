import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from 'sonner';
export const metadata: Metadata = { title: 'Padel Battle Series · A Sportaiment', description: 'Follow the courts. Find your match. Padel Battle Series tournament schedules, results and standings.' };
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="en"><body className={GeistSans.variable}>{children}<Toaster richColors position="bottom-right" closeButton /></body></html>;
}
