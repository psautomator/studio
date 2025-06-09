
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// MainAppLayout is not used for AdminLayout structure
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { Package, Users, FileText, LayoutDashboard, Home, ListChecks, Award } from 'lucide-react';
// APP_NAME is not used directly in AdminSidebar titles
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
  const { translations, language } = useLanguage(); // language is the current locale (en/nl)

  const getLabel = (item: { labelKey: string, defaultLabel: string }) => {
    return translations[item.labelKey.toLowerCase() as keyof typeof translations] || item.defaultLabel;
  };

  const visibleAdminNavItems = allAdminNavItems.filter(item =>
    userHasAnyRequiredRole(currentUser.roles, item.requiredRoles)
  );

  // Admin area specific "Back to App" link
  const appLink = { baseHref: '/dashboard', labelKey: 'backToApp', icon: Home, defaultLabel: 'Back to App' };
  const localizedAppLinkHref = `/${language}${appLink.baseHref}`;


  return (
     <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader className="p-4">
         <Link href="/admin" className="flex items-center">
          <span className="font-headline text-lg font-semibold text-sidebar-foreground">
            {translations.admin || "Admin"}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {visibleAdminNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))}
                tooltip={{ children: getLabel(item) }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{getLabel(item)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="mt-auto pt-2 border-t border-sidebar-border">
           <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === localizedAppLinkHref}
                tooltip={{ children: getLabel(appLink) }}
              >
                <Link href={localizedAppLinkHref}>
                  <appLink.icon />
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
}: {
  children: React.ReactNode;
}) {
  const canAccessAdmin = allAdminNavItems.some(item => userHasAnyRequiredRole(currentUser.roles, item.requiredRoles));

  if (!canAccessAdmin && typeof window !== 'undefined') {
    // Basic redirect - in a real app, this would be handled by middleware or auth provider
    // if (!pathname.startsWith('/admin')) { // Avoid redirect loop if already trying to leave admin
    //    window.location.href = '/dashboard'; // Potentially needs locale prefix
    // }
    // return <p>Access Denied or redirecting...</p>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar /> {/* Navbar now uses useLanguage to get locale */}
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
