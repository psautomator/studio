
"use client";

import { useState } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { QuizItem } from '@/components/quizzes/quiz-item';
import { placeholderQuizzes } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import { Progress } from '@/components/ui/progress';
import type { Quiz as QuizSetType } from '@/types'; // Renamed import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function QuizzesPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  
  const allQuizSets: QuizSetType[] = placeholderQuizzes;

  const [activeQuizSet, setActiveQuizSet] = useState<QuizSetType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleStartQuiz = (quizSet: QuizSetType) => {
    setActiveQuizSet(quizSet);
    setCurrentQuestionIndex(0);
  };

  const handleFinishQuiz = () => {
    toast({
      title: translations.quizCompleted,
      description: `You finished the "${activeQuizSet?.title}" quiz.`,
    });
    setActiveQuizSet(null);
    setCurrentQuestionIndex(0);
  };

  const handleAdvanceQuestion = () => {
    if (activeQuizSet) {
      if (currentQuestionIndex < activeQuizSet.questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        // This was the last question
        handleFinishQuiz();
      }
    }
  };
  
  // Quiz Overview UI
  if (!activeQuizSet) {
    return (
      <MainAppLayout>
        <PageHeader title={translations.quizzes} description={translations.selectQuizPrompt} />
        {allQuizSets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allQuizSets.map((quizSet) => (
              <Card key={quizSet.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">{quizSet.title}</CardTitle>
                  {quizSet.description && <CardDescription>{quizSet.description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow">
                  {quizSet.difficulty && (
                    <p className="text-sm text-muted-foreground capitalize">
                      Difficulty: {quizSet.difficulty}
                    </p>
                  )}
                   <p className="text-sm text-muted-foreground">
                      Questions: {quizSet.questions.length}
                    </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleStartQuiz(quizSet)} className="w-full bg-primary hover:bg-primary/90">
                    {translations.startQuiz}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>No quizzes available at the moment. Please check back later!</p>
        )}
      </MainAppLayout>
    );
  }

  // Active Quiz Playing UI
  const currentQuestion = activeQuizSet.questions[currentQuestionIndex];
  const progressPercentage = activeQuizSet.questions.length > 0 
    ? ((currentQuestionIndex + 1) / activeQuizSet.questions.length) * 100 
    : 0;
  const isLastQuestion = currentQuestionIndex === activeQuizSet.questions.length - 1;

  return (
    <MainAppLayout>
      <PageHeader title={activeQuizSet.title} description="Test your Javanese knowledge." />
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl mb-4">
          <Progress value={progressPercentage} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {`${translations.question} ${currentQuestionIndex + 1} / ${activeQuizSet.questions.length}`}
          </p>
        </div>
        <QuizItem 
          quizQuestion={currentQuestion} 
          onAdvance={handleAdvanceQuestion}
          isLastQuestion={isLastQuestion} 
        />
      </div>
    </MainAppLayout>
  );
}
