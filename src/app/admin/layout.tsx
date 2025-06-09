
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MainAppLayout } from '@/components/layout/main-app-layout'; 
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
import { APP_NAME } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser } from '@/lib/placeholder-data'; // For current user roles
import type { User as UserType } from '@/types'; // Import UserType

// Assume placeholderUser is our current user for now
const currentUser: UserType = placeholderUser; 

// Helper function to check roles
const userHasAnyRequiredRole = (userRoles: string[], requiredRoles?: string[]): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No specific roles required, accessible to all who can see admin panel
  }
  if (!userRoles || userRoles.length === 0) {
    return false; // User has no roles, cannot access role-protected item
  }
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

const appLink = { href: '/dashboard', labelKey: 'backToApp', icon: Home, defaultLabel: 'Back to App' };

function AdminSidebar() {
  const pathname = usePathname();
  const { translations } = useLanguage();

  const getLabel = (item: { labelKey: string, defaultLabel: string }) => {
    return translations[item.labelKey] || item.defaultLabel;
  };

  const visibleAdminNavItems = allAdminNavItems.filter(item => 
    userHasAnyRequiredRole(currentUser.roles, item.requiredRoles)
  );

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
                isActive={pathname === appLink.href}
                tooltip={{ children: getLabel(appLink) }}
              >
                <Link href={appLink.href}>
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
  // This check ideally would be more robust, e.g., redirecting if user doesn't have any admin-level roles
  // For now, if no admin links are visible, it implies limited access, but actual page protection is needed.
  const canAccessAdmin = allAdminNavItems.some(item => userHasAnyRequiredRole(currentUser.roles, item.requiredRoles));

  if (!canAccessAdmin && typeof window !== 'undefined') {
    // Basic redirect if no admin rights at all based on current roles
    // In a real app with auth, this would be handled by a proper auth provider / middleware
    // window.location.href = '/dashboard'; 
    // return <p>Access Denied. Redirecting...</p>; // Or a proper "Access Denied" component
  }


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
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
