
'use server';
/**
 * @fileOverview AI flow for generating a single-question quiz for a given word.
 *
 * - generateQuizForWord - Generates a quiz JSON string.
 * - GenerateQuizForWordInput - Input type for the flow.
 * - GenerateQuizForWordOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {formatPrompt} from '@/lib/prompt-utils';
import {z} from 'genkit';
import type { Word, QuestionType } from '@/types'; // Assuming Word and QuestionType are in your types

// Define Zod schemas for Word and QuestionType if they are not already Zod schemas
// For simplicity, we'll assume they are compatible with direct use or use z.any() if complex.
// Ideally, you'd have Zod schemas for all your core types.
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

const QuestionTypeSchema = z.enum([
  'multiple-choice',
  'translation-word-to-dutch',
  'translation-sentence-to-dutch',
  'translation-word-to-javanese',
  'translation-sentence-to-javanese',
  'fill-in-the-blank-mcq',
  'fill-in-the-blank-text-input',
]);

const GenerateQuizForWordInputSchema = z.object({
  word: WordSchema.describe('The word to generate a quiz question for.'),
  targetQuestionType: QuestionTypeSchema.describe('The desired type of question for the quiz.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The desired difficulty of the quiz.'),
});
export type GenerateQuizForWordInput = z.infer<typeof GenerateQuizForWordInputSchema>;

const GenerateQuizForWordOutputSchema = z.object({
  quizJsonString: z.string().describe('A JSON string representing the generated Quiz object with one question.'),
  feedbackMessage: z.string().optional().describe('A message about the generation process.'),
});
export type GenerateQuizForWordOutput = z.infer<typeof GenerateQuizForWordOutputSchema>;

const generateQuizTemplate = `You are an AI assistant specialized in creating Javanese language learning quizzes.
Your task is to generate a complete JSON object for a single Javanese quiz.
The quiz will contain exactly ONE question based on the provided Javanese word, desired question type, and difficulty.

Word details:
- Javanese: <%= word.javanese %>
- Dutch: <%= word.dutch %>
- Category: <%= word.category %>
- Level: <%= word.level %>
- Formality: <%= word.formality %>
- Example Javanese: <%= word.exampleSentenceJavanese %>
- Example Dutch: <%= word.exampleSentenceDutch %>

Desired quiz parameters:
- Question Type: <%= targetQuestionType %>
- Difficulty: <%= difficulty %>

Your output MUST be a single, valid JSON string representing a Quiz object.
The Quiz object structure is:
{
  "id": "quiz-ai-[timestamp]", // Generate a unique ID, e.g., using Date.now() or similar random string.
  "title": "AI Quiz for: <%= word.javanese %>",
  "description": "An AI-generated quiz question focusing on the word '<%= word.javanese %>'. Type: <%= targetQuestionType %>, Difficulty: <%= difficulty %>.",
  "category": "AI Generated - <%= word.category %>", // Combine AI Generated with word category
  "difficulty": "<%= difficulty %>",
  "status": "draft",
  "questions": [
    {
      "id": "q-ai-[timestamp]-1", // Generate a unique question ID.
      "questionType": "<%= targetQuestionType %>",
      "questionText": "[Generate appropriate question text based on word and targetQuestionType. See examples below]",
      "options": [ /* Generate options. See examples below */ ],
      "explanation": "[Generate a concise explanation for the correct answer, referencing the word and its Dutch translation.]"
      // "audioUrl": "" // Optional: leave empty or omit if not applicable
    }
  ]
Question Text and Options Examples:

1. If targetQuestionType is 'multiple-choice' (general knowledge about the word):
   - questionText: "Which of the following is true about the Javanese word '<%= word.javanese %>'?"
   - options: [
       { "text": "[A plausible correct fact, e.g., 'Its Dutch translation is \"<%= word.dutch %>\"']", "isCorrect": true },
       { "text": "[A plausible incorrect fact 1]", "isCorrect": false },
       { "text": "[A plausible incorrect fact 2]", "isCorrect": false },
       { "text": "[A plausible incorrect fact 3, if difficulty is medium/hard]", "isCorrect": false }
     ]
   - explanation: "The word '<%= word.javanese %>' means '<%= word.dutch %>'. [Add more context if relevant, e.g., its formality or category]."

