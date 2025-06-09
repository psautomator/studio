
"use client";

import Link from 'next/link';
import { Shield, UserCircle, Menu, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { useLanguage } from '@/hooks/use-language';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { translations, language } = useLanguage(); // language is the current locale (en/nl)
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  const isAdminArea = pathname.startsWith(`/${language}/admin`); // Check if current path is admin, considering locale
  const dashboardLink = `/${language}/dashboard`;
  const profileLink = `/${language}/profile`;
  const adminLink = `/${language}/admin`; // Admin area link is now also locale-prefixed

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {isMobile && <SidebarTrigger />}
          <Link href={isAdminArea ? adminLink : dashboardLink} className="flex items-center space-x-2">
            <span className="font-headline text-xl font-bold text-primary">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-2">
            {isAdminArea ? (
              <Button variant="default" asChild>
                <Link href={dashboardLink}> 
                  <Home className="mr-2 h-4 w-4" />
                  {translations.backToApp || "App"}
                </Link>
              </Button>
            ) : (
              <Button variant="default" asChild>
                <Link href={adminLink}> 
                  <Shield className="mr-2 h-4 w-4" />
                  {translations.admin}
                </Link>
              </Button>
            )}
          </nav>
          <LanguageToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href={profileLink}> 
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
