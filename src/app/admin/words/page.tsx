"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import type { Word } from '@/types';
import { placeholderWords } from '@/lib/placeholder-data';
import { useLanguage } from '@/hooks/use-language';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Dummy WordForm component (replace with actual form logic)
function WordForm({
  open,
  onOpenChange,
  word,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: Partial<Word> | null;
  onSave: (data: Word) => void;
}) {
  const [javanese, setJavanese] = useState(word?.javanese || '');
  const [dutch, setDutch] = useState(word?.dutch || '');
  const [category, setCategory] = useState(word?.category || '');
  const { translations } = useLanguage();

  const handleSubmit = () => {
    // Basic validation
    if (!javanese || !dutch) {
      alert('Javanese and Dutch fields are required.');
      return;
    }
    onSave({
      id: word?.id || String(Date.now()), // simple ID generation
      javanese,
      dutch,
      category,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{word?.id ? 'Edit Word' : 'Add New Word'}</DialogTitle>
          <DialogDescription>
            {word?.id ? 'Modify the details of the Javanese word.' : 'Enter the details for the new Javanese word.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="javanese" className="text-right">
              {translations.javanese}
            </Label>
            <Input id="javanese" value={javanese} onChange={(e) => setJavanese(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dutch" className="text-right">
              {translations.dutch}
            </Label>
            <Input id="dutch" value={dutch} onChange={(e) => setDutch(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{translations.cancel}</Button>
          <Button onClick={handleSubmit}>{translations.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function AdminWordsPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [words, setWords] = useState<Word[]>(placeholderWords);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Partial<Word> | null>(null);

  const columns = [
    { accessorKey: 'javanese', header: translations.javanese },
    { accessorKey: 'dutch', header: translations.dutch },
    { accessorKey: 'category', header: 'Category' },
  ];

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setIsFormOpen(true);
  };

  const handleDelete = (wordToDelete: Word) => {
    if (window.confirm(`Are you sure you want to delete "${wordToDelete.javanese}"?`)) {
      setWords(words.filter(w => w.id !== wordToDelete.id));
      toast({ title: "Word Deleted", description: `"${wordToDelete.javanese}" has been removed.` });
    }
  };
  
  const handleSaveWord = (wordData: Word) => {
    if (editingWord?.id) { // Editing existing word
      setWords(words.map(w => w.id === editingWord.id ? { ...w, ...wordData } : w));
      toast({ title: "Word Updated", description: `"${wordData.javanese}" has been updated.` });
    } else { // Adding new word
      setWords([...words, { ...wordData, id: String(Date.now()) }]); // Ensure new ID
      toast({ title: "Word Added", description: `"${wordData.javanese}" has been added.` });
    }
    setEditingWord(null);
    setIsFormOpen(false);
  };

  const handleAddNew = () => {
    setEditingWord(null); // Ensure it's a new word form
    setIsFormOpen(true);
  };

  return (
    <>
      <PageHeader title={translations.wordsManagement} description="Manage Javanese vocabulary and translations.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.addNewWord}
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={words} onEdit={handleEdit} onDelete={handleDelete} />
      <WordForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        word={editingWord}
        onSave={handleSaveWord}
      />
    </>
  );
}
