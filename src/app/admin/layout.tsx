
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MainAppLayout } from '@/components/layout/main-app-layout'; // Can re-use or make a specific admin layout
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
import { Navbar } from '@/components/layout/navbar'; // Could have an AdminNavbar
import { Package, Users, FileText, LayoutDashboard, Home, ListChecks, Award } from 'lucide-react'; // Added Home, ListChecks, Award icon
import { APP_NAME } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';

const adminNavItems = [
  { href: '/admin', labelKey: 'adminDashboard', icon: LayoutDashboard, defaultLabel: 'Admin Dashboard' },
  { href: '/admin/words', labelKey: 'wordsManagement', icon: FileText, defaultLabel: 'Words Management' },
  { href: '/admin/quizzes', labelKey: 'quizzesManagement', icon: Package, defaultLabel: 'Quizzes Management' },
  { href: '/admin/grammar', labelKey: 'grammarManagement', icon: ListChecks, defaultLabel: 'Grammar Management' },
  { href: '/admin/badges', labelKey: 'badgesManagement', icon: Award, defaultLabel: 'Badges Management' }, // New Badge Link
  { href: '/admin/users', labelKey: 'usersManagement', icon: Users, defaultLabel: 'Users Management' },
];

const appLink = { href: '/dashboard', labelKey: 'backToApp', icon: Home, defaultLabel: 'Back to App' };

function AdminSidebar() {
  const pathname = usePathname();
  const { translations } = useLanguage();

  const getLabel = (item: (typeof adminNavItems)[number] | typeof appLink) => {
    return translations[item.labelKey] || item.defaultLabel;
  };

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
          {adminNavItems.map((item) => (
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
