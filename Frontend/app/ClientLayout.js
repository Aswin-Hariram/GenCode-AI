'use client';

import { Inter } from 'next/font/google';
import { SidebarProvider } from './context/SidebarContext';
import CombinedSidebar from './components/sidebar/CombinedSidebar';
import { ThemeProvider } from './context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        {/* Urbanist font for all environments */}
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap" rel="stylesheet" />
        <style jsx global>{`
          :root {
            --font-inter: 'Inter', sans-serif;
          }
          body {
            font-family: var(--font-inter), sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <SidebarProvider>
            {children}
            <CombinedSidebar />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
