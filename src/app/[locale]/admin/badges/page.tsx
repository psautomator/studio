
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import type { Badge } from '@/types';
import { placeholderBadges } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { BadgeForm } from '@/components/admin/badge-form'; // We'll create this next

export default function AdminBadgesPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>(placeholderBadges);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

  const columns = [
    { accessorKey: 'name', header: translations.badgeName || 'Name' },
    { accessorKey: 'description', header: translations.badgeDescription || 'Description' },
    { accessorKey: 'icon', header: translations.badgeIcon || 'Icon' },
    { accessorKey: 'threshold', header: translations.badgeThreshold || 'Threshold', cell: (item: Badge) => item.threshold || 'N/A' },
  ];

  const handleEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setIsFormOpen(true);
  };

  const handleDelete = (badgeToDelete: Badge) => {
    if (window.confirm(`${translations.confirmRemove || "Are you sure you want to delete this badge?"} "${badgeToDelete.name}"?`)) {
      setBadges(badges.filter(b => b.id !== badgeToDelete.id));
      toast({ title: translations.badgeDeleted || "Badge Deleted", description: `"${badgeToDelete.name}" ${translations.hasBeenRemoved || "has been removed."}` });
    }
  };

  const handleAddNew = () => {
    setEditingBadge(null);
    setIsFormOpen(true);
  };

  const handleSaveBadge = (data: Badge) => {
    const existingIndex = badges.findIndex(b => b.id === data.id);
    if (existingIndex > -1) {
      const updatedBadges = [...badges];
      updatedBadges[existingIndex] = data;
      setBadges(updatedBadges);
      toast({ title: translations.badgeSaved || "Badge Saved", description: `"${data.name}" ${translations.hasBeenUpdated || "has been updated."}` });
    } else {
      setBadges(prevBadges => [...prevBadges, { ...data, id: data.id || `badge-${Date.now()}` }]);
      toast({ title: translations.badgeSaved || "Badge Saved", description: `"${data.name}" ${translations.hasBeenAdded || "has been added."}` });
    }
    setIsFormOpen(false);
    setEditingBadge(null);
  };

  return (
    <>
      <PageHeader title={translations.badgesManagement || "Badges Management"} description={translations.badgesManagementDesc || "Create and manage achievement badges."}>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.addNewBadge || "Add New Badge"}
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={badges} onEdit={handleEdit} onDelete={handleDelete} />
      
      <BadgeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        badge={editingBadge}
        onSave={handleSaveBadge}
      />
    </>
  );
}
