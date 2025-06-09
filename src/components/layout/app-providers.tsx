
'use client';

// This component might become redundant if LanguageProvider and SidebarProvider
// are directly used in src/app/[locale]/layout.tsx.
// For now, keeping it simple and assuming it might be removed or changed later.
// If LocaleLayout directly implements these providers, this file can be deleted.

import type { ReactNode } from 'react';
// import { LanguageProvider } from '@/contexts/language-provider'; // Will be used higher up
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // LanguageProvider is now expected to be wrapping this at a higher level ([locale]/layout.tsx)
    <SidebarProvider defaultOpen={true}>
      {children}
    </SidebarProvider>
  );
}
