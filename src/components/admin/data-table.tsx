
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Sparkles } from "lucide-react"; // Added Sparkles
import type { ReactNode } from "react";

interface DataTableColumn<T> {
  accessorKey: keyof T | string; // Allow string for custom accessors or nested paths
  header: string;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onGenerateQuizAction?: (item: T) => void; // New prop for custom action
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  onGenerateQuizAction, // Destructure new prop
}: DataTableProps<T>) {
  
  const renderCellContent = (item: T, column: DataTableColumn<T>): ReactNode => {
    if (column.cell) {
      return column.cell(item);
    }
    // Basic accessor for non-nested keys
    const value = item[column.accessorKey as keyof T];
    if (typeof value === 'boolean') {
      return value ? "Yes" : "No";
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value ?? '');
  };


  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)} className="font-semibold">{column.header}</TableHead>
            ))}
            {(onEdit || onDelete || onView || onGenerateQuizAction) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={String(column.accessorKey)}>
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView || onGenerateQuizAction) && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {onView && (
                        <Button variant="ghost" size="icon" onClick={() => onView(item)} aria-label="View item" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label="Edit item" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                       {onGenerateQuizAction && ( // Conditionally render new action button
                        <Button variant="ghost" size="icon" onClick={() => onGenerateQuizAction(item)} aria-label="Generate AI Quiz" title="Generate AI Quiz">
                          <Sparkles className="h-4 w-4 text-accent" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="text-destructive hover:text-destructive" aria-label="Delete item" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + ((onEdit || onDelete || onView || onGenerateQuizAction) ? 1 : 0)} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
