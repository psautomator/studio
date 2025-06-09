
// src/ai/flows/grammar-content-assist-flow.ts
'use server';
/**
 * @fileOverview AI assistant for grammar lesson content creation.
 * Provides proofreading for English and Dutch, and translation if one language is missing.
 *
 * - assistGrammarContent - The main flow function.
 * - GrammarContentAssistInput - Input type for the flow.
 * - GrammarContentAssistOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import { formatPrompt } from '@/lib/prompt-utils';
import {z} from 'genkit';

const GrammarContentAssistInputSchema = z.object({
  titleEn: z.string().optional().describe('The English title of the lesson.'),
  titleNl: z.string().optional().describe('The Dutch title of the lesson.'),
  explanationEn: z.string().optional().describe('The English explanation (Markdown).'),
  explanationNl: z.string().optional().describe('The Dutch explanation (Markdown).'),
});
export type GrammarContentAssistInput = z.infer<typeof GrammarContentAssistInputSchema>;

const GrammarContentAssistOutputSchema = z.object({
  assistedTitleEn: z.string().describe('Assisted English title (proofread or translated).'),
  assistedTitleNl: z.string().describe('Assisted Dutch title (proofread or translated).'),
  assistedExplanationEn: z.string().describe('Assisted English explanation (Markdown, proofread or translated).'),
  assistedExplanationNl: z.string().describe('Assisted Dutch explanation (Markdown, proofread or translated).'),
  feedbackMessage: z.string().optional().describe('A summary of actions taken by the AI.'),
});
export type GrammarContentAssistOutput = z.infer<typeof GrammarContentAssistOutputSchema>;

const grammarContentAssistPrompt = ai.definePrompt({
  name: 'grammarContentAssistPrompt',
  input: {schema: GrammarContentAssistInputSchema},
  output: {schema: GrammarContentAssistOutputSchema},
  prompt: `You are an AI assistant helping to create bilingual (English and Dutch) grammar lessons.
You will receive a lesson title and explanation, potentially in English, Dutch, both, or neither for each field.
Your tasks are:
1.  **Proofread & Correct**: For any text provided in English, correct grammar and spelling mistakes. Do the same for any text provided in Dutch.
2.  **Translate if Missing**:
    *   If an English field (title or explanation) is provided but its Dutch counterpart is missing or empty, translate the English content to Dutch for that field.
    *   If a Dutch field (title or explanation) is provided but its English counterpart is missing or empty, translate the Dutch content to English for that field.
    *   If both language versions are provided for a field, just proofread them.
    *   If neither language version is provided for a field (e.g., titleEn and titleNl are both empty), return an empty string for both assisted versions of that field.
3.  **Retain Markdown**: Ensure that the explanations remain in Markdown format after any processing.
4.  **Output Format**: Return the processed content in the specified JSON format.
    *   \`assistedTitleEn\` should contain the final English title.
    *   \`assistedTitleNl\` should contain the final Dutch title.
    *   \`assistedExplanationEn\` should contain the final English explanation.
    *   \`assistedExplanationNl\` should contain the final Dutch explanation.
    *   \`feedbackMessage\` should be a concise summary of the actions taken (e.g., "Proofread English and Dutch content.", "Translated Dutch explanation to English and proofread both fields.").

Input Data:
Title EN: <%= titleEn %>
Title NL: <%= titleNl %>
Explanation EN (Markdown):
\`\`\`markdown
<%= explanationEn %>
\`\`\`
Explanation NL (Markdown):
\`\`\`markdown
<%= explanationNl %> 
\`\`\`
`,
});

const grammarContentAssistFlow = ai.defineFlow(
  {
    name: "grammarContentAssistFlow",
    inputSchema: GrammarContentAssistInputSchema,
    outputSchema: GrammarContentAssistOutputSchema,
  },
  async (input) => {
    const {output} = await grammarContentAssistPrompt(input);
    if (!output) {
      throw new Error('AI assistant failed to generate content.');
    } 
    const renderedPrompt = formatPrompt(
      grammarContentAssistPrompt.prompt,
      input
    );
    const { output: llmOutput } = await ai.generate({ prompt: renderedPrompt });

    // Ensure all fields are present in the output, even if empty strings
    return {
      assistedTitleEn: output.assistedTitleEn || '',
      assistedTitleNl: output.assistedTitleNl || '',
      assistedExplanationEn: output.assistedExplanationEn || '',
      assistedExplanationNl: output.assistedExplanationNl || '',
      feedbackMessage: output.feedbackMessage || 'Content processed by AI.',
    };
  }
);

export async function assistGrammarContent(
  input: GrammarContentAssistInput
): Promise<GrammarContentAssistOutput> {
  return grammarContentAssistFlow(input);
}
