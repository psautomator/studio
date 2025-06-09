
"use client";

import { useState } from 'react';
import type { EmbeddedErrorSpottingExercise } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EmbeddedErrorSpottingItemProps {
  exerciseData: EmbeddedErrorSpottingExercise;
  onFirstAttempt: (exerciseId: string, wasCorrectOnFirstTry: boolean) => void;
}

export function EmbeddedErrorSpottingItem({ exerciseData, onFirstAttempt }: EmbeddedErrorSpottingItemProps) {
  const { translations, language } = useLanguage();
  const { toast } = useToast();

  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);

  const exercise = exerciseData;
  const incorrectSentenceDisplay = exercise.incorrectSentence[language] || exercise.incorrectSentence.en;
  const correctSentenceDisplay = exercise.correctSentence[language] || exercise.correctSentence.en;
  const hintText = exercise.hint?.[language] || exercise.hint?.en;

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) {
      toast({ title: translations.typeYourAnswer || "Please type your corrected sentence.", variant: "destructive" });
      return;
    }

    // Normalize answers for comparison: trim whitespace and convert to lowercase
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctSentenceDisplay.trim().toLowerCase();

    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    if (isCorrect) {
      setFeedback({ type: 'correct', message: translations.correct });
      toast({ title: "+3 XP!", description: "Error spotted and corrected!" }); // XP for error spotting
    } else {
      setFeedback({
        type: 'incorrect',
        message: `${translations.incorrectCorrection || "That's not quite right. The correct sentence is:"} "${correctSentenceDisplay}"`,
      });
    }

    if (isFirstAttempt) {
      onFirstAttempt(exercise.id, isCorrect);
      setIsFirstAttempt(false);
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
          <p>Could not load this error spotting exercise.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-normal text-md md:text-lg text-primary/90 leading-relaxed">
          {translations.spotTheErrorInstruction || "The following sentence has an error. Correct it:"}
        </CardTitle>
        <CardDescription className="text-lg md:text-xl text-foreground pt-1 italic">
          "{incorrectSentenceDisplay}"
        </CardDescription>
        {hintText && (
          <p className="text-xs text-muted-foreground pt-2">
            <Lightbulb className="inline-block h-3 w-3 mr-1 text-accent" />
            ({translations.hintForError || 'Hint'}): <em className="text-muted-foreground">{hintText}</em>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={translations.typeCorrectedSentence || "Type the corrected sentence here..."}
          disabled={isAnswered}
          className="text-md min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isAnswered) {
              e.preventDefault();
              handleCheckAnswer();
            }
          }}
        />
        {feedback && (
          <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className="animate-in fade-in text-sm">
            {feedback.type === 'correct' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle className="text-sm">{feedback.type === 'correct' ? translations.correct : translations.yourAnswer}</AlertTitle>
            <AlertDescription className="text-xs">
              {feedback.type === 'incorrect' && (
                <>
                  {translations.submittedAnswer || "You submitted:"} "<em>{userAnswer}</em>".<br />
                  {translations.correctSentenceIs || "The correct sentence is:"} "<em>{correctSentenceDisplay}</em>".
                </>
              )}
              {feedback.type === 'correct' && (
                <>
                  {translations.wellDoneCorrectSentence || "Well done! The correct sentence is indeed:"} "<em>{correctSentenceDisplay}</em>".
                </>
              )}
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
            {translations.checkCorrection || "Check Correction"}
          </Button>
        ) : (
          <Button
            onClick={handleTryAgain}
            variant="outline"
            size="sm"
          >
            {translations.tryAgain || "Try Again"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
