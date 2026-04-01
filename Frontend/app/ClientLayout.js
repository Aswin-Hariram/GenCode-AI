'use client';

import { SidebarProvider } from './context/SidebarContext';
import CombinedSidebar from './sections/Header/sidebar/CombinedSidebar';
import { ThemeProvider } from './context/ThemeContext';

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
