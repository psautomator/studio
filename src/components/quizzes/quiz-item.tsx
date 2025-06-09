
"use client";

import type { QuizQuestion, QuizOption } from '@/types'; // Updated import
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
  quizQuestion: QuizQuestion; // Renamed from quiz
  onAdvance: () => void; // Renamed from onNextQuiz
  isLastQuestion: boolean;
}

export function QuizItem({ quizQuestion, onAdvance, isLastQuestion }: QuizItemProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { translations } = useLanguage();
  const { toast } = useToast();

  const handleOptionSelect = (value: string) => {
    if (isAnswered) return;

    setSelectedOption(value);
    const chosenOption = quizQuestion.options.find(opt => opt.text === value);

    if (chosenOption) {
      if (chosenOption.isCorrect) {
        setFeedback({ type: 'correct', message: translations.correct });
      } else {
        const correctAnswerText = quizQuestion.options.find(opt => opt.isCorrect)?.text;
        const incorrectMessage = correctAnswerText 
          ? `${translations.incorrect} ${correctAnswerText}`
          : translations.incorrect; // Fallback if somehow no correct answer is found
        setFeedback({
          type: 'incorrect',
          message: incorrectMessage,
        });
      }
      setIsAnswered(true);
    }
  };

  const handleAdvanceClick = () => {
    setSelectedOption(null);
    setFeedback(null);
    setIsAnswered(false);
    onAdvance();
  };

  const playAudio = () => {
    if (quizQuestion.audioUrl) {
      toast({
        title: "Playing Audio",
        description: `Simulating playback for quiz question. URL: ${quizQuestion.audioUrl}`,
      });
      // Actual audio playback: new Audio(quizQuestion.audioUrl).play();
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-2xl text-primary flex-1">{quizQuestion.question}</CardTitle>
          {quizQuestion.audioUrl && (
            <Button variant="ghost" size="icon" type="button" onClick={playAudio} aria-label="Play question audio" className="ml-2">
              <Volume2 className="h-5 w-5 text-accent" />
            </Button>
          )}
        </div>
         {/* Difficulty is now part of the Quiz (set), not QuizQuestion. Displayed on overview page. */}
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption || undefined}
          onValueChange={handleOptionSelect}
          disabled={isAnswered}
          className="space-y-3"
          aria-label="Quiz options"
        >
          {quizQuestion.options.map((option, index) => (
            <div key={index} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${selectedOption === option.text && !isAnswered ? 'bg-accent/10 border-accent' : 'border-border'}`}>
              <RadioGroupItem value={option.text} id={`option-${quizQuestion.id}-${index}`} />
              <Label 
                htmlFor={`option-${quizQuestion.id}-${index}`} 
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
            {quizQuestion.explanation && feedback.type === 'incorrect' && (
                 <p className="text-sm mt-2">{quizQuestion.explanation}</p>
            )}
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {isAnswered && (
          <Button type="button" onClick={handleAdvanceClick} className="w-full bg-primary hover:bg-primary/90">
            {isLastQuestion ? translations.finishQuiz : translations.nextQuestion}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
