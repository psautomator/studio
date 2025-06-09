
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, X, Upload } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import type { Quiz, QuizOption, QuizQuestion, QuestionType } from '@/types';
import { placeholderQuizzes } from '@/lib/placeholder-data';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// QuizForm component (modified)
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('draft');
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([
    { questionType: 'multiple-choice', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] },
  ]);

  const questionTypes: QuestionType[] = [
    'multiple-choice',
    'translation-word-to-dutch',
    'translation-sentence-to-dutch',
    'translation-word-to-javanese',
    'translation-sentence-to-javanese',
    'fill-in-the-blank-mcq',
    'fill-in-the-blank-text-input',
  ];

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || '');
      setDescription(quiz.description || '');
      setCategory(quiz.category || '');
      setDifficulty(quiz.difficulty || 'easy');
      setStatus(quiz.status || 'draft');
      setQuestions(quiz.questions?.length ? quiz.questions.map(q => ({...q})) : [{ questionType: 'multiple-choice', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }]);
    } else {
      // Reset form for new quiz
      setTitle('');
      setDescription('');
      setCategory('');
      setDifficulty('easy');
      setStatus('draft');
      setQuestions([{ questionType: 'multiple-choice', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }]);
    }
  }, [quiz, open]);


  const handleQuestionChange = (qIndex: number, field: keyof QuizQuestion, value: string | QuestionType) => {
    const newQuestions = [...questions];
    const currentQuestion = { ...newQuestions[qIndex] };
    (currentQuestion[field as keyof QuizQuestion] as any) = value; // Type assertion
    
    // If changing to fill-in-the-blank-text-input, ensure options array is initialized correctly
    if (field === 'questionType' && value === 'fill-in-the-blank-text-input') {
        currentQuestion.options = [{ text: '', isCorrect: true }];
    } else if (field === 'questionType' && value !== 'fill-in-the-blank-text-input' && (!currentQuestion.options || currentQuestion.options.length === 0)) {
        // If changing to other MCQ types and options are empty, initialize with two default options
        currentQuestion.options = [{ text: '', isCorrect: false }, { text: '', isCorrect: false }];
    }

    newQuestions[qIndex] = currentQuestion;
    setQuestions(newQuestions);
  };
  

  const handleOptionChange = (qIndex: number, oIndex: number, field: keyof QuizOption, value: string | boolean) => {
    const newQuestions = [...questions];
    const currentQuestion = { ...newQuestions[qIndex] };
    const newOptions = [...(currentQuestion.options || [])];
    if (field === 'text' && typeof value === 'string') newOptions[oIndex] = { ...newOptions[oIndex], text: value };
    if (field === 'isCorrect' && typeof value === 'boolean') {
        if (currentQuestion.questionType === 'fill-in-the-blank-text-input') {
            newOptions[oIndex] = { ...newOptions[oIndex], isCorrect: true }; // Always true for this type
        } else {
            newOptions[oIndex] = { ...newOptions[oIndex], isCorrect: value };
        }
    }
    currentQuestion.options = newOptions;
    newQuestions[qIndex] = currentQuestion;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    const currentQuestion = { ...newQuestions[qIndex] };
    currentQuestion.options = [...(currentQuestion.options || []), { text: '', isCorrect: false }];
    newQuestions[qIndex] = currentQuestion;
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    const currentQuestion = { ...newQuestions[qIndex] };
    currentQuestion.options = currentQuestion.options?.filter((_, i) => i !== oIndex);
    newQuestions[qIndex] = currentQuestion;
    setQuestions(newQuestions);
  };
  
  const addQuestion = () => {
    setQuestions([...questions, { questionType: 'multiple-choice', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }]);
  };

  const removeQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };


  const handleSubmit = () => {
    if (!title) {
        alert('Quiz Title is required.');
        return;
    }
    if (questions.some(q => {
        if (!q.questionText) return true;
        if (q.questionType === 'fill-in-the-blank-text-input') {
            return !q.options || q.options.length === 0 || !q.options[0].text;
        }
        return q.options?.some(opt => !opt.text) || !q.options?.some(opt => opt.isCorrect);
    })) {
        alert('All question texts, all option texts (or correct answer for fill-in-the-blank), and at least one correct answer per MCQ question are required.');
        return;
    }
    
    const finalQuestions: QuizQuestion[] = questions.map((q, index) => ({
        id: q.id || `q-${Date.now()}-${index}`, // Generate ID if not present
        questionType: q.questionType!, 
        questionText: q.questionText!,
        options: q.options! as QuizOption[],
        explanation: q.explanation,
        audioUrl: q.audioUrl,
    }));

    onSave({
      id: quiz?.id || `quiz-${Date.now()}`,
      title,
      description,
      category,
      difficulty,
      status,
      questions: finalQuestions,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{quiz?.id ? 'Edit Quiz Set' : 'Add New Quiz Set'}</DialogTitle>
          <DialogDescription>
            {quiz?.id ? 'Modify the details of the quiz set.' : 'Enter the details for the new quiz set.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="category">Category (optional)</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1" placeholder="e.g., Vocabulary, Grammar Topic, Numbers" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger id="difficulty" className="mt-1">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'published' | 'draft' | 'archived')}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6 mt-4">
            <Label className="text-lg font-semibold">Questions</Label>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-md space-y-3 bg-muted/30">
                <div className="flex justify-between items-center">
                    <Label htmlFor={`question-${qIndex}`} className="font-medium">Question {qIndex + 1}</Label>
                    {questions.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}><X className="h-4 w-4 mr-1" /> Remove Question</Button>
                    )}
                </div>
                <div>
                  <Label htmlFor={`questionType-${qIndex}`}>Question Type</Label>
                  <Select
                    value={q.questionType}
                    onValueChange={(value) => handleQuestionChange(qIndex, 'questionType', value as QuestionType)}
                  >
                    <SelectTrigger id={`questionType-${qIndex}`} className="mt-1">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea id={`questionText-${qIndex}`} value={q.questionText || ''} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} placeholder={q.questionType === 'fill-in-the-blank-text-input' ? "Enter sentence with '_______' for the blank" : "Enter question text"} />
                 
                 {q.questionType === 'fill-in-the-blank-text-input' ? (
                    <div>
                        <Label htmlFor={`correctAnswer-${qIndex}`}>Correct Answer</Label>
                        <Input 
                            id={`correctAnswer-${qIndex}`} 
                            value={q.options && q.options.length > 0 ? q.options[0].text : ''} 
                            onChange={(e) => handleOptionChange(qIndex, 0, 'text', e.target.value)} 
                            placeholder="Enter the correct word for the blank" 
                            className="mt-1"
                        />
                    </div>
                 ) : (
                    <div className="space-y-2">
                        <Label>Options</Label>
                        {q.options?.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder={`Option ${oIndex + 1}`}
                                value={opt.text}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                                className="flex-grow"
                            />
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                id={`isCorrect-${qIndex}-${oIndex}`}
                                checked={opt.isCorrect}
                                onCheckedChange={(checked) => handleOptionChange(qIndex, oIndex, 'isCorrect', !!checked)}
                                />
                                <Label htmlFor={`isCorrect-${qIndex}-${oIndex}`} className="text-sm">Correct</Label>
                            </div>
                            {(q.options?.length || 0) > 2 && (
                                <Button variant="ghost" size="icon" onClick={() => removeOption(qIndex, oIndex)}><X className="h-4 w-4" /></Button>
                            )}
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addOption(qIndex)} className="mt-1">Add Option</Button>
                    </div>
                 )}
                <div>
                  <Label htmlFor={`explanation-${qIndex}`}>Explanation (optional)</Label>
                  <Textarea id={`explanation-${qIndex}`} value={q.explanation || ''} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} placeholder="Explain the correct answer" className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor={`audioUrl-${qIndex}`}>Audio URL (optional)</Label>
                  <Input id={`audioUrl-${qIndex}`} value={q.audioUrl || ''} onChange={(e) => handleQuestionChange(qIndex, 'audioUrl', e.target.value)} placeholder="Enter audio URL for the question" className="mt-1" />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addQuestion}>Add Question</Button>
          </div>

        </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{translations.cancel}</Button>
          <Button onClick={handleSubmit}>{translations.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BulkImportDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (quizzes: Quiz[]) => void;
}) {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState('');

  const exampleFormat = `[
  {
    "id": "quiz-bulk-1",
    "title": "Bulk Imported Quiz 1",
    "description": "Description for bulk quiz 1.",
    "category": "Greetings",
    "difficulty": "medium", 
    "status": "draft", 
    "questions": [
      {
        "id": "q-bulk-1-1",
        "questionType": "multiple-choice",
        "questionText": "What is 'siji' in Dutch?",
        "options": [
          { "text": "Een", "isCorrect": true },
          { "text": "Twee", "isCorrect": false },
          { "text": "Drie", "isCorrect": false }
        ],
        "explanation": "'Siji' means 'Een' (One).",
        "audioUrl": ""
      },
      {
        "id": "q-bulk-1-2",
        "questionType": "fill-in-the-blank-text-input",
        "questionText": "Sugeng _____, Bu Guru. (means: Good morning, teacher)",
        "options": [ 
          { "text": "enjing", "isCorrect": true }
        ],
        "explanation": "'Enjing' means morning. 'Sugeng enjing' is 'Good morning'."
      }
    ]
  }
]
// Paste an array of such quiz objects. IDs must be unique.
// questionType can be: 'multiple-choice', 'translation-word-to-dutch', ..., 'fill-in-the-blank-text-input'
`;

  const handleImportClick = () => {
    try {
      const parsedQuizzes = JSON.parse(jsonInput) as Quiz[];
      if (!Array.isArray(parsedQuizzes)) {
        throw new Error("Input must be an array of quizzes.");
      }
      
      const validatedQuizzes = parsedQuizzes.map(quiz => {
        if (!quiz.id || !quiz.title || !Array.isArray(quiz.questions)) {
          throw new Error(`Quiz missing id, title, or questions. Problem with: ${JSON.stringify(quiz).substring(0,100)}...`);
        }
        quiz.status = quiz.status || 'draft';
        quiz.difficulty = quiz.difficulty || 'easy';
        quiz.category = quiz.category || '';

        quiz.questions.forEach((q, idx) => {
          if(!q.id || !q.questionText || !Array.isArray(q.options) || !q.questionType) { 
            throw new Error(`Question #${idx+1} in quiz "${quiz.title}" is missing id, questionType, questionText, or options array.`);
          }
          if(q.questionType === 'fill-in-the-blank-text-input') {
            if(q.options.length !== 1 || !q.options[0].text || q.options[0].isCorrect !== true) {
                throw new Error(`Fill-in-the-blank-text-input question "${q.questionText.substring(0,30)}..." in quiz "${quiz.title}" must have exactly one option with 'isCorrect: true' and text.`);
            }
          } else { // For MCQ types
            if(q.options.length < 2) {
                throw new Error(`MCQ Question #${idx+1} in quiz "${quiz.title}" must have at least two options.`);
            }
            if(!q.options.some(opt => opt.isCorrect)) {
                throw new Error(`MCQ Question "${q.questionText.substring(0,30)}..." in quiz "${quiz.title}" must have at least one correct option.`);
            }
          }
        });
        return quiz;
      });

      onImport(validatedQuizzes);
      toast({ title: "Import Successful", description: `${validatedQuizzes.length} quizzes imported.` });
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
          <DialogTitle>Bulk Import Quizzes</DialogTitle>
          <DialogDescription>
            Paste your quiz data in JSON format below. Refer to the expected format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto pr-2">
          <div>
            <Label htmlFor="jsonImport">JSON Data</Label>
            <Textarea
              id="jsonImport"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON array of quizzes here..."
              className="mt-1 min-h-[200px] font-mono text-xs"
            />
          </div>
          <div>
            <Label>Expected JSON Format</Label>
            <ScrollArea className="max-h-[200px] mt-1">
                <pre className="p-3 bg-muted/50 rounded-md text-xs overflow-x-auto">
                <code>{exampleFormat}</code>
                </pre>
            </ScrollArea>
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


export default function AdminQuizzesPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>(placeholderQuizzes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Partial<Quiz> | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);


  const columns = [
    { accessorKey: 'title', header: 'Title', cell: (item: Quiz) => <span className="truncate block max-w-xs font-medium">{item.title}</span> },
    { accessorKey: 'category', header: 'Category', cell: (item: Quiz) => item.category || 'N/A' },
    { accessorKey: 'questions', header: 'Questions', cell: (item: Quiz) => item.questions.length },
    { accessorKey: 'difficulty', header: 'Difficulty', cell: (item: Quiz) => <Badge variant={item.difficulty === 'hard' ? 'destructive' : item.difficulty === 'medium' ? 'secondary' : 'outline'} className="capitalize">{item.difficulty || 'N/A'}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: (item: Quiz) => <Badge variant={item.status === 'published' ? 'default' : item.status === 'draft' ? 'secondary' : 'outline'} className="capitalize">{item.status || 'N/A'}</Badge> },
  ];

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsFormOpen(true);
  };

  const handleDelete = (quizToDelete: Quiz) => {
     if (window.confirm(`Are you sure you want to delete this quiz: "${quizToDelete.title}"?`)) {
      setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
      toast({ title: "Quiz Deleted", description: "The quiz has been removed." });
    }
  };

  const handleSaveQuiz = (quizData: Quiz) => {
    const existingQuizIndex = quizzes.findIndex(q => q.id === quizData.id);
    if (existingQuizIndex > -1) {
      const updatedQuizzes = [...quizzes];
      updatedQuizzes[existingQuizIndex] = quizData;
      setQuizzes(updatedQuizzes);
      toast({ title: "Quiz Updated", description: `"${quizData.title}" has been updated.` });
    } else {
      setQuizzes([...quizzes, quizData]);
      toast({ title: "Quiz Added", description: `"${quizData.title}" has been added.` });
    }
    setEditingQuiz(null);
    setIsFormOpen(false);
  };
  
  const handleAddNew = () => {
    setEditingQuiz(null);
    setIsFormOpen(true);
  };

  const handleBulkImport = (importedQuizzes: Quiz[]) => {
    const updatedQuizzesMap = new Map(quizzes.map(q => [q.id, q]));
    importedQuizzes.forEach(iq => updatedQuizzesMap.set(iq.id, iq));
    setQuizzes(Array.from(updatedQuizzesMap.values()));
  };


  return (
    <>
      <PageHeader title={translations.quizzesManagement} description="Create, manage, and import quiz sets.">
        <Button onClick={() => setIsImportDialogOpen(true)} variant="outline" className="mr-2">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Import Quizzes
        </Button>
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
      <BulkImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleBulkImport}
      />
    </>
  );
}
