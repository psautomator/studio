
"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import type { GrammarLesson, LocaleString, GrammarExample, EmbeddedFillInTheBlankExercise, EmbeddedErrorSpottingExercise, SpeechLevel, Quiz, Word, EmbeddedExercise } from '@/types';
import { PlusCircle, Trash2, Eye, Sparkles, Loader2 } from 'lucide-react';
import { runFlow } from '@genkit-ai/next/client';
import { assistGrammarContent, type GrammarContentAssistInput } from '@/ai/flows/grammar-content-assist-flow';


const localeStringSchema = z.object({
  en: z.string().min(1, { message: "English content is required." }).or(z.literal('')), // Allow empty if AI will fill
  nl: z.string().min(1, { message: "Dutch content is required." }).or(z.literal('')), // Allow empty if AI will fill
}).refine(data => data.en || data.nl, {
    message: "At least one language (English or Dutch) must be provided for title and explanation, or use AI Assist.",
    path: ["en"], 
});


const grammarExampleSchema = z.object({
  id: z.string().optional(), 
  javanese: z.string().min(1, "Javanese sentence is required."),
  dutch: z.string().min(1, "Dutch translation is required."),
  speechLevel: z.enum(['ngoko', 'krama', 'madya', 'neutral', 'other']),
  audioUrl: z.string().url().optional().or(z.literal('')),
});

const embeddedFillInTheBlankExerciseSchema = z.object({
  id: z.string().optional(),
  type: z.literal('fill-in-the-blank'),
  javaneseSentenceWithPlaceholder: z.string().min(1, "Sentence with placeholder is required."),
  correctAnswer: z.string().min(1, "Correct answer is required."),
  hint: localeStringSchema.optional(),
});

const embeddedErrorSpottingExerciseSchema = z.object({
  id: z.string().optional(),
  type: z.literal('error-spotting'),
  incorrectSentence: localeStringSchema.refine(data => data.en || data.nl, { message: "Incorrect sentence in EN or NL is required."}),
  correctSentence: localeStringSchema.refine(data => data.en || data.nl, { message: "Correct sentence in EN or NL is required."}),
  hint: localeStringSchema.optional(),
});


const embeddedExerciseSchema = z.discriminatedUnion("type", [
  embeddedFillInTheBlankExerciseSchema,
  embeddedErrorSpottingExerciseSchema,
]);


const grammarLessonFormSchema = z.object({
  id: z.string().optional(),
  title: localeStringSchema,
  explanation: localeStringSchema,
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  category: z.string().min(1, "Category is required."),
  examples: z.array(grammarExampleSchema),
  relatedQuizIds: z.array(z.string()),
  relatedWordIds: z.array(z.string()),
  embeddedExercises: z.array(embeddedExerciseSchema),
  status: z.enum(['published', 'draft', 'archived']),
  imageUrl: z.string().url().optional().or(z.literal('')),
  lessonAudioUrl: z.string().url().optional().or(z.literal('')),
});

export type GrammarLessonFormValues = z.infer<typeof grammarLessonFormSchema>;

interface GrammarLessonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: GrammarLesson | null;
  onSave: (data: GrammarLessonFormValues) => void;
  allQuizzes: Quiz[];
  allWords: Word[];
}

