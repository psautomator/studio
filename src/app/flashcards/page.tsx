"use client";

import { useState } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { FlashcardItem } from '@/components/flashcards/flashcard-item';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';

export default function FlashcardsPage() {
  const { translations } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = placeholderWords; // In a real app, fetch or manage this list

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
  };

  if (words.length === 0) {
    return (
      <MainAppLayout>
        <PageHeader title={translations.flashcards} />
        <p>No flashcards available.</p>
      </MainAppLayout>
    );
  }
  
  const currentWord = words[currentIndex];

  return (
    <MainAppLayout>
      <PageHeader title={translations.flashcards} description="Master new vocabulary." />
      <div className="flex flex-col items-center gap-8">
        <FlashcardItem word={currentWord} />
        <div className="flex items-center gap-4">
          <Button onClick={handlePrevious} variant="outline" size="lg" aria-label="Previous card">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <p className="text-muted-foreground">
            {currentIndex + 1} / {words.length}
          </p>
          <Button onClick={handleNext} variant="outline" size="lg" aria-label="Next card">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </MainAppLayout>
  );
}
