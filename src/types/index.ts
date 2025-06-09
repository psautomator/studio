
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
  // status?: 'published' | 'draft'; // For later, if needed
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
