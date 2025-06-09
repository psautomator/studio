"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  HelpCircle,
  Volume2,
  BarChart3,
  Target,
  LayoutDashboard,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

const mainNavItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/flashcards', labelKey: 'flashcards', icon: BookOpen },
  { href: '/quizzes', labelKey: 'quizzes', icon: HelpCircle },
  { href: '/pronunciation', labelKey: 'pronunciation', icon: Volume2 },
  { href: '/progress', labelKey: 'progress', icon: BarChart3 },
  { href: '/goals', labelKey: 'goals', icon: Target },
];

const secondaryNavItems = [
  { href: '/settings', labelKey: 'Settings', icon: Settings }, // Assuming 'Settings' will be in translations
  { href: '/support', labelKey: 'Support', icon: LifeBuoy }, // Assuming 'Support' will be in translations
];


export function AppSidebar() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const { open } = useSidebar();

  const getLabel = (labelKey: string, defaultLabel?: string) => {
    return translations[labelKey.toLowerCase()] || defaultLabel || labelKey;
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader className="p-4">
        {open && (
           <Link href="/dashboard" className="flex items-center">
            <span className="font-headline text-lg font-semibold text-sidebar-foreground">
              {APP_NAME}
            </span>
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                tooltip={{ children: getLabel(item.labelKey, item.labelKey) }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{getLabel(item.labelKey, item.labelKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {/* Example of secondary nav items or user profile quick access */}
        <SidebarMenu>
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.labelKey }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.labelKey}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
