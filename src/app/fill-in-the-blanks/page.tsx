
"use client";

import { useState, useEffect, useMemo } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import type { FillInTheBlankExercise, Word } from '@/types';
import { useToast } from '@/hooks/use-toast';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function FillInTheBlanksPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();

  const exercises = useMemo((): FillInTheBlankExercise[] => {
    return placeholderWords
      .filter(word => word.exampleSentenceJavanese && word.javanese)
      .map(word => {
        // Create a regex that matches the word, case-insensitive, as a whole word if possible,
        // but fall back to simple string match if it's part of a larger compound.
        // For simplicity, we'll use a case-insensitive replacement of the first occurrence.
        const blankedSentence = word.exampleSentenceJavanese!
            .replace(new RegExp(escapeRegExp(word.javanese), 'i'), '_______');
        
        // Check if the blanking actually happened. If not, this example might be problematic.
        // For now, we'll include it, but in a real app, you might filter these out or log them.
        if (blankedSentence === word.exampleSentenceJavanese) {
            console.warn(`Could not create blank for word "${word.javanese}" in sentence "${word.exampleSentenceJavanese}". The word might not be present as expected.`);
        }

        return {
          id: word.id,
          questionSentence: blankedSentence,
          hintSentence: word.exampleSentenceDutch || translations.noHintAvailable || "No hint available.",
          correctAnswer: word.javanese,
          originalJavaneseSentence: word.exampleSentenceJavanese!,
        };
      });
  }, [translations.noHintAvailable]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Reset state when exercises change (e.g., language switch re-memoizes)
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setIsAnswered(false);
  }, [exercises]);


  const currentExercise = exercises.length > 0 ? exercises[currentIndex] : null;

  const handleCheckAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) {
      toast({title: "Please enter an answer.", variant: "destructive"});
      return;
    }

    const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correctAnswer.toLowerCase();
    if (isCorrect) {
      setFeedback({ type: 'correct', message: translations.correct });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `${translations.incorrect} ${currentExercise.correctAnswer}`,
      });
    }
    setIsAnswered(true);
  };

  const handleNextExercise = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % exercises.length);
    setUserAnswer('');
    setFeedback(null);
    setIsAnswered(false);
  };

  if (exercises.length === 0) {
    return (
      <MainAppLayout>
        <PageHeader title={translations.fillInTheBlanks} />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{translations.noFillExercises}</p>
        </div>
      </MainAppLayout>
    );
  }
  
  if (!currentExercise) {
     // Should ideally not happen if exercises.length > 0, but good for safety
    return <MainAppLayout><PageHeader title={translations.fillInTheBlanks} /><p>Loading exercise...</p></MainAppLayout>;
  }


  return (
    <MainAppLayout>
      <PageHeader title={translations.fillInTheBlanks} description={translations.fillInTheBlankInstruction} />
      
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="font-normal text-2xl md:text-3xl text-primary text-center leading-relaxed">
              {currentExercise.questionSentence.split('_______').map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 && (
                    <span className="inline-block bg-muted-foreground/10 px-4 py-1 rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground/50 select-none">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  )}
                </span>
              ))}
            </CardTitle>
            {currentExercise.hintSentence && (
              <CardDescription className="text-center pt-3">
                <Lightbulb className="inline-block h-4 w-4 mr-1 text-accent" /> 
                ({translations.dutch}): <em className="text-muted-foreground">{currentExercise.hintSentence}</em>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={translations.typeYourAnswer}
              disabled={isAnswered}
              className="text-center text-lg h-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAnswered) handleCheckAnswer();
                if (e.key === 'Enter' && isAnswered) handleNextExercise();
              }}
            />
            {feedback && (
              <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className="animate-in fade-in">
                {feedback.type === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <AlertTitle>{feedback.type === 'correct' ? translations.correct : translations.yourAnswer}</AlertTitle>
                <AlertDescription>
                    {feedback.type === 'incorrect' ? 
                        `${translations.missingWordWas} "${currentExercise.correctAnswer}". ` 
                        : ''}
                     Original: <em>{currentExercise.originalJavaneseSentence}</em>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={handleCheckAnswer} 
              disabled={isAnswered || !userAnswer.trim()}
              className="w-full sm:w-auto"
            >
              {translations.checkAnswer}
            </Button>
            <Button 
              onClick={handleNextExercise} 
              disabled={!isAnswered}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {translations.nextExercise} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
       <p className="text-center mt-4 text-sm text-muted-foreground">
        {translations.question} {currentIndex + 1} / {exercises.length}
      </p>
    </MainAppLayout>
  );
}
