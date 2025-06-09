
"use client";

import { useParams } from 'next/navigation';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { placeholderGrammarLessons } from '@/lib/placeholder-data';
import type { GrammarLesson, GrammarExample } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function GrammarLessonPage() {
  const params = useParams();
  const { lessonId } = params;
  const { translations } = useLanguage();
  const { toast } = useToast();

  const lesson = placeholderGrammarLessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (lesson) {
      // Basic check to prevent duplicate toasts if component re-renders for other reasons
      const viewedKey = `viewed_lesson_${lesson.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        toast({
          title: "+5 XP",
          description: `Viewed lesson: ${lesson.title}`,
        });
        sessionStorage.setItem(viewedKey, 'true');
      }
    }
  }, [lesson, toast]);


  const handlePlayAudio = (example: GrammarExample) => {
    if (example.audioUrl) {
      toast({
        title: `Playing audio for: ${example.javanese}`,
        description: `Simulating playback. URL: ${example.audioUrl}`,
      });
      // new Audio(example.audioUrl).play().catch(err => console.error("Audio playback error:", err));
    } else {
      toast({
        title: "Audio Not Available",
        description: `No audio for "${example.javanese}".`,
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

  return (
    <MainAppLayout>
      <PageHeader title={lesson.title} description={`${lesson.level} - ${lesson.category}`}>
        <Button asChild variant="outline">
          <Link href="/grammar"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons</Link>
        </Button>
      </PageHeader>

      <Card className="shadow-lg">
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
            <ReactMarkdown>{lesson.explanation}</ReactMarkdown>
          </article>
        </CardContent>
      </Card>

      {lesson.examples && lesson.examples.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lesson.examples.map((example, index) => (
              <div key={index} className="p-4 border rounded-md bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-lg text-primary">{example.javanese}</p>
                  {example.audioUrl && (
                    <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(example)} aria-label={`Play audio for ${example.javanese}`}>
                      <Volume2 className="h-5 w-5 text-accent" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground italic">({translations.dutch || "Dutch"}): {example.dutch}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </MainAppLayout>
  );
}
