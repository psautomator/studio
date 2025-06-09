
"use client";

import type { Word } from '@/types';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ThumbsUp, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

interface FlashcardItemProps {
  word: Word;
  onPlayAudio: (audioUrl: string) => void;
}

export function FlashcardItem({ word, onPlayAudio }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { translations } = useLanguage();
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking audio button
    if (word.audioUrl) {
      onPlayAudio(word.audioUrl);
    } else {
      toast({ title: "Audio Not Available", description: "No audio for this word yet." });
    }
  };
  
  const handleKnown = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({ title: "Marked as Known!", description: `You marked "${word.javanese}" as known.` });
    // Add logic to advance or mark as known
  };

  const handleReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({ title: "Marked for Review!", description: `"${word.javanese}" will be reviewed later.` });
    // Add logic for review
  };


  return (
    <Card 
      className="w-full max-w-md mx-auto aspect-[3/2] [perspective:1000px] shadow-xl relative cursor-pointer rounded-lg"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFlip(); }}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? `Showing ${translations.dutch} side. Click to show ${translations.javanese} side.` : `Showing ${translations.javanese} side. Click to show ${translations.dutch} side.`}
    >
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary text-center">
            {word.javanese}
          </h2>
          {word.audioUrl && (
            <Button variant="ghost" size="icon" onClick={handleAudioPlay} className="mt-3 text-accent hover:text-accent/80" aria-label="Play audio">
              <Volume2 className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground mb-1">({translations.dutch})</p>
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary text-center mb-3">
            {word.dutch}
          </h2>
          
          {(word.category || word.level) && (
            <div className="text-xs text-muted-foreground mb-3 text-center">
              {word.category && <span>Category: {word.category}</span>}
              {word.category && word.level && <span className="mx-1">|</span>}
              {word.level && <span>Level: {word.level}</span>}
            </div>
          )}

          {(word.exampleSentenceJavanese || word.exampleSentenceDutch) && (
            <div className="mt-2 text-sm text-center w-full mb-3">
              <p className="font-medium text-muted-foreground">Example:</p>
              {word.exampleSentenceJavanese && <p className="italic text-primary">{word.exampleSentenceJavanese}</p>}
              {word.exampleSentenceDutch && <p className="text-muted-foreground">{word.exampleSentenceDutch}</p>}
            </div>
          )}

          <div className="flex gap-4 mt-auto pt-4">
            <Button variant="outline" size="sm" onClick={handleKnown} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
              <ThumbsUp className="mr-2 h-4 w-4" /> Knew it
            </Button>
            <Button variant="outline" size="sm" onClick={handleReview} className="text-orange-500 border-orange-500 hover:bg-orange-50 hover:text-orange-600">
              <RotateCcw className="mr-2 h-4 w-4" /> Review
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
