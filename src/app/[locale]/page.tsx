// src/app/[locale]/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Language } from '@/types';

export default function LocaleRootPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Language;

  useEffect(() => {
    if (locale) {
      router.replace(`/${locale}/dashboard`);
    }
    // If locale is somehow not available from params (should not happen with this route structure),
    // the root page.tsx or middleware should handle redirection.
  }, [router, locale]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <p>Loading dashboard...</p>
      {/* This page should ideally redirect immediately. */}
    </div>
  );
}
