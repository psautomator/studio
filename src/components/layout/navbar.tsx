
"use client";

import Link from 'next/link';
import { Shield, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { useLanguage } from '@/hooks/use-language';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export function Navbar() {
  const { translations } = useLanguage();
  const { isMobile } = useSidebar();


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && <SidebarTrigger />}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-headline text-xl font-bold text-primary">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="default" asChild>
              <Link href="/admin">{translations.admin}</Link>
            </Button>
          </nav>
          <LanguageToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile"> {/* Placeholder for profile page */}
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
