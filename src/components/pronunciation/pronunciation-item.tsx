
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

  const handlePlayAudio = () => {
    if (word.audioUrl) {
      toast({
        title: `Playing: ${word.javanese}`,
        description: `Simulating audio playback. URL: ${word.audioUrl}`, // In a real app, you'd use an Audio object
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
      <div className="flex-grow">
        <div className="flex items-center">
          <p className="font-semibold text-lg text-primary">{word.javanese}</p>
          {word.audioUrl && (
             <Button variant="ghost" size="icon" onClick={handlePlayAudio} aria-label={`Play audio for ${word.javanese}`} className="ml-2">
              <Volume2 className="h-5 w-5 text-accent" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{word.dutch}</p>
        
        {word.exampleSentenceJavanese && (
          <div className="mt-2 text-xs">
            <p className="italic text-primary">Contoh: {word.exampleSentenceJavanese}</p>
            {word.exampleSentenceDutch && <p className="italic text-muted-foreground">{word.exampleSentenceDutch}</p>}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground italic mt-2">
          AI-generated explanation and detailed usage examples coming soon!
        </p>
      </div>
      {!word.audioUrl && (
        <Button variant="outline" size="icon" disabled aria-label={`No audio for ${word.javanese}`}>
            <Volume2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
