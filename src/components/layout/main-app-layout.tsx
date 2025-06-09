import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { AppSidebar } from './app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar'; // This is the main content area wrapper from ShadCN Sidebar

export function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <SidebarInset> {/* This will be the main content area that resizes with the sidebar */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
