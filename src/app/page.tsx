// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language'; // We'll use this to get the default/preferred locale if needed

export default function RootPage() {
  const router = useRouter();
  
  // This page should ideally be immediately redirected by middleware.
  // If it's ever rendered, it means middleware might not have caught the request
  // for some reason, or this is an intermediate step.
  // We attempt a client-side redirect to the default locale if not handled by middleware.
  
  // We can't use useLanguage() directly here if this page is rendered outside LanguageProvider.
  // The middleware is the primary mechanism for redirection.
  // This component serves as a fallback or if you want to render a loading/splash screen.

  useEffect(() => {
    // Attempt to get preferred locale from localStorage, default to 'nl'
    // This logic is secondary to the middleware.
    const preferredLocale = localStorage.getItem('javaneseJourneyLanguagePref') || 'nl';
    router.replace(`/${preferredLocale}`);
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <p>Loading Javanese Journey...</p>
      {/* 
        Alternatively, you could render a very simple loading indicator or splash screen here.
        It's crucial this component does NOT call useLanguage() or render components that do,
        as it's outside the [locale] layout's LanguageProvider.
      */}
    </div>
  );
}
