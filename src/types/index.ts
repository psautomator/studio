
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

export interface Quiz {
  id:string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  audioUrl?: string; // Added for quiz question audio
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

