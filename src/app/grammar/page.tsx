
"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { useLanguage } from '@/hooks/use-language';
import { placeholderGrammarLessons } from '@/lib/placeholder-data';
import type { GrammarLesson } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function GrammarPage() {
  const { translations, language } = useLanguage(); // Ensure language is available
  const lessons: GrammarLesson[] = placeholderGrammarLessons.filter(lesson => lesson.status === 'published');

  return (
    <MainAppLayout>
      <PageHeader title={translations.grammarLessons || "Grammar Lessons"} description="Learn the rules of the Javanese language." />
      
      {lessons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center mb-2">
                    <GraduationCap className="h-6 w-6 mr-2 text-primary" />
                    <CardTitle className="font-headline text-xl text-primary">{lesson.title[language] || lesson.title.en}</CardTitle>
                </div>
                <CardDescription>
                  <span className="capitalize">{lesson.level}</span> - {lesson.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {(lesson.explanation[language] || lesson.explanation.en || "").substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild> 
                  <Link href={`/grammar/${lesson.id}`}>
                    View Lesson <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No grammar lessons available yet. Please check back later!</p>
        </div>
      )}
    </MainAppLayout>
  );
}
