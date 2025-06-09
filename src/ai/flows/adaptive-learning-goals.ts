
'use server';
/**
 * @fileOverview An AI flow to generate adaptive learning goals for a Javanese language learner.
 *
 * - generateAdaptiveLearningGoals - A function that creates personalized daily learning goals.
 * - AdaptiveLearningGoalsInput - The input type for the function.
 * - AdaptiveLearningGoalsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveLearningGoalsInputSchema = z.object({
  learningProgress: z.string().describe("A summary of the user's current learning progress, including topics covered, strengths, and weaknesses."),
  preferredLearningStyle: z.string().optional().describe("The user's preferred learning style (e.g., visual, auditory, kinesthetic, reading/writing)."),
  timeAvailable: z.string().optional().describe("The amount of time the user has available for learning today (e.g., '30 minutes', '1 hour')."),
  languageLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner').optional().describe("The user's overall Javanese language proficiency level."),
  recentScores: z.array(z.object({ quizName: z.string(), score: z.number() })).optional().describe("Scores from recent quizzes, if available."),
  targetLanguage: z.enum(['en', 'nl']).default('en').describe("The language in which the goals should be generated.")
});
export type AdaptiveLearningGoalsInput = z.infer<typeof AdaptiveLearningGoalsInputSchema>;

const AdaptiveLearningGoalsOutputSchema = z.object({
  dailyGoals: z.array(z.string()).describe("A list of 2-4 specific, actionable learning goals for the day."),
  explanation: z.string().describe("A brief explanation of why these goals were chosen based on the input progress."),
  progressSummary: z.string().optional().describe("A short, encouraging summary of the user's progress to be displayed alongside the goals."),
});
export type AdaptiveLearningGoalsOutput = z.infer<typeof AdaptiveLearningGoalsOutputSchema>;

export async function generateAdaptiveLearningGoals(input: AdaptiveLearningGoalsInput): Promise<AdaptiveLearningGoalsOutput> {
  return adaptiveLearningGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveLearningGoalsPrompt',
  input: {schema: AdaptiveLearningGoalsInputSchema},
  output: {schema: AdaptiveLearningGoalsOutputSchema},
  prompt: `You are an AI language learning assistant for "Javanese Journey", an app to learn Javanese.
Your task is to generate 2-4 personalized daily learning goals for a user.
The goals should be in {{targetLanguage}}.

User's Current Learning Progress:
{{{learningProgress}}}

Preferred Learning Style: {{{preferredLearningStyle}}}
Time Available Today: {{{timeAvailable}}}
Current Language Level: {{{languageLevel}}}
{{#if recentScores}}
Recent Quiz Scores:
{{#each recentScores}}
- {{this.quizName}}: {{this.score}}%
{{/each}}
{{/if}}

Based on this information:
1.  Create 2-4 specific, actionable, and achievable daily learning goals.
    Focus on areas that need improvement or build upon recent successes.
    If time available is short, suggest fewer or smaller goals.
    Tailor goals to the user's level (Beginner, Intermediate, Advanced).
    Examples for Beginner: "Learn 5 new Javanese words for common foods.", "Practice introducing yourself in Ngoko Javanese."
    Examples for Intermediate: "Review Krama versions of 5 verbs you know in Ngoko.", "Try to form 3 sentences using the passive voice."
2.  Provide a brief explanation (1-2 sentences) for why these goals were chosen.
3.  Provide a short (1 sentence) encouraging progress summary. If progress is good, be positive. If there are struggles, be encouraging and suggest focus.

Return the output in the specified JSON format.
Goals should be concise and clear.
The progress summary should be motivating.
`,
});

const adaptiveLearningGoalsFlow = ai.defineFlow(
  {
    name: 'adaptiveLearningGoalsFlow',
    inputSchema: AdaptiveLearningGoalsInputSchema,
    outputSchema: AdaptiveLearningGoalsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate adaptive learning goals.');
    }
    return {
        dailyGoals: output.dailyGoals || ["Review today's lesson.", "Practice one new phrase."],
        explanation: output.explanation || "These goals are designed to help you make steady progress.",
        progressSummary: output.progressSummary || "Keep up the great work!",
    };
  }
);
