
"use client";

import type { QuizQuestion, QuizOption, QuestionType } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

interface QuizItemProps {
  quizQuestion: QuizQuestion;
  onAdvance: () => void;
  isLastQuestion: boolean;
}

export function QuizItem({ quizQuestion, onAdvance, isLastQuestion }: QuizItemProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // For MCQs
  const [textInputAnswer, setTextInputAnswer] = useState<string>(''); // For text input
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { translations } = useLanguage();
  const { toast } = useToast();

  // Reset local state when quizQuestion changes
  useEffect(() => {
    setSelectedOption(null);
    setTextInputAnswer('');
    setFeedback(null);
    setIsAnswered(false);
  }, [quizQuestion]);


  const handleSubmitAnswer = () => {
    if (isAnswered) return;

    let isCorrect = false;
    let correctAnswerText: string | undefined = '';

    if (quizQuestion.questionType === 'fill-in-the-blank-text-input') {
      if (!textInputAnswer.trim()) {
        toast({ title: translations.typeYourAnswer || "Please enter an answer.", variant: "destructive" });
        return;
      }
      correctAnswerText = quizQuestion.options[0]?.text; // Assuming correct answer is the first option's text
      isCorrect = textInputAnswer.trim().toLowerCase() === correctAnswerText?.toLowerCase();
    } else { // MCQ types
      if (!selectedOption) {
         toast({ title: "Please select an option.", variant: "destructive" }); // TODO: Add translation
        return;
      }
      const chosenOption = quizQuestion.options.find(opt => opt.text === selectedOption);
      isCorrect = chosenOption?.isCorrect || false;
      correctAnswerText = quizQuestion.options.find(opt => opt.isCorrect)?.text;
    }

    if (isCorrect) {
      setFeedback({ type: 'correct', message: translations.correct });
      toast({ title: "+10 XP!", description: "Correct answer!" });
    } else {
      const incorrectMessage = correctAnswerText
        ? `${translations.incorrect} ${correctAnswerText}`
        : translations.incorrect;
      setFeedback({
        type: 'incorrect',
        message: incorrectMessage,
      });
    }
    setIsAnswered(true);
  };

  const handleAdvanceClick = () => {
    onAdvance(); // This will trigger useEffect in parent to change question, then this useEffect will reset local state
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
    if (optionText === selectedOption) { // User's selection for MCQ
      return isOptionCorrect
        ? "text-base cursor-pointer flex-1 text-green-700 font-bold"
        : "text-base cursor-pointer flex-1 text-red-700 font-bold";
    }
    if (isOptionCorrect) {
      return "text-base cursor-pointer flex-1 text-green-600";
    }
    return "text-base cursor-pointer flex-1 text-muted-foreground opacity-75";
  };

  const renderQuestionContent = () => {
    const { questionType, questionText } = quizQuestion;
    let typeLabel = "";

    switch (questionType) {
      case 'translation-word-to-dutch':
        typeLabel = translations.translateWordDutch || "Translate to Dutch:";
        break;
      case 'translation-sentence-to-dutch':
        typeLabel = translations.translateSentenceDutch || "Translate sentence to Dutch:";
        break;
      case 'translation-word-to-javanese':
        typeLabel = translations.translateWordJavanese || "Translate to Javanese:";
        break;
      case 'translation-sentence-to-javanese':
        typeLabel = translations.translateSentenceJavanese || "Translate sentence to Javanese:";
        break;
      case 'fill-in-the-blank-mcq':
      case 'fill-in-the-blank-text-input':
        typeLabel = translations.fillInTheBlankMCQ || "Complete the sentence:"; // Re-use for text input too
        break;
      default:
        break;
    }

    return (
      <>
        {typeLabel && <p className="text-sm text-muted-foreground mb-2">{typeLabel}</p>}
        <CardTitle className="font-headline text-2xl text-primary flex-1">{questionText}</CardTitle>
      </>
    );
  };

  const isMcqType = ![
    'fill-in-the-blank-text-input'
  ].includes(quizQuestion.questionType);


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {renderQuestionContent()}
          </div>
          {quizQuestion.audioUrl && (
            <Button variant="ghost" size="icon" type="button" onClick={playAudio} aria-label="Play question audio" className="ml-2 flex-shrink-0">
              <Volume2 className="h-5 w-5 text-accent" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isMcqType ? (
          <RadioGroup
            value={selectedOption || undefined}
            onValueChange={(value) => setSelectedOption(value)}
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
        ) : ( // For 'fill-in-the-blank-text-input'
          <Input
            type="text"
            value={textInputAnswer}
            onChange={(e) => setTextInputAnswer(e.target.value)}
            placeholder={translations.typeYourAnswer}
            disabled={isAnswered}
            className="text-lg h-12"
            onKeyDown={(e) => { if (e.key === 'Enter' && !isAnswered) handleSubmitAnswer(); }}
          />
        )}

        {feedback && (
          <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className="mt-6 animate-in fade-in">
            {feedback.type === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <AlertTitle>{feedback.type === 'correct' ? translations.correct : translations.yourAnswer}</AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
            {quizQuestion.explanation && (isAnswered || feedback.type === 'incorrect') && (
                 <p className="text-sm mt-2">{quizQuestion.explanation}</p>
            )}
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        {!isAnswered && (
            <Button type="button" onClick={handleSubmitAnswer} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {translations.checkAnswer}
            </Button>
        )}
        {isAnswered && (
          <Button type="button" onClick={handleAdvanceClick} className="w-full bg-primary hover:bg-primary/90">
            {isLastQuestion ? translations.finishQuiz : translations.nextQuestion}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
