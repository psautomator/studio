
"use client";

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date?: Date | string;
  options?: Intl.DateTimeFormatOptions;
}

export function FormattedDate({ date, options }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (date) {
      // Ensure consistent date formatting, explicitly provide locale if needed,
      // or use a library like date-fns for more control.
      // For now, using default client locale after mount.
      setFormattedDate(new Date(date).toLocaleDateString(undefined, options));
    } else {
      setFormattedDate('N/A');
    }
  }, [date, options]);

  // Render a placeholder or null until formattedDate is set on the client
  if (formattedDate === null) {
    // You can return a loading state or the original unformatted date string if preferred
    // For consistency with 'N/A', we can return null or a generic placeholder.
    // Or, to avoid layout shift, you could return a string of expected length.
    return <span className="opacity-0">00/00/0000</span>; // Placeholder to prevent layout shift, will be invisible
  }

  return <>{formattedDate}</>;
}
