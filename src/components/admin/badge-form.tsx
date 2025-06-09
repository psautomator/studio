
"use client";

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Badge } from '@/types';
import { useLanguage } from '@/hooks/use-language';

const badgeFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Badge name is required."),
  description: z.string().min(1, "Description is required."),
  icon: z.string().min(1, "Icon name is required (e.g., Award, Flame, StarIcon)."),
  threshold: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
});

type BadgeFormValues = z.infer<typeof badgeFormSchema>;

interface BadgeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: Badge | null;
  onSave: (data: BadgeFormValues) => void;
}

export function BadgeForm({ open, onOpenChange, badge, onSave }: BadgeFormProps) {
  const { translations } = useLanguage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeFormSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'Award', // Default icon
      threshold: undefined,
    },
  });

  useEffect(() => {
    if (badge) {
      reset({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        threshold: badge.threshold,
      });
    } else {
      reset({
        id: undefined,
        name: '',
        description: '',
        icon: 'Award',
        threshold: undefined,
      });
    }
  }, [badge, reset, open]);

  const onSubmit: SubmitHandler<BadgeFormValues> = (data) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{badge ? (translations.editBadge || "Edit Badge") : (translations.addNewBadge || "Add New Badge")}</DialogTitle>
          <DialogDescription>
            {badge ? (translations.editBadgeDesc || "Modify the details of this badge.") : (translations.addNewBadgeDesc || "Enter the details for the new badge.")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">{translations.badgeName || "Badge Name"}</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">{translations.badgeDescription || "Description"}</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="icon">{translations.badgeIcon || "Icon Name (Lucide)"}</Label>
            <Input id="icon" {...register("icon")} placeholder="e.g., Award, Flame, StarIcon, Trophy" />
            {errors.icon && <p className="text-sm text-destructive mt-1">{errors.icon.message}</p>}
             <p className="text-xs text-muted-foreground mt-1">
              {translations.badgeIconHint || "Refer to lucide.dev for icon names. Common ones: Award, BookOpenCheck, Flame, StarIcon, Trophy."}
            </p>
          </div>
          <div>
            <Label htmlFor="threshold">{translations.badgeThreshold || "Threshold (optional number)"}</Label>
            <Input id="threshold" type="number" {...register("threshold")} placeholder="e.g., 10 (for 10 quizzes completed)" />
            {errors.threshold && <p className="text-sm text-destructive mt-1">{errors.threshold.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{translations.cancel}</Button>
            <Button type="submit">{translations.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
