
"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser, placeholderBadges } from '@/lib/placeholder-data';
import type { User as UserType, Badge as BadgeType } from '@/types';
import { XpDisplay } from '@/components/progress/xp-display';
import { StreakDisplay } from '@/components/progress/streak-display';
import { BadgeItem } from '@/components/progress/badge-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LogOut, Trash2, UserCog, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


export default function ProfilePage() {
  const { translations, language } = useLanguage();
  const { toast } = useToast();
  const user: UserType = placeholderUser;
  const allBadges: BadgeType[] = placeholderBadges;

  const unlockedBadgeIds = new Set(user.badges);
  const unlockedBadges = allBadges.filter(badge => unlockedBadgeIds.has(badge.id));

  const currentLevel = Math.floor(user.xp / 1000) + 1;
  const xpForNextLevel = currentLevel * 1000;

  const handleLogout = () => {
    toast({
      title: translations.logout || "Logout",
      description: translations.loggedOutSuccessfully || "You have been logged out (simulated).",
    });
    // In a real app, you would redirect to a login page or clear auth state.
    // For now, we can redirect to the main landing page.
    // setTimeout(() => {
    //   window.location.href = `/${language}/`; 
    // }, 1500);
  };

  const handleDeleteAccount = () => {
    if (confirm(translations.confirmDeleteAccount || "Are you sure you want to delete your account? This action is irreversible (simulated).")) {
      toast({
        title: translations.accountDeleted || "Account Deleted",
        description: translations.accountDeletedDesc || "Your account has been deleted (simulated).",
        variant: "destructive",
      });
      // In a real app, handle actual account deletion and redirect.
      // For example, redirect to a "goodbye" page or the root.
      // setTimeout(() => {
      //   window.location.href = `/${language}/`; 
      // }, 1500);
    }
  };

  return (
    <MainAppLayout>
      <PageHeader
        title={translations.profileSettings || "Profile Settings"}
        description={`${translations.manageYourProfile || "Manage your profile, preferences, and account."} - ${user.name}`}
      />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: User Info & Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <UserCog className="mx-auto h-16 w-16 text-primary mb-3" />
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <XpDisplay currentXp={user.xp} xpToNextLevel={xpForNextLevel} level={currentLevel} />
                <StreakDisplay currentStreak={user.streak} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preferences, Badges, Account */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings2 className="mr-2 h-5 w-5 text-primary" />
                {translations.learningPreferences || "Learning Preferences"}
              </CardTitle>
              <CardDescription>{translations.customizeExperience || "Customize your learning experience."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{translations.preferredLearningStyle || "Preferred Learning Style"}</h4>
                <p className="text-md">{user.learningPreferences?.preferredStyle || (translations.notSet || "Not set")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{translations.dailyStudyGoal || "Daily Study Goal (minutes)"}</h4>
                <p className="text-md">{user.learningPreferences?.dailyGoalMinutes || (translations.notSet || "Not set")}</p>
              </div>
               <Button variant="outline" size="sm" className="mt-2" disabled>
                {translations.editPreferences || "Edit Preferences"} ({translations.comingSoon || "Coming soon"})
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{translations.yourBadges || "Your Badges"}</CardTitle>
              <CardDescription>{translations.badgesYouveEarned || "A collection of your achievements."}</CardDescription>
            </CardHeader>
            <CardContent>
              {unlockedBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unlockedBadges.map(badge => (
                    <BadgeItem key={badge.id} badge={badge} isUnlocked={true} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{translations.noBadgesEarned || "No badges earned yet. Keep learning!"}</p>
              )}
               <Button variant="link" asChild className="mt-2 px-0">
                <Link href={`/${language}/progress`}>{translations.viewAllProgress || "View All Progress & Badges"}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <Trash2 className="mr-2 h-5 w-5" />
                {translations.accountManagement || "Account Management"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                {translations.logout || "Logout"}
              </Button>
              <Button onClick={handleDeleteAccount} variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                {translations.deleteAccount || "Delete Account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainAppLayout>
  );
}
