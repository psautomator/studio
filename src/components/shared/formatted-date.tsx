
"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language'; // Import useLanguage

interface FormattedDateProps {
  date?: Date | string;
  options?: Intl.DateTimeFormatOptions;
}

export function FormattedDate({ date, options }: FormattedDateProps) {
  const { language } = useLanguage(); // Get the current locale
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (date) {
      // Use the language from context for toLocaleDateString
      setFormattedDate(new Date(date).toLocaleDateString(language, options));
    } else {
      setFormattedDate('N/A');
    }
  }, [date, options, language]); // Add language to dependencies

  if (formattedDate === null) {
    return <span className="opacity-0">00/00/0000</span>;
  }

  return <>{formattedDate}</>;
}