2. If targetQuestionType is 'translation-word-to-dutch':
   - questionText: "What is the Dutch translation of the Javanese word '<%= word.javanese %>'?"
   - options: [
       { "text": "<%= word.dutch %>", "isCorrect": true },
       { "text": "[Plausible incorrect Dutch word 1]", "isCorrect": false },
       { "text": "[Plausible incorrect Dutch word 2]", "isCorrect": false },
       { "text": "[Plausible incorrect Dutch word 3, if difficulty is medium/hard]", "isCorrect": false }
     ]
   - explanation: "The correct Dutch translation for '<%= word.javanese %>' is '<%= word.dutch %>'."

3. If targetQuestionType is 'translation-word-to-javanese':
   - questionText: "What is the Javanese translation of the Dutch word '<%= word.dutch %>'?"
   - options: [
       { "text": "<%= word.javanese %>", "isCorrect": true },
       { "text": "[Plausible incorrect Javanese word 1]", "isCorrect": false },
       { "text": "[Plausible incorrect Javanese word 2]", "isCorrect": false },
       { "text": "[Plausible incorrect Javanese word 3, if difficulty is medium/hard]", "isCorrect": false }
     ]
   - explanation: "The correct Javanese translation for '<%= word.dutch %>' is '<%= word.javanese %>'."

4. If targetQuestionType is 'fill-in-the-blank-mcq':
   - Use word.exampleSentenceJavanese if available. Create a blank for word.javanese.
   - questionText: "Complete the sentence: <%= word.exampleSentenceJavanese %>". Replace '<%= word.javanese %>' with '_______'.
   - options: [
       { "text": "<%= word.javanese %>", "isCorrect": true },
       { "text": "[Plausible incorrect Javanese word 1 that could fit grammatically]", "isCorrect": false },
       { "text": "[Plausible incorrect Javanese word 2 that could fit grammatically]", "isCorrect": false }
     ]
   - explanation: "The missing word is '<%= word.javanese %>'. The full sentence means: '<%= word.exampleSentenceDutch %>'."
   - If no example sentence is available for the word, state that this type cannot be generated for this word and provide an empty quiz JSON or a message.

5. If targetQuestionType is 'fill-in-the-blank-text-input':
   - Use word.exampleSentenceJavanese if available. Create a blank for word.javanese.
   - questionText: "Complete the sentence by typing the missing word: <%= word.exampleSentenceJavanese %>". Replace '<%= word.javanese %>' with '_______'.
   - options: [ { "text": "<%= word.javanese %>", "isCorrect": true } ] // Only one option, the correct answer
   - explanation: "The missing word is '<%= word.javanese %>'. The full sentence means: '<%= word.exampleSentenceDutch %>'."
   - If no example sentence is available for the word, state that this type cannot be generated and provide an empty quiz JSON or a message.

General instructions for JSON generation:
- Ensure all string values in the JSON are properly escaped (e.g., quotes within strings).
- Ensure IDs are unique strings. Using a prefix like "quiz-ai-" and "q-ai-" followed by a timestamp or random part is good.
- For options arrays, provide 3-4 options for multiple-choice type questions, with only one being correct.
- Difficulty should influence the plausibility and subtlety of incorrect options. Easy: obvious distractors. Medium/Hard: more similar or tricky distractors.
- The explanation should be helpful and confirm the correct answer.

