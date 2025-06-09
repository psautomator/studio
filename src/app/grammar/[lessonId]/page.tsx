
"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { placeholderGrammarLessons, placeholderQuizzes, placeholderWords } from '@/lib/placeholder-data';
import type { GrammarLesson, Quiz, Word } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft, HelpCircle, FileSignature, BookHeadphones, List } from 'lucide-react';
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

  useEffect(() => {
    const foundLesson = placeholderGrammarLessons.find(l => l.id === lessonId);
    setLesson(foundLesson);

    if (foundLesson) {
      const viewedKey = `viewed_lesson_${foundLesson.id}`;
      if (typeof window !== 'undefined' && !sessionStorage.getItem(viewedKey)) {
        toast({
          title: "+5 XP",
          description: `Viewed lesson: ${foundLesson.title[language] || foundLesson.title.en}`,
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
  }, [lessonId, toast, language]);

  const handlePlayAudio = (url: string, itemName: string) => {
    if (url) {
      toast({
        title: `Playing audio for: ${itemName}`,
        description: `Simulating playback. URL: ${url}`,
      });
      // new Audio(url).play().catch(err => console.error("Audio playback error:", err));
    } else {
      toast({
        title: "Audio Not Available",
        description: `No audio for "${itemName}".`,
        variant: "destructive"
      });
    }
  };

  if (!lesson) {
    return (
      <MainAppLayout>
        <PageHeader title="Lesson Not Found" />
        <p>The grammar lesson you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/grammar"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Grammar Lessons</Link>
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
          <Link href="/grammar"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons</Link>
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
              Listen to Lesson Overview
            </Button>
          </div>
      )}

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Explanation</CardTitle>
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
            <CardTitle className="font-headline text-2xl text-primary">Examples</CardTitle>
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
                <p className="text-xs text-muted-foreground capitalize mt-1">Level: {example.speechLevel}</p>
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
              Practice Exercises
            </CardTitle>
            <CardDescription>Apply what you've learned with these interactive exercises.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lesson.embeddedExercises.map((exercise) => {
              if (exercise.type === 'fill-in-the-blank') {
                return (
                    <EmbeddedFillInTheBlankItem
                        key={exercise.id}
                        exerciseData={exercise}
                    />
                );
              }
              return null;
            })}
          </CardContent>
        </Card>
      )}

      {linkedWords.length > 0 && (
        <Card className="mt-6 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <List className="mr-2 h-5 w-5" />
              Related Vocabulary
            </CardTitle>
            <CardDescription>Key words related to this lesson.</CardDescription>
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
              <Link href="/flashcards">
                Practice these words in Flashcards <ArrowLeft className="ml-1 h-3 w-3 -rotate-180"/>
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
              Related Quizzes
            </CardTitle>
            <CardDescription>Test your understanding of concepts from this lesson.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedQuizzes.map(quiz => (
                 <div key={quiz.id}>
                    <p className="mb-1">
                    This lesson relates to the quiz: <strong className="text-primary">{quiz.title}</strong>.
                    </p>
                    <Button asChild>
                    <Link href={`/quizzes?quizId=${quiz.id}`}>
                        {translations.startQuiz || "Start Quiz"}: {quiz.title}
                    </Link>
                    </Button>
                </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              (This will take you to the main Quizzes page where you can select this quiz.)
            </p>
          </CardContent>
        </Card>
      )}
    </MainAppLayout>
  );
}
