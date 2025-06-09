
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
// LanguageProvider and SidebarProvider will be in [locale]/layout.tsx
// AppProviders is removed as its responsibilities are shifted

export const metadata: Metadata = {
  title: 'Javanese Journey',
  description: 'Learn Javanese with interactive tools and personalized goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute will be set in [locale]/layout.tsx
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
