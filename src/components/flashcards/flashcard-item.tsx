"use client";

import type { Word } from '@/types';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface FlashcardItemProps {
  word: Word;
}

export function FlashcardItem({ word }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { translations } = useLanguage();

  return (
    <Card className="w-full max-w-md mx-auto aspect-[3/2] perspective shadow-xl relative">
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button onClick={() => setIsFlipped(!isFlipped)} variant="outline" className="shadow-md">
          <RefreshCw className="mr-2 h-4 w-4" />
          {translations.flip}
        </Button>
      </div>
    </Card>
  );
}
