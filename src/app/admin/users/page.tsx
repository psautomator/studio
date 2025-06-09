
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/admin/data-table';
import type { User } from '@/types';
import { placeholderAdminUsers } from '@/lib/placeholder-data'; // Using specific admin user data
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { UserRoleForm } from '@/components/admin/user-role-form'; // Import the new form

const ALL_ASSIGNABLE_ROLES = ['admin', 'editor', 'publisher']; // Define assignable roles

export default function AdminUsersPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(placeholderAdminUsers);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingUserForRoles, setEditingUserForRoles] = useState<User | null>(null);

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { 
      accessorKey: 'roles', 
      header: 'Roles', 
      cell: (item: User) => (
        <div className="flex flex-wrap gap-1">
          {item.roles.map(role => (
            <Badge key={role} variant={role === 'admin' ? 'default' : role === 'editor' ? 'secondary' : 'outline'} className="capitalize">
              {translations[role.toLowerCase()] || role}
            </Badge>
          ))}
        </div>
      )
    },
    { accessorKey: 'xp', header: 'XP' },
    { accessorKey: 'streak', header: 'Streak (days)' },
    { accessorKey: 'badges', header: 'Badges', cell: (item: User) => item.badges.length },
    { accessorKey: 'lastLogin', header: 'Last Login', cell: (item: User) => item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'N/A' },
  ];

  const handleEditUserRoles = (user: User) => {
    setEditingUserForRoles(user);
    setIsRoleFormOpen(true);
  };

  const handleSaveUserRoles = (userId: string, newRoles: string[]) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, roles: newRoles } : user
      )
    );
    const updatedUser = users.find(u => u.id === userId);
    toast({
      title: translations.userRolesUpdated || "User Roles Updated",
      description: `${translations.rolesFor || "Roles for"} ${updatedUser?.name || userId} ${translations.haveBeenSaved || "have been saved."}`,
    });
    setIsRoleFormOpen(false);
    setEditingUserForRoles(null);
  };
  
  const handleViewUser = (user: User) => {
    toast({
      title: `Viewing ${user.name}`,
      description: "Detailed user view is not yet implemented. Role management is via Edit icon.",
    });
  };

  return (
    <>
      <PageHeader title={translations.usersManagement} description={translations.usersManagementDesc || "View user data and manage roles."} />
      <DataTable 
        columns={columns} 
        data={users} 
        onView={handleViewUser} 
        onEdit={handleEditUserRoles} // Use onEdit to trigger role management
      />
      
      {editingUserForRoles && (
        <UserRoleForm
          open={isRoleFormOpen}
          onOpenChange={setIsRoleFormOpen}
          user={editingUserForRoles}
          onSaveRoles={handleSaveUserRoles}
          allAssignableRoles={ALL_ASSIGNABLE_ROLES}
        />
      )}
    </>
  );
}

