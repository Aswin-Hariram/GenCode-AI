'use client';

import { Inter } from 'next/font/google';
import { SidebarProvider } from './context/SidebarContext';
import CombinedSidebar from './sections/Header/sidebar/CombinedSidebar';
import { ThemeProvider } from './context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        {/* Lexend font for all environments */}
        <style jsx global>{`
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-lexend: 'Lexend', sans-serif;
          }
          body {
            font-family: var(--font-lexend), sans-serif;
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
