
"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser, placeholderBadges } from '@/lib/placeholder-data';
import type { User as UserType, Badge as BadgeType } from '@/types';
import { XpDisplay } from '@/components/progress/xp-display';
import { StreakDisplay } from '@/components/progress/streak-display';
import { BadgeItem } from '@/components/progress/badge-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProgressPage() {
  const { translations } = useLanguage();
  const user: UserType = placeholderUser;
  const allBadges: BadgeType[] = placeholderBadges;

  const unlockedBadgeIds = new Set(user.badges);
  const unlockedBadges = allBadges.filter(badge => unlockedBadgeIds.has(badge.id));
  const lockedBadges = allBadges.filter(badge => !unlockedBadgeIds.has(badge.id));

  // Calculate XP needed for next level (simple example, can be more complex)
  const currentLevel = Math.floor(user.xp / 1000) + 1; // e.g., 1000 XP per level
  const xpForNextLevel = currentLevel * 1000;
  const currentLevelXp = user.xp - (currentLevel - 1) * 1000;


  return (
    <MainAppLayout>
      <PageHeader
        title={translations.progress || "Your Progress"}
        description={translations.progressDescription || "Track your learning journey and achievements."}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <XpDisplay currentXp={user.xp} xpToNextLevel={xpForNextLevel} level={currentLevel} />
        <StreakDisplay currentStreak={user.streak} />
        <Card className="shadow-md lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-lg">{translations.lessonsCompleted || "Lessons Completed"}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-primary">{user.completedLessonIds?.length || 0}</p>
                <p className="text-xs text-muted-foreground">{translations.grammarLessonsMastered || "Grammar lessons mastered"}</p>
            </CardContent>
        </Card>
      </div>
      
      <Separator className="my-8" />

      <div className="mb-8">
        <h2 className="text-2xl font-headline font-semibold text-primary mb-4">{translations.yourBadges || "Your Badges"}</h2>
        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {unlockedBadges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} isUnlocked={true} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{translations.noBadgesEarned || "No badges earned yet. Keep learning!"}</p>
        )}
      </div>

      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">{translations.badgesToUnlock || "Badges to Unlock"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lockedBadges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} isUnlocked={false} />
            ))}
          </div>
        </div>
      )}
    </MainAppLayout>
  );
}
