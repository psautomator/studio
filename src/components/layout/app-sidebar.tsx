
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
  GraduationCap,
  LogOut, 
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
import { SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser } from '@/lib/placeholder-data';
import type { User as UserType } from '@/types';
import { useToast } from '@/hooks/use-toast'; 


const mainNavItems = [
  { baseHref: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { baseHref: '/flashcards', labelKey: 'flashcards', icon: BookOpen },
  { baseHref: '/quizzes', labelKey: 'quizzes', icon: HelpCircle },
  { baseHref: '/pronunciation', labelKey: 'pronunciation', icon: Volume2 },
  { baseHref: '/grammar', labelKey: 'grammar', icon: GraduationCap },
  { baseHref: '/progress', labelKey: 'progress', icon: BarChart3 },
  { baseHref: '/goals', labelKey: 'goals', icon: Target },
];

const currentUser: UserType = placeholderUser;
const adminAccessRoles = ['admin', 'editor', 'publisher'];

export function AppSidebar() {
  const pathname = usePathname();
  const { translations, language } = useLanguage(); 
  const { toast } = useToast(); 
  const { open, isMobile, setOpenMobile } = useSidebar();

  const getLabel = (labelKey: string, defaultLabel?: string) => {
    return translations[labelKey.toLowerCase() as keyof typeof translations] || defaultLabel || labelKey;
  };

  const handleMobileLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = () => {
    handleMobileLinkClick();
    toast({
      title: translations.logout || "Logout",
      description: translations.loggedOutSuccessfully || "You have been logged out (simulated).",
    });
    // In a real app, you'd clear session/token and redirect.
    // For now, we can redirect to the main landing page after a short delay.
    // setTimeout(() => {
    //   window.location.href = `/${language}/`; 
    // }, 1500);
  };

  const canAccessAdminPanel = currentUser.roles.some(role => adminAccessRoles.includes(role));
  const localizedProfileBaseHref = `/${language}/profile`;
  const localizedProgressBaseHref = `/${language}/progress`;
  const localizedAdminHref = `/${language}/admin`;


  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader className="p-4">
        {open && (
           <Link href={`/${language}/dashboard`} onClick={handleMobileLinkClick} className="flex items-center">
            <span className="font-headline text-lg font-semibold text-sidebar-foreground">
              {APP_NAME}
            </span>
          </Link>
        )}
         {!open && isMobile && <SheetTitle className="sr-only">Navigation Menu</SheetTitle> }
         {open && isMobile && <SheetTitle className="sr-only">Navigation Menu</SheetTitle>}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {mainNavItems.map((item) => {
            const localizedHref = `/${language}${item.baseHref}`;
            return (
              <SidebarMenuItem key={item.baseHref}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === localizedHref || (item.baseHref !== "/dashboard" && pathname.startsWith(localizedHref))}
                  tooltip={{ children: getLabel(item.labelKey, item.labelKey) }}
                >
                  <Link href={localizedHref} onClick={handleMobileLinkClick}>
                    <item.icon />
                    <span>{getLabel(item.labelKey, item.labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
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
                  <Link href={localizedProfileBaseHref} className="flex items-center w-full" onClick={handleMobileLinkClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{getLabel('profile', 'Profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={localizedProgressBaseHref} className="flex items-center w-full" onClick={handleMobileLinkClick}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>{getLabel('progress', 'Progress')}</span>
                  </Link>
                </DropdownMenuItem>
                {canAccessAdminPanel && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground">
                      <Link href={localizedAdminHref} className="flex items-center w-full" onClick={handleMobileLinkClick}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>{getLabel('admin', 'Admin Panel')}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive/90">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{getLabel('logout', 'Logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
