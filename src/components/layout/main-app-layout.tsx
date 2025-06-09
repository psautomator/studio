
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { AppSidebar } from './app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar'; // This is the main content area wrapper from ShadCN Sidebar

export function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      {/* Added w-0 to ensure flex-1 properly calculates width */}
      <div className="flex flex-1 flex-col w-0"> 
        <Navbar />
        <SidebarInset> 
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
