
"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight, BookOpen, HelpCircle, Target, Mic, FileSignature, GraduationCap, Award, Star, FastForward, Compass, ClipboardList
} from 'lucide-react';
import { placeholderUser, placeholderBadges, placeholderGrammarLessons, placeholderQuizzes } from '@/lib/placeholder-data';
import type { Badge as BadgeType } from '@/types';

export default function DashboardPage() {
  const { translations, language } = useLanguage();
  const user = placeholderUser;
  const earnedBadges = placeholderBadges.filter(b => user.badges.includes(b.id)).slice(0, 3);

  const dailyGoals: string[] = user.activeLearningGoals?.map(g => g.text).slice(0,3) || [];

  const firstGrammarLesson = placeholderGrammarLessons.find(lesson => lesson.status === 'published');
  const firstQuiz = placeholderQuizzes.find(q => q.status === 'published');

  const continueLearningItems = [
    {
      id: 'gl1',
      titleKey: 'resumeGrammar',
      itemTitle: firstGrammarLesson?.title[language] || firstGrammarLesson?.title.en || "Intro to Speech Levels",
      href: `/${language}/grammar/${firstGrammarLesson?.id || 'gl1'}`,
      icon: GraduationCap
    },
    {
      id: 'qz1',
      titleKey: 'tryNewQuiz',
      itemTitle: firstQuiz?.title || "Javanese Greetings",
      href: `/${language}/quizzes?quizId=${firstQuiz?.id || 'quizSet1'}`,
      icon: HelpCircle
    },
    {
      id: 'pr1',
      titleKey: 'practicePronunciation',
      itemTitle: "Common Phrases",
      href: `/${language}/pronunciation`,
      icon: Mic
    },
  ];

  const discoverMoreItems = [
    { labelKey: 'flashcards', baseHref: '/flashcards', icon: BookOpen, description: "Master vocabulary with interactive cards." },
    { labelKey: 'fillintheblanks', baseHref: '/fill-in-the-blanks', icon: FileSignature, description: "Test your sentence completion skills." },
    { labelKey: 'grammarLessonsOverview', baseHref: '/grammar', icon: GraduationCap, description: "Explore Javanese grammar rules." },
  ];

  return (
    <MainAppLayout>
      <PageHeader
        title={translations.dashboard}
        description={`${translations.welcomeBack || "Welcome back,"} ${user.name}!  XP: ${user.xp} | ${translations.learningStreak || "Streak"}: ${user.streak} ${translations.days || "days"}`}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <ClipboardList className="mr-3 h-6 w-6" />
              {translations.todaysFocus || "Today's Focus"}
            </CardTitle>
            <CardDescription>
              {dailyGoals.length > 0 ? (translations.yourPersonalizedTasks || "Your personalized tasks for today.") : (translations.noGoalsYet || "No goals generated yet. Let's create some!")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyGoals.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-sm">
                {dailyGoals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">{translations.noGoalsYet || "No goals generated yet. Let's create some!"}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="default" size="lg" asChild className="w-full bg-primary hover:bg-primary/90 text-lg">
              <Link href={`/${language}/goals`}>
                <Target className="mr-2 h-5 w-5" />
                {dailyGoals.length > 0 ? (translations.viewYourGoals || "View Your Goals") : (translations.generateYourGoals || "Generate Your Goals")}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <Award className="mr-2 h-5 w-5" />
              {translations.yourAchievements || "Your Achievements"}
            </CardTitle>
            <CardDescription>A glimpse of your accomplishments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {earnedBadges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-1 text-xs bg-accent/20 text-accent-foreground p-2 rounded-md shadow-sm">
                     <Star className="h-4 w-4 text-accent" />
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{translations.noBadgesEarned || "No badges earned yet. Keep learning!"}</p>
            )}
             <Button variant="secondary" size="sm" asChild className="mt-3 w-full">
              <Link href={`/${language}/progress`}>{translations.viewAllProgress || "View All Progress & Badges"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <FastForward className="mr-2 h-5 w-5" />
            {translations.continueLearning || "Continue Learning"}
          </CardTitle>
          <CardDescription>Pick up where you left off or try something new.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {continueLearningItems.map(item => (
            <Button variant="outline" className="w-full justify-start h-auto py-3 text-left border-border hover:border-primary/50 hover:bg-primary/5" asChild key={item.id}>
              <Link href={item.href}> {/* href is already locale-prefixed */}
                <item.icon className="mr-3 h-5 w-5 text-primary/80" />
                <div>
                  <span className="font-medium text-primary">{translations[item.titleKey.toLowerCase() as keyof typeof translations] || item.titleKey}</span>
                  <p className="text-sm text-muted-foreground">{item.itemTitle}</p>
                </div>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Compass className="mr-2 h-5 w-5" />
            {translations.discoverMore || "Discover More"}
          </CardTitle>
          <CardDescription>Explore all the learning tools available.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discoverMoreItems.map(item => (
            <Link href={`/${language}${item.baseHref}`} key={item.baseHref} className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow hover:bg-muted/30">
                <div className="flex items-center mb-2">
                    <item.icon className="mr-3 h-6 w-6 text-accent" />
                    <h3 className="text-md font-semibold text-foreground">{translations[item.labelKey.toLowerCase() as keyof typeof translations] || item.labelKey}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </MainAppLayout>
  );
}
