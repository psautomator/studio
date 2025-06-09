
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { use } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset, // Import SidebarInset
} from '@/components/ui/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Package, Users, FileText, LayoutDashboard, Home, ListChecks, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser } from '@/lib/placeholder-data';
import type { User as UserType } from '@/types';

const currentUser: UserType = placeholderUser;

const userHasAnyRequiredRole = (userRoles: string[], requiredRoles?: string[]): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return requiredRoles.some(role => userRoles.includes(role));
};

const allAdminNavItems = [
  { href: '/admin', labelKey: 'adminDashboard', icon: LayoutDashboard, defaultLabel: 'Admin Dashboard', requiredRoles: ['admin', 'editor', 'publisher'] },
  { href: '/admin/words', labelKey: 'wordsManagement', icon: FileText, defaultLabel: 'Words Management', requiredRoles: ['admin', 'editor'] },
  { href: '/admin/quizzes', labelKey: 'quizzesManagement', icon: Package, defaultLabel: 'Quizzes Management', requiredRoles: ['admin', 'editor'] },
  { href: '/admin/grammar', labelKey: 'grammarManagement', icon: ListChecks, defaultLabel: 'Grammar Management', requiredRoles: ['admin', 'editor', 'publisher'] },
  { href: '/admin/badges', labelKey: 'badgesManagement', icon: Award, defaultLabel: 'Badges Management', requiredRoles: ['admin'] },
  { href: '/admin/users', labelKey: 'usersManagement', icon: Users, defaultLabel: 'Users Management', requiredRoles: ['admin'] },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { translations, language } = useLanguage();

  const getLabel = (item: { labelKey: string, defaultLabel: string }) => {
    return translations[item.labelKey.toLowerCase() as keyof typeof translations] || item.defaultLabel;
  };

  const visibleAdminNavItems = allAdminNavItems.filter(item =>
    userHasAnyRequiredRole(currentUser.roles, item.requiredRoles)
  );

  const appLink = { baseHref: '/dashboard', labelKey: 'backToApp', icon: Home, defaultLabel: 'Back to App' };
  
  return (
     <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader className="p-4">
         <Link href={`/${language}/admin`} className="flex items-center">
          <span className="font-headline text-lg font-semibold text-sidebar-foreground">
            {translations.admin || "Admin"}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {visibleAdminNavItems.map((item) => {
            const localizedItemHref = `/${language}${item.href}`;
            const IconComponent = item.icon;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === localizedItemHref || (item.href !== "/admin" && pathname.startsWith(localizedItemHref))}
                  tooltip={{ children: getLabel(item) }}
                >
                  <Link href={localizedItemHref}>
                    <IconComponent />
                    <span>{getLabel(item)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <SidebarMenu className="mt-auto pt-2 border-t border-sidebar-border">
           <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === `/${language}${appLink.baseHref}`}
                tooltip={{ children: getLabel(appLink) }}
              >
                <Link href={`/${language}${appLink.baseHref}`}>
                  {React.createElement(appLink.icon)}
                  <span>{getLabel(appLink)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const locale = params.locale;

  // This logic is for illustrative purposes; actual auth would be more robust
  // For now, we assume if they can reach this layout, they have some admin role.
  const canAccessAdmin = allAdminNavItems.some(item => userHasAnyRequiredRole(currentUser.roles, item.requiredRoles));

  // if (!canAccessAdmin && typeof window !== 'undefined') {
  //   window.location.href = `/${locale}/dashboard`;
  //   return <p>Access Denied or redirecting...</p>;
  // }

  return (
      <div className="flex min-h-screen w-full"> {/* Ensure w-full for full width */}
        <AdminSidebar />
        <div className="flex flex-1 flex-col w-0"> {/* w-0 is important for flex-1 content to not overflow */}
          <Navbar />
          {/* Use SidebarInset for consistent main content area styling */}
          <SidebarInset as="main" className="bg-muted/10"> {/* Added bg-muted/10 as an example */}
            {children}
          </SidebarInset>
        </div>
      </div>
  );
}
