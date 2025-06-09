"use client";

import { useState } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { runFlow } from '@genkit-ai/next/client';
import { generateAdaptiveLearningGoals, type AdaptiveLearningGoalsOutput } from '@/ai/flows/adaptive-learning-goals';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target } from 'lucide-react';

const goalsSchema = z.object({
  learningProgress: z.string().min(10, "Please provide more details about your progress."),
  preferredLearningStyle: z.string().optional(),
  timeAvailable: z.string().optional(),
});

type GoalsFormValues = z.infer<typeof goalsSchema>;

export default function GoalsPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [goalsOutput, setGoalsOutput] = useState<AdaptiveLearningGoalsOutput | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<GoalsFormValues>({
    resolver: zodResolver(goalsSchema),
  });

  const onSubmit: SubmitHandler<GoalsFormValues> = async (data) => {
    setIsLoading(true);
    setGoalsOutput(null);
    try {
      const result = await runFlow(generateAdaptiveLearningGoals, {
        learningProgress: data.learningProgress,
        ...(data.preferredLearningStyle && { preferredLearningStyle: data.preferredLearningStyle }),
        ...(data.timeAvailable && { timeAvailable: data.timeAvailable }),
      });
      setGoalsOutput(result);
    } catch (error) {
      console.error("Error generating goals:", error);
      toast({
        title: "Error",
        description: translations.errorGeneratingGoals,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainAppLayout>
      <PageHeader title={translations.goals} description="Get personalized daily learning goals." />
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Your Learning Input</CardTitle>
            <CardDescription>Help us tailor your goals by providing some information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="learningProgress" className="font-semibold">{translations.learningProgress}</Label>
                <Textarea
                  id="learningProgress"
                  {...register("learningProgress")}
                  placeholder="e.g., Completed Chapter 1, scored 70% on vocab quiz, struggling with past tense..."
                  className="mt-1 min-h-[120px]"
                  aria-invalid={errors.learningProgress ? "true" : "false"}
                />
                {errors.learningProgress && <p className="text-sm text-destructive mt-1">{errors.learningProgress.message}</p>}
              </div>
              <div>
                <Label htmlFor="preferredLearningStyle">{translations.preferredLearningStyle}</Label>
                <Input
                  id="preferredLearningStyle"
                  {...register("preferredLearningStyle")}
                  placeholder="e.g., Visual, Auditory, Kinesthetic, Reading/Writing"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="timeAvailable">{translations.timeAvailable}</Label>
                <Input
                  id="timeAvailable"
                  {...register("timeAvailable")}
                  placeholder="e.g., 30 minutes, 1 hour"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Target className="mr-2 h-4 w-4" />
                )}
                {isLoading ? translations.loadingGoals : translations.generateGoals}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">{translations.dailyGoals}</CardTitle>
            <CardDescription>Your AI-generated plan for today.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="mt-4 text-muted-foreground">{translations.loadingGoals}</p>
              </div>
            )}
            {!isLoading && goalsOutput && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <h3 className="font-semibold text-primary mb-1">Summary:</h3>
                  <p className="text-sm">{goalsOutput.progress}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Goals:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {goalsOutput.dailyGoals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">{translations.explanation}:</h3>
                  <p className="text-sm text-muted-foreground">{goalsOutput.explanation}</p>
                </div>
              </div>
            )}
            {!isLoading && !goalsOutput && (
              <div className="flex flex-col items-center justify-center h-full">
                <Target className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground text-center">{translations.noGoalsGenerated}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainAppLayout>
  );
}
