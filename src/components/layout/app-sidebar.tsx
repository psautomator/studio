
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
  UserCircle,
  Shield,
  User,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser } from '@/lib/placeholder-data'; // For admin role simulation
import type { User as UserType } from '@/types';


const mainNavItems = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/flashcards', labelKey: 'flashcards', icon: BookOpen },
  { href: '/quizzes', labelKey: 'quizzes', icon: HelpCircle },
  { href: '/pronunciation', labelKey: 'pronunciation', icon: Volume2 },
  { href: '/progress', labelKey: 'progress', icon: BarChart3 },
  { href: '/goals', labelKey: 'goals', icon: Target },
];

// User for simulation, in a real app this would come from context or API
const currentUser: UserType = placeholderUser;

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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="w-full"
                  tooltip={{ children: getLabel('profile', 'Profile') }}
                >
                  <UserCircle />
                  <span>{getLabel('profile', 'Profile')}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 mb-2 ml-1">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>{getLabel('profile', 'Profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/progress" className="flex items-center w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>{getLabel('progress', 'Progress')}</span>
                  </Link>
                </DropdownMenuItem>
                {currentUser.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>{getLabel('admin', 'Admin Panel')}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
