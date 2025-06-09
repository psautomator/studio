"use client";

import type { Quiz, QuizOption } from '@/types';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface QuizItemProps {
  quiz: Quiz;
  onNextQuiz: () => void;
}

export function QuizItem({ quiz, onNextQuiz }: QuizItemProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { translations } = useLanguage();

  const handleSubmit = () => {
    if (!selectedOption) return;

    const chosenOption = quiz.options.find(opt => opt.text === selectedOption);
    if (chosenOption) {
      if (chosenOption.isCorrect) {
        setFeedback({ type: 'correct', message: translations.correct });
      } else {
        const correctAnswer = quiz.options.find(opt => opt.isCorrect)?.text;
        setFeedback({
          type: 'incorrect',
          message: `${translations.incorrect} ${correctAnswer || ''}`,
        });
      }
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setIsAnswered(false);
    onNextQuiz();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{quiz.question}</CardTitle>
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
        >
          {quiz.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option.text} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1">
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
        {!isAnswered ? (
          <Button onClick={handleSubmit} disabled={!selectedOption} className="w-full bg-primary hover:bg-primary/90">
            {translations.checkAnswer}
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {translations.next}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
