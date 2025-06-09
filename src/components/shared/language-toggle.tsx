
"use client";

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language'; // This will now provide the URL-driven language
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, toggleLanguage, translations } = useLanguage();

  // toggleLanguage in the provider now handles navigation
  const handleSetLanguage = (langToSet: 'en' | 'nl') => {
    if (language !== langToSet) {
      toggleLanguage(); // This will navigate to the other language's path
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="flex items-center gap-1.5 px-2">
          <Languages className="h-5 w-5" />
          <span className="text-xs font-medium">{language.toUpperCase()}</span>
          <span className="sr-only">Toggle language, current: {language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetLanguage('en')} disabled={language === 'en'}>
          {translationsData.en.english || "English"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetLanguage('nl')} disabled={language === 'nl'}>
          {translationsData.nl.dutch || "Nederlands"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Minimal copy of translationsData for fallback in toggle items if translations are not yet loaded
const translationsData = {
  en: { english: "English", dutch: "Dutch" },
  nl: { english: "English", dutch: "Nederlands" },
};
