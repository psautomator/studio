"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { XpDisplay } from '@/components/progress/xp-display';
import { StreakDisplay } from '@/components/progress/streak-display';
import { BadgeItem } from '@/components/progress/badge-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderUser, placeholderBadges } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';

export default function ProgressPage() {
  const { translations } = useLanguage();
  const user = placeholderUser; // In a real app, this would come from user context/API
  const allBadges = placeholderBadges;

  return (
    <MainAppLayout>
      <PageHeader title={translations.progress} description="Track your learning achievements." />
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <XpDisplay currentXp={user.xp} xpToNextLevel={2000} level={Math.floor(user.xp / 1000) + 1} />
        <StreakDisplay currentStreak={user.streak} />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{translations.badges}</CardTitle>
        </CardHeader>
        <CardContent>
          {allBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} isUnlocked={user.badges.includes(badge.id)} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No badges available to earn yet.</p>
          )}
        </CardContent>
      </Card>
    </MainAppLayout>
  );
}
