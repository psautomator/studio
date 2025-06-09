
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ALL_LEVELS_VALUE = 'all';
type ExerciseLevel = Word['level'] | typeof ALL_LEVELS_VALUE;

export default function FillInTheBlanksPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();

  const [selectedLevel, setSelectedLevel] = useState<ExerciseLevel>(ALL_LEVELS_VALUE);

  const exercises = useMemo((): FillInTheBlankExercise[] => {
    return placeholderWords
      .filter(word => {
        const levelMatch = selectedLevel === ALL_LEVELS_VALUE || word.level === selectedLevel;
        return levelMatch && word.exampleSentenceJavanese && word.javanese;
      })
      .map(word => {
        const blankedSentence = word.exampleSentenceJavanese!
            .replace(new RegExp(escapeRegExp(word.javanese), 'i'), '_______');
        
        if (blankedSentence === word.exampleSentenceJavanese) {
            console.warn(`Could not create blank for word "${word.javanese}" in sentence "${word.exampleSentenceJavanese}".`);
        }

        return {
          id: word.id,
          questionSentence: blankedSentence,
          hintSentence: word.exampleSentenceDutch || translations.noHintAvailable || "No hint available.",
          correctAnswer: word.javanese,
          originalJavaneseSentence: word.exampleSentenceJavanese!,
        };
      });
  }, [translations.noHintAvailable, translations, selectedLevel]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setIsAnswered(false);
  }, [exercises, selectedLevel]);


  const currentExercise = exercises.length > 0 ? exercises[currentIndex] : null;

  const handleCheckAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) {
      toast({title: translations.typeYourAnswer || "Please enter an answer.", variant: "destructive"});
      return;
    }

    const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correctAnswer.toLowerCase();
    if (isCorrect) {
      setFeedback({ type: 'correct', message: translations.correct });
      toast({ title: "+10 XP!", description: "Correct! You earned 10 XP." });
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

  const availableLevels: ExerciseLevel[] = [ALL_LEVELS_VALUE, 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <MainAppLayout>
      <PageHeader title={translations.fillInTheBlanks} description={translations.fillInTheBlankInstruction} />
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6 max-w-xs">
            <Label htmlFor="level-filter" className="text-sm font-medium">{translations.filterByLevel || "Filter by Level:"}</Label>
            <Select
              value={selectedLevel}
              onValueChange={(value) => setSelectedLevel(value as ExerciseLevel)}
            >
              <SelectTrigger id="level-filter" className="mt-1">
                <SelectValue placeholder={translations.selectLevel || "Select level"} />
              </SelectTrigger>
              <SelectContent>
                {availableLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level === ALL_LEVELS_VALUE ? (translations.allLevels || "All Levels") : (translations[level.toLowerCase() as keyof typeof translations] || level) }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {exercises.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center py-4">
                  {translations.noFillExercisesForLevel || "No fill-in-the-blank exercises available for the selected level. Try a different filter."}
                </p>
              </CardContent>
            </Card>
          ) : currentExercise ? (
            <>
              <Card key={currentExercise.id} className="shadow-xl">
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
              <p className="text-center mt-4 text-sm text-muted-foreground">
                {translations.question} {currentIndex + 1} / {exercises.length}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">Loading exercise...</p>
          )}
        </div>
      </div>
    </MainAppLayout>
  );
}

    