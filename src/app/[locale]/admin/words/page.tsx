
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Sparkles } from 'lucide-react'; // Added Sparkles
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { GenerateQuizForWordDialog } from '@/components/admin/generate-quiz-for-word-dialog'; // Import the new dialog

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
  const [javanese, setJavanese] = useState('');
  const [dutch, setDutch] = useState('');
  const [phoneticJavanese, setPhoneticJavanese] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [formality, setFormality] = useState<'ngoko' | 'krama' | 'madya'>('ngoko');
  const [audioUrl, setAudioUrl] = useState('');
  const [exampleSentenceJavanese, setExampleSentenceJavanese] = useState('');
  const [exampleSentenceDutch, setExampleSentenceDutch] = useState('');

  const { translations } = useLanguage();

  useEffect(() => {
    if (word) {
      setJavanese(word.javanese || '');
      setDutch(word.dutch || '');
      setPhoneticJavanese(word.phoneticJavanese || '');
      setCategory(word.category || '');
      setLevel(word.level || 'Beginner');
      setFormality(word.formality || 'ngoko');
      setAudioUrl(word.audioUrl || '');
      setExampleSentenceJavanese(word.exampleSentenceJavanese || '');
      setExampleSentenceDutch(word.exampleSentenceDutch || '');
    } else {
      // Reset for new word
      setJavanese('');
      setDutch('');
      setPhoneticJavanese('');
      setCategory('');
      setLevel('Beginner');
      setFormality('ngoko');
      setAudioUrl('');
      setExampleSentenceJavanese('');
      setExampleSentenceDutch('');
    }
  }, [word, open]);

  const handleSubmit = () => {
    if (!javanese || !dutch) {
      alert('Javanese and Dutch fields are required.');
      return;
    }
    onSave({
      id: word?.id || String(Date.now()),
      javanese,
      dutch,
      phoneticJavanese,
      category,
      level,
      formality,
      audioUrl,
      exampleSentenceJavanese,
      exampleSentenceDutch,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{word?.id ? 'Edit Word' : 'Add New Word'}</DialogTitle>
          <DialogDescription>
            {word?.id ? 'Modify the details of the Javanese word.' : 'Enter the details for the new Javanese word.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto pr-2">
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
            <Label htmlFor="phoneticJavanese" className="text-right">
              Phonetic (Javanese)
            </Label>
            <Input id="phoneticJavanese" value={phoneticJavanese} onChange={(e) => setPhoneticJavanese(e.target.value)} className="col-span-3" placeholder="e.g., [su-geng en-jing]"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
            </Label>
             <Select value={level} onValueChange={(value) => setLevel(value as 'Beginner' | 'Intermediate' | 'Advanced')}>
                <SelectTrigger id="level" className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="formality" className="text-right">
              Formality
            </Label>
             <Select value={formality} onValueChange={(value) => setFormality(value as 'ngoko' | 'krama' | 'madya')}>
                <SelectTrigger id="formality" className="col-span-3">
                  <SelectValue placeholder="Select formality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngoko">Ngoko (Informal)</SelectItem>
                  <SelectItem value="madya">Madya (Semi-formal)</SelectItem>
                  <SelectItem value="krama">Krama (Formal)</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="audioUrl" className="text-right">
              Audio URL
            </Label>
            <Input id="audioUrl" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="exampleJavanese" className="text-right pt-2">
              Example (Javanese)
            </Label>
            <Textarea id="exampleJavanese" value={exampleSentenceJavanese} onChange={(e) => setExampleSentenceJavanese(e.target.value)} className="col-span-3" placeholder="Example sentence in Javanese" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="exampleDutch" className="text-right pt-2">
              Example (Dutch)
            </Label>
            <Textarea id="exampleDutch" value={exampleSentenceDutch} onChange={(e) => setExampleSentenceDutch(e.target.value)} className="col-span-3" placeholder="Dutch translation of the example"/>
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

function BulkImportWordsDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (words: Word[]) => void;
}) {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState('');

  const exampleFormat = `Example for a single word:
{
  "id": "unique-word-id",
  "javanese": "Word in Javanese",
  "dutch": "Word in Dutch",
  "phoneticJavanese": "[Optional phonetic spelling]", 
  "category": "Optional category",
  "level": "Beginner" | "Intermediate" | "Advanced", (optional)
  "formality": "ngoko" | "krama" | "madya", (optional, defaults to 'ngoko')
  "audioUrl": "Optional URL for audio pronunciation",
  "exampleSentenceJavanese": "Optional example sentence in Javanese",
  "exampleSentenceDutch": "Optional Dutch translation of example"
}

Paste an array of such word objects: [ {word1}, {word2}, ... ]
Make sure all IDs are unique.
`;

  const handleImportClick = () => {
    try {
      const parsedWords = JSON.parse(jsonInput) as Word[];
      if (!Array.isArray(parsedWords)) {
        throw new Error("Input must be an array of words.");
      }
      
      const validatedWords = parsedWords.map(word => {
        if (!word.id || !word.javanese || !word.dutch) {
          throw new Error(`Each word must have an id, javanese, and dutch field. Problem with: ${JSON.stringify(word)}`);
        }
        return {
          ...word,
          formality: word.formality || 'ngoko', // Default to 'ngoko'
          level: word.level || 'Beginner', // Default to 'Beginner'
        };
      });

      onImport(validatedWords);
      toast({ title: "Import Successful", description: `${validatedWords.length} words imported.` });
      setJsonInput('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Invalid JSON format or structure.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Import Words</DialogTitle>
          <DialogDescription>
            Paste your word data in JSON format below. Refer to the expected format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto pr-2">
          <div>
            <Label htmlFor="jsonImport">JSON Data</Label>
            <Textarea
              id="jsonImport"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON array of words here..."
              className="mt-1 min-h-[200px] font-mono text-xs"
            />
          </div>
          <div>
            <Label>Expected JSON Format</Label>
            <pre className="mt-1 p-3 bg-muted/50 rounded-md text-xs overflow-x-auto max-h-[200px]">
              <code>{exampleFormat}</code>
            </pre>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleImportClick}>Import</Button>
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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const [isGenerateQuizDialogOpen, setIsGenerateQuizDialogOpen] = useState(false);
  const [wordForQuizGeneration, setWordForQuizGeneration] = useState<Word | null>(null);


  const columns = [
    { accessorKey: 'javanese', header: translations.javanese },
    { accessorKey: 'dutch', header: translations.dutch },
    { accessorKey: 'phoneticJavanese', header: 'Phonetic' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'level', header: 'Level', cell: (item: Word) => item.level || 'N/A' },
    { accessorKey: 'formality', header: 'Formality', cell: (item: Word) => item.formality ? <Badge variant={item.formality === 'krama' ? 'secondary' : 'outline'} className="capitalize">{item.formality}</Badge> : 'N/A' },
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
    const existingWordIndex = words.findIndex(w => w.id === wordData.id);
    if (existingWordIndex > -1) {
      const updatedWords = [...words];
      updatedWords[existingWordIndex] = wordData;
      setWords(updatedWords);
      toast({ title: "Word Updated", description: `"${wordData.javanese}" has been updated.` });
    } else {
      setWords([...words, wordData]);
      toast({ title: "Word Added", description: `"${wordData.javanese}" has been added.` });
    }
    setEditingWord(null);
    setIsFormOpen(false);
  };

  const handleAddNew = () => {
    setEditingWord(null);
    setIsFormOpen(true);
  };

  const handleBulkImport = (importedWords: Word[]) => {
    // Simple merge: add new, overwrite existing by ID
    const updatedWordsMap = new Map(words.map(w => [w.id, w]));
    importedWords.forEach(iw => updatedWordsMap.set(iw.id, iw));
    setWords(Array.from(updatedWordsMap.values()));
  };

  const handleOpenGenerateQuizDialog = (word: Word) => {
    setWordForQuizGeneration(word);
    setIsGenerateQuizDialogOpen(true);
  };

  return (
    <>
      <PageHeader title={translations.wordsManagement} description="Manage Javanese vocabulary and translations.">
        <Button onClick={() => setIsImportDialogOpen(true)} variant="outline" className="mr-2">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Import Words
        </Button>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.addNewWord}
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={words}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerateQuizAction={handleOpenGenerateQuizDialog} // Pass the new action handler
      />
      <WordForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        word={editingWord}
        onSave={handleSaveWord}
      />
      <BulkImportWordsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleBulkImport}
      />
      <GenerateQuizForWordDialog
        open={isGenerateQuizDialogOpen}
        onOpenChange={setIsGenerateQuizDialogOpen}
        word={wordForQuizGeneration}
      />
    </>
  );
}
