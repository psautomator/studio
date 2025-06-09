
import type { Word, Quiz, QuizQuestion, User, Badge, GrammarLesson } from '@/types'; // Updated Quiz import

export const placeholderWords: Word[] = [
  {
    id: '1',
    javanese: 'Sugeng enjing',
    dutch: 'Goedemorgen',
    category: 'Greetings',
    level: 'Beginner',
    formality: 'krama', // Formal greeting
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
    formality: 'krama', // Formal
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Matur%20nuwun&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Matur nuwun kagem bantuanipun.',
    exampleSentenceDutch: 'Dank u wel voor uw hulp.'
  },
  {
    id: '3',
    javanese: 'Kula',
    dutch: 'Ik (formeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kula&tl=jv&client=tw-ob',
  },
  {
    id: '3ngoko',
    javanese: 'Aku',
    dutch: 'Ik (informeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Aku&tl=jv&client=tw-ob',
  },
  {
    id: '4',
    javanese: 'Sampeyan',
    dutch: 'U (formeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sampeyan&tl=jv&client=tw-ob',
  },
  {
    id: '4ngoko',
    javanese: 'Kowe',
    dutch: 'Jij (informeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kowe&tl=jv&client=tw-ob',
  },
  {
    id: '5',
    javanese: 'Sinten asmanipun sampeyan?',
    dutch: 'Hoe heet u?',
    category: 'Phrases',
    level: 'Intermediate',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sinten%20asmanipun%20sampeyan&tl=jv&client=tw-ob',
  },
  {
    id: '5ngoko',
    javanese: 'Sapa jenengmu?',
    dutch: 'Hoe heet jij?',
    category: 'Phrases',
    level: 'Intermediate',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sapa%20jenengmu&tl=jv&client=tw-ob',
  },
  {
    id: '6',
    javanese: 'Omah',
    dutch: 'Huis',
    category: 'Nouns',
    level: 'Beginner',
    formality: 'ngoko', // Generally Ngoko, Griya for Krama
    exampleSentenceJavanese: 'Omahku cedhak pasar.',
    exampleSentenceDutch: 'Mijn huis is dichtbij de markt.'
  },
  {
    id: '7',
    javanese: 'Sekolah',
    dutch: 'School',
    category: 'Nouns',
    level: 'Beginner',
    formality: 'ngoko',
  },
  {
    id: '8',
    javanese: 'Mangan',
    dutch: 'Eten (informeel)',
    category: 'Verbs',
    level: 'Beginner',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Mangan&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Aku arep mangan sega goreng.',
    exampleSentenceDutch: 'Ik wil gebakken rijst eten.'
  },
  {
    id: '8krama',
    javanese: 'Dahar',
    dutch: 'Eten (formeel)',
    category: 'Verbs',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Dahar&tl=jv&client=tw-ob',
  },
  {
    id: '9',
    javanese: 'Sinau',
    dutch: 'Leren/Studeren',
    category: 'Verbs',
    level: 'Intermediate',
    formality: 'ngoko',
  },
  {
    id: '10',
    javanese: 'Abang',
    dutch: 'Rood',
    category: 'Colors',
    level: 'Beginner',
    formality: 'ngoko', // Generally Ngoko, Abrit for Krama
  },
];

