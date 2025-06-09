"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import type { Quiz, QuizOption } from '@/types';
import { placeholderQuizzes } from '@/lib/placeholder-data';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

// Dummy QuizForm component
function QuizForm({
  open,
  onOpenChange,
  quiz,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Partial<Quiz> | null;
  onSave: (data: Quiz) => void;
}) {
  const { translations } = useLanguage();
  const [question, setQuestion] = useState(quiz?.question || '');
  const [options, setOptions] = useState<QuizOption[]>(quiz?.options || [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
  const [explanation, setExplanation] = useState(quiz?.explanation || '');

  const handleOptionChange = (index: number, field: keyof QuizOption, value: string | boolean) => {
    const newOptions = [...options];
    if (field === 'text' && typeof value === 'string') newOptions[index].text = value;
    if (field === 'isCorrect' && typeof value === 'boolean') newOptions[index].isCorrect = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, { text: '', isCorrect: false }]);
  const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!question || options.some(opt => !opt.text) || !options.some(opt => opt.isCorrect)) {
      alert('Question, all option texts, and at least one correct answer are required.');
      return;
    }
    onSave({
      id: quiz?.id || String(Date.now()),
      question,
      options,
      explanation,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{quiz?.id ? 'Edit Quiz' : translations.addNewQuiz}</DialogTitle>
          <DialogDescription>
            {quiz?.id ? 'Modify the details of the quiz.' : 'Enter the details for the new quiz.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="question">{translations.question}</Label>
            <Textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>{translations.options}</Label>
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  className="flex-grow"
                />
                <div className="flex items-center space-x-2">
                   <Checkbox
                    id={`isCorrect-${index}`}
                    checked={opt.isCorrect}
                    onCheckedChange={(checked) => handleOptionChange(index, 'isCorrect', !!checked)}
                  />
                  <Label htmlFor={`isCorrect-${index}`} className="text-sm">Correct</Label>
                </div>
                {options.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => removeOption(index)}><X className="h-4 w-4" /></Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addOption} className="mt-2">Add Option</Button>
          </div>
           <div>
            <Label htmlFor="explanation">Explanation (optional)</Label>
            <Textarea id="explanation" value={explanation} onChange={(e) => setExplanation(e.target.value)} className="mt-1" />
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

export default function AdminQuizzesPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>(placeholderQuizzes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Partial<Quiz> | null>(null);

  const columns = [
    { accessorKey: 'question', header: translations.question, cell: (item: Quiz) => <span className="truncate block max-w-xs">{item.question}</span> },
    { accessorKey: 'options', header: translations.options, cell: (item: Quiz) => item.options.length },
    { accessorKey: 'difficulty', header: 'Difficulty' },
  ];

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsFormOpen(true);
  };

  const handleDelete = (quizToDelete: Quiz) => {
     if (window.confirm(`Are you sure you want to delete this quiz: "${quizToDelete.question.substring(0,30)}..."?`)) {
      setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
      toast({ title: "Quiz Deleted", description: "The quiz has been removed." });
    }
  };

  const handleSaveQuiz = (quizData: Quiz) => {
    if (editingQuiz?.id) {
      setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...q, ...quizData } : q));
      toast({ title: "Quiz Updated", description: "The quiz has been updated." });
    } else {
      setQuizzes([...quizzes, { ...quizData, id: String(Date.now()) }]);
      toast({ title: "Quiz Added", description: "The new quiz has been added." });
    }
    setEditingQuiz(null);
    setIsFormOpen(false);
  };
  
  const handleAddNew = () => {
    setEditingQuiz(null);
    setIsFormOpen(true);
  };


  return (
    <>
      <PageHeader title={translations.quizzesManagement} description="Create and manage quizzes.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.addNewQuiz}
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={quizzes} onEdit={handleEdit} onDelete={handleDelete} />
      <QuizForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        quiz={editingQuiz}
        onSave={handleSaveQuiz}
      />
    </>
  );
}
