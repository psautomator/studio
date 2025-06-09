
"use client";

import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { placeholderUser } from '@/lib/placeholder-data';
import { UserCircle, Edit3, Shield, BookOpen, Settings, Trash2, KeyRound } from 'lucide-react';

export default function ProfilePage() {
  const { translations } = useLanguage();
  const user = placeholderUser; // In a real app, this would come from user context/API

  return (
    <MainAppLayout>
      <PageHeader title={translations.profile} description="Manage your account settings and preferences." />

      <div className="grid gap-8 md:grid-cols-3">
        {/* User Info Card */}
        <Card className="md:col-span-1 shadow-lg rounded-lg">
          <CardHeader className="items-center text-center pt-8">
            <Avatar className="w-28 h-28 mb-4 border-4 border-primary/50 shadow-md">
              <AvatarImage src={`https://placehold.co/120x120.png`} alt={user.name} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                {user.name.substring(0, 1).toUpperCase()}
                {user.name.split(' ')[1]?.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <CardDescription className="capitalize text-sm text-muted-foreground mt-1">
              {translations.role || 'Role'}: {user.role} {user.role === 'admin' && <Shield className="inline-block ml-1 h-4 w-4 text-primary" />}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center p-6 pt-2">
            <Button variant="outline" className="w-full mt-4">
              <Edit3 className="mr-2 h-4 w-4" /> {translations.updateProfile || 'Update Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Settings Cards */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Settings */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <Settings className="mr-3 h-6 w-6 text-primary" /> {translations.profileSettings || 'Profile Settings'}
              </CardTitle>
              <CardDescription>Update your personal information and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{translations.name || 'Name'}</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translations.email || 'Email'}</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <Button variant="secondary">
                <KeyRound className="mr-2 h-4 w-4" /> {translations.changePassword || 'Change Password'}
              </Button>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-primary" /> {translations.learningPreferences || 'Learning Preferences'}
              </CardTitle>
              <CardDescription>Customize how you learn with Javanese Journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="learningStyle">{translations.preferredLearningStyle}</Label>
                <Input id="learningStyle" placeholder="e.g., Visual, Auditory" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studyGoal">{translations.dailyStudyGoal || 'Daily Study Goal (minutes)'}</Label>
                <Input id="studyGoal" type="number" placeholder="e.g., 30" />
              </div>
               <Button variant="secondary">
                {translations.save} {translations.learningPreferences || 'Learning Preferences'}
              </Button>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <UserCircle className="mr-3 h-6 w-6 text-primary" /> {translations.accountManagement || 'Account Management'}
              </CardTitle>
              <CardDescription>Manage your subscription and account status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                {translations.manageSubscription || 'Manage Subscription'}
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="mr-2 h-4 w-4" /> {translations.deleteAccount || 'Delete Account'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainAppLayout>
  );
}
