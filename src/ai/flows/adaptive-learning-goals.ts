// src/ai/flows/adaptive-learning-goals.ts
'use server';

/**
 * @fileOverview Adaptive learning goals generator.
 *
 * This file defines a Genkit flow that generates personalized daily learning goals for Javanese language learners.
 * It analyzes the learner's progress and suggests areas for improvement.
 *
 * @exports {
 *   generateAdaptiveLearningGoals,
 *   AdaptiveLearningGoalsInput,
 *   AdaptiveLearningGoalsOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the adaptive learning goals generator.
 */
const AdaptiveLearningGoalsInputSchema = z.object({
  learningProgress: z
    .string()
    .describe(
      'A summary of the learner\'s progress, including completed lessons, quiz scores, and areas of difficulty.'
    ),
  preferredLearningStyle: z
    .string()
    .optional()
    .describe('The learner\'s preferred learning style (e.g., visual, auditory, kinesthetic).'),
  timeAvailable: z
    .string()
    .optional()
    .describe('The amount of time the learner has available for studying today.'),
});

/**
 * Type definition for the input to the adaptive learning goals generator.
 */
export type AdaptiveLearningGoalsInput = z.infer<typeof AdaptiveLearningGoalsInputSchema>;

/**
 * Output schema for the adaptive learning goals generator.
 */
const AdaptiveLearningGoalsOutputSchema = z.object({
  dailyGoals: z.array(
    z.string().describe('A specific learning goal for the day.')
  ).describe('List of daily learning goals'),
  explanation: z.string().describe('Explanation of why these goals were chosen.'),
  progress: z.string().describe('A one-sentence summary of progress.')
});

/**
 * Type definition for the output of the adaptive learning goals generator.
 */
export type AdaptiveLearningGoalsOutput = z.infer<typeof AdaptiveLearningGoalsOutputSchema>;

/**
 * Flow definition for generating adaptive learning goals.
 */
const adaptiveLearningGoalsFlow = ai.defineFlow(
  {
    name: 'adaptiveLearningGoalsFlow',
    inputSchema: AdaptiveLearningGoalsInputSchema,
    outputSchema: AdaptiveLearningGoalsOutputSchema,
  },
  async input => {
    const {output} = await adaptiveLearningGoalsPrompt(input);
    return output!;
  }
);

/**
 * Prompt definition for generating adaptive learning goals.
 */
const adaptiveLearningGoalsPrompt = ai.definePrompt({
  name: 'adaptiveLearningGoalsPrompt',
  input: {schema: AdaptiveLearningGoalsInputSchema},
  output: {schema: AdaptiveLearningGoalsOutputSchema},
  prompt: `You are an AI learning assistant specializing in Javanese language education. Based on the learner's progress, preferred learning style, and time available, generate a set of personalized daily learning goals.

Learner Progress: {{{learningProgress}}}
Preferred Learning Style: {{{preferredLearningStyle}}}
Time Available: {{{timeAvailable}}}

Consider the learner's weaknesses and areas where they need the most improvement. Provide 3-5 specific and achievable learning goals for the day, along with a brief explanation of why these goals were chosen.

Output should be JSON in the following format:
{
  "dailyGoals": ["Goal 1", "Goal 2", "Goal 3"],
    "explanation": "Explanation of why these goals were chosen.",
    "progress": "A one-sentence summary of progress."
}
`,
});

/**
 * Wrapper function for the adaptive learning goals flow.
 */
export async function generateAdaptiveLearningGoals(
  input: AdaptiveLearningGoalsInput
): Promise<AdaptiveLearningGoalsOutput> {
  return adaptiveLearningGoalsFlow(input);
}
