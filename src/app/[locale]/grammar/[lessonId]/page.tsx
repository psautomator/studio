
"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { placeholderGrammarLessons, placeholderQuizzes, placeholderWords } from '@/lib/placeholder-data';
import type { GrammarLesson, Quiz, Word } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft, HelpCircle, FileSignature, BookHeadphones, List, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { EmbeddedFillInTheBlankItem } from '@/components/grammar/embedded-fill-in-the-blank-item';

export default function GrammarLessonPage() {
  const params = useParams();
  const { lessonId } = params;
  const { translations, language } = useLanguage();
  const { toast } = useToast();

  const [lesson, setLesson] = useState<GrammarLesson | undefined>(undefined);
  const [relatedQuizzes, setRelatedQuizzes] = useState<Quiz[]>([]);
  const [linkedWords, setLinkedWords] = useState<Word[]>([]);
  const [firstAttemptResults, setFirstAttemptResults] = useState<{ [exerciseId: string]: boolean }>({});

  useEffect(() => {
    const foundLesson = placeholderGrammarLessons.find(l => l.id === lessonId);
    setLesson(foundLesson);
    setFirstAttemptResults({});

    if (foundLesson) {
      const viewedKey = `viewed_lesson_${foundLesson.id}`;
      if (typeof window !== 'undefined' && !sessionStorage.getItem(viewedKey)) {
        toast({
          title: "+5 XP",
          description: `${translations.viewedLesson || "Viewed lesson"}: ${foundLesson.title[language] || foundLesson.title.en}`,
        });
        sessionStorage.setItem(viewedKey, 'true');
      }

      if (foundLesson.relatedQuizIds && foundLesson.relatedQuizIds.length > 0) {
        const quizzes = placeholderQuizzes.filter(q => foundLesson.relatedQuizIds.includes(q.id) && q.status === 'published');
        setRelatedQuizzes(quizzes);
      } else {
        setRelatedQuizzes([]);
      }

      if (foundLesson.relatedWordIds && foundLesson.relatedWordIds.length > 0) {
        const words = placeholderWords.filter(w => foundLesson.relatedWordIds.includes(w.id));
        setLinkedWords(words);
      } else {
        setLinkedWords([]);
      }

    }
  }, [lessonId, toast, language, translations.viewedLesson, translations]); // Added translations to dep array

  const handlePlayAudio = (url: string, itemName: string) => {
    if (url) {
      toast({
        title: `${translations.playingAudio || "Playing audio for"}: ${itemName}`,
        description: `${translations.simulatingPlayback || "Simulating playback"}. URL: ${url}`,
      });
    } else {
      toast({
        title: translations.audioNotAvailable || "Audio Not Available",
        description: `${translations.noAudioFor || "No audio for"} "${itemName}".`,
        variant: "destructive"
      });
    }
  };

  const handleFirstExerciseAttempt = (exerciseId: string, wasCorrectOnFirstTry: boolean) => {
    setFirstAttemptResults(prev => ({ ...prev, [exerciseId]: wasCorrectOnFirstTry }));
  };

  const handleMasteryCheck = () => {
    if (!lesson || !lesson.embeddedExercises || lesson.embeddedExercises.length === 0) return;

    const allAttempted = lesson.embeddedExercises.every(ex => ex.id in firstAttemptResults);
    if (!allAttempted) {
      toast({
        title: translations.completeAllExercises || "Incomplete",
        description: translations.attemptAllEmbeddedExercises || "Please attempt all embedded exercises before checking mastery.",
        variant: "destructive"
      });
      return;
    }

    const allCorrectOnFirstTry = lesson.embeddedExercises.every(ex => firstAttemptResults[ex.id] === true);

    if (allCorrectOnFirstTry) {
      toast({
        title: translations.lessonMastered || "Lesson Mastered!",
        description: `${translations.congratsPerfectEmbedded || "Congratulations! You completed all embedded exercises perfectly on the first try."} (+20 XP - simulated)`,
      });
      console.log(`Lesson ${lesson.id} mastered and would be added to completed list.`);
    } else {
      toast({
        title: translations.masteryNotAchieved || "Mastery Not Achieved",
        description: translations.reviewAndRetryLesson || "Not all exercises were correct on the first try. Review the material and try the lesson again (e.g., by re-navigating) for a fresh attempt at mastery.",
        variant: "default",
        duration: 7000,
      });
    }
  };

  const allExercisesAttempted = lesson && lesson.embeddedExercises && lesson.embeddedExercises.length > 0 &&
                               lesson.embeddedExercises.every(ex => ex.id in firstAttemptResults);

  const backToLessonsLink = `/${language}/grammar`;
  const flashcardsLink = `/${language}/flashcards`;


  if (!lesson) {
    return (
      <MainAppLayout>
        <PageHeader title={translations.lessonNotFound || "Lesson Not Found"} />
        <p>{translations.lessonNotFoundDesc || "The grammar lesson you are looking for does not exist or could not be loaded."}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={backToLessonsLink}><ArrowLeft className="mr-2 h-4 w-4" /> {translations.backToLessons || "Back to Grammar Lessons"}</Link>
        </Button>
      </MainAppLayout>
    );
  }

  const lessonTitle = lesson.title[language] || lesson.title.en;
  const lessonExplanation = lesson.explanation[language] || lesson.explanation.en;

  return (
    <MainAppLayout>
      <PageHeader title={lessonTitle} description={`${lesson.level} - ${lesson.category}`}>
        <Button asChild variant="outline">
          <Link href={backToLessonsLink}><ArrowLeft className="mr-2 h-4 w-4" /> {translations.backToLessons || "Back to Lessons"}</Link>
        </Button>
      </PageHeader>

      {lesson.imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg aspect-video relative max-w-3xl mx-auto">
          <Image src={lesson.imageUrl} alt={`Image for ${lessonTitle}`} fill style={{objectFit: 'cover'}} data-ai-hint="lesson illustration" />
        </div>
      )}

      {lesson.lessonAudioUrl && (
         <div className="mb-6 flex justify-center">
            <Button variant="outline" onClick={() => handlePlayAudio(lesson.lessonAudioUrl!, 'lesson audio')}>
              <BookHeadphones className="mr-2 h-5 w-5 text-accent" />
              {translations.listenToLesson || "Listen to Lesson Overview"}
            </Button>
          </div>
      )}

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{translations.explanation || "Explanation"}</CardTitle>
        </CardHeader>
        <CardContent>
          <article className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground dark:prose-invert
            prose-headings:text-primary prose-strong:text-foreground/90 prose-a:text-accent hover:prose-a:text-accent/80
            prose-code:bg-muted prose-code:text-muted-foreground prose-code:p-1 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm
            prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
            prose-li:my-1
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
            <ReactMarkdown>{lessonExplanation}</ReactMarkdown>
          </article>
        </CardContent>
      </Card>

      {lesson.examples && lesson.examples.length > 0 && (
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{translations.lessonExamples || "Examples"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lesson.examples.map((example) => (
              <div key={example.id} className="p-4 border rounded-md bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-lg text-primary">{example.javanese}</p>
                  {example.audioUrl && (
                    <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(example.audioUrl!, example.javanese)} aria-label={`Play audio for ${example.javanese}`}>
                      <Volume2 className="h-5 w-5 text-accent" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground italic">({translations.dutch || "Dutch"}): {example.dutch}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">{translations.exampleSpeechLevel || "Level"}: {example.speechLevel}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {lesson.embeddedExercises && lesson.embeddedExercises.length > 0 && (
        <Card className="mt-6 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <FileSignature className="mr-2 h-5 w-5" />
              {translations.practiceExercises || "Practice Exercises"}
            </CardTitle>
            <CardDescription>{translations.applyWhatLearned || "Apply what you've learned with these interactive exercises."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lesson.embeddedExercises.map((exercise) => {
              if (exercise.type === 'fill-in-the-blank') {
                return (
                    <EmbeddedFillInTheBlankItem
                        key={exercise.id}
                        exerciseData={exercise}
                        onFirstAttempt={handleFirstExerciseAttempt}
                    />
                );
              }
              return null;
            })}
          </CardContent>
          <CardFooter className="flex-col items-center gap-2 pt-4">
            <Button
              onClick={handleMasteryCheck}
              disabled={!allExercisesAttempted}
              className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {translations.checkMasteryAndComplete || "Check Mastery & Complete Lesson"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {translations.masteryNote || "Mastery requires all embedded exercises to be correct on the first attempt."}
            </p>
          </CardFooter>
        </Card>
      )}

      {linkedWords.length > 0 && (
        <Card className="mt-6 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <List className="mr-2 h-5 w-5" />
              {translations.relatedVocabulary || "Related Vocabulary"}
            </CardTitle>
            <CardDescription>{translations.keyWordsRelated || "Key words related to this lesson."}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {linkedWords.map(word => (
                <li key={word.id} className="text-sm">
                  <strong className="text-primary">{word.javanese}</strong> ({word.formality}): {word.dutch}
                </li>
              ))}
            </ul>
             <Button asChild variant="link" className="mt-2 px-0">
              <Link href={flashcardsLink}>
                {translations.practiceInFlashcards || "Practice these words in Flashcards"} <ArrowLeft className="ml-1 h-3 w-3 -rotate-180"/>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {relatedQuizzes.length > 0 && (
        <Card className="mt-6 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              {translations.relatedQuizzes || "Related Quizzes"}
            </CardTitle>
            <CardDescription>{translations.testYourUnderstanding || "Test your understanding of concepts from this lesson."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedQuizzes.map(quiz => (
                 <div key={quiz.id}>
                    <p className="mb-1">
                    {translations.lessonRelatesToQuiz || "This lesson relates to the quiz:"} <strong className="text-primary">{quiz.title}</strong>.
                    </p>
                    <Button asChild>
                    <Link href={`/${language}/quizzes?quizId=${quiz.id}`}>
                        {translations.startQuiz || "Start Quiz"}: {quiz.title}
                    </Link>
                    </Button>
                </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              {translations.quizPageNote || "(This will take you to the main Quizzes page where you can select this quiz.)"}
            </p>
          </CardContent>
        </Card>
      )}
    </MainAppLayout>
  );
}
