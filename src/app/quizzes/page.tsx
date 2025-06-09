
"use client";

import { useState } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { QuizItem } from '@/components/quizzes/quiz-item';
import { placeholderQuizzes } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import { Progress } from '@/components/ui/progress'; // Import Progress component

export default function QuizzesPage() {
  const { translations } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const quizzes = placeholderQuizzes; // In a real app, fetch or manage this list

  const handleNextQuiz = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quizzes.length);
  };
  
  if (quizzes.length === 0) {
    return (
      <MainAppLayout>
        <PageHeader title={translations.quizzes} />
        <p>No quizzes available.</p>
      </MainAppLayout>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const progressPercentage = quizzes.length > 0 ? ((currentIndex + 1) / quizzes.length) * 100 : 0;

  return (
    <MainAppLayout>
      <PageHeader title={translations.quizzes} description="Test your Javanese knowledge." />
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl mb-4">
          <Progress value={progressPercentage} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Question {currentIndex + 1} of {quizzes.length}
          </p>
        </div>
        <QuizItem quiz={currentQuiz} onNextQuiz={handleNextQuiz} />
      </div>
    </MainAppLayout>
  );
}

