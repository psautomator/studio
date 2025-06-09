"use client";

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage, translations } = useLanguage();

  const handleSetLanguage = (lang: 'en' | 'nl') => {
    setLanguage(lang);
    localStorage.setItem('javaneseJourneyLanguage', lang);
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
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetLanguage('nl')} disabled={language === 'nl'}>
          Nederlands
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
