
import type { User as UserType, UserQuizAttempt, QuizAttemptStatus } from '@/types'; // Renamed to avoid conflict
import type { Word, Quiz, Badge, GrammarLesson, GrammarExample, EmbeddedExercise, SpeechLevel, QuizQuestion, LearningGoal } from '@/types';

export const placeholderWords: Word[] = [
  {
    id: 'word1',
    javanese: 'Sugeng enjing',
    dutch: 'Goedemorgen',
    category: 'Greetings',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sugeng%20enjing&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Sugeng enjing, Bu Guru.',
    exampleSentenceDutch: 'Goedemorgen, mevrouw de lerares.'
  },
  {
    id: 'word2',
    javanese: 'Matur nuwun',
    dutch: 'Dank u wel',
    category: 'Politeness',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Matur%20nuwun&tl=jv&client=tw-ob',
    exampleSentenceJavanese: 'Matur nuwun kagem bantuanipun.',
    exampleSentenceDutch: 'Dank u wel voor uw hulp.'
  },
  {
    id: 'word3krama',
    javanese: 'Kula',
    dutch: 'Ik (formeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kula&tl=jv&client=tw-ob',
  },
  {
    id: 'word3ngoko',
    javanese: 'Aku',
    dutch: 'Ik (informeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Aku&tl=jv&client=tw-ob',
  },
  {
    id: 'word4krama',
    javanese: 'Sampeyan',
    dutch: 'U (formeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sampeyan&tl=jv&client=tw-ob',
  },
  {
    id: 'word4ngoko',
    javanese: 'Kowe',
    dutch: 'Jij (informeel)',
    category: 'Pronouns',
    level: 'Beginner',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kowe&tl=jv&client=tw-ob',
  },
  {
    id: 'word5krama',
    javanese: 'Sinten asmanipun sampeyan?',
    dutch: 'Hoe heet u?',
    category: 'Phrases',
    level: 'Intermediate',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sinten%20asmanipun%20sampeyan&tl=jv&client=tw-ob',
  },
  {
    id: 'word5ngoko',
    javanese: 'Sapa jenengmu?',
    dutch: 'Hoe heet jij?',
    category: 'Phrases',
    level: 'Intermediate',
    formality: 'ngoko',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sapa%20jenengmu&tl=jv&client=tw-ob',
  },
  {
    id: 'word6',
    javanese: 'Omah',
    dutch: 'Huis',
    category: 'Nouns',
    level: 'Beginner',
    formality: 'ngoko',
    exampleSentenceJavanese: 'Omahku cedhak pasar.',
    exampleSentenceDutch: 'Mijn huis is dichtbij de markt.'
  },
  {
    id: 'word7',
    javanese: 'Sekolah',
    dutch: 'School',
    category: 'Nouns',
    level: 'Beginner',
    formality: 'ngoko',
  },
  {
    id: 'word8ngoko',
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
    id: 'word8krama',
    javanese: 'Dahar',
    dutch: 'Eten (formeel)',
    category: 'Verbs',
    level: 'Beginner',
    formality: 'krama',
    audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Dahar&tl=jv&client=tw-ob',
  },
  {
    id: 'word9',
    javanese: 'Sinau',
    dutch: 'Leren/Studeren',
    category: 'Verbs',
    level: 'Intermediate',
    formality: 'ngoko',
  },
  {
    id: 'word10',
    javanese: 'Abang',
    dutch: 'Rood',
    category: 'Colors',
    level: 'Beginner',
    formality: 'ngoko',
  },
];

