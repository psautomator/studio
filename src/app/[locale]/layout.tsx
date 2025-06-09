
"use client"; // This layout will use client-side context providers

import type { ReactNode } from 'react';
import { use } from 'react'; // Import the 'use' hook
import type { Language } from '@/types';
import { LanguageProvider } from '@/contexts/language-provider';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ // <<< Type `params` as a Promise
    locale: Language;
  }>;
}

export default function LocaleLayout({
  children,
  params, // `params` is now the Promise itself
}: LocaleLayoutProps) {
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  
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
