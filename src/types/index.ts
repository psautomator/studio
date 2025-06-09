
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
  formality?: 'ngoko' | 'krama' | 'madya'; // Added formality
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

// Renamed from Quiz to QuizQuestion
export interface QuizQuestion {
  id: string; // ID for the question itself
  question: string;
  options: QuizOption[];
  explanation?: string;
  audioUrl?: string; // For the question audio
}

// New type for a quiz set
export interface Quiz {
  id: string; // ID for the quiz set
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  status?: 'published' | 'draft' | 'archived'; // Added status
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
  icon: string; // Icon name from lucide-react or path to image
  threshold?: number; // e.g., XP needed or streak length
}

export interface GrammarExample {
  javanese: string;
  dutch: string;
  audioUrl?: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  explanation: string; // Could be Markdown
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  examples: GrammarExample[];
  // Future: exercises: Exercise[];
}

// Type for Fill in the Blanks exercises
export interface FillInTheBlankExercise {
  id: string; // Derived from word.id
  questionSentence: string; // Javanese sentence with a blank
  hintSentence: string; // Dutch translation of the full sentence
  correctAnswer: string; // The Javanese word that was blanked out
  originalJavaneseSentence: string; // Full original Javanese sentence
}
