
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
import { UserCircle, Shield, BookOpen, Settings, Trash2, Save } from 'lucide-react'; 
import type { User as UserType } from '@/types'; // Import UserType

const currentUser: UserType = placeholderUser; // Use UserType

export default function ProfilePage() {
  const { translations } = useLanguage();
  // In a real app, this would come from user context/API (Google Auth)
  const user = currentUser; 

  // Mock handler for saving settings
  const handleSaveSettings = (section: string) => {
    // In a real app, you'd call an API here
    console.log(`Saving ${section} settings...`);
    // Example: toast({ title: `${section} settings saved!` });
  };

  const userDisplayRoles = user.roles.filter(r => r !== 'user').map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ');

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
            {userDisplayRoles && (
              <CardDescription className="capitalize text-sm text-muted-foreground mt-1">
                {translations.role || 'Role'}: {userDisplayRoles} 
                {user.roles.includes('admin') && <Shield className="inline-block ml-1 h-4 w-4 text-primary" />}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="text-center p-6 pt-2">
            {/* Removed "Update Profile" button from here */}
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
              <CardDescription>Update your display name and view your email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{translations.name || 'Name'}</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translations.email || 'Email'}</Label>
                <p id="email" className="text-sm text-muted-foreground pt-2">{user.email} (Managed by Google)</p>
              </div>
              <Button onClick={() => handleSaveSettings('Profile')}>
                <Save className="mr-2 h-4 w-4" /> {translations.save} {translations.profileSettings || 'Profile Settings'}
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
               <Button onClick={() => handleSaveSettings('Learning Preferences')}>
                <Save className="mr-2 h-4 w-4" /> {translations.save} {translations.learningPreferences || 'Learning Preferences'}
              </Button>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <UserCircle className="mr-3 h-6 w-6 text-primary" /> {translations.accountManagement || 'Account Management'}
              </CardTitle>
              <CardDescription>Manage your account status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Removed Manage Subscription button */}
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