export function GrammarLessonForm({
  open, onOpenChange, lesson, onSave, allQuizzes, allWords
}: GrammarLessonFormProps) {
  const { translations, language } = useLanguage();
  const { toast } = useToast();
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const speechLevels: SpeechLevel[] = ['ngoko', 'krama', 'madya', 'neutral', 'other'];
  const exerciseTypes: EmbeddedExercise['type'][] = ['fill-in-the-blank', 'error-spotting'];

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue, 
    getValues,
    watch
  } = useForm<GrammarLessonFormValues>({
    resolver: zodResolver(grammarLessonFormSchema),
    defaultValues: {
      id: undefined,
      title: { en: '', nl: '' },
      explanation: { en: '', nl: '' },
      level: 'Beginner',
      category: '',
      examples: [],
      relatedQuizIds: [],
      relatedWordIds: [],
      embeddedExercises: [],
      status: 'draft',
      imageUrl: '',
      lessonAudioUrl: '',
    },
  });

  const { fields: exampleFields, append: appendExample, remove: removeExample } = useFieldArray({
    control,
    name: "examples",
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: "embeddedExercises",
  });

  useEffect(() => {
    if (lesson) {
      reset({
        ...lesson,
        id: lesson.id, 
        relatedQuizIds: lesson.relatedQuizIds || [],
        relatedWordIds: lesson.relatedWordIds || [],
        embeddedExercises: lesson.embeddedExercises || [],
      });
    } else {
      reset({ 
        id: undefined, 
        title: { en: '', nl: '' },
        explanation: { en: '', nl: '' },
        level: 'Beginner',
        category: '',
        examples: [],
        relatedQuizIds: [],
        relatedWordIds: [],
        embeddedExercises: [],
        status: 'draft',
        imageUrl: '',
        lessonAudioUrl: '',
      });
    }
  }, [lesson, reset, open]);

  const handleAiAssist = async () => {
    setIsAiProcessing(true);
    const currentData = getValues();
    const input: GrammarContentAssistInput = {
        titleEn: currentData.title.en,
        titleNl: currentData.title.nl,
        explanationEn: currentData.explanation.en,
        explanationNl: currentData.explanation.nl,
        category: currentData.category,
        level: currentData.level,
    };

    try {
        const result = await runFlow(assistGrammarContent, input);
        setValue('title.en', result.assistedTitleEn);
        setValue('title.nl', result.assistedTitleNl);
        setValue('explanation.en', result.assistedExplanationEn);
        setValue('explanation.nl', result.assistedExplanationNl);
        toast({
            title: translations.aiAssistComplete || "AI Assistance Complete",
            description: result.feedbackMessage || "Content has been processed by AI.",
        });
    } catch (error) {
        console.error("AI Assist Error:", error);
        toast({
            title: translations.aiAssistError || "AI Assist Error",
            description: (error as Error).message || "Could not process content with AI.",
            variant: "destructive",
        });
    } finally {
        setIsAiProcessing(false);
    }
  };

  const processSubmit: SubmitHandler<GrammarLessonFormValues> = (data) => {
    if (!data.title.en && !data.title.nl) {
      toast({ title: "Validation Error", description: "Please provide a title in at least one language or use AI Assist.", variant: "destructive"});
      return;
    }
    if (!data.explanation.en && !data.explanation.nl) {
      toast({ title: "Validation Error", description: "Please provide an explanation in at least one language or use AI Assist.", variant: "destructive"});
      return;
    }
    onSave(data); 
    onOpenChange(false);
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(processSubmit)();
  }
  
  const handleSaveDraft = () => {
    setValue('status', 'draft');
    handleSubmit(processSubmit)();
  }

  const handleAddNewExercise = (type: EmbeddedExercise['type']) => {
    if (type === 'fill-in-the-blank') {
      appendExercise({ id: `ee-new-${Date.now()}`, type: 'fill-in-the-blank', javaneseSentenceWithPlaceholder: '', correctAnswer: '', hint: {en: '', nl: ''}});
    } else if (type === 'error-spotting') {
      appendExercise({ id: `ee-new-${Date.now()}`, type: 'error-spotting', incorrectSentence: {en: '', nl: ''}, correctSentence: {en: '', nl: ''}, hint: {en: '', nl: ''}});
    }
  };

  const watchedRelatedQuizIds = watch("relatedQuizIds");
  const watchedRelatedWordIds = watch("relatedWordIds");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
                <DialogTitle>{lesson ? translations.editLesson : translations.addNewLesson}</DialogTitle>
                <DialogDescription>
                {lesson ? 'Modify lesson details.' : 'Enter details for the new grammar lesson.'}
                </DialogDescription>
            </div>
            <Button onClick={handleAiAssist} variant="outline" size="sm" disabled={isAiProcessing}>
                {isAiProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                {translations.aiAssistContent || "AI Assist Content"}
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-200px)] p-1">
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 p-4 pr-6">
            <Tabs defaultValue="en">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">{translations.english || "English"}</TabsTrigger>
                <TabsTrigger value="nl">{translations.dutch || "Dutch"}</TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="space-y-3 pt-3">
                <div>
                  <Label htmlFor="title.en">{translations.lessonTitle} (EN)</Label>
                  <Input id="title.en" {...register("title.en")} />
                  {errors.title?.en && <p className="text-sm text-destructive mt-1">{errors.title.en.message}</p>}
                   {errors.title?.root && <p className="text-sm text-destructive mt-1">{errors.title.root.message}</p>}
                </div>
                <div>
                  <Label htmlFor="explanation.en">{translations.lessonExplanation} (EN) - Note: Use Markdown for formatting.</Label>
                  <Textarea id="explanation.en" {...register("explanation.en")} rows={8} placeholder="Enter rich text explanation in English..."/>
                  {errors.explanation?.en && <p className="text-sm text-destructive mt-1">{errors.explanation.en.message}</p>}
                  {errors.explanation?.root && <p className="text-sm text-destructive mt-1">{errors.explanation.root.message}</p>}
                </div>
              </TabsContent>
              <TabsContent value="nl" className="space-y-3 pt-3">
                 <div>
                  <Label htmlFor="title.nl">{translations.lessonTitle} (NL)</Label>
                  <Input id="title.nl" {...register("title.nl")} />
                  {errors.title?.nl && <p className="text-sm text-destructive mt-1">{errors.title.nl.message}</p>}
                </div>
                <div>
                  <Label htmlFor="explanation.nl">{translations.lessonExplanation} (NL) - Note: Use Markdown for formatting.</Label>
                  <Textarea id="explanation.nl" {...register("explanation.nl")} rows={8} placeholder="Voer hier de Nederlandse uitleg in..."/>
                  {errors.explanation?.nl && <p className="text-sm text-destructive mt-1">{errors.explanation.nl.message}</p>}
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">{translations.lessonCategory}</Label>
                <Input id="category" {...register("category")} />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="level">{translations.lessonLevel}</Label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder={translations.selectLevel} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">{translations.beginner || "Beginner"}</SelectItem>
                        <SelectItem value="Intermediate">{translations.intermediate || "Intermediate"}</SelectItem>
                        <SelectItem value="Advanced">{translations.advanced || "Advanced"}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.level && <p className="text-sm text-destructive mt-1">{errors.level.message}</p>}
              </div>
              <div>
                <Label htmlFor="status">{translations.lessonStatus}</Label>
                 <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder={translations.selectStatus} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{translations.draft || "Draft"}</SelectItem>
                        <SelectItem value="published">{translations.published || "Published"}</SelectItem>
                        <SelectItem value="archived">{translations.archived || "Archived"}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </div>
            </div>

            <div>
                <Label htmlFor="imageUrl">{translations.lessonImageURL || "Lesson Image URL (optional)"}</Label>
                <Input id="imageUrl" type="url" {...register("imageUrl")} placeholder="https://placehold.co/600x400.png" />
                {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
            </div>
            <div>
                <Label htmlFor="lessonAudioUrl">{translations.lessonAudioURL || "Lesson Audio URL (optional)"}</Label>
                <Input id="lessonAudioUrl" type="url" {...register("lessonAudioUrl")} placeholder="https://example.com/audio.mp3"/>
                {errors.lessonAudioUrl && <p className="text-sm text-destructive mt-1">{errors.lessonAudioUrl.message}</p>}
            </div>

            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="text-lg font-medium">{translations.lessonExamples}</h3>
              {exampleFields.map((field, index) => (
                <div key={field.id} className="space-y-3 p-3 border rounded bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`examples.${index}.javanese`}>{translations.exampleJavanese}</Label>
                      <Input {...register(`examples.${index}.javanese`)} />
                      {errors.examples?.[index]?.javanese && <p className="text-sm text-destructive mt-1">{errors.examples[index]?.javanese?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`examples.${index}.dutch`}>{translations.exampleDutch}</Label>
                      <Input {...register(`examples.${index}.dutch`)} />
                       {errors.examples?.[index]?.dutch && <p className="text-sm text-destructive mt-1">{errors.examples[index]?.dutch?.message}</p>}
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`examples.${index}.speechLevel`}>{translations.exampleSpeechLevel}</Label>
                      <Controller
                        name={`examples.${index}.speechLevel`}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Select onValueChange={controllerField.onChange} value={controllerField.value}>
                            <SelectTrigger><SelectValue placeholder={translations.selectSpeechLevel} /></SelectTrigger>
                            <SelectContent>
                              {speechLevels.map(sl => <SelectItem key={sl} value={sl}>{translations[sl.toLowerCase() as keyof typeof translations] || sl}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.examples?.[index]?.speechLevel && <p className="text-sm text-destructive mt-1">{errors.examples[index]?.speechLevel?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`examples.${index}.audioUrl`}>{translations.audioURL} (optional)</Label>
                      <Input type="url" {...register(`examples.${index}.audioUrl`)} placeholder="https://example.com/example.mp3"/>
                      {errors.examples?.[index]?.audioUrl && <p className="text-sm text-destructive mt-1">{errors.examples[index]?.audioUrl?.message}</p>}
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeExample(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                    <Trash2 className="mr-1 h-4 w-4" /> {translations.removeExample}
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendExample({ id: `ex-new-${Date.now()}`, javanese: '', dutch: '', speechLevel: 'neutral', audioUrl: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> {translations.addExample}
              </Button>
            </div>

            <div className="space-y-2 border p-4 rounded-md">
              <h3 className="text-lg font-medium">{translations.attachQuizzes}</h3>
              {allQuizzes.length > 0 ? (
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                  {allQuizzes.map(quiz => (
                    <div key={quiz.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`quiz-${quiz.id}`}
                        checked={(watchedRelatedQuizIds || []).includes(quiz.id)}
                        onCheckedChange={(checked) => {
                          const currentIds = getValues("relatedQuizIds") || [];
                          if (checked) {
                            setValue("relatedQuizIds", [...currentIds, quiz.id]);
                          } else {
                            setValue("relatedQuizIds", currentIds.filter(id => id !== quiz.id));
                          }
                        }}
                      />
                      <Label htmlFor={`quiz-${quiz.id}`} className="font-normal">{quiz.title} <span className="text-xs text-muted-foreground">({quiz.difficulty}, {quiz.questions.length} questions)</span></Label>
                       <Button type="button" variant="ghost" size="sm" onClick={() => toast({title: translations.preview, description: `Previewing quiz: ${quiz.title}`})}>
                        <Eye className="h-4 w-4"/>
                      </Button>
                    </div>
                  ))}
                  </div>
                </ScrollArea>
              ) : <p className="text-sm text-muted-foreground">{translations.noQuizzesAvailable}</p>}
            </div>

             <div className="space-y-2 border p-4 rounded-md">
              <h3 className="text-lg font-medium">{translations.attachWords}</h3>
               {allWords.length > 0 ? (
                <ScrollArea className="h-32">
                   <div className="space-y-1">
                  {allWords.map(word => (
                    <div key={word.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`word-${word.id}`}
                        checked={(watchedRelatedWordIds || []).includes(word.id)}
                        onCheckedChange={(checked) => {
                          const currentIds = getValues("relatedWordIds") || [];
                          if (checked) {
                            setValue("relatedWordIds", [...currentIds, word.id]);
                          } else {
                            setValue("relatedWordIds", currentIds.filter(id => id !== word.id));
                          }
                        }}
                      />
                      <Label htmlFor={`word-${word.id}`} className="font-normal">{word.javanese} - {word.dutch} <span className="text-xs text-muted-foreground">({word.level})</span></Label>
                       <Button type="button" variant="ghost" size="sm" onClick={() => toast({title: translations.preview, description: `Previewing word: ${word.javanese}`})}>
                        <Eye className="h-4 w-4"/>
                      </Button>
                    </div>
                  ))}
                  </div>
                </ScrollArea>
              ) : <p className="text-sm text-muted-foreground">{translations.noWordsAvailable}</p>}
            </div>

            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="text-lg font-medium">{translations.embedExercises}</h3>
              {exerciseFields.map((field, index) => (
                <div key={field.id} className="space-y-3 p-3 border rounded bg-muted/30">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      {field.type === 'fill-in-the-blank' ? translations.fillInTheBlankExercise : translations.errorSpottingExercise} #{index + 1}
                    </h4>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeExercise(index)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                      <Trash2 className="mr-1 h-4 w-4" /> {translations.removeExercise}
                    </Button>
                  </div>
                  
                  {field.type === 'fill-in-the-blank' && (
                    <>
                      <div>
                        <Label htmlFor={`embeddedExercises.${index}.javaneseSentenceWithPlaceholder`}>{translations.sentenceWithPlaceholder}</Label>
                        <Input {...register(`embeddedExercises.${index}.javaneseSentenceWithPlaceholder` as const)} />
                        {errors.embeddedExercises?.[index]?.javaneseSentenceWithPlaceholder && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.javaneseSentenceWithPlaceholder?.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor={`embeddedExercises.${index}.correctAnswer`}>{translations.correctAnswerForBlank}</Label>
                        <Input {...register(`embeddedExercises.${index}.correctAnswer` as const)} />
                         {errors.embeddedExercises?.[index]?.correctAnswer && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.correctAnswer?.message}</p>}
                      </div>
                      <Tabs defaultValue="en-hint">
                        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="en-hint">Hint (EN)</TabsTrigger><TabsTrigger value="nl-hint">Hint (NL)</TabsTrigger></TabsList>
                        <TabsContent value="en-hint" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.hint.en`}>{translations.hintForBlank} (EN)</Label>
                          <Input {...register(`embeddedExercises.${index}.hint.en` as const)} />
                        </TabsContent>
                        <TabsContent value="nl-hint" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.hint.nl`}>{translations.hintForBlank} (NL)</Label>
                          <Input {...register(`embeddedExercises.${index}.hint.nl` as const)} />
                        </TabsContent>
                      </Tabs>
                    </>
                  )}

                  {field.type === 'error-spotting' && (
                    <>
                      <Tabs defaultValue="en-incorrect">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="en-incorrect">{translations.incorrectSentenceLabel} (EN)</TabsTrigger>
                          <TabsTrigger value="nl-incorrect">{translations.incorrectSentenceLabel} (NL)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="en-incorrect" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.incorrectSentence.en`}>{translations.incorrectSentenceLabel} (EN)</Label>
                          <Textarea {...register(`embeddedExercises.${index}.incorrectSentence.en` as const)} />
                          {errors.embeddedExercises?.[index]?.incorrectSentence?.en && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.incorrectSentence?.en?.message}</p>}
                           {errors.embeddedExercises?.[index]?.incorrectSentence?.root && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.incorrectSentence?.root?.message}</p>}
                        </TabsContent>
                        <TabsContent value="nl-incorrect" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.incorrectSentence.nl`}>{translations.incorrectSentenceLabel} (NL)</Label>
                          <Textarea {...register(`embeddedExercises.${index}.incorrectSentence.nl` as const)} />
                           {errors.embeddedExercises?.[index]?.incorrectSentence?.nl && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.incorrectSentence?.nl?.message}</p>}
                        </TabsContent>
                      </Tabs>
                       <Tabs defaultValue="en-correct">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="en-correct">{translations.correctSentenceLabel} (EN)</TabsTrigger>
                          <TabsTrigger value="nl-correct">{translations.correctSentenceLabel} (NL)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="en-correct" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.correctSentence.en`}>{translations.correctSentenceLabel} (EN)</Label>
                          <Textarea {...register(`embeddedExercises.${index}.correctSentence.en` as const)} />
                          {errors.embeddedExercises?.[index]?.correctSentence?.en && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.correctSentence?.en?.message}</p>}
                          {errors.embeddedExercises?.[index]?.correctSentence?.root && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.correctSentence?.root?.message}</p>}
                        </TabsContent>
                        <TabsContent value="nl-correct" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.correctSentence.nl`}>{translations.correctSentenceLabel} (NL)</Label>
                          <Textarea {...register(`embeddedExercises.${index}.correctSentence.nl` as const)} />
                          {errors.embeddedExercises?.[index]?.correctSentence?.nl && <p className="text-sm text-destructive mt-1">{(errors.embeddedExercises[index] as any)?.correctSentence?.nl?.message}</p>}
                        </TabsContent>
                      </Tabs>
                      <Tabs defaultValue="en-hint-spotting">
                        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="en-hint-spotting">{translations.hintOptional} (EN)</TabsTrigger><TabsTrigger value="nl-hint-spotting">{translations.hintOptional} (NL)</TabsTrigger></TabsList>
                        <TabsContent value="en-hint-spotting" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.hint.en`}>{translations.hintOptional} (EN)</Label>
                          <Input {...register(`embeddedExercises.${index}.hint.en` as const)} />
                        </TabsContent>
                        <TabsContent value="nl-hint-spotting" className="pt-2">
                          <Label htmlFor={`embeddedExercises.${index}.hint.nl`}>{translations.hintOptional} (NL)</Label>
                          <Input {...register(`embeddedExercises.${index}.hint.nl` as const)} />
                        </TabsContent>
                      </Tabs>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => handleAddNewExercise('fill-in-the-blank')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {translations.addExercise} ({translations.fillInTheBlankExercise})
                </Button>
                <Button type="button" variant="outline" onClick={() => handleAddNewExercise('error-spotting')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {translations.addExercise} ({translations.errorSpottingExercise})
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">{translations.cancel}</Button>
              </DialogClose>
              <Button type="button" variant="secondary" onClick={handleSaveDraft}>{translations.saveDraft}</Button>
              <Button type="button" onClick={handlePublish}>{translations.publish}</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
