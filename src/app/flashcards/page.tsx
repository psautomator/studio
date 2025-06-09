
"use client";

import { useState, useEffect, useCallback } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { FlashcardItem } from '@/components/flashcards/flashcard-item';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import type { Word } from '@/types';

export default function FlashcardsPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showJavaneseFirst, setShowJavaneseFirst] = useState(true);
  const words: Word[] = placeholderWords; // In a real app, fetch or manage this list

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  }, [words.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
  }, [words.length]);

  const currentWord = words[currentIndex];

  const handlePlayAudio = useCallback((audioUrl: string) => {
    toast({
      title: `Playing Audio`,
      description: `Simulating playback for: ${currentWord?.javanese || 'current word'}. URL: ${audioUrl}`,
    });
    // Actual audio playback:
    // try {
    //   const audio = new Audio(audioUrl);
    //   audio.play();
    // } catch (error) {
    //   console.error("Error playing audio:", error);
    //   toast({ title: "Audio Error", description: "Could not play audio.", variant: "destructive" });
    // }
  }, [toast, currentWord]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (words.length === 0) return;

      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
        const cardElement = document.querySelector('[role="button"][aria-label*="Showing"]');
        if (cardElement instanceof HTMLElement) {
          cardElement.click();
        }
      } else if (event.key.toLowerCase() === 'a') {
        if (currentWord?.audioUrl) {
          handlePlayAudio(currentWord.audioUrl);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, words.length, handleNext, handlePrevious, currentWord, handlePlayAudio]);


  if (words.length === 0) {
    return (
      <MainAppLayout>
        <PageHeader title={translations.flashcards} />
        <p>No flashcards available.</p>
      </MainAppLayout>
    );
  }
  
  const progressPercentage = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  return (
    <MainAppLayout>
      <PageHeader title={translations.flashcards} description="Master new vocabulary." />
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="language-toggle-switch"
            checked={showJavaneseFirst}
            onCheckedChange={setShowJavaneseFirst}
            aria-label={translations.showJavaneseFirst || "Show Javanese First"}
          />
          <Label htmlFor="language-toggle-switch" className="text-sm">
            {translations.showJavaneseFirst || "Show Javanese First"}
          </Label>
        </div>

        <FlashcardItem word={currentWord} onPlayAudio={handlePlayAudio} showJavaneseFirst={showJavaneseFirst} />
        
        <div className="w-full max-w-md mt-4"> {/* Added mt-4 for spacing from "Knew it/Review" buttons */}
           <Progress value={progressPercentage} className="h-2 mb-2" />
           <div className="flex items-center justify-between">
            <Button onClick={handlePrevious} variant="outline" size="lg" aria-label="Previous card" className="px-6">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <p className="text-muted-foreground text-sm">
              {currentIndex + 1} / {words.length}
            </p>
            <Button onClick={handleNext} variant="outline" size="lg" aria-label="Next card" className="px-6">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </MainAppLayout>
  );
}
