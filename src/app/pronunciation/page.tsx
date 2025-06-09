
"use client";

import { useState, useEffect } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { PronunciationItem } from '@/components/pronunciation/pronunciation-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import type { Word } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function PronunciationPage() {
  const { translations } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<Word['level'] | 'all'>('all');
  const [filteredWords, setFilteredWords] = useState<Word[]>(placeholderWords);

  useEffect(() => {
    if (selectedLevel === 'all') {
      setFilteredWords(placeholderWords);
    } else {
      setFilteredWords(placeholderWords.filter(word => word.level === selectedLevel));
    }
  }, [selectedLevel]);

  const levels: (Word['level'] | 'all')[] = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <MainAppLayout>
      <PageHeader title={translations.pronunciation} description="Listen and perfect your Javanese accent." />
      
      <div className="mb-6 max-w-xs">
        <Label htmlFor="level-filter" className="text-sm font-medium">Filter by Level:</Label>
        <Select
          value={selectedLevel}
          onValueChange={(value) => setSelectedLevel(value as Word['level'] | 'all')}
        >
          <SelectTrigger id="level-filter" className="mt-1">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map(level => (
              <SelectItem key={level || 'all'} value={level || 'all'}>
                {level === 'all' ? 'All Levels' : level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Word List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWords.length > 0 ? (
            <div className="divide-y">
              {filteredWords.map((word) => (
                <PronunciationItem key={word.id} word={word} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No words found for the selected level.
            </p>
          )}
        </CardContent>
      </Card>
    </MainAppLayout>
  );
}
