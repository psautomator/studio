
'use server';
/**
 * @fileOverview An AI flow to generate a single-question quiz for a given Javanese word.
 *
 * - generateQuizForWord - A function that creates a quiz JSON string.
 * - GenerateQuizForWordInput - The input type for the function.
 * - GenerateQuizForWordOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Word as AppWordType, QuestionType } from '@/types'; // Use app's Word type

const WordSchema = z.object({
  id: z.string(),
  javanese: z.string(),
  dutch: z.string(),
  category: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  formality: z.enum(['ngoko', 'krama', 'madya']).optional(),
  exampleSentenceJavanese: z.string().optional(),
  exampleSentenceDutch: z.string().optional(),
});

const GenerateQuizForWordInputSchema = z.object({
  word: WordSchema.describe("The Javanese word object to create a quiz for."),
  targetQuestionType: z.enum([
    'multiple-choice',
    'translation-word-to-dutch',
    'translation-sentence-to-dutch',
    'translation-word-to-javanese',
    'translation-sentence-to-javanese',
    'fill-in-the-blank-mcq',
    'fill-in-the-blank-text-input',
  ]).describe("The desired type of question for the quiz."),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy').describe("The desired difficulty for the quiz question."),
  targetLanguage: z.enum(['en', 'nl']).default('en').describe("The target language for UI elements of the quiz, if applicable (e.g., for generic MCQ question text).")
});
export type GenerateQuizForWordInput = z.infer<typeof GenerateQuizForWordInputSchema>;

const GenerateQuizForWordOutputSchema = z.object({
  quizJsonString: z.string().describe("A JSON string representing a complete Quiz object with one question."),
  feedbackMessage: z.string().optional().describe("A message about the quiz generation process."),
});
export type GenerateQuizForWordOutput = z.infer<typeof GenerateQuizForWordOutputSchema>;

export async function generateQuizForWord(input: GenerateQuizForWordInput): Promise<GenerateQuizForWordOutput> {
  return generateQuizForWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizForWordPrompt',
  input: {schema: GenerateQuizForWordInputSchema},
  // Output schema is not strictly enforced here as we are asking for a JSON string.
  // The structure of the JSON string is described in the prompt.
  output: {schema: z.object({ jsonResponse: z.string() }) }, 
  prompt: `You are an AI assistant for "Javanese Journey", an app to learn Javanese.
Your task is to generate a JSON string representing a single-question quiz based on a given Javanese word.
The JSON string must conform to the following TypeScript 'Quiz' interface:
\`\`\`typescript
interface QuizOption { text: string; isCorrect: boolean; }
interface QuizQuestion {
  id: string; // Auto-generate, e.g., "q-word-{{word.id}}-{{timestamp}}"
  questionType: QuestionType; // This will be '{{targetQuestionType}}'
  questionText: string; // The main text of the question
  options: QuizOption[]; // Options for MCQ, or a single correct answer for fill-in-the-blank-text-input
  explanation?: string; // Explanation for the correct answer
  audioUrl?: string; // Optional audio URL
}
interface Quiz {
  id: string; // Auto-generate, e.g., "quiz-word-{{word.id}}-{{timestamp}}"
  title: string; // e.g., "Quiz for '{{word.javanese}}'"
  description?: string; // e.g., "Test your knowledge of the word '{{word.javanese}}'."
  category: string; // Default to "Vocabulary" or "{{word.category}}" if available
  difficulty: 'easy' | 'medium' | 'hard'; // This will be '{{difficulty}}'
  questions: QuizQuestion[]; // Array containing the single generated question
  status: 'draft'; // Always 'draft'
}
type QuestionType =
  | 'multiple-choice' // Generic question about the word
  | 'translation-word-to-dutch' // Given Javanese word, options are Dutch
  | 'translation-sentence-to-dutch' // Given Javanese sentence, options are Dutch sentences
  | 'translation-word-to-javanese' // Given Dutch word, options are Javanese
  | 'translation-sentence-to-javanese' // Given Dutch sentence, options are Javanese sentences
  | 'fill-in-the-blank-mcq' // Javanese sentence with '_______', options are Javanese words
  | 'fill-in-the-blank-text-input'; // Javanese sentence with '_______', one correct Javanese word in options[0].text
\`\`\`

Word Details:
- Javanese: {{word.javanese}}
- Dutch: {{word.dutch}}
- Category: {{word.category}}
- Level: {{word.level}}
- Formality: {{word.formality}}
- Example Javanese: {{word.exampleSentenceJavanese}}
- Example Dutch: {{word.exampleSentenceDutch}}

Target Question Type: {{targetQuestionType}}
Target Difficulty: {{difficulty}}
Target UI Language: {{targetLanguage}} (for general question phrasing if needed, explanations should be in this language)

Instructions:
1.  Generate a unique \`id\` for the quiz and the question (e.g., using "quiz-word-{{word.id}}-<timestamp>" and "q-word-{{word.id}}-<timestamp>").
2.  Set the quiz \`title\`, \`description\`, \`category\`, \`difficulty\`, and \`status\` as specified.
3.  Construct one \`QuizQuestion\` object:
    *   Set \`questionType\` to \`{{targetQuestionType}}\`.
    *   Formulate \`questionText\` appropriately for the \`targetQuestionType\` and the given word.
        *   For 'translation-word-to-dutch': \`questionText\` should be "{{word.javanese}}". Options are Dutch.
        *   For 'translation-word-to-javanese': \`questionText\` should be "{{word.dutch}}". Options are Javanese.
        *   For 'fill-in-the-blank-mcq' or 'fill-in-the-blank-text-input': Use \`{{word.exampleSentenceJavanese}}\` if available, replacing \`{{word.javanese}}\` with "_______". If no example sentence, state "Cannot generate fill-in-the-blank for this word." in the JSON output's \`description\` or provide a generic sentence.
        *   For 'multiple-choice': Ask a question about the word's meaning, category, formality, or usage.
    *   Generate \`options\`:
        *   For MCQ types, provide 3-4 options. One must be correct. Distractors should be plausible but incorrect words from a similar category or meaning if possible.
        *   For 'fill-in-the-blank-text-input', \`options\` array must have exactly one item: \`{ text: "{{word.javanese}}", isCorrect: true }\`.
    *   Provide a concise \`explanation\` for the correct answer in {{targetLanguage}}.
4.  Output ONLY the raw JSON string for the Quiz object. Do not wrap it in backticks or any other text.

Example for 'translation-word-to-dutch' and word 'sugeng enjing':
Question Text: "Sugeng enjing"
Options: [{text: "Goedemorgen", isCorrect: true}, {text: "Goedenavond", isCorrect: false}, ...]
Explanation: "'Sugeng enjing' means 'Good morning' in Javanese."

If the word's example sentence is missing and it's required for a 'fill-in-the-blank' type,
the \`questionText\` for that question can be "N/A" and the \`description\` of the QUIZ can state "Could not generate fill-in-the-blank: missing example sentence."

Output the JSON string directly.
`,
});

const generateQuizForWordFlow = ai.defineFlow(
  {
    name: 'generateQuizForWordFlow',
    inputSchema: GenerateQuizForWordInputSchema,
    outputSchema: GenerateQuizForWordOutputSchema,
  },
  async (input) => {
    const { word, targetQuestionType } = input;

    if ((targetQuestionType === 'fill-in-the-blank-mcq' || targetQuestionType === 'fill-in-the-blank-text-input') && !word.exampleSentenceJavanese) {
      const quizId = `quiz-word-${word.id}-${Date.now()}`;
      const questionId = `q-word-${word.id}-${Date.now()}`;
      const errorQuiz = {
        id: quizId,
        title: `Quiz for '${word.javanese}' (Error)`,
        description: `Could not generate '${targetQuestionType}' question for "${word.javanese}": example sentence is missing.`,
        category: word.category || "Vocabulary",
        difficulty: input.difficulty,
        status: 'draft',
        questions: [{
          id: questionId,
          questionType: targetQuestionType,
          questionText: "N/A - Missing example sentence",
          options: [],
          explanation: "This question could not be generated due to a missing example sentence for the word."
        }],
      };
      return {
        quizJsonString: JSON.stringify(errorQuiz, null, 2),
        feedbackMessage: "Quiz generation failed: Missing example sentence for fill-in-the-blank type.",
      };
    }

    const { output } = await prompt(input);
    if (!output || !output.jsonResponse) {
      throw new Error('AI failed to generate quiz JSON.');
    }

    try {
      // Validate if the output is actually JSON, then re-stringify to ensure formatting.
      const parsedJson = JSON.parse(output.jsonResponse);
      return {
        quizJsonString: JSON.stringify(parsedJson, null, 2),
        feedbackMessage: `Quiz for "${word.javanese}" generated successfully.`,
      };
    } catch (e) {
      console.error("Generated output was not valid JSON:", output.jsonResponse, e);
      throw new Error('AI produced invalid JSON output. Raw output: ' + output.jsonResponse);
    }
  }
);
