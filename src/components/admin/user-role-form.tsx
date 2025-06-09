
"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';
import { useLanguage } from '@/hooks/use-language';

// Define a schema for the form if needed, though for simple checkboxes, direct state might be okay.
// For consistency and potential future validation, a schema is good practice.
const userRoleFormSchema = z.object({
  roles: z.array(z.string()).min(0, "User must have at least a base role (handled implicitly)."),
});

type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;

interface UserRoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSaveRoles: (userId: string, newRoles: string[]) => void;
  allAssignableRoles: string[]; // e.g., ['admin', 'editor', 'publisher']
}

export function UserRoleForm({ open, onOpenChange, user, onSaveRoles, allAssignableRoles }: UserRoleFormProps) {
  const { translations } = useLanguage();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user && open) {
      // Initialize selectedRoles with the user's current roles, excluding 'user' base role
      setSelectedRoles(user.roles.filter(role => allAssignableRoles.includes(role)));
    } else if (!open) {
      setSelectedRoles([]); // Reset when dialog closes
    }
  }, [user, open, allAssignableRoles]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = () => {
    if (!user) return;
    // Ensure 'user' role is always present, add other selected roles
    const newRoles = Array.from(new Set(['user', ...selectedRoles]));
    onSaveRoles(user.id, newRoles);
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.manageUserRoles || "Manage User Roles"}: {user.name}</DialogTitle>
          <DialogDescription>
            {translations.selectRolesForUser || `Select the roles for ${user.email}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="font-semibold">{translations.assignableRoles || "Assignable Roles"}</Label>
            {allAssignableRoles.map(role => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <Label htmlFor={`role-${role}`} className="font-normal capitalize">
                  {translations[role] || role}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{translations.cancel}</Button>
          <Button type="button" onClick={handleSubmit}>{translations.saveRoles || "Save Roles"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

