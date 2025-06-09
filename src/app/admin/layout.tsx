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
import { Package, Users, FileText, LayoutDashboard } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';

const adminNavItems = [
  { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/admin/words', label: 'Words Management', icon: FileText },
  { href: '/admin/quizzes', label: 'Quizzes Management', icon: Package },
  { href: '/admin/users', label: 'Users Management', icon: Users },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { translations } = useLanguage();

  return (
     <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader className="p-4">
         <Link href="/admin" className="flex items-center">
          <span className="font-headline text-lg font-semibold text-sidebar-foreground">
            {translations.admin}
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
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
  // For admin, we might want a slightly different Navbar or overall structure.
  // For now, re-using MainAppLayout components but with AdminSidebar.
  return (
    // Wrap with SidebarProvider if not already done by AppProviders at root
    // However, if AppProviders already has SidebarProvider, this might cause issues
    // Let's assume AppProviders handles it, and this layout just adds its specific sidebar
    // If AppProviders is NOT used for /admin routes, then this SidebarProvider is needed.
    // For now, we assume admin routes are separate and need their own provider.
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar /> {/* Or an AdminNavbar */}
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
