
'use server';
/**
 * @fileOverview An AI flow to assist with generating and refining grammar lesson content.
 *
 * - assistGrammarContent - A function that takes partial lesson content and returns AI-assisted suggestions.
 * - GrammarContentAssistInput - The input type for the assistGrammarContent function.
 * - GrammarContentAssistOutput - The return type for the assistGrammarContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrammarContentAssistInputSchema = z.object({
  titleEn: z.string().optional().describe('Partial or existing title in English.'),
  titleNl: z.string().optional().describe('Partial or existing title in Dutch.'),
  explanationEn: z.string().optional().describe('Partial or existing explanation in English. Markdown can be used.'),
  explanationNl: z.string().optional().describe('Partial or existing explanation in Dutch. Markdown can be used.'),
  category: z.string().optional().describe('The category of the grammar lesson, e.g., "Pronouns", "Tenses".'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional().describe('The difficulty level of the lesson.'),
});
export type GrammarContentAssistInput = z.infer<typeof GrammarContentAssistInputSchema>;

const GrammarContentAssistOutputSchema = z.object({
  assistedTitleEn: z.string().describe('The AI-assisted or completed title in English.'),
  assistedTitleNl: z.string().describe('The AI-assisted or completed title in Dutch.'),
  assistedExplanationEn: z.string().describe('The AI-assisted or completed explanation in English, formatted in Markdown.'),
  assistedExplanationNl: z.string().describe('The AI-assisted or completed explanation in Dutch, formatted in Markdown.'),
  feedbackMessage: z.string().optional().describe('A brief message from the AI about the assistance provided.'),
});
export type GrammarContentAssistOutput = z.infer<typeof GrammarContentAssistOutputSchema>;

export async function assistGrammarContent(input: GrammarContentAssistInput): Promise<GrammarContentAssistOutput> {
  return grammarContentAssistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'grammarContentAssistPrompt',
  input: {schema: GrammarContentAssistInputSchema},
  output: {schema: GrammarContentAssistOutputSchema},
  prompt: `You are an expert Javanese language curriculum developer.
Your task is to assist with creating and refining content for grammar lessons.
The user will provide partial or existing lesson titles and explanations in English and/or Dutch.
They may also provide a category (e.g., "{{category}}") and level (e.g., "{{level}}").

Based on the input:
1.  If a title is provided, refine it or suggest a better one. If not, create an appropriate title.
2.  If an explanation is provided, review, expand, or rephrase it for clarity, accuracy, and completeness, ensuring it's suitable for language learners. Use Markdown for formatting (headings, lists, bolding). If no explanation is provided, generate one based on the title, category, and level.
3.  Provide versions for both English and Dutch. If one language is missing input, generate content for that language based on the provided language.
4.  Ensure the content is pedagogically sound.
5.  Include a brief feedback message summarizing the assistance provided.

Existing English Title: {{{titleEn}}}
Existing Dutch Title: {{{titleNl}}}
Existing English Explanation:
{{{explanationEn}}}
Existing Dutch Explanation:
{{{explanationNl}}}
Lesson Category: {{{category}}}
Lesson Level: {{{level}}}

Return the completed/assisted titles and explanations in the specified output format.
Keep explanations concise yet comprehensive. If generating from scratch, ensure the titles and explanations are distinct and appropriate for the implied topic.
If very little input is given (e.g. only a category), try to create a foundational lesson for that category.
The user is creating content for an app called "Javanese Journey".
Focus on providing complete values for 'assistedTitleEn', 'assistedTitleNl', 'assistedExplanationEn', and 'assistedExplanationNl'.
Example explanation structure: Start with a concise definition, then provide examples, and then key differences or usage notes.
Make sure the explanations are suitable for the given level. For 'Beginner', keep it very simple.
`,
});

const grammarContentAssistFlow = ai.defineFlow(
  {
    name: 'grammarContentAssistFlow',
    inputSchema: GrammarContentAssistInputSchema,
    outputSchema: GrammarContentAssistOutputSchema,
  },
  async (input) => {
    // If only category is provided, slightly adjust the input to guide the AI better.
    let enrichedInput = { ...input };
    if (input.category && !input.titleEn && !input.titleNl && !input.explanationEn && !input.explanationNl) {
        enrichedInput.titleEn = `Introduction to ${input.category}`;
        enrichedInput.titleNl = `Introductie tot ${input.category}`;
    }


    const {output} = await prompt(enrichedInput);
    if (!output) {
      throw new Error('AI failed to generate content.');
    }
    // Ensure all required fields are present, even if AI might sometimes omit them.
    return {
        assistedTitleEn: output.assistedTitleEn || input.titleEn || "AI Generated Title EN",
        assistedTitleNl: output.assistedTitleNl || input.titleNl || "AI Gegenereerde Titel NL",
        assistedExplanationEn: output.assistedExplanationEn || input.explanationEn || "AI generated explanation for English.",
        assistedExplanationNl: output.assistedExplanationNl || input.explanationNl || "AI gegenereerde uitleg voor Nederlands.",
        feedbackMessage: output.feedbackMessage || "Content generated by AI.",
    };
  }
);
