"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, HelpCircle, Target } from 'lucide-react';
import { placeholderUser, placeholderBadges } from '@/lib/placeholder-data'; // Assuming goals would be fetched or from AI

export default function DashboardPage() {
  const { translations } = useLanguage();
  // In a real app, these would come from context/API
  const user = placeholderUser; 
  const badges = placeholderBadges.filter(b => user.badges.includes(b.id));

  // Placeholder daily goals - in a real app, this would be from the AI
  const dailyGoals = [
    "Learn 5 new vocabulary words related to family.",
    "Practice forming simple sentences using 'kula' and 'sampeyan'.",
    "Listen to Javanese audio for 10 minutes.",
  ];

  return (
    <MainAppLayout>
      <PageHeader title={translations.dashboard} description={`Welcome back, ${user.name}!`} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">{translations.progress}</CardTitle>
            <CardDescription>Your current learning status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong className="text-primary">{translations.userXP}:</strong> {user.xp}</p>
            <p><strong className="text-primary">{translations.learningStreak}:</strong> {user.streak} days</p>
            <div>
              <strong className="text-primary">{translations.badges}:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {badges.map(badge => (
                  <span key={badge.id} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{badge.name}</span>
                ))}
                 {badges.length === 0 && <span className="text-xs text-muted-foreground">No badges yet.</span>}
              </div>
            </div>
            <Button variant="secondary" size="sm" asChild className="mt-2">
              <Link href="/progress">View Full Progress <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">{translations.dailyGoals}</CardTitle>
            <CardDescription>Your personalized tasks for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyGoals.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-sm">
                {dailyGoals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{translations.noGoalsGenerated}</p>
            )}
            <Button variant="default" size="sm" asChild className="mt-4 bg-primary hover:bg-primary/90">
              <Link href="/goals">{translations.generateGoals} <Target className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Quick Start</CardTitle>
            <CardDescription>Jump back into learning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" className="w-full justify-start border border-transparent hover:border-primary/50" asChild>
              <Link href="/flashcards"><BookOpen className="mr-2 h-4 w-4" /> {translations.flashcards}</Link>
            </Button>
            <Button variant="secondary" className="w-full justify-start border border-transparent hover:border-primary/50" asChild>
              <Link href="/quizzes"><HelpCircle className="mr-2 h-4 w-4" /> {translations.quizzes}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainAppLayout>
  );
}