Provide ONLY the JSON string as your output. Do not add any other text before or after the JSON string.
Example of a full JSON output:
{
  "id": "quiz-ai-1678886400000",
  "title": "AI Quiz for: Sugeng enjing",
  "description": "An AI-generated quiz question focusing on the word 'Sugeng enjing'. Type: translation-word-to-dutch, Difficulty: easy.",
  "category": "AI Generated - Greetings",
  "difficulty": "easy",
  "status": "draft",
  "questions": [
    {
      "id": "q-ai-1678886400000-1",
      "questionType": "translation-word-to-dutch",
      "questionText": "What is the Dutch translation of the Javanese word 'Sugeng enjing'?",
      "options": [
        { "text": "Goedemorgen", "isCorrect": true },
        { "text": "Goedenavond", "isCorrect": false },
        { "text": "Welkom", "isCorrect": false }
      ],
      "explanation": "The correct Dutch translation for 'Sugeng enjing' is 'Goedemorgen'."
    }
  ]
}
Make sure the output is a single minified JSON string if possible, or at least a valid JSON string.
` as const, // Use 'as const' to treat the template string as a constant
});

const generateQuizForWordFlow = ai.defineFlow(
  {
    name: 'generateQuizForWordFlow',
    inputSchema: GenerateQuizForWordInputSchema,
    outputSchema: GenerateQuizForWordOutputSchema,
  },
  async (input) => {
    // Fallback for question types that require an example sentence
    if (
      (input.targetQuestionType === 'fill-in-the-blank-mcq' ||
        input.targetQuestionType === 'fill-in-the-blank-text-input') &&
      !input.word.exampleSentenceJavanese
    ) {
      const emptyQuiz = {
        id: `quiz-ai-empty-${Date.now()}`,
        title: `Cannot generate '${input.targetQuestionType}' for: ${input.word.javanese}`,
        description: `This question type requires an example sentence, which is not available for '${input.word.javanese}'.`,
        category: `AI Generated - ${input.word.category || 'Uncategorized'}`,
        difficulty: input.difficulty,
        status: 'draft',
        questions: [],
      };
      return {
        quizJsonString: JSON.stringify(emptyQuiz),
        feedbackMessage: `Could not generate '${input.targetQuestionType}' quiz for "${input.word.javanese}" as it lacks an example sentence.`,
      };
    }

    const {output} = await generateQuizPrompt(input);

    if (!output || !output.quizJsonString) {
      // Attempt to parse the raw output if structured output failed but text might be JSON
      // This is a fallback, the prompt is designed for structured output.
      const llmResponseText = (output as any)?.text || (output as any); // Access raw text if available
      if (typeof llmResponseText === 'string') {
        try {
          // Validate if the text is JSON
          JSON.parse(llmResponseText);
          return {
            quizJsonString: llmResponseText,
            feedbackMessage: 'AI generated quiz JSON (parsed from raw text). Review carefully.',
          };
        } catch (e) {
          // Not valid JSON
        }
      }
      // If still no valid JSON, return an error or a placeholder
      const errorQuiz = {
        id: `quiz-ai-error-${Date.now()}`,
        title: `Error generating quiz for: ${input.word.javanese}`,
        description: 'The AI failed to generate valid quiz JSON for this word and question type. Please try again or a different type.',
        category: `AI Generated - ${input.word.category || 'Uncategorized'}`,
        difficulty: input.difficulty,
        status: 'draft',
        questions: [],
      };
      return {
        quizJsonString: JSON.stringify(errorQuiz),
        feedbackMessage: `AI failed to generate structured quiz JSON for "${input.word.javanese}". An error placeholder quiz was created.`,
      };
    }
    
    // Ensure the output from the prompt is correctly assigned if it matches the schema
    // The prompt is asked to return the JSON string directly in the 'quizJsonString' field as per its own instructions.
    // However, Genkit might wrap it if the LLM doesn't adhere perfectly.
    // Let's assume `output` is `GenerateQuizForWordOutputSchema` here.
    // If the prompt directly outputs the JSON string as the entire response.text(),
    // we'd adjust the flow or prompt structure.

    // For this setup, the prompt is asked to fill `GenerateQuizForWordOutputSchema`.
    // So, `output.quizJsonString` should contain the JSON.
    // A simple validation:
    try {
        JSON.parse(output.quizJsonString);
    } catch (e) {
        console.error("Generated quizJsonString is not valid JSON:", output.quizJsonString, e);
        // Fallback if the LLM fails to produce valid JSON within the expected field
        const errorQuiz = {
            id: `quiz-ai-invalidjson-${Date.now()}`,
            title: `Invalid JSON from AI for: ${input.word.javanese}`,
            description: 'The AI returned invalid JSON. Please try again.',
            category: `AI Generated - ${input.word.category || 'Uncategorized'}`,
            difficulty: input.difficulty,
            status: 'draft',
            questions: [],
        };
        return {
            quizJsonString: JSON.stringify(errorQuiz),
            feedbackMessage: `AI returned invalid JSON for "${input.word.javanese}".`,
        };
    }

    return {
      quizJsonString: output.quizJsonString,
      feedbackMessage: `Successfully generated quiz JSON for "${input.word.javanese}".`,
    };
  }
);

export async function generateQuizForWord(
  input: GenerateQuizForWordInput
): Promise<GenerateQuizForWordOutput> {
  return generateQuizForWordFlow(input);
}
