
export type Language = 'en' | 'nl';

export interface Word {
  id: string;
  javanese: string;
  dutch: string;
  audioUrl?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  exampleSentenceJavanese?: string;
  exampleSentenceDutch?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  formality?: 'ngoko' | 'krama' | 'madya';
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export type QuestionType =
  | 'multiple-choice' // Standard text question with text options
  | 'translation-word-to-dutch' // Given Javanese word, options are Dutch words
  | 'translation-sentence-to-dutch' // Given Javanese sentence, options are Dutch sentences
  | 'translation-word-to-javanese' // Given Dutch word, options are Javanese words
  | 'translation-sentence-to-javanese' // Given Dutch sentence, options are Javanese sentences
  | 'fill-in-the-blank-mcq'; // Sentence with a blank, options are words to fill

export interface QuizQuestion {
  id: string;
  questionType?: QuestionType; // Optional for backward compatibility, default to 'multiple-choice'
  questionText: string; // Main question text (e.g., "What is X?", "Translate Y", "Aku ____ Z.")
  options: QuizOption[];
  explanation?: string;
  audioUrl?: string;
  question?: string; // Legacy, prefer questionText
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  status?: 'published' | 'draft' | 'archived';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  xp: number;
  streak: number;
  badges: string[];
  lastLogin?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold?: number;
}

// Helper type for localized strings
export interface LocaleString {
  en: string;
  nl: string;
}

export type SpeechLevel = 'ngoko' | 'krama' | 'madya' | 'neutral' | 'other';

export interface GrammarExample {
  id: string; // Add ID for unique key in arrays
  javanese: string;
  dutch: string;
  speechLevel: SpeechLevel;
  audioUrl?: string;
}

export interface EmbeddedFillInTheBlankExercise {
  id: string;
  type: 'fill-in-the-blank';
  javaneseSentenceWithPlaceholder: string; // e.g., "Kula badhe ___ pasar." (placeholder: ____ or {BLANK})
  correctAnswer: string;
  hint?: LocaleString; // Optional hint in both languages
}

// Future: Add other exercise types
// export interface EmbeddedMultipleChoiceExercise {
//   id: string;
//   type: 'multiple-choice';
//   question: LocaleString;
//   options: { text: LocaleString; isCorrect: boolean }[];
//   explanation?: LocaleString;
// }

export type EmbeddedExercise = EmbeddedFillInTheBlankExercise; // | EmbeddedMultipleChoiceExercise;

export interface GrammarLesson {
  id: string;
  title: LocaleString;
  explanation: LocaleString; // Rich text content for each language
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  examples: GrammarExample[];
  relatedQuizIds: string[]; // Array of Quiz IDs
  relatedWordIds: string[]; // Array of Word IDs (for general vocab linking, or could be used by exercises)
  embeddedExercises: EmbeddedExercise[];
  status: 'published' | 'draft' | 'archived';
  imageUrl?: string; // Optional lesson-wide image
  lessonAudioUrl?: string; // Optional lesson-wide audio
  // Future: sections for drag-and-drop ordering
  // contentOrder: ('explanation' | 'examples' | 'exercises')[];
}

export interface FillInTheBlankExercise {
  id: string;
  questionSentence: string;
  hintSentence: string;
  correctAnswer: string;
  originalJavaneseSentence: string;
}

