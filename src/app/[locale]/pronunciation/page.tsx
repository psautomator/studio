
"use client";

import { useState, useEffect, useCallback } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { PronunciationItem } from '@/components/pronunciation/pronunciation-item';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import type { Word } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { ChevronRight, ThumbsUp, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { runFlow } from '@genkit-ai/next/client';
import { getPronunciationFeedback, type PronunciationFeedbackOutput } from '@/ai/flows/pronunciation-feedback-flow';

export default function PronunciationPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [allWords] = useState<Word[]>(placeholderWords);
  const [filteredWords, setFilteredWords] = useState<Word[]>(placeholderWords);
  const [selectedLevel, setSelectedLevel] = useState<Word['level'] | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isRecordingAi, setIsRecordingAi] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<PronunciationFeedbackOutput | null>(null);

  useEffect(() => {
    let newFilteredWords;
    if (selectedLevel === 'all') {
      newFilteredWords = allWords;
    } else {
      newFilteredWords = allWords.filter(word => word.level === selectedLevel);
    }
    setFilteredWords(newFilteredWords);
    setCurrentIndex(0);
    setAiFeedback(null); 
  }, [selectedLevel, allWords]);

  const currentWord = filteredWords.length > 0 ? filteredWords[currentIndex] : null;

  const advanceWord = useCallback(() => {
    if (filteredWords.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredWords.length);
    setAiFeedback(null); 
    setIsRecordingAi(false);
    setIsProcessingAi(false);
  }, [filteredWords.length]);


  const handleNextWord = useCallback(() => {
    advanceWord();
  }, [advanceWord]);

  const handleMarkKnown = () => {
    if (currentWord) {
      toast({
        title: "Marked as Known",
        description: `You marked "${currentWord.javanese}" as known.`,
      });
    }
    advanceWord();
  };

  const handleMarkRepeat = () => {
     if (currentWord) {
      toast({
        title: "Marked for Repeat",
        description: `"${currentWord.javanese}" will be set for future review.`,
      });
    }
    advanceWord();
  };

  const handleAiPracticeToggle = async () => {
    if (!currentWord) return;

    if (isRecordingAi) { 
      setIsRecordingAi(false);
      setIsProcessingAi(true);
      setAiFeedback(null);
      try {
        const dummyAudioDataUri = 'data:audio/webm;base64,XXXX';
        const result = await runFlow(getPronunciationFeedback, {
          targetWord: currentWord.javanese,
          audioDataUri: dummyAudioDataUri,
        });
        setAiFeedback(result);
        toast({ title: "+5 XP!", description: "Pronunciation practice attempted." });
        if (result.score >= 80) {
            toast({ title: "+10 XP Bonus!", description: "Great pronunciation!" });
        }
      } catch (error) {
        console.error("Error getting AI feedback:", error);
        toast({
          title: "AI Feedback Error",
          description: "Could not get feedback from the AI tutor. Please try again.",
          variant: "destructive",
        });
        setAiFeedback(null);
      } finally {
        setIsProcessingAi(false);
      }
    } else { 
      setIsRecordingAi(true);
      setIsProcessingAi(false);
      setAiFeedback(null);
      toast({
        title: "Recording Started (Simulated)",
        description: "Microphone recording is simulated. Click 'Stop & Get Feedback' to proceed.",
      });
    }
  };

  const levels: (Word['level'] | 'all')[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <MainAppLayout>
      <PageHeader title={translations.pronunciation} description="Listen, learn, and practice one word at a time." />
      
      {/* Apply mx-auto to this div to center it, remove outer flex justify-center div */}
      <div className="w-full max-w-2xl mx-auto space-y-6"> 
        
        {/* Filter by Level Select */}
        <div className="max-w-xs"> {/* This will be left-aligned within the centered max-w-2xl block */}
          <Label htmlFor="level-filter" className="text-sm font-medium">Filter by Level:</Label>
          <Select
            value={selectedLevel}
            onValueChange={(value) => setSelectedLevel(value as Word['level'] | 'all')}
          >
            <SelectTrigger id="level-filter" className="mt-1">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level || 'all'} value={level || 'all'}>
                  {level === 'all' ? 'All Levels' : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Pronunciation Content */}
        {currentWord ? (
          <div className="flex flex-col items-center gap-4"> {/* Centers card and buttons below it */}
            <Card className="w-full shadow-lg"> {/* Card takes full width of its max-w-2xl parent */}
              <CardContent className="p-0">
                <PronunciationItem
                  word={currentWord}
                  onAiPracticeToggle={handleAiPracticeToggle}
                  isRecordingAi={isRecordingAi}
                  isProcessingAi={isProcessingAi}
                  aiFeedback={aiFeedback}
                />
              </CardContent>
            </Card>
            
            <div className="flex w-full justify-center gap-4">
              <Button variant="outline" onClick={handleMarkKnown} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                <ThumbsUp className="mr-2 h-4 w-4" /> I Know This
              </Button>
              <Button variant="outline" onClick={handleMarkRepeat} className="text-orange-500 border-orange-500 hover:bg-orange-50 hover:text-orange-600">
                <RotateCcw className="mr-2 h-4 w-4" /> Repeat Later
              </Button>
              <Button onClick={handleNextWord} variant="default" className="bg-primary hover:bg-primary/90">
                Next Word <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
                Word {currentIndex + 1} of {filteredWords.length}
              </p>
          </div>
        ) : (
          <div className="flex justify-center"> {/* Centering for no words message */}
            <Card className="shadow-lg w-full"> {/* Card takes full width of its max-w-2xl parent */}
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-4">
                  No words found for the selected level. Please try a different filter.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainAppLayout>
  );
}
