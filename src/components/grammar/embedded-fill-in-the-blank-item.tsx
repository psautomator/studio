
"use client";

import { useState } from 'react';
import type { Word, FillInTheBlankExercise } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EmbeddedFillInTheBlankItemProps {
  word: Word;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function EmbeddedFillInTheBlankItem({ word }: EmbeddedFillInTheBlankItemProps) {
  const { translations } = useLanguage();
  const { toast } = useToast();

  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Derive exercise from word prop
  const exercise: FillInTheBlankExercise | null = (() => {
    if (!word.exampleSentenceJavanese || !word.javanese) return null;
    
    const blankedSentence = word.exampleSentenceJavanese
        .replace(new RegExp(escapeRegExp(word.javanese), 'i'), '_______');
    
    if (blankedSentence === word.exampleSentenceJavanese) {
        console.warn(`Could not create blank for word "${word.javanese}" in sentence "${word.exampleSentenceJavanese}" for embedded item.`);
        return null; 
    }
    return {
      id: word.id,
      questionSentence: blankedSentence,
      hintSentence: word.exampleSentenceDutch || translations.noHintAvailable || "No hint available.",
      correctAnswer: word.javanese,
      originalJavaneseSentence: word.exampleSentenceJavanese!,
    };
  })();

  const handleCheckAnswer = () => {
    if (!exercise || !userAnswer.trim()) {
      toast({title: "Please enter an answer.", variant: "destructive"});
      return;
    }

    const isCorrect = userAnswer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    if (isCorrect) {
      setFeedback({ type: 'correct', message: translations.correct });
      toast({ title: "+10 XP!", description: "Correct! You earned 10 XP." });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `${translations.incorrect} ${exercise.correctAnswer}`,
      });
    }
    setIsAnswered(true);
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setFeedback(null);
    setIsAnswered(false);
  };

  if (!exercise) {
    return (
      <Card className="border-dashed border-muted-foreground/50 bg-muted/20">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p>Could not load this fill-in-the-blank exercise for "{word.javanese}". The example sentence might be missing or misconfigured.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-normal text-xl md:text-2xl text-primary/90 leading-relaxed">
          {exercise.questionSentence.split('_______').map((part, index, arr) => (
            <span key={index}>
              {part}
              {index < arr.length - 1 && (
                <span className="inline-block bg-muted-foreground/10 px-3 py-0.5 rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground/50 select-none">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              )}
            </span>
          ))}
        </CardTitle>
        {exercise.hintSentence && (
          <CardDescription className="text-center pt-2 text-xs">
            <Lightbulb className="inline-block h-3 w-3 mr-1 text-accent" /> 
            ({translations.dutch}): <em className="text-muted-foreground">{exercise.hintSentence}</em>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={translations.typeYourAnswer}
          disabled={isAnswered}
          className="text-center text-md h-10"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isAnswered) handleCheckAnswer();
          }}
        />
        {feedback && (
          <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className="animate-in fade-in text-sm">
            {feedback.type === 'correct' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle className="text-sm">{feedback.type === 'correct' ? translations.correct : translations.yourAnswer}</AlertTitle>
            <AlertDescription className="text-xs">
                {feedback.type === 'incorrect' ? 
                    `${translations.missingWordWas} "${exercise.correctAnswer}". ` 
                    : ''}
                 Original: <em>{exercise.originalJavaneseSentence}</em>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-3 pt-0 pb-4">
        {!isAnswered ? (
            <Button 
            onClick={handleCheckAnswer} 
            disabled={!userAnswer.trim()}
            size="sm"
            >
            {translations.checkAnswer}
            </Button>
        ) : (
            <Button 
            onClick={handleTryAgain} 
            variant="outline"
            size="sm"
            >
            Try Again
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
