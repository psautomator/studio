
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import type { Word, QuestionType, Quiz } from '@/types';
import { runFlow } from '@genkit-ai/next/client';
import { generateQuizForWord, type GenerateQuizForWordInput, type GenerateQuizForWordOutput } from '@/ai/flows/generate-quiz-for-word-flow';
import { Loader2, Sparkles, ClipboardCopy } from 'lucide-react';

interface GenerateQuizForWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: Word | null;
}

const ALL_QUESTION_TYPES: QuestionType[] = [
  'multiple-choice',
  'translation-word-to-dutch',
  'translation-sentence-to-dutch',
  'translation-word-to-javanese',
  'translation-sentence-to-javanese',
  'fill-in-the-blank-mcq',
  'fill-in-the-blank-text-input',
];

export function GenerateQuizForWordDialog({ open, onOpenChange, word }: GenerateQuizForWordDialogProps) {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('translation-word-to-dutch');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [generatedQuizJson, setGeneratedQuizJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setGeneratedQuizJson('');
      setSelectedQuestionType('translation-word-to-dutch');
      setSelectedDifficulty('easy');
    }
  }, [open]);

  const handleGenerateQuiz = async () => {
    if (!word) {
      toast({ title: "Error", description: "No word selected for quiz generation.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setGeneratedQuizJson('');

    const input: GenerateQuizForWordInput = {
      word: { // Ensure word structure matches flow input schema
        id: word.id,
        javanese: word.javanese,
        dutch: word.dutch,
        category: word.category,
        level: word.level,
        formality: word.formality,
        exampleSentenceJavanese: word.exampleSentenceJavanese,
        exampleSentenceDutch: word.exampleSentenceDutch,
      },
      targetQuestionType: selectedQuestionType,
      difficulty: selectedDifficulty,
    };

    try {
      const result: GenerateQuizForWordOutput = await runFlow(generateQuizForWord, input);
      setGeneratedQuizJson(result.quizJsonString);
      // Attempt to pretty-print the JSON for better readability in textarea
      try {
        const parsedJson = JSON.parse(result.quizJsonString);
        setGeneratedQuizJson(JSON.stringify(parsedJson, null, 2));
      } catch (e) {
        // If parsing fails, use the raw string
        setGeneratedQuizJson(result.quizJsonString);
      }
      toast({ title: "Quiz Generated!", description: result.feedbackMessage || "AI has generated a quiz." });
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Quiz Generation Failed",
        description: error.message || "Could not generate quiz using AI.",
        variant: "destructive",
      });
      setGeneratedQuizJson(`{\n  "error": "Failed to generate quiz: ${error.message}"\n}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedQuizJson) {
      navigator.clipboard.writeText(generatedQuizJson)
        .then(() => {
          toast({ title: "Copied!", description: "Quiz JSON copied to clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy JSON to clipboard.", variant: "destructive" });
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            Generate AI Quiz for: <span className="text-primary ml-1">{word?.javanese}</span>
          </DialogTitle>
          <DialogDescription>
            Select a question type and difficulty, then let AI generate a quiz JSON for this word.
            You can copy the JSON and use it in the 'Bulk Import Quizzes' feature.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto pr-2 flex-grow">
          {word && (
            <div className="p-3 bg-muted/50 rounded-md text-sm">
              <p><strong>Word:</strong> {word.javanese} ({word.dutch})</p>
              {word.category && <p><strong>Category:</strong> {word.category}</p>}
              {word.level && <p><strong>Level:</strong> {word.level}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="questionType">Question Type</Label>
              <Select value={selectedQuestionType} onValueChange={(value) => setSelectedQuestionType(value as QuestionType)}>
                <SelectTrigger id="questionType" className="mt-1">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_QUESTION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as 'easy' | 'medium' | 'hard')}>
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
          </div>

          <Button onClick={handleGenerateQuiz} disabled={isLoading || !word} className="w-full mt-2">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Quiz JSON
          </Button>

          {generatedQuizJson && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="quizJsonOutput">Generated Quiz JSON</Label>
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <ClipboardCopy className="mr-2 h-4 w-4" /> Copy JSON
                </Button>
              </div>
              <Textarea
                id="quizJsonOutput"
                value={generatedQuizJson}
                readOnly
                rows={10}
                className="font-mono text-xs bg-background"
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
