
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

  const isAdminArea = pathname.startsWith('/admin');
  const dashboardLink = `/${language}/dashboard`;
  const profileLink = `/${language}/profile`;
  const adminLink = "/admin"; // Admin area is not locale-prefixed

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && <SidebarTrigger />}
          {/* Link to admin root or localized dashboard */}
          <Link href={isAdminArea ? adminLink : dashboardLink} className="flex items-center space-x-2">
            <span className="font-headline text-xl font-bold text-primary">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-2">
            {isAdminArea ? (
              <Button variant="default" asChild>
                <Link href={dashboardLink}> {/* Localized dashboard link */}
                  <Home className="mr-2 h-4 w-4" />
                  {translations.backToApp || "App"}
                </Link>
              </Button>
            ) : (
              <Button variant="default" asChild>
                <Link href={adminLink}> {/* Admin link is not localized */}
                  <Shield className="mr-2 h-4 w-4" />
                  {translations.admin}
                </Link>
              </Button>
            )}
          </nav>
          <LanguageToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href={profileLink}> {/* Localized profile link */}
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
