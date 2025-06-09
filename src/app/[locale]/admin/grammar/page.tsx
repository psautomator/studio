
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import type { GrammarLesson } from '@/types';
import { placeholderGrammarLessons, placeholderQuizzes, placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { GrammarLessonForm } from '@/components/admin/grammar-lesson-form';

export default function AdminGrammarPage() {
  const { translations, language } = useLanguage();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<GrammarLesson[]>(placeholderGrammarLessons);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<GrammarLesson | null>(null);

  const columns = [
    { 
      accessorKey: 'title', 
      header: translations.lessonTitle || 'Title', 
      cell: (item: GrammarLesson) => <span className="font-medium">{item.title[language] || item.title.en}</span> 
    },
    { accessorKey: 'category', header: translations.lessonCategory || 'Category', cell: (item: GrammarLesson) => item.category },
    { accessorKey: 'level', header: translations.lessonLevel || 'Level', cell: (item: GrammarLesson) => <Badge variant="secondary" className="capitalize">{item.level}</Badge> },
    { accessorKey: 'examples', header: translations.lessonExamples || 'Examples', cell: (item: GrammarLesson) => item.examples.length },
    { accessorKey: 'status', header: translations.lessonStatus || 'Status', cell: (item: GrammarLesson) => <Badge variant={item.status === 'published' ? 'default' : item.status === 'draft' ? 'secondary' : 'outline'} className="capitalize">{item.status || 'N/A'}</Badge> },
  ];

  const handleEdit = (lesson: GrammarLesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleDelete = (lessonToDelete: GrammarLesson) => {
     if (window.confirm(`${translations.confirmRemove || "Are you sure you want to delete this?"} "${lessonToDelete.title[language] || lessonToDelete.title.en}"?`)) {
      setLessons(lessons.filter(l => l.id !== lessonToDelete.id));
      toast({ title: "Lesson Deleted (Simulated)", description: `"${lessonToDelete.title[language] || lessonToDelete.title.en}" would be removed.` });
    }
  };
  
  const handleAddNew = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  };

  const handleSaveLesson = (data: GrammarLesson) => {
    const existingIndex = lessons.findIndex(l => l.id === data.id);
    if (existingIndex > -1) {
      const updatedLessons = [...lessons];
      updatedLessons[existingIndex] = data;
      setLessons(updatedLessons);
      toast({ title: translations.lessonSaved || "Lesson Saved", description: `"${data.title[language] || data.title.en}" has been updated.` });
    } else {
      setLessons(prevLessons => [...prevLessons, { ...data, id: data.id || `gl-${Date.now()}` }]); // Ensure ID for new lessons
      toast({ title: translations.lessonSaved || "Lesson Saved", description: `"${data.title[language] || data.title.en}" has been added.` });
    }
    setIsFormOpen(false);
    setEditingLesson(null);
  };


  return (
    <>
      <PageHeader title={translations.grammarManagement || "Grammar Management"} description="Manage grammar lessons and explanations.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.addNewLesson || "Add New Lesson"}
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={lessons} onEdit={handleEdit} onDelete={handleDelete} />
      
      <GrammarLessonForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        lesson={editingLesson}
        onSave={handleSaveLesson}
        allQuizzes={placeholderQuizzes}
        allWords={placeholderWords}
      />
    </>
  );
}
