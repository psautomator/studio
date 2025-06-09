
// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import next/image
import type { Language } from '@/types';
import { Button } from '@/components/ui/button'; // Import Button
import { APP_NAME } from '@/lib/constants'; // Import APP_NAME
import { useLanguage } from '@/hooks/use-language'; // For translations

export default function RootPage() {
  const router = useRouter();
  // translations will be an empty object on first load if LanguageProvider is not wrapping this root page
  // which it isn't by default. So, we need a fallback.
  const { translations: contextTranslations, language: contextLanguage } = useLanguage();

  // Fallback translations for the root page elements, as it might render before LanguageProvider context is fully available or if it's outside it.
  const getTranslation = (key: string, lang: Language, fallback: string): string => {
    const allTranslations = {
      en: {
        appName: APP_NAME,
        welcome: "Welcome to",
        tagline: "Your personal guide to mastering the Javanese language.",
        getStarted: "Get Started",
        allRightsReserved: "All rights reserved.",
      },
      nl: {
        appName: APP_NAME, // Assuming APP_NAME is fine for both or you'd handle it differently
        welcome: "Welkom bij",
        tagline: "Jouw persoonlijke gids om de Javaanse taal te beheersen.",
        getStarted: "Begin Nu",
        allRightsReserved: "Alle rechten voorbehouden.",
      }
    };
    return allTranslations[lang]?.[key as keyof typeof allTranslations.en] || fallback;
  };
  
  const preferredLocaleFromStorage: Language | null = typeof window !== 'undefined' ? localStorage.getItem('javaneseJourneyLanguagePref') as Language : null;
  const targetLocale: Language = preferredLocaleFromStorage || contextLanguage || 'nl';
  const dashboardLink = `/${targetLocale}/dashboard`;

  const translations = {
    appName: getTranslation('appName', targetLocale, APP_NAME),
    welcome: getTranslation('welcome', targetLocale, "Welcome to"),
    tagline: getTranslation('tagline', targetLocale, "Your personal guide to mastering the Javanese language."),
    getStarted: getTranslation('getStarted', targetLocale, "Get Started"),
    allRightsReserved: getTranslation('allRightsReserved', targetLocale, "All rights reserved."),
  };


  useEffect(() => {
    router.replace(dashboardLink);
  }, [router, dashboardLink]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12">
        <div className="text-center max-w-3xl">
          <div className="mb-8 rounded-lg overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[1024/576]">
            <Image
              src="https://placehold.co/1024x576.png" // REPLACE THIS with your actual image path, e.g., /hero-image.jpg
              alt={translations.appName}
              width={1024}
              height={576}
              className="w-full h-full object-cover" // Ensure image covers the aspect ratio box
              priority 
              data-ai-hint="learning travel"
            />
          </div>

          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            {translations.welcome} {translations.appName}!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {translations.tagline}
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6">
            {/* Use <a> for a direct link feel, router.replace will still handle the SPA transition */}
            <a href={dashboardLink}> 
              {translations.getStarted}
            </a>
          </Button>
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {translations.appName}. {translations.allRightsReserved}
        </p>
      </footer>
    </div>
  );
}
