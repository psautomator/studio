'use client';

import type { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/language-provider';
import { SidebarProvider } from '@/components/ui/sidebar'; // Assuming this is the ShadCN sidebar provider

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SidebarProvider defaultOpen={true}>{/* Adjust defaultOpen as needed */}
        {children}
      </SidebarProvider>
    </LanguageProvider>
  );
}
