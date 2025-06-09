
import type { Word, Quiz, QuizQuestion, User, Badge } from '@/types'; // Updated Quiz import

export const placeholderWords: Word[] = [
  {
    id: '1',
    javanese: 'Sugeng enjing',
    dutch: 'Goedemorgen',
    category: 'Greetings',
    level: 'Beginner',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sugeng%20enjing&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Sugeng enjing, Bu Guru.',
    exampleSentenceDutch: 'Goedemorgen, mevrouw de lerares.'
  },
  {
    id: '2',
    javanese: 'Matur nuwun',
    dutch: 'Dank u wel',
    category: 'Politeness',
    level: 'Beginner',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Matur%20nuwun&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Matur nuwun kagem bantuanipun.',
    exampleSentenceDutch: 'Dank u wel voor uw hulp.'
  },
  {
    id: '3',
    javanese: 'Kula',
    dutch: 'Ik',
    category: 'Pronouns',
    level: 'Beginner',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kula&tl=jv&client=tw-ob',
  },
  {
    id: '4',
    javanese: 'Sampeyan',
    dutch: 'U (formeel)',
    category: 'Pronouns',
    level: 'Beginner',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sampeyan&tl=jv&client=tw-ob',
  },
  {
    id: '5',
    javanese: 'Sinten asmanipun sampeyan?',
    dutch: 'Hoe heet u?',
    category: 'Phrases',
    level: 'Intermediate',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sinten%20asmanipun%20sampeyan&tl=jv&client=tw-ob',
  },
  {
    id: '6',
    javanese: 'Omah',
    dutch: 'Huis',
    category: 'Nouns',
    level: 'Beginner',
    exampleSentenceJavanese: 'Omahku cedhak pasar.',
    exampleSentenceDutch: 'Mijn huis is dichtbij de markt.'
  },
  {
    id: '7',
    javanese: 'Sekolah',
    dutch: 'School',
    category: 'Nouns',
    level: 'Beginner',
  },
  {
    id: '8',
    javanese: 'Mangan',
    dutch: 'Eten',
    category: 'Verbs',
    level: 'Beginner',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Mangan&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Aku arep mangan sega goreng.',
    exampleSentenceDutch: 'Ik wil gebakken rijst eten.'
  },
  {
    id: '9',
    javanese: 'Sinau',
    dutch: 'Leren/Studeren',
    category: 'Verbs',
    level: 'Intermediate',
  },
  {
    id: '10',
    javanese: 'Abang',
    dutch: 'Rood',
    category: 'Colors',
    level: 'Beginner',
  },
];

// Refactored: placeholderQuizzes is now an array of Quiz (quiz sets)
export const placeholderQuizzes: Quiz[] = [
  {
    id: 'quizSet1',
    title: 'Javanese Greetings',
    description: 'Test your knowledge of common Javanese greetings and politeness.',
    difficulty: 'easy',
    questions: [
      {
        id: 'q1s1', // Unique ID for this question within the set
        question: "Wat betekent 'Sugeng rawuh'?",
        options: [
          { text: 'Goedenacht', isCorrect: false },
          { text: 'Welkom', isCorrect: true },
          { text: 'Tot ziens', isCorrect: false },
          { text: 'Hallo', isCorrect: false },
        ],
        explanation: "'Sugeng rawuh' is een formele Javaanse begroeting die 'Welkom' betekent.",
        audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sugeng%20rawuh&tl=jv&client=tw-ob',
      },
      {
        id: 'q2s1',
        question: "How do you say 'Thank you' formally in Javanese?",
        options: [
          { text: 'Ngapunten', isCorrect: false },
          { text: 'Matur nuwun', isCorrect: true },
          { text: 'Monggo', isCorrect: false },
          { text: 'Inggih', isCorrect: false },
        ],
        explanation: "'Matur nuwun' is the formal way to say 'Thank you'.",
      },
    ],
  },
  {
    id: 'quizSet2',
    title: 'Basic Javanese Vocabulary',
    description: 'A quiz on fundamental Javanese words like colors and nouns.',
    difficulty: 'medium',
    questions: [
      {
        id: 'q1s2',
        question: "Welk Javaans woord betekent 'water'?",
        options: [
          { text: 'Geni', isCorrect: false },
          { text: 'Angin', isCorrect: false },
          { text: 'Banyu', isCorrect: true },
          { text: 'Lemah', isCorrect: false },
        ],
        explanation: "'Banyu' is het Javaanse woord voor 'water'. 'Geni' is vuur, 'Angin' is wind, 'Lemah' is aarde.",
      },
      {
        id: 'q2s2',
        question: "What is 'Abang' in Dutch?",
        options: [
          { text: 'Blauw', isCorrect: false },
          { text: 'Groen', isCorrect: false },
          { text: 'Rood', isCorrect: true },
          { text: 'Geel', isCorrect: false },
        ],
        explanation: "'Abang' means 'Rood' (Red).",
      },
      {
        id: 'q3s2',
        question: "Kies de juiste Javaanse vertaling voor 'Ik hou van jou'.",
        options: [
          { text: 'Kula tresna sampeyan', isCorrect: true },
          { text: 'Kula sengit sampeyan', isCorrect: false },
          { text: 'Kula kangen sampeyan', isCorrect: false },
          { text: 'Kula ngantuk', isCorrect: false },
        ],
        audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kula%20tresna%20sampeyan&tl=jv&client=tw-ob',
      },
    ],
  },
];


export const placeholderUser: User = {
  id: 'user123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  role: 'user',
  xp: 1250,
  streak: 15,
  badges: ['newbie', 'wordmaster_lvl1'],
  lastLogin: new Date(Date.now() - 86400000) // 1 day ago
};

export const placeholderBadges: Badge[] = [
  { id: 'newbie', name: 'Newbie Linguist', description: 'Started your Javanese journey!', icon: 'Award' },
  { id: 'wordmaster_lvl1', name: 'Word Master Lv. 1', description: 'Learned 50 new words.', icon: 'BookOpenCheck', threshold: 50 },
  { id: 'streak_7', name: '7-Day Streak', description: 'Logged in for 7 days in a row!', icon: 'Flame', threshold: 7 },
  { id: 'quiz_champ_easy', name: 'Quiz Champion (Easy)', description: 'Completed 10 easy quizzes with 80%+ accuracy.', icon: 'Star', threshold: 10 }, // Corrected icon name
];

export const placeholderAdminUsers: User[] = [
    { id: 'user1', name: 'Jan Jansen', email: 'jan@example.com', role: 'user', xp: 1500, streak: 10, badges: ['newbie', 'wordmaster_lvl1'] },
    { id: 'user2', name: 'Piet Pietersen', email: 'piet@example.com', role: 'user', xp: 800, streak: 5, badges: ['newbie'] },
    { id: 'user3', name: 'Admin Account', email: 'admin@example.com', role: 'admin', xp: 0, streak: 0, badges: [] },
];
