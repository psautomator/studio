// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Language } from '@/types';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Attempt to get preferred locale from localStorage, default to 'nl'
    // This logic is secondary to the middleware but provides a client-side push.
    const preferredLocale: Language = (localStorage.getItem('javaneseJourneyLanguagePref') as Language) || 'nl';
    router.replace(`/${preferredLocale}/dashboard`);
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <p>Loading Javanese Journey dashboard...</p>
    </div>
  );
}
