"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/admin/data-table';
import type { User } from '@/types';
import { placeholderAdminUsers } from '@/lib/placeholder-data'; // Using specific admin user data
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge'; // For displaying roles


export default function AdminUsersPage() {
  const { translations } = useLanguage();
  const { toast } = useToast(); // For potential future actions like "promote to admin"
  const [users, setUsers] = useState<User[]>(placeholderAdminUsers);

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: (item: User) => <Badge variant={item.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{item.role}</Badge> },
    { accessorKey: 'xp', header: 'XP' },
    { accessorKey: 'streak', header: 'Streak (days)' },
    { accessorKey: 'badges', header: 'Badges', cell: (item: User) => item.badges.length },
    { accessorKey: 'lastLogin', header: 'Last Login', cell: (item: User) => item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'N/A' },
  ];

  // View action can show a modal with more details. For now, it's just a placeholder.
  const handleViewUser = (user: User) => {
    toast({
      title: `Viewing ${user.name}`,
      description: "Detailed user view is not yet implemented.",
    });
  };

  return (
    <>
      <PageHeader title={translations.usersManagement} description="View user data and progress." />
      <DataTable columns={columns} data={users} onView={handleViewUser} />
      {/* Future: Add filtering, sorting, pagination. Modals for detailed view. */}
    </>
  );
}
