
"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, Users, BarChartHorizontalBig, ListChecks, Award, FileEdit, ClipboardEdit } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { placeholderUser, placeholderWords, placeholderQuizzes, placeholderGrammarLessons, placeholderBadges, placeholderAdminUsers } from '@/lib/placeholder-data';
import type { User as UserType } from '@/types';

const currentUser: UserType = placeholderUser;

const userHasAnyRequiredRole = (userRoles: string[], requiredRoles?: string[]): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return requiredRoles.some(role => userRoles.includes(role));
};

export default function AdminDashboardPage() {
  const { translations, language } = useLanguage();

  const draftQuizzesCount = placeholderQuizzes.filter(q => q.status === 'draft').length;
  const draftGrammarLessonsCount = placeholderGrammarLessons.filter(l => l.status === 'draft').length;

  const allSummaryCards = [
    { 
      id: 'words', 
      titleKey: 'wordsManagement', 
      defaultTitle: 'Words Management', 
      count: placeholderWords.length, 
      icon: FileText, 
      hrefSuffix: '/admin/words', 
      descriptionKey: 'manageVocabulary', 
      defaultDescription: "Manage vocabulary & translations.",
      requiredRoles: ['admin', 'editor'] 
    },
    { 
      id: 'quizzes', 
      titleKey: 'quizzesManagement', 
      defaultTitle: 'Quizzes Management', 
      count: placeholderQuizzes.length, 
      icon: Package, 
      hrefSuffix: '/admin/quizzes', 
      descriptionKey: 'createEditQuizzes', 
      defaultDescription: "Create & edit quizzes.",
      requiredRoles: ['admin', 'editor'] 
    },
    { 
      id: 'grammar', 
      titleKey: 'grammarManagement', 
      defaultTitle: 'Grammar Management', 
      count: placeholderGrammarLessons.length, 
      icon: ListChecks, 
      hrefSuffix: '/admin/grammar', 
      descriptionKey: 'manageGrammarLessons', 
      defaultDescription: "Manage grammar lessons.",
      requiredRoles: ['admin', 'editor', 'publisher'] 
    },
    { 
      id: 'badges', 
      titleKey: 'badgesManagement', 
      defaultTitle: 'Badges Management', 
      count: placeholderBadges.length, 
      icon: Award, 
      hrefSuffix: '/admin/badges', 
      descriptionKey: 'manageBadges', 
      defaultDescription: "Create & manage badges.",
      requiredRoles: ['admin'] 
    },
    { 
      id: 'users', 
      titleKey: 'usersManagement', 
      defaultTitle: 'Users Management', 
      count: placeholderAdminUsers.length, 
      icon: Users, 
      hrefSuffix: '/admin/users', 
      descriptionKey: 'viewManageUsers', 
      defaultDescription: "View user data & manage roles.",
      requiredRoles: ['admin'] 
    },
    { 
      id: 'draftQuizzes', 
      titleKey: 'draftQuizzesCount', 
      defaultTitle: 'Draft Quizzes', 
      count: draftQuizzesCount, 
      icon: ClipboardEdit, 
      hrefSuffix: '/admin/quizzes', // Consider adding filter params in future e.g. ?status=draft
      descriptionKey: 'reviewDraftQuizzes', 
      defaultDescription: "Quizzes needing review.",
      requiredRoles: ['admin', 'editor', 'publisher'] 
    },
    { 
      id: 'draftGrammar', 
      titleKey: 'draftGrammarLessonsCount', 
      defaultTitle: 'Draft Grammar Lessons', 
      count: draftGrammarLessonsCount, 
      icon: FileEdit, 
      hrefSuffix: '/admin/grammar', // Consider adding filter params in future
      descriptionKey: 'reviewDraftGrammar', 
      defaultDescription: "Lessons needing review.",
      requiredRoles: ['admin', 'editor', 'publisher'] 
    },
    // { 
    //   id: 'analytics', 
    //   titleKey: 'contentAnalytics', 
    //   defaultTitle: 'Content Analytics', 
    //   count: "N/A", 
    //   icon: BarChartHorizontalBig, 
    //   hrefSuffix: '/admin/analytics', 
    //   descriptionKey: 'viewLearningStats', 
    //   defaultDescription: "View learning statistics.",
    //   requiredRoles: ['admin', 'publisher'] 
    // },
  ];

  const visibleSummaryCards = allSummaryCards.filter(card => 
    userHasAnyRequiredRole(currentUser.roles, card.requiredRoles)
  );

  return (
    <>
      <PageHeader 
        title={translations.adminDashboard || "Admin Dashboard"} 
        description={translations.adminDashboardDesc || "Oversee and manage application content and users."} 
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {visibleSummaryCards.map(card => (
          <Link href={`/${language}${card.hrefSuffix}`} key={card.id} className="block hover:shadow-lg transition-shadow duration-200">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {translations[card.titleKey.toLowerCase() as keyof typeof translations] || card.defaultTitle}
                  </CardTitle>
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{card.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {translations[card.descriptionKey.toLowerCase() as keyof typeof translations] || card.defaultDescription}
                  </p>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
      {/* Further admin dashboard content can go here, e.g., recent activity, quick actions */}
    </>
  );
}

    