
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { AppSidebar } from './app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full min-h-screen"> {/* Added w-full */}
      <AppSidebar />
      <div className="flex flex-1 flex-col w-0"> 
        <Navbar />
        {/* SidebarInset will now be the <main> tag with padding and overflow */}
        <SidebarInset as="main"> 
          {children}
        </SidebarInset>
      </div>
    </div>
  );
}

    