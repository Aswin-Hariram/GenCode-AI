'use client';

import { Inter } from 'next/font/google';
import { SidebarProvider } from './context/SidebarContext';
import CombinedSidebar from './sections/Header/sidebar/CombinedSidebar';
import { ThemeProvider } from './context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        {children}
        <CombinedSidebar />
      </SidebarProvider>
    </ThemeProvider>
  );
}