export const placeholderQuizzes: Quiz[] = [
  {
    id: 'quizSet1',
    title: 'Javanese Greetings',
    description: 'Test your knowledge of common Javanese greetings and politeness.',
    difficulty: 'easy',
    status: 'published',
    questions: [
      {
        id: 'q1s1',
        questionType: 'multiple-choice',
        questionText: "Wat betekent 'Sugeng rawuh'?",
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
        questionType: 'translation-word-to-javanese',
        questionText: "How do you say 'Thank you' formally in Javanese?",
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
    title: 'Basic Javanese Vocabulary & Sentences',
    description: 'A quiz on fundamental Javanese words, colors, and simple sentences.',
    difficulty: 'medium',
    status: 'published',
    questions: [
      {
        id: 'q1s2',
        questionType: 'translation-word-to-javanese',
        questionText: "Welk Javaans woord betekent 'water'?",
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
        questionType: 'translation-word-to-dutch',
        questionText: "What is 'Abang' in Dutch?",
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
        questionType: 'translation-sentence-to-javanese',
        questionText: "Kies de juiste Javaanse vertaling voor 'Ik hou van jou'.",
        options: [
          { text: 'Kula tresna sampeyan', isCorrect: true },
          { text: 'Kula sengit sampeyan', isCorrect: false },
          { text: 'Kula kangen sampeyan', isCorrect: false },
          { text: 'Kula ngantuk', isCorrect: false },
        ],
        audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Kula%20tresna%20sampeyan&tl=jv&client=tw-ob',
      },
      {
        id: 'q4s2',
        questionType: 'fill-in-the-blank-mcq',
        questionText: "Aku arep _______ sega goreng.",
        options: [
          { text: 'sinau', isCorrect: false },
          { text: 'mangan', isCorrect: true },
          { text: 'turu', isCorrect: false },
          { text: 'lunga', isCorrect: false },
        ],
        explanation: "The sentence means 'I want to eat fried rice.' 'Mangan' means 'to eat'.",
        audioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Aku%20arep%20mangan%20sega%20goreng&tl=jv&client=tw-ob',
      }
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
        questionType: 'translation-word-to-dutch',
        questionText: "What is 'siji' in English?",
        options: [
          { text: 'One', isCorrect: true },
          { text: 'Two', isCorrect: false },
          { text: 'Three', isCorrect: false },
        ],
      },
    ],
  },
];

const placeholderActiveGoals: LearningGoal[] = [
  // { id: 'goal1', text: "Learn 5 new vocabulary words related to family.", isCompleted: false, createdAt: new Date(Date.now() - 86400000 * 2) },
  // { id: 'goal2', text: "Practice forming simple sentences using 'kula' and 'sampeyan'.", isCompleted: true, createdAt: new Date(Date.now() - 86400000) },
  // { id: 'goal3', text: "Listen to Javanese audio for 10 minutes.", isCompleted: false, createdAt: new Date() },
];

const placeholderQuizAttempts: UserQuizAttempt[] = [
    {
        quizId: 'quizSet1',
        totalQuestions: 2,
        correctAnswers: 2,
        scorePercentage: 100,
        status: 'Perfect',
        perfect: true,
        attempts: 1,
        completedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        timeSpentSeconds: 120,
    },
    {
        quizId: 'quizSet2',
        totalQuestions: 4,
        correctAnswers: 3,
        scorePercentage: 75,
        status: 'Incomplete',
        perfect: false,
        attempts: 1,
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        timeSpentSeconds: 240,
    },
    {
        quizId: 'quizSet2', // Second attempt for quizSet2
        totalQuestions: 4,
        correctAnswers: 4,
        scorePercentage: 100,
        status: 'Perfect',
        perfect: true,
        attempts: 2, // This should be the user's 2nd attempt for this specific quiz
        completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        timeSpentSeconds: 180,
    },
];


export const placeholderUser: UserType = {
  id: 'user123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  roles: ['user', 'admin'],
  xp: 1250,
  streak: 15,
  badges: ['newbie', 'wordmaster_lvl1', 'quiz_champ_easy'], // Added quiz_champ_easy for perfect score
  lastLogin: new Date(Date.now() - 86400000), // Logged in yesterday
  
  completedLessonIds: ['gl2'], // Completed 'Basic Sentence Structure'
  quizAttempts: placeholderQuizAttempts,
  currentQuizProgress: {
    quizId: 'quizSet2',
    currentQuestionIndex: 1, 
    answersSoFar: [ { questionId: 'q1s2', selectedOptionText: 'Banyu' } ],
  },
  lastGrammarLessonId: 'gl1', // Last viewed 'Intro to Speech Levels'
  lastFlashcardDeckId: 'Greetings', 
  lastFlashcardIndex: 2, 
  lastPronunciationWordId: 'word2', 
  lastFillInTheBlanksExerciseId: placeholderWords[5]?.id,
  activeLearningGoals: placeholderActiveGoals,
  learningPreferences: {
    preferredStyle: 'Visual',
    dailyGoalMinutes: 30,
  },
};

export const placeholderAdminUsers: UserType[] = [
    { id: 'user1', name: 'Jan Jansen', email: 'jan@example.com', roles: ['user'], xp: 1500, streak: 10, badges: ['newbie', 'wordmaster_lvl1'], lastLogin: new Date(Date.now() - 172800000), completedLessonIds: ['gl1', 'gl2'], quizAttempts: [{quizId: 'quizSet1', totalQuestions: 2, correctAnswers: 2, scorePercentage: 100, status: 'Perfect', perfect: true, attempts: 1, completedAt: new Date()}]},
    { id: 'user2', name: 'Piet Pietersen', email: 'piet@example.com', roles: ['user', 'editor'], xp: 800, streak: 5, badges: ['newbie'], lastLogin: new Date(Date.now() - 86400000 * 3), completedLessonIds: ['gl1'] },
    { id: 'user3', name: 'Admin Account', email: 'admin@example.com', roles: ['user', 'admin'], xp: 0, streak: 0, badges: [], lastLogin: new Date(), activeLearningGoals: [] },
    { id: 'user4', name: 'Publisher Paula', email: 'paula@example.com', roles: ['user', 'publisher'], xp: 200, streak: 2, badges: ['newbie'], lastLogin: new Date(Date.now() - 86400000 * 5) },
    { id: 'user5', name: 'Editor Eddie', email: 'eddie@example.com', roles: ['user', 'editor', 'publisher'], xp: 1200, streak: 20, badges: ['newbie', 'wordmaster_lvl1', 'streak_7'], lastLogin: new Date(Date.now() - 86400000), lastGrammarLessonId: 'gl2' },
];

export const placeholderBadges: Badge[] = [
  { id: 'newbie', name: 'Newbie Linguist', description: 'Started your Javanese journey!', icon: 'Award' },
  { id: 'wordmaster_lvl1', name: 'Word Master Lv. 1', description: 'Learned 50 new words.', icon: 'BookOpenCheck', threshold: 50 },
  { id: 'streak_7', name: '7-Day Streak', description: 'Logged in for 7 days in a row!', icon: 'Flame', threshold: 7 },
  { id: 'quiz_champ_easy', name: 'Quiz Champion (Easy)', description: 'Completed 10 easy quizzes with 90%+ accuracy.', icon: 'StarIcon', threshold: 10 }, // Adjusted description
  { id: 'quiz_perfect_1', name: 'Quiz Perfectionist', description: 'Achieved a perfect 100% score on any quiz.', icon: 'Trophy' }, // New badge
  { id: 'grammar_initiate', name: 'Grammar Initiate', description: 'Completed your first grammar lesson.', icon: 'GraduationCap' },
  { id: 'perfect_pronunciation_1', name: 'Clear Speaker', description: 'Achieved 90%+ on a pronunciation exercise.', icon: 'Trophy', threshold: 1 },
];

export const placeholderGrammarLessons: GrammarLesson[] = [
  {
    id: 'gl1',
    title: {
      en: 'Introduction to Javanese Speech Levels',
      nl: 'Introductie tot Javaanse Taalniveaus'
    },
    explanation: {
      en: "Javanese is unique for its distinct speech levels (undha-usuk basa), which are crucial for polite and appropriate conversation. The main levels are:\n\n- **Ngoko:** This is the informal or 'low' level. It's used when speaking to close friends, family members of similar age or younger, or in very casual situations. Using Ngoko with someone deserving higher respect can be considered rude.\n\n- **Madya:** This is an intermediate level, sometimes considered 'middle' Javanese. It mixes elements of Ngoko and Krama and is often used with acquaintances, people you know but are not extremely close to, or when trying to be polite but not overly formal. It can be a bit more nuanced to master and is very common in daily interactions.\n\n- **Krama:** This is the formal or 'high' level. It's used when addressing elders, strangers, superiors, or in formal settings (like speeches or official occasions). Krama shows respect and politeness. Many common Ngoko words have different Krama equivalents.\n\n**Key Differences to Note:**\n*   **Vocabulary:** The most significant difference lies in vocabulary. For example, 'to eat' is 'mangan' (Ngoko) but 'dahar' (Krama).\n*   **Pronouns:** Personal pronouns change dramatically, e.g., 'I' is 'aku' (Ngoko) and 'kula' (Krama).\n*   **Affixes:** Some grammatical affixes can also change between levels.\n\nUnderstanding when to use each level is a key part of learning Javanese effectively.",
      nl: "Het Javaans is uniek vanwege zijn duidelijke taalniveaus (undha-usuk basa), die cruciaal zijn voor beleefde en gepaste conversatie. De belangrijkste niveaus zijn:\n\n- **Ngoko:** Dit is het informele of 'lage' niveau. Het wordt gebruikt bij het spreken met goede vrienden, familieleden van vergelijkbare leeftijd of jonger, of in zeer informele situaties. Ngoko gebruiken tegen iemand die hoger respect verdient, kan als onbeleefd worden beschouwd.\n\n- **Madya:** Dit is een tussenniveau, soms beschouwd als 'midden' Javaans. Het mengt elementen van Ngoko en Krama en wordt vaak gebruikt met kennissen, mensen die je kent maar niet extreem close mee bent, of wanneer je beleefd probeert te zijn maar niet overdreven formeel. Het kan wat genuanceerder zijn om onder de knie te krijgen en komt veel voor in dagelijkse interacties.\n\n- **Krama:** Dit is het formele of 'hoge' niveau. Het wordt gebruikt bij het aanspreken van ouderen, vreemden, superieuren, of in formele settings (zoals toespraken of officiële gelegenheden). Krama toont respect en beleefdheid. Veelvoorkomende Ngoko-woorden hebben verschillende Krama-equivalenten.\n\n**Belangrijke Verschillen:**\n*   **Woordenschat:** Het belangrijkste verschil ligt in de woordenschat. Bijvoorbeeld, 'eten' is 'mangan' (Ngoko) maar 'dahar' (Krama).\n*   **Voornaamwoorden:** Persoonlijke voornaamwoorden veranderen drastisch, bijv. 'ik' is 'aku' (Ngoko) en 'kula' (Krama).\n*   **Affixen:** Sommige grammaticale affixen kunnen ook veranderen tussen niveaus.\n\nHet begrijpen wanneer elk niveau te gebruiken is een essentieel onderdeel van het effectief leren van Javaans."
    },
    level: 'Beginner',
    category: 'Formality & Speech Levels',
    examples: [
      { id: 'gl1-ex1', javanese: 'Aku mangan sega.', dutch: 'Ik eet rijst.', speechLevel: 'ngoko' },
      { id: 'gl1-ex2', javanese: 'Kula nedha sekul.', dutch: 'Ik eet rijst.', speechLevel: 'krama' },
      { id: 'gl1-ex3', javanese: 'Kowe arep lunga?', dutch: 'Ga jij weg?', speechLevel: 'ngoko' },
      { id: 'gl1-ex4', javanese: 'Sampeyan badhe tindak?', dutch: 'Gaat u weg?', speechLevel: 'krama' },
    ],
    relatedQuizIds: ['quizSet1'],
    relatedWordIds: ['word3krama', 'word3ngoko', 'word4krama', 'word4ngoko', 'word8ngoko', 'word8krama'],
    embeddedExercises: [],
    status: 'published',
    imageUrl: 'https://placehold.co/600x300.png',
    lessonAudioUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Introduction%20to%20Javanese%20Speech%20Levels&tl=en&client=tw-ob'
  },
  {
    id: 'gl2',
    title: {
      en: 'Basic Sentence Structure (S-P-O)',
      nl: 'Basis Zinsstructuur (O-P-V)'
    },
    explanation: {
        en: "The basic sentence structure in Javanese is often Subject-Predicate-Object (S-P-O), similar to English and Dutch.\n\n- **Subject (Jejer):** Who or what is doing the action.\n- **Predicate (Wasesa):** The verb or action.\n- **Object (Lesan):** Who or what receives the action.",
        nl: "De basiszinsstructuur in het Javaans is vaak Onderwerp-Persoonsvorm-Voorwerp (O-P-V), vergelijkbaar met het Engels en Nederlands.\n\n- **Onderwerp (Jejer):** Wie of wat de actie uitvoert.\n- **Persoonsvorm (Wasesa):** Het werkwoord of de actie.\n- **Voorwerp (Lesan):** Wie of wat de actie ontvangt."
    },
    level: 'Beginner',
    category: 'Sentence Structure',
    examples: [
      { id: 'gl2-ex1', javanese: 'Aku maca buku.', dutch: 'Ik lees een boek.', speechLevel: 'ngoko' },
      { id: 'gl2-ex2', javanese: 'Bapak ngunjuk kopi.', dutch: 'Vader drinkt koffie.', speechLevel: 'krama' },
      { id: 'gl2-ex3', javanese: 'Kucing mangan iwak.', dutch: 'De kat eet vis.', speechLevel: 'ngoko' },
    ],
    relatedQuizIds: [],
    relatedWordIds: ['word8ngoko', 'word6'],
    embeddedExercises: [
        {
            id: 'gl2-ee1',
            type: 'fill-in-the-blank',
            javaneseSentenceWithPlaceholder: 'Aku arep ____ sega goreng.',
            correctAnswer: 'mangan',
            hint: { en: 'I want to eat fried rice.', nl: 'Ik wil gebakken rijst eten.'},
            originalJavaneseSentenceForDisplay: 'Aku arep mangan sega goreng.'
        },
        {
            id: 'gl2-ee2',
            type: 'fill-in-the-blank',
            javaneseSentenceWithPlaceholder: 'Omahku cedhak _____.',
            correctAnswer: 'pasar',
            hint: { en: 'My house is near the market.', nl: 'Mijn huis is dichtbij de markt.'},
            originalJavaneseSentenceForDisplay: 'Omahku cedhak pasar.'
        }
    ],
    status: 'published',
  },
  {
    id: 'gl3',
    title: { en: 'Possessive Pronouns', nl: 'Bezittelijke Voornaamwoorden' },
    explanation: {
        en: "Possessive pronouns indicate ownership. In Javanese Ngoko, you often append '-ku' (my), '-mu' (your - informal), or '-e' (his/her/its).\n\nFor Krama, it's often different words or structures, e.g., 'kagungan kula' (mine - for objects), or using the noun form like 'griya kula' (my house).",
        nl: "Bezittelijke voornaamwoorden geven eigendom aan. In het Javaans Ngoko voeg je vaak '-ku' (mijn), '-mu' (jouw - informeel), of '-e' (zijn/haar/het) toe.\n\nVoor Krama zijn het vaak andere woorden of structuren, bijv. 'kagungan kula' (van mij - voor objecten), of het gebruik van de zelfstandig naamwoordvorm zoals 'griya kula' (mijn huis)."
    },
    level: 'Intermediate',
    category: 'Pronouns',
    examples: [
      { id: 'gl3-ex1', javanese: 'Omahku gedhe.', dutch: 'Mijn huis is groot.', speechLevel: 'ngoko' },
      { id: 'gl3-ex2', javanese: 'Jenengmu sapa?', dutch: 'Wat is jouw naam?', speechLevel: 'ngoko' },
    ],
    relatedQuizIds: [],
    relatedWordIds: [],
    embeddedExercises: [],
    status: 'published',
  },
  {
    id: 'gl4',
    title: {en: 'Javanese Pronunciation Guide: Letters and Sounds', nl: 'Javaanse Uitspraakgids: Letters en Klanken'},
    explanation: {
        en: "Understanding Javanese pronunciation is key to speaking and understanding the language. Here are some basics:\n\n**Vowels:**\nJavanese has several vowel sounds that can differ from Dutch or English.\n- **a:** Often like the 'a' in 'father' (e.g., 'apa' - what). However, in closed syllables or word-final position, it can sound more like the 'o' in 'lot' or 'cot' (e.g., 'mangan' - eat, 'sega' - rice).\n- **i:** Like the 'ee' in 'see' (e.g., 'iki' - this).\n- **u:** Like the 'oo' in 'moon' (e.g., 'iku' - that).\n- **e:** This vowel has two main sounds:\n    - **e (pepet):** Like the 'e' in 'the' or 'sofa' (schwa sound). (e.g., 'sega' - rice, 'kesel' - tired).\n    - **é (taling):** Like the 'e' in 'bed' or the 'ai' in 'rain'. (e.g., 'énjing' - morning, 'méja' - table).\n- **o:** Like the 'o' in 'go' (e.g., 'oma' - house, 'loro' - two).\n\n**Consonants:**\nMany consonants are similar to Dutch/English, but some are noteworthy:\n- **c:** Always like 'ch' in 'church' (e.g., 'cacing' - worm).\n- **dh:** A retroflex 'd' sound. (e.g., 'dahar' - eat (Krama)).\n- **th:** A retroflex 't' sound. (e.g., 'kathok' - pants).\n\n*This guide provides a basic overview. Listening to native speakers is the best way to master pronunciation!*",
        nl: "Het begrijpen van de Javaanse uitspraak is essentieel om de taal te spreken en te verstaan. Hier zijn enkele basisprincipes:\n\n**Klinkers:**\nHet Javaans heeft verschillende klinkergeluiden die kunnen verschillen van het Nederlands of Engels.\n- **a:** Vaak zoals de 'a' in 'vader' (bijv. 'apa' - wat). Echter, in gesloten lettergrepen of aan het einde van een woord kan het meer klinken als de 'o' in 'lot' (bijv. 'mangan' - eten, 'sega' - rijst).\n- **i:** Zoals de 'ie' in 'zien' (bijv. 'iki' - dit).\n- **u:** Zoals de 'oe' in 'moe' (bijv. 'iku' - dat).\n- **e:** Deze klinker heeft twee hoofduitspraken:\n    - **e (pepet):** Zoals de 'e' in 'de' (schwa-klank). (bijv. 'sega' - rijst, 'kesel' - moe).\n    - **é (taling):** Zoals de 'e' in 'bed'. (bijv. 'énjing' - ochtend, 'méja' - tafel).\n- **o:** Zoals de 'o' in 'zo' (bijv. 'oma' - huis, 'loro' - twee).\n\n**Medeklinkers:**\nVeel medeklinkers lijken op het Nederlands/Engels, maar sommige zijn opmerkelijk:\n- **c:** Altijd zoals 'tsj' in 'tsjilpen' (bijv. 'cacing' - worm).\n- **dh:** Een retroflexe 'd'-klank. (bijv. 'dahar' - eten (Krama)).\n- **th:** Een retroflexe 't'-klank. (bijv. 'kathok' - broek).\n\n*Deze gids biedt een basisoverzicht. Luisteren naar moedertaalsprekers is de beste manier om de uitspraak onder de knie te krijgen!*"
    },
    level: 'Beginner',
    category: 'Pronunciation & Phonetics',
    examples: [
      { id: 'gl4-ex1', javanese: 'apa', dutch: 'wat', speechLevel: 'neutral' },
      { id: 'gl4-ex2', javanese: 'sega', dutch: 'rijst', speechLevel: 'ngoko' },
    ],
    relatedQuizIds: [],
    relatedWordIds: [],
    embeddedExercises: [],
    status: 'published',
  },
];
