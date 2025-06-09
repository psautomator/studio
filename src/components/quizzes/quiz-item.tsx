
"use client";

import type { Quiz, QuizOption } from '@/types';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

interface QuizItemProps {
  quiz: Quiz;
  onNextQuiz: () => void;
}

export function QuizItem({ quiz, onNextQuiz }: QuizItemProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { translations } = useLanguage();
  const { toast } = useToast();

  const processSubmit = () => {
    if (!selectedOption) return;

    const chosenOption = quiz.options.find(opt => opt.text === selectedOption);
    if (chosenOption) {
      if (chosenOption.isCorrect) {
        setFeedback({ type: 'correct', message: translations.correct });
      } else {
        const correctAnswerText = quiz.options.find(opt => opt.isCorrect)?.text;
        setFeedback({
          type: 'incorrect',
          message: `${translations.incorrect} ${correctAnswerText || ''}`,
        });
      }
      setIsAnswered(true);
    }
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAnswered) {
      processSubmit();
    } else {
      handleNext();
    }
  };


  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setIsAnswered(false);
    onNextQuiz();
  };

  const playAudio = () => {
    if (quiz.audioUrl) {
      toast({
        title: "Playing Audio",
        description: `Simulating playback for quiz question. URL: ${quiz.audioUrl}`,
      });
      // Actual audio playback: new Audio(quiz.audioUrl).play();
    } else {
      toast({ title: "Audio Not Available" });
    }
  };

  const getOptionLabelClass = (optionText: string, isOptionCorrect: boolean) => {
    if (!isAnswered) {
      return "text-base cursor-pointer flex-1";
    }
    if (optionText === selectedOption) { // User's selection
      return isOptionCorrect
        ? "text-base cursor-pointer flex-1 text-green-700 font-bold" // Selected and Correct
        : "text-base cursor-pointer flex-1 text-red-700 font-bold";   // Selected and Incorrect
    }
    // Not selected by user, but IS the correct answer
    if (isOptionCorrect) {
      return "text-base cursor-pointer flex-1 text-green-600"; 
    }
    // Other options that were not selected and are not correct
    return "text-base cursor-pointer flex-1 text-muted-foreground opacity-75";
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <form onSubmit={handleFormSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-2xl text-primary flex-1">{quiz.question}</CardTitle>
            {quiz.audioUrl && (
              <Button variant="ghost" size="icon" type="button" onClick={playAudio} aria-label="Play question audio" className="ml-2">
                <Volume2 className="h-5 w-5 text-accent" />
              </Button>
            )}
          </div>
          {quiz.difficulty && (
            <CardDescription>Difficulty: <span className="capitalize">{quiz.difficulty}</span></CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption || undefined}
            onValueChange={setSelectedOption}
            disabled={isAnswered}
            className="space-y-3"
            aria-label="Quiz options"
          >
            {quiz.options.map((option, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${selectedOption === option.text && !isAnswered ? 'bg-accent/10 border-accent' : 'border-border'}`}>
                <RadioGroupItem value={option.text} id={`option-${quiz.id}-${index}`} />
                <Label 
                  htmlFor={`option-${quiz.id}-${index}`} 
                  className={getOptionLabelClass(option.text, option.isCorrect)}
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {feedback && (
            <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className="mt-6 animate-in fade-in">
              {feedback.type === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <AlertTitle>{feedback.type === 'correct' ? translations.correct : translations.yourAnswer}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
              {quiz.explanation && feedback.type === 'incorrect' && (
                   <p className="text-sm mt-2">{quiz.explanation}</p>
              )}
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!selectedOption && !isAnswered} className="w-full bg-primary hover:bg-primary/90">
            {isAnswered ? translations.next : translations.checkAnswer}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

