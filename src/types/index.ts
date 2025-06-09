
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
  questionType: QuestionType;
  questionText: string; // Main question text (e.g., "What is X?", "Translate Y", "Aku ____ Z.")
  options: QuizOption[];
  explanation?: string;
  audioUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  status?: 'published' | 'draft' | 'archived';
}

// For storing active AI-generated goals
export interface LearningGoal {
  id: string; // Could be timestamp or a unique ID
  text: string;
  isCompleted: boolean;
  createdAt: Date;
}

export type QuizAttemptStatus = 'Incomplete' | 'Completed' | 'Perfect';

export interface UserQuizAttempt {
  // userId: string; // Implicit if stored as a subcollection under user, or explicit if top-level
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number; // Calculated: (correctAnswers / totalQuestions) * 100
  status: QuizAttemptStatus; // 'Incomplete' (<90%), 'Completed' (90-99%), 'Perfect' (100%)
  perfect: boolean; // True if scorePercentage is 100
  attempts: number; // Number of times this specific quiz has been attempted by the user
  timeSpentSeconds?: number; // Optional: duration of the quiz attempt
  completedAt: Date | string; // Firestore Timestamp ideally, or ISO string
  // `id` field for the attempt itself can be the document ID in Firestore
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  xp: number;
  streak: number;
  badges: string[];
  lastLogin?: Date;

  // Fields for tracking progress and last activities
  // completedLessonIds should only contain IDs of lessons where mastery is achieved (e.g., no mistakes in embedded exercises or linked quizzes)
  completedLessonIds?: string[];
  quizAttempts?: UserQuizAttempt[]; // History of quiz attempts
  currentQuizProgress?: { // For resuming an incomplete quiz
    quizId: string;
    currentQuestionIndex: number;
    answersSoFar: { questionId: string; selectedOptionText: string }[];
  };

  lastGrammarLessonId?: string; // ID of the last grammar lesson viewed/interacted with
  lastFlashcardDeckId?: string; // If flashcards are in decks/categories
  lastFlashcardIndex?: number; // Index within the last viewed deck
  lastPronunciationWordId?: string;
  lastFillInTheBlanksExerciseId?: string;
  activeLearningGoals?: LearningGoal[];
  learningPreferences?: {
    preferredStyle?: string;
    dailyGoalMinutes?: number;
  };
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
  id: string;
  javanese: string;
  dutch: string;
  speechLevel: SpeechLevel;
  audioUrl?: string;
}

export interface EmbeddedFillInTheBlankExercise {
  id: string;
  type: 'fill-in-the-blank';
  javaneseSentenceWithPlaceholder: string;
  correctAnswer: string;
  hint?: LocaleString;
  originalJavaneseSentenceForDisplay?: string;
}

export type EmbeddedExercise = EmbeddedFillInTheBlankExercise;

export interface GrammarLesson {
  id: string;
  title: LocaleString;
  explanation: LocaleString;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  examples: GrammarExample[];
  relatedQuizIds: string[];
  relatedWordIds: string[];
  embeddedExercises: EmbeddedExercise[];
  status: 'published' | 'draft' | 'archived';
  imageUrl?: string;
  lessonAudioUrl?: string;
}

export interface FillInTheBlankExercise {
  id: string;
  questionSentence: string;
  hintSentence: string;
  correctAnswer: string;
  originalJavaneseSentence: string;
}
