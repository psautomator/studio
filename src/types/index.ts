
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
  userId: string; // Assuming this will be populated eventually
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  /** Score as a percentage (0-100), calculated server-side or by a function.
   *  Client might pre-calculate for immediate display, but server should verify/recalculate.
   */
  scorePercentage: number;
  /** Status derived from scorePercentage:
   * <90% "Incomplete",
   * 90-99% "Completed",
   * 100% "Perfect". Set by server/function.
   */
  status: QuizAttemptStatus;
  /** True if scorePercentage is 100, set server-side or by a function. */
  perfect: boolean;
  /** Number of times this specific quiz has been attempted by the user.
   *  Ideally managed/incremented server-side for accuracy.
   */
  attempts: number;
  timeSpentSeconds?: number; // Optional: duration of the quiz attempt
  completedAt: Date | string; // Firestore Timestamp ideally, or ISO string
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

  /** Stores IDs of grammar lessons where the user demonstrated mastery
   * (e.g., all embedded exercises correct on first try, or perfect score on a linked mastery quiz).
   * "Mastery" implies no mistakes on designated components.
   */
  completedLessonIds?: string[];
  quizAttempts?: UserQuizAttempt[];
  currentQuizProgress?: {
    quizId: string;
    currentQuestionIndex: number;
    answersSoFar: { questionId: string; selectedOptionText: string }[];
  };

  lastGrammarLessonId?: string;
  // lastQuizId?: string; // Replaced by more detailed quizAttempts and currentQuizProgress
  lastFlashcardDeckId?: string;
  lastFlashcardIndex?: number;
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
  javaneseSentenceWithPlaceholder: string; // e.g., "Kula badhe ____ pasar."
  correctAnswer: string; // e.g., "tindak"
  hint?: LocaleString; // e.g., { en: "I will go to the market.", nl: "Ik zal naar de markt gaan." }
  originalJavaneseSentenceForDisplay?: string; // e.g., "Kula badhe tindak pasar." (Optional, for showing full sentence in feedback)
}

export interface EmbeddedErrorSpottingExercise {
  id: string;
  type: 'error-spotting';
  incorrectSentence: LocaleString; // { en: "I is going home.", nl: "Ik ben naar huis gaat." }
  correctSentence: LocaleString;   // { en: "I am going home.", nl: "Ik ga naar huis." }
  hint?: LocaleString; // Optional hint for the user
}

export type EmbeddedExercise = EmbeddedFillInTheBlankExercise | EmbeddedErrorSpottingExercise;

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
