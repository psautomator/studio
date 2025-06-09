import type { Word, Quiz, User, Badge } from '@/types';

export const placeholderWords: Word[] = [
  { id: '1', javanese: 'Sugeng enjing', dutch: 'Goedemorgen', category: 'Greetings' },
  { id: '2', javanese: 'Matur nuwun', dutch: 'Dank u wel', category: 'Politeness' },
  { id: '3', javanese: 'Kula', dutch: 'Ik', category: 'Pronouns' },
  { id: '4', javanese: 'Sampeyan', dutch: 'U (formeel)', category: 'Pronouns' },
  { id: '5', javanese: 'Sinten asmanipun sampeyan?', dutch: 'Hoe heet u?', category: 'Phrases' },
  { id: '6', javanese: 'Omah', dutch: 'Huis', category: 'Nouns' },
  { id: '7', javanese: 'Sekolah', dutch: 'School', category: 'Nouns' },
  { id: '8', javanese: 'Mangan', dutch: 'Eten', category: 'Verbs' },
  { id: '9', javanese: 'Sinau', dutch: 'Leren/Studeren', category: 'Verbs' },
  { id: '10', javanese: 'Abang', dutch: 'Rood', category: 'Colors' },
];

export const placeholderQuizzes: Quiz[] = [
  {
    id: 'q1',
    question: "Wat betekent 'Sugeng rawuh'?",
    options: [
      { text: 'Goedenacht', isCorrect: false },
      { text: 'Welkom', isCorrect: true },
      { text: 'Tot ziens', isCorrect: false },
      { text: 'Hallo', isCorrect: false },
    ],
    explanation: "'Sugeng rawuh' is een formele Javaanse begroeting die 'Welkom' betekent.",
    difficulty: 'easy',
  },
  {
    id: 'q2',
    question: "Welk Javaans woord betekent 'water'?",
    options: [
      { text: 'Geni', isCorrect: false },
      { text: 'Angin', isCorrect: false },
      { text: 'Banyu', isCorrect: true },
      { text: 'Lemah', isCorrect: false },
    ],
    explanation: "'Banyu' is het Javaanse woord voor 'water'. 'Geni' is vuur, 'Angin' is wind, 'Lemah' is aarde.",
    difficulty: 'medium',
  },
  {
    id: 'q3',
    question: "Kies de juiste Javaanse vertaling voor 'Ik hou van jou'.",
    options: [
      { text: 'Kula tresna sampeyan', isCorrect: true },
      { text: 'Kula sengit sampeyan', isCorrect: false },
      { text: 'Kula kangen sampeyan', isCorrect: false },
      { text: 'Kula ngantuk', isCorrect: false },
    ],
    difficulty: 'medium',
  }
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
  { id: 'quiz_champ_easy', name: 'Quiz Champion (Easy)', description: 'Completed 10 easy quizzes with 80%+ accuracy.', icon: 'Star', threshold: 10 },
];

export const placeholderAdminUsers: User[] = [
    { id: 'user1', name: 'Jan Jansen', email: 'jan@example.com', role: 'user', xp: 1500, streak: 10, badges: ['newbie', 'wordmaster_lvl1'] },
    { id: 'user2', name: 'Piet Pietersen', email: 'piet@example.com', role: 'user', xp: 800, streak: 5, badges: ['newbie'] },
    { id: 'user3', name: 'Admin Account', email: 'admin@example.com', role: 'admin', xp: 0, streak: 0, badges: [] },
];
