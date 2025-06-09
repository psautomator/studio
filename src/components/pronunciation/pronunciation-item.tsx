
"use client";

import type { Word } from '@/types';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PronunciationItemProps {
  word: Word;
}

export function PronunciationItem({ word }: PronunciationItemProps) {
  const { toast } = useToast();

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent onClick handlers if this button is inside a clickable area
    if (word.audioUrl) {
      toast({
        title: `Playing: ${word.javanese}`,
        description: `Simulating audio playback. URL: ${word.audioUrl}`,
      });
      // Example: new Audio(word.audioUrl).play().catch(e => console.error("Error playing audio:", e));
    } else {
      toast({
        title: "Audio Not Available",
        description: `No audio pronunciation for "${word.javanese}".`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-start justify-between p-6 gap-4"> {/* Increased padding */}
      <div className="w-full">
        <div className="flex items-center mb-2">
          <p className="font-headline text-3xl md:text-4xl font-semibold text-primary">{word.javanese}</p>
          {word.audioUrl ? (
             <Button variant="ghost" size="icon" onClick={handlePlayAudio} aria-label={`Play audio for ${word.javanese}`} className="ml-3">
              <Volume2 className="h-6 w-6 text-accent" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" disabled aria-label={`No audio for ${word.javanese}`} className="ml-3">
                <Volume2 className="h-6 w-6 text-muted-foreground" />
            </Button>
          )}
        </div>
        <p className="text-lg text-muted-foreground mb-3">{word.dutch}</p>
        
        {(word.exampleSentenceJavanese || word.exampleSentenceDutch) && (
          <div className="mt-3 text-sm p-3 bg-muted/50 rounded-md">
            <p className="font-medium text-muted-foreground mb-1">Example:</p>
            {word.exampleSentenceJavanese && <p className="italic text-primary">{word.exampleSentenceJavanese}</p>}
            {word.exampleSentenceDutch && <p className="italic text-muted-foreground mt-0.5">{word.exampleSentenceDutch}</p>}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground italic mt-4">
          AI-generated explanation and detailed usage examples coming soon!
        </p>
      </div>
    </div>
  );
}
