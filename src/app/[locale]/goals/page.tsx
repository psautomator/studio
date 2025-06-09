
"use client";

import { useState, useEffect } from 'react';
import { MainAppLayout } from '@/components/layout/main-app-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Added Input for timeAvailable
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Target, Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import type { LearningGoal } from '@/types';
import { placeholderUser } from '@/lib/placeholder-data';
import { runFlow } from '@genkit-ai/next/client';
import { generateAdaptiveLearningGoals, type AdaptiveLearningGoalsInput, type AdaptiveLearningGoalsOutput } from '@/ai/flows/adaptive-learning-goals';
import { useToast } from '@/hooks/use-toast';

export default function GoalsPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [activeGoals, setActiveGoals] = useState<LearningGoal[]>(placeholderUser.activeLearningGoals || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [learningProgress, setLearningProgress] = useState(
    "Completed beginner greetings and basic pronouns. Scored 75% on the last vocabulary quiz. Struggling a bit with Krama speech level."
  );
  const [preferredLearningStyle, setPreferredLearningStyle] = useState(placeholderUser.learningPreferences?.preferredStyle || 'Visual');
  const [timeAvailable, setTimeAvailable] = useState(placeholderUser.learningPreferences?.dailyGoalMinutes?.toString() || '30 minutes');
  const [aiGeneratedOutput, setAiGeneratedOutput] = useState<AdaptiveLearningGoalsOutput | null>(null);

  const handleGenerateGoals = async () => {
    setIsLoading(true);
    setError(null);
    setAiGeneratedOutput(null);

    const input: AdaptiveLearningGoalsInput = {
      learningProgress,
      preferredLearningStyle: preferredLearningStyle || undefined,
      timeAvailable: timeAvailable || undefined,
    };

    try {
      const result = await runFlow(generateAdaptiveLearningGoals, input);
      setAiGeneratedOutput(result);
      // Update activeGoals with the new goals from AI, converting them to LearningGoal type
      const newGoals: LearningGoal[] = result.dailyGoals.map((goalText, index) => ({
        id: `ai-goal-${Date.now()}-${index}`,
        text: goalText,
        isCompleted: false,
        createdAt: new Date(),
      }));
      setActiveGoals(newGoals); // Replace existing goals with new AI-generated ones for this demo

      toast({
        title: translations.goalsGenerated || "New Goals Generated!",
        description: translations.aiGoalsSuccess || "Your personalized learning goals have been created.",
      });
    } catch (err) {
      console.error("Error generating goals:", err);
      setError(translations.errorGeneratingGoals || "Could not generate goals. Please try again.");
      toast({
        title: translations.errorGeneratingGoals || "Error Generating Goals",
        description: (err as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleGoalCompletion = (goalId: string) => {
    setActiveGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId ? { ...goal, isCompleted: !goal.isCompleted } : goal
      )
    );
    toast({ title: translations.goalUpdated || "Goal status updated!"});
  };


  return (
    <MainAppLayout>
      <PageHeader
        title={translations.goals || "Learning Goals"}
        description={translations.goalsDescription || "Set and track your daily Javanese learning objectives."}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              {translations.generateNewGoals || "Generate New Goals"}
            </CardTitle>
            <CardDescription>
              {translations.aiGoalGeneratorDesc || "Let our AI help you create personalized learning goals based on your progress and preferences."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="learningProgress">{translations.learningProgressSummary || "Your Learning Progress Summary"}</Label>
              <Textarea
                id="learningProgress"
                value={learningProgress}
                onChange={(e) => setLearningProgress(e.target.value)}
                placeholder={translations.learningProgressPlaceholder || "e.g., Finished Level 1, good with Ngoko, need Krama practice."}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="preferredLearningStyle">{translations.preferredLearningStyle || "Preferred Learning Style (optional)"}</Label>
              <Input
                id="preferredLearningStyle"
                value={preferredLearningStyle}
                onChange={(e) => setPreferredLearningStyle(e.target.value)}
                placeholder={translations.learningStylePlaceholder || "e.g., Visual, Auditory, Kinesthetic"}
              />
            </div>
            <div>
              <Label htmlFor="timeAvailable">{translations.timeAvailable || "Time Available Today (optional)"}</Label>
              <Input
                id="timeAvailable"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                placeholder={translations.timeAvailablePlaceholder || "e.g., 30 minutes, 1 hour"}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateGoals} disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {translations.generateGoals || "Generate Goals"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Target className="mr-2 h-5 w-5" />
              {translations.currentLearningGoals || "Current Learning Goals"}
            </CardTitle>
             <CardDescription>
              {aiGeneratedOutput?.progress || (translations.yourPersonalizedTasks || "Your personalized tasks for today.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !aiGeneratedOutput && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">{translations.loadingGoals || "Generating your personalized goals..."}</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>{translations.error || "Error"}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && activeGoals.length === 0 && !aiGeneratedOutput && (
              <p className="text-muted-foreground text-center py-4">
                {translations.noGoalsYet || "No goals set yet. Generate some with AI or add them manually (feature coming soon)!"}
              </p>
            )}
            {aiGeneratedOutput && !isLoading && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground italic">
                  <Lightbulb className="inline h-4 w-4 mr-1 text-accent" /> {aiGeneratedOutput.explanation}
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  {activeGoals.map((goal) => (
                    <li key={goal.id} className={`flex items-center justify-between p-2 rounded-md ${goal.isCompleted ? 'bg-green-100 dark:bg-green-900/30 line-through text-muted-foreground' : 'bg-background'}`}>
                      <span>{goal.text}</span>
                      <Button 
                        variant={goal.isCompleted ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => toggleGoalCompletion(goal.id)}
                      >
                        {goal.isCompleted ? (translations.markAsIncomplete || "Mark Incomplete") : (translations.markAsComplete || "Mark Complete")}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Display pre-existing or manually added goals if no AI output yet */}
            {!isLoading && !aiGeneratedOutput && activeGoals.length > 0 && (
                 <ul className="space-y-2 list-disc list-inside">
                  {activeGoals.map((goal) => (
                     <li key={goal.id} className={`flex items-center justify-between p-2 rounded-md ${goal.isCompleted ? 'bg-green-100 dark:bg-green-900/30 line-through text-muted-foreground' : 'bg-background'}`}>
                      <span>{goal.text}</span>
                       <Button 
                        variant={goal.isCompleted ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => toggleGoalCompletion(goal.id)}
                      >
                        {goal.isCompleted ? (translations.markAsIncomplete || "Mark Incomplete") : (translations.markAsComplete || "Mark Complete")}
                      </Button>
                    </li>
                  ))}
                </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </MainAppLayout>
  );
}
