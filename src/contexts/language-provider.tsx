
"use client";

import type { Language } from '@/types';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  toggleLanguage: () => void;
  translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations - extend this as needed
const translationsData = {
  en: {
    appName: "Javanese Journey",
    dashboard: "Dashboard",
    flashcards: "Flashcards",
    quizzes: "Quizzes",
    pronunciation: "Pronunciation",
    progress: "Progress",
    goals: "Goals",
    grammar: "Grammar",
    grammarLessons: "Grammar Lessons",
    grammarManagement: "Grammar Management",
    admin: "Admin Panel",
    toggleToDutch: "Switch to Dutch",
    toggleToEnglish: "Switch to English",
    welcome: "Welcome to Javanese Journey!",
    startLearning: "Start Learning",
    javanese: "Javanese",
    dutch: "Dutch",
    flip: "Flip",
    next: "Next",
    checkAnswer: "Check Answer",
    correct: "Correct!",
    incorrect: "Incorrect. The correct answer is:",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    userXP: "User XP",
    learningStreak: "Learning Streak",
    badges: "Badges",
    learningProgress: "Learning Progress",
    preferredLearningStyle: "Preferred Learning Style (optional)",
    timeAvailable: "Time Available Today (optional)",
    generateGoals: "Generate Goals",
    dailyGoals: "Daily Goals",
    explanation: "Explanation",
    wordsManagement: "Words Management",
    quizzesManagement: "Quizzes Management",
    usersManagement: "Users Management",
    addNewWord: "Add New Word",
    addNewQuiz: "Add New Quiz",
    viewUsers: "View Users",
    save: "Save",
    cancel: "Cancel",
    question: "Question",
    options: "Options",
    noGoalsGenerated: "Enter your progress and generate your daily goals!",
    loadingGoals: "Generating your personalized goals...",
    errorGeneratingGoals: "Could not generate goals. Please try again.",
    logout: "Logout",
    login: "Login",
    getStarted: "Get Started",
    tagline: "Your personal guide to mastering the Javanese language.",
    featureFlashcards: "Interactive Flashcards",
    featureFlashcardsDesc: "Master vocabulary with engaging flashcards.",
    featureQuizzes: "Challenging Quizzes",
    featureQuizzesDesc: "Test your knowledge with diverse quizzes.",
    featurePronunciation: "Audio Pronunciation",
    featurePronunciationDesc: "Perfect your accent with native audio.",
    featureAdaptiveGoals: "AI-Powered Goals",
    featureAdaptiveGoalsDesc: "Get daily learning goals tailored to you.",
    profile: "Profile",
    profileSettings: "Profile Settings",
    updateProfile: "Update Profile", 
    learningPreferences: "Learning Preferences",
    dailyStudyGoal: "Daily Study Goal (minutes)",
    accountManagement: "Account Management",
    deleteAccount: "Delete Account",
    role: "Role",
    name: "Name",
    email: "Email",
    finishQuiz: "Finish Quiz",
    nextQuestion: "Next Question",
    selectQuizPrompt: "Select a quiz to begin.",
    quizCompleted: "Quiz Completed!",
    startQuiz: "Start Quiz",
    fillInTheBlanks: "Fill in the Blanks",
    fillInTheBlankInstruction: "Type the missing Javanese word.",
    nextExercise: "Next Exercise",
    typeYourAnswer: "Type your answer here...",
    showAnswer: "Show Answer",
    missingWordWas: "The missing word was:",
    noFillExercises: "No fill-in-the-blank exercises available at the moment.",
    showJavaneseFirst: "Show Javanese First",
  },
  nl: {
    appName: "Javaanse Reis",
    dashboard: "Dashboard",
    flashcards: "Flashcards",
    quizzes: "Quizzen",
    pronunciation: "Uitspraak",
    progress: "Voortgang",
    goals: "Doelen",
    grammar: "Grammatica",
    grammarLessons: "Grammaticalessen",
    grammarManagement: "Grammaticabeheer",
    admin: "Beheerderspaneel",
    toggleToDutch: "Schakel naar Nederlands",
    toggleToEnglish: "Switch to English",
    welcome: "Welkom bij Javaanse Reis!",
    startLearning: "Begin met Leren",
    javanese: "Javaans",
    dutch: "Nederlands",
    flip: "Omdraaien",
    next: "Volgende",
    checkAnswer: "Controleer Antwoord",
    correct: "Correct!",
    incorrect: "Incorrect. Het juiste antwoord is:",
    yourAnswer: "Jouw antwoord",
    correctAnswer: "Correct antwoord",
    userXP: "Gebruikers XP",
    learningStreak: "Leerreeks",
    badges: "Badges",
    learningProgress: "Leervoortgang",
    preferredLearningStyle: "Voorkeur Leerstijl (optioneel)",
    timeAvailable: "Beschikbare Tijd Vandaag (optioneel)",
    generateGoals: "Genereer Doelen",
    dailyGoals: "Dagelijkse Doelen",
    explanation: "Uitleg",
    wordsManagement: "Woordenbeheer",
    quizzesManagement: "Quizbeheer",
    usersManagement: "Gebruikersbeheer",
    addNewWord: "Nieuw Woord Toevoegen",
    addNewQuiz: "Nieuwe Quiz Toevoegen",
    viewUsers: "Bekijk Gebruikers",
    save: "Opslaan",
    cancel: "Annuleren",
    question: "Vraag",
    options: "Opties",
    noGoalsGenerated: "Voer je voortgang in en genereer je dagelijkse doelen!",
    loadingGoals: "Je gepersonaliseerde doelen worden gegenereerd...",
    errorGeneratingGoals: "Kon doelen niet genereren. Probeer het opnieuw.",
    logout: "Uitloggen",
    login: "Inloggen",
    getStarted: "Begin Nu",
    tagline: "Jouw persoonlijke gids om de Javaanse taal te beheersen.",
    featureFlashcards: "Interactieve Flashcards",
    featureFlashcardsDesc: "Beheers woordenschat met boeiende flashcards.",
    featureQuizzes: "Uitdagende Quizzen",
    featureQuizzesDesc: "Test je kennis met diverse quizzen.",
    featurePronunciation: "Audio Uitspraak",
    featurePronunciationDesc: "Perfectioneer je accent met authentieke audio.",
    featureAdaptiveGoals: "AI-gestuurde Doelen",
    featureAdaptiveGoalsDesc: "Ontvang dagelijkse leerdoelen op maat.",
    profile: "Profiel",
    profileSettings: "Profielinstellingen",
    updateProfile: "Profiel Bijwerken",
    learningPreferences: "Leervoorkeuren",
    dailyStudyGoal: "Dagelijks Studiedoel (minuten)",
    accountManagement: "Accountbeheer",
    deleteAccount: "Account Verwijderen",
    role: "Rol",
    name: "Naam",
    email: "E-mailadres",
    finishQuiz: "Quiz Voltooien",
    nextQuestion: "Volgende Vraag",
    selectQuizPrompt: "Selecteer een quiz om te beginnen.",
    quizCompleted: "Quiz Voltooid!",
    startQuiz: "Start Quiz",
    fillInTheBlanks: "Vul de Leemtes In",
    fillInTheBlankInstruction: "Typ het ontbrekende Javaanse woord.",
    nextExercise: "Volgende Oefening",
    typeYourAnswer: "Typ hier je antwoord...",
    showAnswer: "Toon Antwoord",
    missingWordWas: "Het ontbrekende woord was:",
    noFillExercises: "Momenteel geen invuloefeningen beschikbaar.",
    showJavaneseFirst: "Toon Javaans Eerst",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('javaneseJourneyLanguage') as Language | null;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'nl' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('javaneseJourneyLanguage', newLanguage);
  };

  const currentTranslations = translationsData[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, translations: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
