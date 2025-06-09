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
    // Placeholder for actual audio playback
    // In a real app, you'd use an Audio object or a library
    // e.g., const audio = new Audio(word.audioUrl); audio.play();
    toast({
      title: `Playing: ${word.javanese}`,
      description: "Audio playback feature is a placeholder.",
    });
    if (word.audioUrl) {
      console.log(`Attempting to play: ${word.audioUrl}`);
      // Example: new Audio(word.audioUrl).play();
    } else {
      console.log(`No audio URL for ${word.javanese}`);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <p className="font-semibold text-lg text-primary">{word.javanese}</p>
        <p className="text-sm text-muted-foreground">{word.dutch}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handlePlayAudio} aria-label={`Play audio for ${word.javanese}`}>
        <Volume2 className="h-6 w-6 text-accent" />
      </Button>
    </div>
  );
}
