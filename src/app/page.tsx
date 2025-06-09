"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, HelpCircle, Target, Volume2 } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';

export default function HomePage() {
  const { translations } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      titleKey: "featureFlashcards",
      descriptionKey: "featureFlashcardsDesc",
      color: "text-primary"
    },
    {
      icon: HelpCircle,
      titleKey: "featureQuizzes",
      descriptionKey: "featureQuizzesDesc",
      color: "text-accent-foreground" // A different color for variety, ensure it's defined well
    },
    {
      icon: Volume2,
      titleKey: "featurePronunciation",
      descriptionKey: "featurePronunciationDesc",
      color: "text-primary"
    },
    {
      icon: Target,
      titleKey: "featureAdaptiveGoals",
      descriptionKey: "featureAdaptiveGoalsDesc",
      color: "text-accent-foreground"
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
             {/* You can add a logo SVG here */}
            <span className="font-headline text-xl font-bold text-primary">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">{translations.login}</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">{translations.getStarted}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-br from-background to-secondary/30">
          <div className="container text-center">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              {translations.welcome}
            </h1>
            <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
              {translations.tagline}
            </p>
            <Button size="lg" className="mt-8 md:mt-10" asChild>
              <Link href="/dashboard">{translations.startLearning}</Link>
            </Button>
            <div className="mt-12 md:mt-16 relative aspect-[16/7] max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
               <Image 
                src="https://placehold.co/1200x525.png" 
                alt="Javanese Scenery" 
                fill={true}
                style={{ objectFit: 'cover' }}
                data-ai-hint="Indonesia landscape"
                priority
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 lg:py-28">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12 md:mb-16">
              {translations.appName} Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Icon className={`w-10 h-10 ${feature.color}`} />
                      </div>
                      <CardTitle className="font-headline text-xl text-primary">{translations[feature.titleKey]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{translations[feature.descriptionKey]}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-secondary/50">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
