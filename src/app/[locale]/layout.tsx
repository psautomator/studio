
// This is a new file: src/app/[locale]/layout.tsx
"use client"; // This layout will use client-side context providers

import type { ReactNode } from 'react';
import type { Language } from '@/types';
import { LanguageProvider } from '@/contexts/language-provider';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: Language;
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // The HTML element is in the root layout (src/app/layout.tsx)
  // If we need to set the lang attribute dynamically based on locale,
  // it's better done in the root layout if it can access params,
  // or via a client component that modifies the document.
  // For now, Next.js i18n might handle this at a higher level.
  // We can add a client component here to set document.documentElement.lang if needed.
  
  // useEffect(() => {
  //   document.documentElement.lang = locale;
  // }, [locale]);

  return (
    <LanguageProvider passedLocale={locale}>
      <SidebarProvider defaultOpen={true}>
        {children}
      </SidebarProvider>
    </LanguageProvider>
  );
}
