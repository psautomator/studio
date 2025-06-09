
"use client";

// AdminLayout is applied by Next.js for this route via src/app/[locale]/admin/layout.tsx
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, Users, BarChartHorizontalBig } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { translations, language } = useLanguage();

  const summaryCards = [
    { title: translations.wordsManagement, count: 120, icon: FileText, href: `/${language}/admin/words`, description: "Manage vocabulary" },
    { title: translations.quizzesManagement, count: 35, icon: Package, href: `/${language}/admin/quizzes`, description: "Create and edit quizzes" },
    { title: translations.usersManagement, count: 250, icon: Users, href: `/${language}/admin/users`, description: "View user data" },
    { title: "Content Analytics", count: "N/A", icon: BarChartHorizontalBig, href: `/${language}/admin/analytics`, description: "View learning statistics (placeholder)" },
  ];

  return (
    <>
      <PageHeader title={translations.admin} description="Manage application content and users." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map(card => (
          <Link href={card.href} key={card.title} className="block hover:shadow-lg transition-shadow duration-200">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{card.count}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
      {/* Further admin dashboard content can go here, e.g., recent activity, quick actions */}
    </>
  );
}
