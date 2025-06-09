"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { PronunciationItem } from '@/components/pronunciation/pronunciation-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';

export default function PronunciationPage() {
  const { translations } = useLanguage();
  const wordsWithAudio = placeholderWords.map(word => ({
    ...word,
    // Simulate some words having audio URLs for demonstration
    audioUrl: Math.random() > 0.5 ? `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word.javanese)}&tl=jv&client=tw-ob` : undefined 
  }));


  return (
    <MainAppLayout>
      <PageHeader title={translations.pronunciation} description="Listen and perfect your Javanese accent." />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Word List</CardTitle>
        </CardHeader>
        <CardContent>
          {wordsWithAudio.length > 0 ? (
            <div className="divide-y">
              {wordsWithAudio.map((word) => (
                <PronunciationItem key={word.id} word={word} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pronunciation items available.</p>
          )}
        </CardContent>
      </Card>
    </MainAppLayout>
  );
}
