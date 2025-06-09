
"use client";

import type { Word } from '@/types';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
// Removed Button and RefreshCw as they are no longer needed for the flip action
import { useLanguage } from '@/hooks/use-language';

interface FlashcardItemProps {
  word: Word;
}

export function FlashcardItem({ word }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { translations } = useLanguage();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Card 
      className="w-full max-w-md mx-auto aspect-[3/2] perspective shadow-xl relative cursor-pointer"
      onClick={handleFlip}
      role="button" // Make it accessible as a button
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFlip(); }} // Allow flipping with Enter/Space
      aria-pressed={isFlipped} // Indicate a toggled state for screen readers
      aria-label={isFlipped ? `Showing ${translations.dutch} side. Click to show ${translations.javanese} side.` : `Showing ${translations.javanese} side. Click to show ${translations.dutch} side.`}
    >
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground mb-2">{translations.javanese}</p>
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary text-center">
            {word.javanese}
          </h2>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground mb-2">{translations.dutch}</p>
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary text-center">
            {word.dutch}
          </h2>
          {word.category && (
            <p className="mt-4 text-sm text-muted-foreground">Category: {word.category}</p>
          )}
        </div>
      </div>
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
      {/* The flip button has been removed. The entire card is now clickable. */}
    </Card>
  );
}