// Refactored: placeholderQuizzes is now an array of Quiz (quiz sets)
export const placeholderQuizzes: Quiz[] = [
  {
    id: 'quizSet1',
    title: 'Javanese Greetings',
    description: 'Test your knowledge of common Javanese greetings and politeness.',
    difficulty: 'easy',
    status: 'published',
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
    status: 'published',
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
   {
    id: 'quizSet3',
    title: 'Javanese Numbers (Draft)',
    description: 'A quiz about numbers in Javanese, currently in draft.',
    difficulty: 'easy',
    status: 'draft',
    questions: [
      {
        id: 'q1s3',
        question: "What is 'siji' in Javanese?",
        options: [
          { text: 'One', isCorrect: true },
          { text: 'Two', isCorrect: false },
          { text: 'Three', isCorrect: false },
        ],
      },
    ],
  },
];


export const placeholderUser: User = {
  id: 'user123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  role: 'admin', // Changed to admin for testing admin features
  xp: 1250,
  streak: 15,
  badges: ['newbie', 'wordmaster_lvl1'],
  lastLogin: new Date(Date.now() - 86400000) // 1 day ago
};

export const placeholderBadges: Badge[] = [
  { id: 'newbie', name: 'Newbie Linguist', description: 'Started your Javanese journey!', icon: 'Award' },
  { id: 'wordmaster_lvl1', name: 'Word Master Lv. 1', description: 'Learned 50 new words.', icon: 'BookOpenCheck', threshold: 50 },
  { id: 'streak_7', name: '7-Day Streak', description: 'Logged in for 7 days in a row!', icon: 'Flame', threshold: 7 },
  { id: 'quiz_champ_easy', name: 'Quiz Champion (Easy)', description: 'Completed 10 easy quizzes with 80%+ accuracy.', icon: 'StarIcon', threshold: 10 },
];

export const placeholderAdminUsers: User[] = [
    { id: 'user1', name: 'Jan Jansen', email: 'jan@example.com', role: 'user', xp: 1500, streak: 10, badges: ['newbie', 'wordmaster_lvl1'] },
    { id: 'user2', name: 'Piet Pietersen', email: 'piet@example.com', role: 'user', xp: 800, streak: 5, badges: ['newbie'] },
    { id: 'user3', name: 'Admin Account', email: 'admin@example.com', role: 'admin', xp: 0, streak: 0, badges: [] },
];

export const placeholderGrammarLessons: GrammarLesson[] = [
  {
    id: 'gl1',
    title: 'Introduction to Javanese Speech Levels',
    explanation: "Javanese is unique for its distinct speech levels (undha-usuk basa), which are crucial for polite and appropriate conversation. The main levels are:\n\n- **Ngoko:** This is the informal or 'low' level. It's used when speaking to close friends, family members of similar age or younger, or in very casual situations. Using Ngoko with someone deserving higher respect can be considered rude.\n\n- **Madya:** This is an intermediate level, sometimes considered 'middle' Javanese. It mixes elements of Ngoko and Krama and is often used with acquaintances, people you know but are not extremely close to, or when trying to be polite but not overly formal. It can be a bit more nuanced to master and is very common in daily interactions.\n\n- **Krama:** This is the formal or 'high' level. It's used when addressing elders, strangers, superiors, or in formal settings (like speeches or official occasions). Krama shows respect and politeness. Many common Ngoko words have different Krama equivalents.\n\n**Key Differences to Note:**\n*   **Vocabulary:** The most significant difference lies in vocabulary. For example, 'to eat' is 'mangan' (Ngoko) but 'dahar' (Krama).\n*   **Pronouns:** Personal pronouns change dramatically, e.g., 'I' is 'aku' (Ngoko) and 'kula' (Krama).\n*   **Affixes:** Some grammatical affixes can also change between levels.\n\nUnderstanding when to use each level is a key part of learning Javanese effectively.",
    level: 'Beginner',
    category: 'Formality & Speech Levels',
    examples: [
      { javanese: 'Aku mangan sega.', dutch: 'Ik eet rijst. (Ngoko)' },
      { javanese: 'Kula nedha sekul.', dutch: 'Ik eet rijst. (Krama - more refined than dhahar for some contexts)' },
      { javanese: 'Kowe arep lunga?', dutch: 'Ga jij weg? (Ngoko)' },
      { javanese: 'Sampeyan badhe tindak?', dutch: 'Gaat u weg? (Krama)' },
      { javanese: 'Jenengku Budi.', dutch: 'Mijn naam is Budi. (Ngoko)' },
      { javanese: 'Asma kula Budi.', dutch: 'Mijn naam is Budi. (Krama)' },
    ],
    relatedQuizId: 'quizSet1',
  },
  {
    id: 'gl2',
    title: 'Basic Sentence Structure (S-P-O)',
    explanation: "The basic sentence structure in Javanese is often Subject-Predicate-Object (S-P-O), similar to English and Dutch.\n\n- **Subject (Jejer):** Who or what is doing the action.\n- **Predicate (Wasesa):** The verb or action.\n- **Object (Lesan):** Who or what receives the action.",
    level: 'Beginner',
    category: 'Sentence Structure',
    examples: [
      { javanese: 'Aku maca buku.', dutch: 'Ik lees een boek.' },
      { javanese: 'Bapak ngunjuk kopi.', dutch: 'Vader drinkt koffie. (Krama for "drinken" - ngunjuk)' },
      { javanese: 'Kucing mangan iwak.', dutch: 'De kat eet vis.' },
    ],
    relatedFillInTheBlankWordIds: ['8', '6'], // 'Mangan' (example: Aku arep mangan sega goreng), 'Omah' (example: Omahku cedhak pasar)
  },
  {
    id: 'gl3',
    title: 'Possessive Pronouns',
    explanation: "Possessive pronouns indicate ownership. In Javanese Ngoko, you often append '-ku' (my), '-mu' (your - informal), or '-e' (his/her/its).\n\nFor Krama, it's often different words or structures, e.g., 'kagungan kula' (mine - for objects), or using the noun form like 'griya kula' (my house).",
    level: 'Intermediate',
    category: 'Pronouns',
    examples: [
      { javanese: 'Omahku gedhe.', dutch: 'Mijn huis is groot. (Ngoko)' },
      { javanese: 'Jenengmu sapa?', dutch: 'Wat is jouw naam? (Ngoko)' },
      { javanese: 'Kucingé lucu.', dutch: 'Zijn/haar kat is schattig. (Ngoko)' },
      { javanese: 'Punika buku kagunganipun Bapak.', dutch: 'Dit is het boek van vader. (Krama-like possessive)' },
    ],
  },
  {
    id: 'gl4',
    title: 'Javanese Pronunciation Guide: Letters and Sounds',
    explanation: "Understanding Javanese pronunciation is key to speaking and understanding the language. Here are some basics:\n\n**Vowels:**\nJavanese has several vowel sounds that can differ from Dutch or English.\n- **a:** Often like the 'a' in 'father' (e.g., 'apa' - what). However, in closed syllables or word-final position, it can sound more like the 'o' in 'lot' or 'cot' (e.g., 'mangan' - eat, 'sega' - rice).\n- **i:** Like the 'ee' in 'see' (e.g., 'iki' - this).\n- **u:** Like the 'oo' in 'moon' (e.g., 'iku' - that).\n- **e:** This vowel has two main sounds:\n    - **e (pepet):** Like the 'e' in 'the' or 'sofa' (schwa sound). (e.g., 'sega' - rice, 'kesel' - tired).\n    - **é (taling):** Like the 'e' in 'bed' or the 'ai' in 'rain'. (e.g., 'énjing' - morning, 'méja' - table).\n    - **è (taling tarung - less common in modern spelling but distinct sound):** Like a more open 'e' sound, similar to the 'e' in 'bet' but sometimes a bit lower. Often found in words borrowed from other languages or older texts.\n- **o:** Like the 'o' in 'go' (e.g., 'oma' - house, 'loro' - two).\n\n**Consonants:**\nMany consonants are similar to Dutch/English, but some are noteworthy:\n- **c:** Always like 'ch' in 'church' (e.g., 'cacing' - worm).\n- **dh:** A retroflex 'd' sound, made with the tongue curled back slightly. Different from the 'd' in Dutch. (e.g., 'dahar' - eat (Krama)).\n- **th:** A retroflex 't' sound, also made with the tongue curled back. Different from English 'th'. (e.g., 'kathok' - pants).\n- **j:** Like the 'j' in 'jungle' (e.g., 'jeneng' - name).\n- **y:** Like the 'y' in 'yes' (e.g., 'ya' - yes).\n- **ng:** Like the 'ng' in 'sing' (e.g., 'mangan' - eat).\n- **ny:** Like the 'ni' in 'onion' or 'ñ' in Spanish (e.g., 'nyanyi' - sing).\n- **r:** Often a rolled or trilled 'r'.\n\n**Consonant Clusters (examples):**\n- **mb:** (e.g., 'mBanyu')\n- **nd:** (e.g., 'saNDal')\n- **ngg:** (e.g., 'tuNGGal')\n- **nj:** (e.g., 'aNJing')\n\n**Sound Changes (Sandhi):**\nJavanese has rules (sandhi) where sounds can change at word boundaries or when affixes are added. For instance, a vowel at the end of one word might merge or alter the beginning of the next. This is a more advanced topic. Adding affixes can also sometimes change the base word's pronunciation slightly.\n\n*This guide provides a basic overview. Listening to native speakers is the best way to master pronunciation!*",
    level: 'Beginner',
    category: 'Pronunciation & Phonetics',
    examples: [
      { javanese: 'apa', dutch: 'wat (a as in father)' },
      { javanese: 'sega', dutch: 'rijst (a as short o, e as schwa)' },
      { javanese: 'iki', dutch: 'dit (i as ee)' },
      { javanese: 'iku', dutch: 'dat (u as oo)' },
      { javanese: 'énjing', dutch: 'ochtend (é as in bed)' },
      { javanese: 'loro', dutch: 'twee (o as in go)' },
      { javanese: 'dahar', dutch: 'eten (Krama - note the dh sound)' },
      { javanese: 'kathok', dutch: 'broek (note the th sound)' },
      { javanese: 'mangan', dutch: 'eten (ng sound)' },
      { javanese: 'nyanyi', dutch: 'zingen (ny sound)' },
    ],
  },
];

